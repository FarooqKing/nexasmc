'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <span>ERP &amp; Data Consulting Partner</span>
          <span>Oracle NetSuite • SAP Business One • Power BI • Oracle NSAW</span>
        </div>
      </div>

      <header className="header">
        <div className="container nav-wrap">
          <Link aria-label="nexaSMC home" className="logo brand-logo" href="/" onClick={closeMenu}>
            <img
              alt="nexaSMC logo"
              className="brand-logo-image"
              height="46"
              src="/assets/brand/nexa-logo-192.png"
              width="46"
            />
            <span className="logo-text">nexaSMC</span>
          </Link>

          <button
            aria-expanded={open}
            aria-label="Toggle menu"
            className="menu-toggle"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            <span></span><span></span><span></span>
          </button>

          <nav aria-label="Main navigation" className={`nav${open ? ' open' : ''}`}>
            <Link href="/#home" onClick={closeMenu}>Home</Link>
            <Link href="/#about" onClick={closeMenu}>About</Link>
            <Link href="/#services" onClick={closeMenu}>Services</Link>
            <Link href="/#technologies" onClick={closeMenu}>Technologies</Link>
            <Link href="/#clients" onClick={closeMenu}>Clients</Link>
            <Link href="/#portfolio" onClick={closeMenu}>Portfolio</Link>
            <Link href="/insights" onClick={closeMenu}>Insights</Link>
            <Link href="/faq" onClick={closeMenu}>FAQ</Link>
            <Link className="nav-cta" href="/#contact" onClick={closeMenu}>Contact</Link>
          </nav>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link aria-label="nexaSMC home" className="footer-logo" href="/">
            <img
              alt="nexaSMC logo"
              className="brand-logo-image footer-brand-logo-image"
              height="48"
              src="/assets/brand/nexa-logo-192.png"
              width="48"
            />
            <span className="logo-text">nexaSMC</span>
          </Link>
          <p>Your trusted ERP &amp; Data Consulting partner delivering smart, scalable Oracle NetSuite, SAP Business One and Power BI solutions.</p>
        </div>

        <div>
          <h4>Company</h4>
          <Link href="/#about">About</Link>
          <Link href="/#clients">Happy Clients</Link>
          <Link href="/#portfolio">Portfolio</Link>
          <Link href="/faq">FAQ</Link>
        </div>

        <div>
          <h4>Resources</h4>
          <Link href="/#technologies">Technology Stack</Link>
          <Link href="/#services">Services</Link>
          <Link href="/insights#technology">Technology Updates</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </div>

        <div>
          <h4>Contact</h4>
          <span>28 KM, Ferozpur Road Near Grand Avenue Lahore, Pakistan.</span>
          <span>+92 329 5888001</span>
          <span>info@nexasmc.com</span>
        </div>
      </div>

      <div className="container footer-bottom">
        © <span id="year"></span> nexaSMC. All rights reserved.
        <span className="footer-legal-links"><Link href="/faq">FAQ</Link><Link href="/privacy-policy">Privacy Policy</Link></span>
      </div>
    </footer>
  );
}
