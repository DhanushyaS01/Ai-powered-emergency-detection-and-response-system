import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import PanicButton from './components/PanicButton'
import Impact from './components/Impact'
import Footer from './components/Footer'

function scrollToDemo() {
  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
}

export default function App() {
  return (
    <>
      <Header onActivate={scrollToDemo} />
      <main>
        <Hero onActivate={scrollToDemo} />
        <Features />
        <HowItWorks />
        <PanicButton />
        <Impact />
        <Footer />
      </main>
    </>
  )
}
