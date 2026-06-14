import { Link, useParams } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { getRegionTraditions } from '../data/region-traditions'
import { getRegionBySlug } from '../data/regions'

export function RegionPage() {
  const { slug } = useParams<{ slug: string }>()
  const region = slug ? getRegionBySlug(slug) : undefined
  const traditions = region ? getRegionTraditions(region.id) : undefined

  if (!region) {
    return (
      <article className="article article__not-found">
        <PageMeta
          title="Region not found"
          description="This region does not exist on the Choros map."
          path={slug ? `/region/${slug}` : '/region'}
          noindex
        />
        <h1>Region not found</h1>
        <p className="article__placeholder">
          This region does not exist on the map.
        </p>
        <Link to="/" className="article__back">
          ← Back to map
        </Link>
      </article>
    )
  }

  return (
    <article className="article">
      <PageMeta
        title={`${region.name} — Greek Music & Dance`}
        description={`Traditional music and dances of ${region.name} (${region.nameGreek}). Explore folk songs, dances, and history from this region of Greece.`}
        path={`/region/${region.slug}`}
      />
      <Link to="/" className="article__back">
        ← Back to map
      </Link>

      <h1>{region.name}</h1>
      <p className="article__subtitle">{region.nameGreek}</p>

      <section className="article__section">
        <h2>Music</h2>
        {traditions?.music.length ? (
          <ul className="article__list">
            {traditions.music.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="article__placeholder">Content for {region.name} will be added here.</p>
        )}
      </section>

      <section className="article__section">
        <h2>Dances</h2>
        {traditions?.dances.length ? (
          <ul className="article__list">
            {traditions.dances.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="article__placeholder">Content for {region.name} will be added here.</p>
        )}
      </section>

      <section className="article__section">
        <h2>History</h2>
        <p className="article__placeholder">
          Content for {region.name} will be added here.
        </p>
      </section>
    </article>
  )
}
