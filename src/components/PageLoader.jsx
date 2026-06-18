import { useEffect, useState } from 'react'

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`page-loader ${!isVisible ? 'hidden' : ''}`} id="pageLoader">
      <div className="loader-logo">BAZAAR<span>NET</span></div>
    </div>
  )
}
