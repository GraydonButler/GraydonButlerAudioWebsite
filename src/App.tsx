import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AboutMeSection from './components/AboutMeSection'
import WhatIDoSection from './components/WhatIDoSection'
import HighlightsSection from './components/HighlightsSection'
import ContactSection from './components/ContactSection'

function App() {
  return (
    <div className="relative">
      <Navbar />
      <main className="relative">
        <Hero />
        <WhatIDoSection />
        <HighlightsSection />
        <AboutMeSection />
        <ContactSection />
      </main>
    </div>
  )
}

export default App
