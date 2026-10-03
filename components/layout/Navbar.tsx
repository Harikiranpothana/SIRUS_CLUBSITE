"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Hall of Fame", href: "/hall-of-fame" },
  { label: "Gallery", href: "/gallery" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="nav-container">
        <Link href="/" className="brand">
          <span className="brand-mark">S</span>
          <span>S.I.R.U.S.</span>
        </Link>

        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link href="/login" className="login-link">
            Login
          </Link>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}