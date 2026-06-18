import { useEffect, useRef } from 'react'

export default function WhyUs() {
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
    <section className="why" id="why" ref={sectionRef}>
      <div className="why-grid">
        <div className="reveal">
          <div className="section-tag">Why BazaarNet</div>
          <div className="section-title">Built for<br/>Scale & Speed</div>
          <div className="why-list">
            <div className="why-item">
              <div className="why-icon">🏗️</div>
              <div>
                <h4>Robust Infrastructure</h4>
                <p>We build secure, cloud-native platforms capable of handling thousands of concurrent vendors and transactions.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-icon">⚡</div>
              <div>
                <h4>Lightning-Fast Logistics</h4>
                <p>Our smart warehousing and routing tech ensures next-day deliveries across all major cities.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-icon">🤝</div>
              <div>
                <h4>Vendor-First Approach</h4>
                <p>Intuitive dashboards and automated payouts mean happier vendors and a stronger marketplace.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-icon">🛡️</div>
              <div>
                <h4>Enterprise Security</h4>
                <p>End-to-end encryption and compliance-ready systems protect your customer and financial data.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="why-visual reveal">
          <div className="big-number">99%</div>
          <div className="big-label">On-Time Delivery Rate<br/>Across the Network</div>
        </div>
      </div>
    </section>
  )
}
