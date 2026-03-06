import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AboutMeSection from './components/AboutMeSection'
import WhatIDoSection from './components/WhatIDoSection'
import HighlightsSection from './components/HighlightsSection'
import ContactSection from './components/ContactSection'
import ProjectsSection from './components/FilmsSection'
function App() {
  return (
    <div className="relative">
      <Navbar />
      <main className="relative">
        <Hero />
        <WhatIDoSection />
        <HighlightsSection />
        <ProjectsSection />
        <AboutMeSection />
        <ContactSection />
      </main>
    </div>
  )
}

export default App
