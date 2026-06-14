import * as d3 from 'd3'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRegionById, regions } from '../data/regions'

type UnitFeature = GeoJSON.Feature<
  GeoJSON.Polygon | GeoJSON.MultiPolygon,
  { regionId: string; geoId: string; name?: string; nameGreek?: string }
>

type RegionFeature = GeoJSON.Feature<
  GeoJSON.Polygon | GeoJSON.MultiPolygon,
  { regionId: string }
>

type TooltipState = {
  visible: boolean
  x: number
  y: number
  name: string
  nameGreek: string
}

type TransitionTarget = {
  slug: string
  name: string
  nameGreek: string
}

function mergeByRegion(units: UnitFeature[]): RegionFeature[] {
  const byRegion = new Map<string, UnitFeature[]>()
  for (const unit of units) {
    const id = unit.properties.regionId
    const list = byRegion.get(id) ?? []
    list.push(unit)
    byRegion.set(id, list)
  }

  return regions
    .filter((region) => byRegion.has(region.id))
    .map((region) => {
      const unitsForRegion = byRegion.get(region.id)!
      const polygons: GeoJSON.Position[][][] = []

      for (const unit of unitsForRegion) {
        if (unit.geometry.type === 'Polygon') {
          polygons.push(unit.geometry.coordinates)
        } else {
          polygons.push(...unit.geometry.coordinates)
        }
      }

      return {
        type: 'Feature',
        properties: { regionId: region.id },
        geometry: { type: 'MultiPolygon', coordinates: polygons },
      } as RegionFeature
    })
}

function drawRegionHighlight(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  path: d3.GeoPath,
  feature: RegionFeature,
) {
  g.select('g.map-highlight')
    .selectAll<SVGPathElement, RegionFeature>('path.map-region-highlight')
    .data([feature], (d) => d.properties.regionId)
    .join('path')
    .attr('class', 'map-region-highlight')
    .attr('d', (d) => path(d) ?? '')
    .attr('pointer-events', 'none')
}

function clearRegionHighlight(g: d3.Selection<SVGGElement, unknown, null, undefined>) {
  g.select('g.map-highlight').selectAll('*').remove()
}

function computeRegionZoomTransform(
  feature: RegionFeature,
  path: d3.GeoPath,
  width: number,
  height: number,
): d3.ZoomTransform {
  const [[x0, y0], [x1, y1]] = path.bounds(feature)
  const x = (x0 + x1) / 2
  const y = (y0 + y1) / 2
  const dx = Math.max(x1 - x0, 1)
  const dy = Math.max(y1 - y0, 1)
  const padding = 0.14
  const scale = Math.min(28, (1 - padding) * Math.min(width / dx, height / dy))

  return d3.zoomIdentity.translate(width / 2 - scale * x, height / 2 - scale * y).scale(scale)
}

export function GreeceMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const gRef = useRef<SVGGElement>(null)
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const pathRef = useRef<d3.GeoPath | null>(null)
  const isTransitioningRef = useRef(false)
  const navigate = useNavigate()

  const [units, setUnits] = useState<UnitFeature[] | null>(null)
  const regionFeatures = useMemo(
    () => (units ? mergeByRegion(units) : null),
    [units],
  )

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    name: '',
    nameGreek: '',
  })
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionTarget, setTransitionTarget] = useState<TransitionTarget | null>(null)
  const hoveredRegionRef = useRef<string | null>(null)
  hoveredRegionRef.current = hoveredRegion

  const resetZoom = useCallback(() => {
    if (isTransitioningRef.current) return
    const svgEl = svgRef.current
    const zoom = zoomRef.current
    if (!svgEl || !zoom) return
    d3.select(svgEl).call(zoom.transform, d3.zoomIdentity)
  }, [])

  const exitRegionView = useCallback(() => {
    isTransitioningRef.current = false
    setIsTransitioning(false)
    setTransitionTarget(null)
    setHoveredRegion(null)

    const gEl = gRef.current
    if (gEl) clearRegionHighlight(d3.select(gEl))

    const svgEl = svgRef.current
    const zoom = zoomRef.current
    if (svgEl && zoom) {
      d3.select(svgEl)
        .transition()
        .duration(600)
        .ease(d3.easeCubicInOut)
        .call(zoom.transform, d3.zoomIdentity)
    }
  }, [])

  const enterRegionPage = useCallback(
    (slug: string) => {
      navigate(`/region/${slug}`)
    },
    [navigate],
  )

  const zoomToRegion = useCallback(
    (feature: RegionFeature, slug: string, name: string, nameGreek: string) => {
      if (isTransitioningRef.current) return

      const svgEl = svgRef.current
      const zoom = zoomRef.current
      const container = containerRef.current
      const gEl = gRef.current
      const path = pathRef.current
      if (!svgEl || !zoom || !container || !gEl || !path) {
        navigate(`/region/${slug}`)
        return
      }

      isTransitioningRef.current = true
      setIsTransitioning(true)
      setTransitionTarget(null)
      setHoveredRegion(feature.properties.regionId)
      setTooltip((prev) => ({ ...prev, visible: false }))

      const g = d3.select(gEl)
      drawRegionHighlight(g, path, feature)

      const { width, height } = container.getBoundingClientRect()
      const target = computeRegionZoomTransform(feature, path, width, height)
      const svg = d3.select(svgEl)

      svg
        .transition()
        .duration(950)
        .ease(d3.easeCubicInOut)
        .call(zoom.transform, target)
        .on('end', () => {
          setTransitionTarget({ slug, name, nameGreek })
        })
    },
    [navigate],
  )

  useEffect(() => {
    let cancelled = false
    fetch('/data/greece-map.json')
      .then((res) => res.json())
      .then((data: GeoJSON.FeatureCollection) => {
        if (!cancelled) setUnits(data.features as UnitFeature[])
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (transitionTarget) {
          e.preventDefault()
          exitRegionView()
        } else if (!isTransitioningRef.current) {
          resetZoom()
        }
        return
      }

      if (e.key === 'Enter' && transitionTarget) {
        e.preventDefault()
        enterRegionPage(transitionTarget.slug)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [resetZoom, exitRegionView, enterRegionPage, transitionTarget])

  useEffect(() => {
    const container = containerRef.current
    const svgEl = svgRef.current
    const gEl = gRef.current
    if (!container || !svgEl || !gEl || !regionFeatures) return

    zoomRef.current = null
    d3.select(gEl).attr('transform', null)

    const render = () => {
      if (isTransitioningRef.current) return

      const { width, height } = container.getBoundingClientRect()
      if (width === 0 || height === 0) return

      const svg = d3.select(svgEl)
      svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`)

      const padding = Math.min(width, height) * 0.04
      const projection = d3
        .geoMercator()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          { type: 'FeatureCollection', features: regionFeatures },
        )

      const path = d3.geoPath().projection(projection)
      pathRef.current = path
      const g = d3.select(gEl)

      let fills = g.select<SVGGElement>('g.map-fills')
      if (fills.empty()) {
        fills = g.append('g').attr('class', 'map-fills')
        g.append('g').attr('class', 'map-highlight')
      }

      const regionPaths = fills
        .selectAll<SVGPathElement, RegionFeature>('path.map-region')
        .data(regionFeatures, (d) => d.properties.regionId)

      regionPaths.exit().remove()

      const entered = regionPaths
        .enter()
        .append('path')
        .attr('class', 'map-region')
        .attr('tabindex', 0)
        .attr('role', 'link')

      entered
        .merge(regionPaths)
        .attr('d', (d) => path(d) ?? '')
        .attr('data-region', (d) => d.properties.regionId)
        .attr('aria-label', (d) => {
          const region = getRegionById(d.properties.regionId)
          return region ? `${region.name}, ${region.nameGreek}` : d.properties.regionId
        })
        .on('mouseenter', function (event, d) {
          if (isTransitioningRef.current) return
          const region = getRegionById(d.properties.regionId)
          if (!region) return
          setHoveredRegion(region.id)
          drawRegionHighlight(g, path, d)
          setTooltip({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            name: region.name,
            nameGreek: region.nameGreek,
          })
        })
        .on('mousemove', (event) => {
          setTooltip((prev) =>
            prev.visible ? { ...prev, x: event.clientX, y: event.clientY } : prev,
          )
        })
        .on('mouseleave', function () {
          if (isTransitioningRef.current) return
          setHoveredRegion(null)
          clearRegionHighlight(g)
          setTooltip((prev) => ({ ...prev, visible: false }))
        })
        .on('focus', function (_, d) {
          if (isTransitioningRef.current) return
          const region = getRegionById(d.properties.regionId)
          if (!region) return
          setHoveredRegion(region.id)
          drawRegionHighlight(g, path, d)
        })
        .on('blur', function () {
          if (isTransitioningRef.current) return
          setHoveredRegion(null)
          clearRegionHighlight(g)
        })
        .on('click', (_, d) => {
          const region = getRegionById(d.properties.regionId)
          if (region) zoomToRegion(d, region.slug, region.name, region.nameGreek)
        })
        .on('mousedown', function (event) {
          if (event.button === 0) event.preventDefault()
        })
        .on('keydown', (event, d) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            const region = getRegionById(d.properties.regionId)
            if (region) zoomToRegion(d, region.slug, region.name, region.nameGreek)
          }
        })

      if (!zoomRef.current) {
        const zoom = d3
          .zoom<SVGSVGElement, unknown>()
          .scaleExtent([1, 28])
          .filter(() => !isTransitioningRef.current)
          .on('zoom', (event) => {
            g.attr('transform', event.transform.toString())
          })

        zoomRef.current = zoom

        svg
          .call(zoom)
          .on('dblclick.zoom', null)
          .on('dblclick', () => resetZoom())
      }

      const activeRegionId = hoveredRegionRef.current
      if (activeRegionId) {
        const hoveredFeature = regionFeatures.find((f) => f.properties.regionId === activeRegionId)
        if (hoveredFeature) drawRegionHighlight(g, path, hoveredFeature)
      } else {
        clearRegionHighlight(g)
      }
    }

    render()

    const observer = new ResizeObserver(() => render())
    observer.observe(container)

    return () => observer.disconnect()
  }, [regionFeatures, resetZoom, zoomToRegion])

  const isZooming = isTransitioning && !transitionTarget

  return (
    <>
      <div
        ref={containerRef}
        className={`map-container${isTransitioning ? ' map-container--transitioning' : ''}${isZooming ? ' map-container--zooming' : ''}`}
        aria-label="Interactive map of Greece"
      >
        <svg ref={svgRef}>
          <g ref={gRef} />
        </svg>

        {transitionTarget ? (
          <div className="map-transition-overlay map-transition-overlay--visible">
            <p className="map-transition-overlay__name">{transitionTarget.name}</p>
            <p className="map-transition-overlay__greek">{transitionTarget.nameGreek}</p>
            <button
              type="button"
              className="map-transition-overlay__enter"
              onClick={() => enterRegionPage(transitionTarget.slug)}
            >
              Enter
            </button>
            <button
              type="button"
              className="map-transition-overlay__back"
              onClick={exitRegionView}
            >
              Back to map
            </button>
          </div>
        ) : null}
      </div>

      {tooltip.visible && !isTransitioning ? (
        <div
          className="map-tooltip map-tooltip--visible"
          style={{ left: tooltip.x, top: tooltip.y }}
          aria-hidden="true"
        >
          <div>{tooltip.name}</div>
          <div className="map-tooltip__greek">{tooltip.nameGreek}</div>
        </div>
      ) : null}

      {!isTransitioning ? (
        <p className="map-hint">Scroll to zoom · Drag to pan · Double-click to reset</p>
      ) : null}
    </>
  )
}
