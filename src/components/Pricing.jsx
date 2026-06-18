import { useEffect, useRef } from 'react'

export default function Pricing() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    const currentRef = sectionRef.current
    if (currentRef) {
      const reveals = currentRef.querySelectorAll('.reveal')
      reveals.forEach((el) => observer.observe(el))
      
      return () => {
        reveals.forEach((el) => observer.unobserve(el))
      }
    }
  }, [])

  return (
    <section className="pricing reveal" id="pricing" ref={sectionRef}>
      <div className="pricing-header">
        <div className="section-tag">Transparent Pricing</div>
        <div className="section-title">Scalable Plans,<br/>Real Growth</div>
        <p className="section-desc">Choose the right infrastructure tier to match your commerce volume and technology needs.</p>
      </div>
      <div className="pricing-grid">
        <div className="price-card reveal">
          <div className="price-tier">Starter Platform</div>
          <div className="price-amount"><sup>NPR</sup>15,000</div>
          <div className="price-period">/ month + transaction fee</div>
          <ul className="price-features">
            <li className="active">Standard Vendor Portal</li>
            <li className="active">Up to 50 vendors</li>
            <li className="active">Basic inventory tools</li>
            <li className="active">Email support</li>
            <li>Last-mile logistics</li>
            <li>Custom IT development</li>
          </ul>
          <a href="#contact" className="btn-price btn-price-outline">Get Started</a>
        </div>
        <div className="price-card featured reveal">
          <div className="price-badge">Most Popular</div>
          <div className="price-tier">Logistics + Tech</div>
          <div className="price-amount"><sup>NPR</sup>45,000</div>
          <div className="price-period">/ month + volume pricing</div>
          <ul className="price-features">
            <li className="active">Advanced E-Commerce Platform</li>
            <li className="active">Unlimited vendors</li>
            <li className="active">Full API access</li>
            <li className="active">Warehousing & Last-Mile</li>
            <li className="active">Priority tech support</li>
            <li>Dedicated delivery fleet</li>
          </ul>
          <a href="#contact" className="btn-price btn-price-fill">Get Started</a>
        </div>
        <div className="price-card reveal">
          <div className="price-tier">Enterprise</div>
          <div className="price-amount"><sup>Custom</sup></div>
          <div className="price-period">Contact us for pricing</div>
          <ul className="price-features">
            <li className="active">Custom app development</li>
            <li className="active">Bespoke ERP integrations</li>
            <li className="active">Dedicated cloud infrastructure</li>
            <li className="active">24/7 SLA IT management</li>
            <li className="active">Dedicated logistics fleet</li>
            <li className="active">On-site training</li>
          </ul>
          <a href="#contact" className="btn-price btn-price-outline">Get Started</a>
        </div>
      </div>
    </section>
  )
}
