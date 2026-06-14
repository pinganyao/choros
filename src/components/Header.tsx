import { Link } from 'react-router-dom'
import logo from '../assets/logo-white.png'

export function Header() {
  return (
    <header className="site-header">
      <Link to="/" aria-label="Choros home">
        <img src={logo} alt="Choros" className="site-logo" />
      </Link>
    </header>
  )
}
