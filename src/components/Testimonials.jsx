import { useEffect, useRef } from 'react'

export default function Testimonials() {
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
    <section className="testimonials" id="testimonials" ref={sectionRef}>
      <div className="testimonials-header reveal">
        <div className="section-tag">Partner Success Stories</div>
        <div className="section-title">What Our Vendors Say</div>
        <p className="section-desc">Real results from e-commerce sellers and logistics partners across Nepal.</p>
      </div>
      <div className="testimonials-grid">
        <div className="testimonial-card reveal">
          <div className="testimonial-stars">★★★★★</div>
          <p className="testimonial-text">BazaarNet's vendor portal completely changed how we handle inventory. Connecting directly to their logistics network cut our delivery times in half.</p>
          <div className="testimonial-author">
            <div className="author-avatar">SR</div>
            <div>
              <div className="author-name">Suman Rai</div>
              <div className="author-role">Owner, Rai Electronics</div>
            </div>
          </div>
        </div>
        <div className="testimonial-card reveal">
          <div className="testimonial-stars">★★★★★</div>
          <p className="testimonial-text">We needed a custom multi-vendor app built from scratch. The IT team at BazaarNet delivered a flawless product and integrated it with local payment gateways perfectly.</p>
          <div className="testimonial-author">
            <div className="author-avatar">PM</div>
            <div>
              <div className="author-name">Priya Maharjan</div>
              <div className="author-role">CEO, Himalayan Crafts Marketplace</div>
            </div>
          </div>
        </div>
        <div className="testimonial-card reveal">
          <div className="testimonial-stars">★★★★★</div>
          <p className="testimonial-text">Since migrating our fulfillment to BazaarNet's warehouses, our operational costs dropped by 30%. Their technology tracking is transparent and completely reliable.</p>
          <div className="testimonial-author">
            <div className="author-avatar">BT</div>
            <div>
              <div className="author-name">Bikash Thapa</div>
              <div className="author-role">Founder, TechMart Nepal</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
