import { useOutletContext } from 'react-router-dom'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import ShopPreview from '../components/ShopPreview'
import Services from '../components/Services'
import Process from '../components/Process'
import Pricing from '../components/Pricing'
import WhyUs from '../components/WhyUs'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'

export default function Landing() {
  const { addToast } = useOutletContext()

  return (
    <>
      <Hero />
      <Marquee />
      <ShopPreview />
      <Services />
      <Process />
      <Pricing />
      <WhyUs />
      <Testimonials />
      <FAQ />
      <Contact addToast={addToast} />
    </>
  )
}
