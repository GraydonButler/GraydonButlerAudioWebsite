import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AboutSection from './components/AboutSection'
//import CollectionSection from './components/CollectionSection'
import SurfacesSection from './components/SurfacesSection'
import ArchitecturalSection from './components/ArchitecturalSection'
import HighlightsSection from './components/HighlightsSection'

function App() {
  return (
    <div className="relative">
      <Navbar />
      <main className="relative">
        <Hero />
        <AboutSection />
        <HighlightsSection />
        <SurfacesSection />
        <ArchitecturalSection />
      </main>
    </div>
  )
}

export default App
