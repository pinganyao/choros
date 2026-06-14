import { Link, useLocation } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'

export function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <article className="article article__not-found">
      <PageMeta
        title="Page not found"
        description="This page does not exist on Choros."
        path={pathname}
        noindex
      />
      <h1>Page not found</h1>
      <p className="article__placeholder">
        This page does not exist on Choros.
      </p>
      <Link to="/" className="article__back">
        ← Back to map
      </Link>
    </article>
  )
}
