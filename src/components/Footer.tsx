import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer__text">
        © {new Date().getFullYear()} Choros ·{' '}
        <Link to="/">Map</Link>
        {' · '}
        <Link to="/about">About</Link>
      </p>
    </footer>
  )
}
