import { useEffect, useRef } from 'react'

export default function Process() {
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
    <section className="process" id="process" ref={sectionRef}>
      <div className="section-tag">How It Works</div>
      <div className="section-title reveal">4 Steps to<br/>Commerce Scale</div>
      <div className="process-grid">
        <div className="steps reveal">
          <div className="step">
            <div className="step-num">01</div>
            <div className="step-content">
              <h3>Discovery & Strategy</h3>
              <p>We map out your specific e-commerce architecture, tech stack requirements, and logistics needs.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <div className="step-content">
              <h3>IT & Platform Setup</h3>
              <p>We deploy your custom software, configure vendor portals, and integrate necessary payment and CRM systems.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <div className="step-content">
              <h3>Vendor Onboarding</h3>
              <p>We help you train and integrate your sellers into the ecosystem with intuitive tools and dashboards.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">04</div>
            <div className="step-content">
              <h3>Logistics & Fulfillment</h3>
              <p>We activate our warehousing networks and scale your last-mile delivery operations for maximum efficiency.</p>
            </div>
          </div>
        </div>
        <div className="process-visual reveal" id="metricsCard">
          <div className="metric-tag">✦ Network Performance</div>
          <div className="metrics">
            <div className="metric-row">
              <div className="metric-label"><span>System Uptime</span><span>99.99%</span></div>
              <div className="metric-bar"><div className="metric-fill" style={{width: '99%'}}></div></div>
            </div>
            <div className="metric-row">
              <div className="metric-label"><span>Delivery Speed</span><span>+61%</span></div>
              <div className="metric-bar"><div className="metric-fill" style={{width: '61%'}}></div></div>
            </div>
            <div className="metric-row">
              <div className="metric-label"><span>Vendor Satisfaction</span><span>+93%</span></div>
              <div className="metric-bar"><div className="metric-fill" style={{width: '93%'}}></div></div>
            </div>
            <div className="metric-row">
              <div className="metric-label"><span>Operational Costs</span><span>−42%</span></div>
              <div className="metric-bar"><div className="metric-fill" style={{width: '42%'}}></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
