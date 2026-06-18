import { useEffect, useRef } from 'react'

export default function Services() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    const reveals = sectionRef.current.querySelectorAll('.reveal')
    reveals.forEach((el) => observer.observe(el))

    return () => {
      reveals.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <section className="services reveal" id="services" ref={sectionRef}>
      <div className="services-header">
        <div>
          <div className="section-tag">What We Do</div>
          <div className="section-title">Our Core<br/>Solutions</div>
        </div>
        <p className="section-desc">Everything your business needs to build, scale, and deliver — from digital storefronts to the customer's door.</p>
      </div>
      <div className="services-grid">
        <div className="service-card reveal">
          <div className="service-num">01</div>
          <div className="service-icon">🛒</div>
          <div className="service-name">Multi-Vendor E-Commerce</div>
          <p className="service-desc">Robust marketplace platforms connecting vendors and customers seamlessly with scalable infrastructure.</p>
          <div className="service-arrow">↗</div>
        </div>
        <div className="service-card reveal">
          <div className="service-num">02</div>
          <div className="service-icon">📦</div>
          <div className="service-name">End-to-End Logistics</div>
          <p className="service-desc">Smart warehousing, real-time inventory management, and ultra-fast last-mile delivery fleets.</p>
          <div className="service-arrow">↗</div>
        </div>
        <div className="service-card reveal">
          <div className="service-num">03</div>
          <div className="service-icon">💻</div>
          <div className="service-name">Custom IT Solutions</div>
          <p className="service-desc">Web & mobile app development, custom ERP systems, and secure cloud infrastructure designed for commerce.</p>
          <div className="service-arrow">↗</div>
        </div>
        <div className="service-card reveal">
          <div className="service-num">04</div>
          <div className="service-icon">📊</div>
          <div className="service-name">Vendor Dashboards</div>
          <p className="service-desc">Real-time analytics, order tracking, and intuitive management tools for your marketplace sellers.</p>
          <div className="service-arrow">↗</div>
        </div>
        <div className="service-card reveal">
          <div className="service-num">05</div>
          <div className="service-icon">💳</div>
          <div className="service-name">Secure Payments</div>
          <p className="service-desc">Integration with local and global payment processors to ensure smooth, secure, and fast transactions.</p>
          <div className="service-arrow">↗</div>
        </div>
        <div className="service-card reveal">
          <div className="service-num">06</div>
          <div className="service-icon">🎧</div>
          <div className="service-name">Customer Experience Tech</div>
          <p className="service-desc">Helpdesk integrations, automated order tracking systems, and CRM setups for perfect customer service.</p>
          <div className="service-arrow">↗</div>
        </div>
      </div>
    </section>
  )
}
