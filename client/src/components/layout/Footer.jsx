import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Trending Cartoons', path: '/search?sort=popular' },
  { label: 'Browse Networks', path: '/networks' },
  { label: 'Explore Categories', path: '/categories' },
  { label: 'My Favorites', path: '/favorites' },
];

const networkLinks = [
  { label: 'Cartoon Network', path: '/network/cartoon-network' },
  { label: 'Disney Channel', path: '/network/disney' },
  { label: 'Nickelodeon', path: '/network/nickelodeon' },
  { label: 'Pogo', path: '/network/pogo' },
  { label: 'Hungama TV', path: '/network/hungama' },
  { label: 'Discovery Kids', path: '/network/discovery-kids' },
];

const socialLinks = [
  { label: 'Twitter / X', icon: '𝕏', href: 'https://twitter.com' },
  { label: 'Instagram', icon: '📸', href: 'https://instagram.com' },
  { label: 'YouTube', icon: '▶️', href: 'https://youtube.com' },
  { label: 'Discord', icon: '💬', href: 'https://discord.com' },
];

function Footer() {
  return (
    <footer className="footer">
      {/* Decorative geometric shapes */}
      <div className="footer__shape footer__shape--1" aria-hidden="true" />
      <div className="footer__shape footer__shape--2" aria-hidden="true" />
      <div className="footer__shape footer__shape--3" aria-hidden="true" />

      {/* Top section — 4 columns */}
      <div className="footer__top">
        <div className="container footer__inner">
          {/* Column 1: About */}
          <div className="footer__col">
            <Link to="/" className="footer__brand">
              <img src="/toonverse-logo.png" alt="ToonVerse home" />
            </Link>
            <p className="footer__about-text">
              Your ultimate destination for discovering, watching trailers, and downloading
              authorized cartoon episodes from Pogo, Cartoon Network, Disney, Nickelodeon, and more!
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Navigation</h4>
            <ul className="footer__list">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="footer__list-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Networks */}
          <div className="footer__col">
            <h4 className="footer__col-title">Broadcast Networks</h4>
            <ul className="footer__list">
              {networkLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="footer__list-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="footer__col">
            <h4 className="footer__col-title">Connect & Community</h4>
            <div className="footer__social">
              {socialLinks.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="footer__social-link"
                  aria-label={label}
                  title={label}
                >
                  <span className="footer__social-icon">{icon}</span>
                  <span className="footer__social-label">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section — copyright */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copyright">
            &copy; 2026 Ritik Sharma. Made with ❤️ for Cartoon Lovers.
          </p>
          <div className="footer__legal">
            <span>Free Discovery & Streaming</span>
            <span>•</span>
            <span>Authorized High-Speed CDN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
