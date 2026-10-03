import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <div className="footer-brand">S.I.R.U.S.</div>

          <p>
            Super Intelligence Research & Innovation System.
          </p>
        </div>

        <div className="footer-links">
          <Link href="/about">About</Link>
          <Link href="/events">Events</Link>
          <Link href="/roadmap">Roadmap</Link>
          <Link href="/hall-of-fame">Hall of Fame</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} S.I.R.U.S.</span>
        <span>Research · Innovation · Intelligence</span>
      </div>
    </footer>
  );
}