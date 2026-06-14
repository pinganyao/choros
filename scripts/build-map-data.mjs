import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Region definitions mirrored from src/data/regions.ts
const regions = [
  { id: 'attica', geoIds: ['0901', '0902', '0903', '0904', '0905', '0906', '0907', '0908'] },
  { id: 'peloponnese', geoIds: ['1001', '1002', '1003', '1004', '1005'] },
  { id: 'central-greece', geoIds: ['0801', '0802', '0803', '0804', '0805'] },
  { id: 'western-greece', geoIds: ['0701', '0702', '0703'] },
  { id: 'epirus', geoIds: ['0401', '0402', '0403', '0404'] },
  { id: 'thessaly', geoIds: ['0501', '0502', '0503', '0504', '0505'] },
  { id: 'west-macedonia', geoIds: ['0301', '0302', '0303', '0304'] },
  { id: 'central-macedonia', geoIds: ['0201', '0202', '0203', '0204', '0205', '0206', '0207'] },
  { id: 'east-macedonia-thrace', geoIds: ['0101', '0102', '0103', '0104', '0105', '0106'] },
  { id: 'crete', geoIds: ['1301', '1302', '1303', '1304'] },
  { id: 'corfu', geoIds: ['0603'] },
  { id: 'lefkada', geoIds: ['0605'] },
  { id: 'cephalonia-ithaca', geoIds: ['0602', '0604'] },
  { id: 'zakynthos', geoIds: ['0601'] },
  { id: 'lesbos', geoIds: ['1101'] },
  { id: 'chios', geoIds: ['1105'] },
  { id: 'samos', geoIds: ['1104'] },
  { id: 'limnos', geoIds: ['1103'] },
  { id: 'ikaria', geoIds: ['1102'] },
  { id: 'rhodes', geoIds: ['1211'] },
  { id: 'kos', geoIds: ['1206'] },
  { id: 'karpathos', geoIds: ['1204'] },
  { id: 'santorini', geoIds: ['1202'] },
  { id: 'naxos-paros', geoIds: ['1209', '1210'] },
  { id: 'andros', geoIds: ['1201'] },
  { id: 'syros', geoIds: ['1212'] },
  { id: 'milos', geoIds: ['1207'] },
  { id: 'mykonos', geoIds: ['1208'] },
  { id: 'cyclades', geoIds: ['1205', '1213'] },
  { id: 'dodecanese', geoIds: ['1203'] },
]

/** D3 treats counter-clockwise rings as holes; reverse so regions render as fills. */
function reverseRing(ring) {
  return ring.slice().reverse()
}

function fixGeometry(geometry) {
  if (geometry.type === 'Polygon') {
    return {
      type: 'Polygon',
      coordinates: geometry.coordinates.map(reverseRing),
    }
  }
  if (geometry.type === 'MultiPolygon') {
    return {
      type: 'MultiPolygon',
      coordinates: geometry.coordinates.map((polygon) => polygon.map(reverseRing)),
    }
  }
  return geometry
}

const geoIdToRegion = new Map()
for (const region of regions) {
  for (const geoId of region.geoIds) {
    geoIdToRegion.set(geoId, region.id)
    geoIdToRegion.set(String(geoId), region.id)
  }
}

const source = JSON.parse(
  readFileSync(join(__dirname, 'greecePrefecturesUnits.geojson'), 'utf8'),
)

const features = []
const missing = []

for (const feature of source.features) {
  const rawId = feature.properties?.id
  const geoId = String(rawId).padStart(4, '0')
  const regionId = geoIdToRegion.get(geoId) ?? geoIdToRegion.get(String(rawId))

  if (!regionId) {
    missing.push(geoId)
    continue
  }

  features.push({
    type: 'Feature',
    properties: {
      regionId,
      geoId,
      name: feature.properties?.name,
      nameGreek: feature.properties?.name_greek,
    },
    geometry: fixGeometry(feature.geometry),
  })
}

if (missing.length > 0) {
  console.warn('Unmapped geo IDs:', missing.join(', '))
}

const output = { type: 'FeatureCollection', features }
const outDir = join(__dirname, '../public/data')
const outPath = join(outDir, 'greece-map.json')
writeFileSync(outPath, JSON.stringify(output))
console.log(`Wrote ${features.length} features to ${outPath}`)
