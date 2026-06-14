import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  const { pathname } = useLocation()
  const isMap = pathname === '/'

  return (
    <div className="site-layout">
      <Header />
      <main className={`site-main ${isMap ? 'site-main--map' : 'site-main--article'}`}>
        <Outlet />
      </main>
      {!isMap && <Footer />}
    </div>
  )
}
