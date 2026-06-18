export default function Footer() {
  return (
    <>
      <section className="cta-section">
        <div className="section-title">Ready to Dominate<br/>Your Market?</div>
        <p>Join the fastest growing businesses in Nepal. Let's build a predictable revenue engine for your brand.</p>
        <a href="#contact" className="btn-white">Get Your Free Audit</a>
      </section>

      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">BAZAAR<span>NET</span></div>
            <p>Nepal's premier e-commerce infrastructure provider. We connect vendors, customers, and technology seamlessly.</p>
          </div>
          
          <div className="footer-col">
            <h5>Solutions</h5>
            <ul>
              <li><a href="#services">E-Commerce Platforms</a></li>
              <li><a href="#services">Last-Mile Logistics</a></li>
              <li><a href="#services">Custom IT Development</a></li>
              <li><a href="#services">Vendor Portals</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#process">Our Process</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Connect</h5>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Facebook">F</a>
              <a href="#" className="social-link" aria-label="Instagram">I</a>
              <a href="#" className="social-link" aria-label="LinkedIn">L</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© {new Date().getFullYear()} BazaarNet. All rights reserved.</div>
          <div className="footer-copy">Designed for conversions.</div>
        </div>
      </footer>
    </>
  )
}
