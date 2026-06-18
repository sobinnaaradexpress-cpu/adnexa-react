import { useEffect, useRef, useState } from 'react'

export default function Contact({ addToast }) {
  const sectionRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    message: ''
  })
  const [errors, setErrors] = useState({})

  // REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
  const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'

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

  const validate = () => {
    const newErrors = {}
    if (!formData.fname) newErrors.fname = 'First Name is required'
    if (!formData.lname) newErrors.lname = 'Last Name is required'
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid'
    }
    if (!formData.service) newErrors.service = 'Please select a service'
    if (!formData.message) newErrors.message = 'Please add a message'
    return newErrors
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // clear error
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const formBody = new FormData()
      Object.keys(formData).forEach(key => {
        formBody.append(key, formData[key])
      })

      if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        // Simulate a successful submission if URL is not set yet
        setTimeout(() => {
          setIsSubmitting(false)
          addToast('Form submitted! (Simulation - Please replace SCRIPT_URL in Contact.jsx)', 'success')
          setFormData({ fname: '', lname: '', email: '', phone: '', service: '', budget: '', message: '' })
        }, 1500)
        return
      }

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formBody
      })

      if (response.ok) {
        addToast('Message sent successfully! We will get back to you soon.', 'success')
        setFormData({ fname: '', lname: '', email: '', phone: '', service: '', budget: '', message: '' })
      } else {
        addToast('Oops! Something went wrong. Please try again.', 'error')
      }
    } catch (error) {
      addToast('Oops! Could not connect to the server.', 'error')
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="section-tag">Get in Touch</div>
      <div className="section-title reveal">Let's Grow<br/>Your Business</div>
      <div className="contact-grid">
        <div className="contact-info reveal">
          <p>Ready to stop guessing and start growing? Fill out the form and we'll get back to you within 24 hours. Or reach us directly below.</p>
          <div className="contact-details">
            <div className="contact-detail">
              <div className="contact-detail-icon">📧</div>
              <div className="contact-detail-text"><strong>hello@bazaarnet.com</strong>Email us anytime</div>
            </div>
            <div className="contact-detail">
              <div className="contact-detail-icon">💬</div>
              <div className="contact-detail-text"><strong>+977 98XXXXXXXX</strong>WhatsApp / Viber</div>
            </div>
            <div className="contact-detail">
              <div className="contact-detail-icon">📍</div>
              <div className="contact-detail-text"><strong>Kathmandu, Nepal</strong>Available nationwide</div>
            </div>
          </div>
        </div>
        <form className="contact-form reveal" id="contactForm" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fname">First Name *</label>
              <input type="text" id="fname" name="fname" placeholder="Suman" value={formData.fname} onChange={handleChange} className={errors.fname ? 'error' : ''} />
              {errors.fname && <span className="field-error">{errors.fname}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="lname">Last Name *</label>
              <input type="text" id="lname" name="lname" placeholder="Rai" value={formData.lname} onChange={handleChange} className={errors.lname ? 'error' : ''} />
              {errors.lname && <span className="field-error">{errors.lname}</span>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input type="email" id="email" name="email" placeholder="hello@yourbusiness.com" value={formData.email} onChange={handleChange} className={errors.email ? 'error' : ''} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone / WhatsApp</label>
            <input type="tel" id="phone" name="phone" placeholder="+977 98XXXXXXXX" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="service">Service Interested In *</label>
            <select id="service" name="service" value={formData.service} onChange={handleChange} className={errors.service ? 'error' : ''}>
              <option value="">Select a service...</option>
              <option value="ecommerce-platform">Multi-Vendor E-Commerce Platform</option>
              <option value="logistics">End-to-End Logistics</option>
              <option value="custom-it">Custom App / IT Development</option>
              <option value="payment-gateway">Payment Gateway Integration</option>
              <option value="full-suite">Enterprise Setup (Full Suite)</option>
              <option value="not-sure">Not Sure — Need Advice</option>
            </select>
            {errors.service && <span className="field-error">{errors.service}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="budget">Estimated Budget (NPR)</label>
            <input type="text" id="budget" name="budget" placeholder="e.g. 100,000 – 500,000" value={formData.budget} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea id="message" name="message" placeholder="Tell us about your business and goals..." value={formData.message} onChange={handleChange} className={errors.message ? 'error' : ''}></textarea>
            {errors.message && <span className="field-error">{errors.message}</span>}
          </div>
          <button type="submit" className={`btn-submit ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
            <div className="spinner"></div>
          </button>
        </form>
      </div>
    </section>
  )
}
