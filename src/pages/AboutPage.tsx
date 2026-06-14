import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'

export function AboutPage() {
  return (
    <article className="article about-page">
      <PageMeta
        title="About Choros"
        description="Learn about Choros, an interactive map of Greek traditional music and dances, and the Athens Music Technology Forum project behind it."
        path="/about"
      />
      <Link to="/" className="article__back">
        ← Back to map
      </Link>

      <h1>About Choros</h1>
      <p className="article__subtitle">Χορός — dance, chorus, the circle of tradition</p>

      <section className="article__section">
        <p>
          Choros is an interactive map of Greek traditional music and dances. Explore
          every region of Greece — from the Epirote mountains to the Cycladic islands 
          — and discover the rich heritage of songs and dances that have
          shaped each corner of the country for centuries.
        </p>
        <p>
          This platform is a project started with the goal of preserving the unique musical traditions of Greece, which seem to be increasingly forgotten in the rapidly modernizing 21st century. Choros aims to provide an accessible and engaging experience for anyone interested in learning about Greek music, and thus raise awareness about the Greek culture and beyond.
        </p>
        <p>
          Choros is a side project of the{' '}
          <a
            href="https://amtf.gr/"
            target="_blank"
            rel="noopener noreferrer"
            className="about-amtf__link"
          >
            Athens Music Technology Forum
          </a>{' '}
          <svg
            className="about-amtf__external-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 3h6v6" />
            <path d="M10 14 21 3" />
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </svg>{' '}
          (AMTF)
        </p>
      </section>

      <section className="article__section">
        <h2>The Map</h2>
        <p className="article__placeholder">
          Navigate the map on the homepage to explore {30} cultural regions across
          mainland Greece, Crete, the Ionian Islands, and the Aegean archipelago.
          Click any region to learn more about its musical and dance traditions.
        </p>
      </section>

      <section className="about-creator">
        <p className="about-creator__text">
          Made by{' '}
          <a
            href="https://yaopingan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="about-creator__link"
          >
            Patrick Yao
          </a>
        </p>
        <div className="about-creator__social">
          <a
            href="https://www.instagram.com/ytpyao/"
            target="_blank"
            rel="noopener noreferrer"
            className="about-creator__social-link"
            aria-label="Instagram"
          >
            <img src="/assets/social/instagram.svg" alt="" className="about-creator__social-icon" />
          </a>
          <a
            href="https://www.youtube.com/@patrickyao/videos"
            target="_blank"
            rel="noopener noreferrer"
            className="about-creator__social-link"
            aria-label="YouTube"
          >
            <img src="/assets/social/youtube.svg" alt="" className="about-creator__social-icon" />
          </a>
          <a
            href="https://www.linkedin.com/in/pinganyao/"
            target="_blank"
            rel="noopener noreferrer"
            className="about-creator__social-link"
            aria-label="LinkedIn"
          >
            <img src="/assets/social/linkedin.svg" alt="" className="about-creator__social-icon" />
          </a>
        </div>
      </section>
    </article>
  )
}
