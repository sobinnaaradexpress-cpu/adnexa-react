import { useEffect, useRef, useState } from 'react'

export default function FAQ() {
  const sectionRef = useRef(null)
  const [openIndex, setOpenIndex] = useState(null)

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

  const faqs = [
    {
      q: "Do you support multi-vendor marketplaces?",
      a: "Yes, our core expertise is building and managing multi-vendor architectures. We provide dedicated dashboards for sellers, automated commission payouts, and centralized admin controls."
    },
    {
      q: "Can you handle last-mile delivery?",
      a: "Absolutely. We offer complete logistics and fulfillment services, from warehousing your inventory to ensuring next-day last-mile delivery to your customers."
    },
    {
      q: "Do you build custom web & mobile apps?",
      a: "Yes, our IT technology division builds native mobile apps and scalable web applications customized exactly to your business logic and design requirements."
    },
    {
      q: "Which payment gateways do you integrate?",
      a: "We integrate with all major domestic payment gateways (eSewa, Khalti, IME Pay, standard bank APIs) as well as international processors like Stripe and PayPal."
    },
    {
      q: "How long does a platform setup take?",
      a: "Standard e-commerce platform setups take 2-4 weeks. Complex enterprise implementations with custom ERP and logistics integrations typically take 8-12 weeks."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="faq" id="faq" ref={sectionRef}>
      <div className="section-tag">Got Questions?</div>
      <div className="section-title reveal">Frequently Asked</div>
      <div className="faq-grid">
        <div className="faq-list reveal">
          {faqs.map((faq, index) => (
            <div className={`faq-item ${openIndex === index ? 'open' : ''}`} key={index}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{faq.q}</span>
                <span className="faq-toggle">+</span>
              </div>
              <div className="faq-answer">{faq.a}</div>
            </div>
          ))}
        </div>
        <div className="faq-visual reveal">
          <div className="section-tag">Ready to Scale?</div>
          <h3>Book a Tech & Logistics Consultation</h3>
          <p>Schedule a free 30-minute discovery call. We'll review your current infrastructure and propose a tailored plan to optimize your operations.</p>
          <a href="#contact" className="btn-primary">Book Consultation →</a>
        </div>
      </div>
    </section>
  )
}
