import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-grid"></div>
      <div className="hero-tag">Nepal's Premier Commerce Infrastructure</div>
      <h1>Powering<br/><span className="accent-word">E-Commerce</span>, <br/><span className="outline">Logistics</span><br/>& IT Tech</h1>
      <p className="hero-sub">From vendor management and customer experience to last-mile delivery and custom software — we build the infrastructure your business needs to scale.</p>
      <div className="hero-actions">
        <Link to="/signup" className="btn-primary">Get Started →</Link>
        <a href="#services" className="btn-ghost">Explore Solutions</a>
      </div>
      <div className="hero-stats">
        <div className="stat-item">
          <div className="stat-num">500<span>+</span></div>
          <div className="stat-label">Vendors Onboarded</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">99.9<span>%</span></div>
          <div className="stat-label">Delivery Success</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">24<span>/7</span></div>
          <div className="stat-label">IT Support & Tech</div>
        </div>
      </div>
      <div className="hero-scroll">
        <div className="scroll-line"></div>Scroll to explore
      </div>
    </section>
  )
}
