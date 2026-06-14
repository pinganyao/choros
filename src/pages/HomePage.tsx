import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { GreeceMap } from '../components/GreeceMap'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '../seo/site'

export function HomePage() {
  return (
    <div className="map-page">
      <PageMeta
        title={DEFAULT_TITLE}
        description={DEFAULT_DESCRIPTION}
        path="/"
      />
      <h1 className="visually-hidden">{DEFAULT_TITLE}</h1>
      <GreeceMap />
      <Link to="/about" className="map-corner-link">
        About
      </Link>
    </div>
  )
}
