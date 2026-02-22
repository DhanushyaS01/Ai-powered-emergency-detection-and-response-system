export default function Footer() {
  return (
    <footer id="contact" className="border-t border-gray-800 bg-emergency-card py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-display font-bold text-xl text-white">SafeNow</p>
          <p className="text-gray-500 text-sm mt-1">AI-Powered Women Safety Emergency Alert</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
          <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a>
          <a href="#demo" className="text-gray-400 hover:text-white transition-colors">Demo</a>
          <a href="#impact" className="text-gray-400 hover:text-white transition-colors">Impact</a>
          <a href="mailto:support@safenow.example.com" className="text-gray-400 hover:text-white transition-colors">Contact</a>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>For emergencies, always call local emergency services. This system supplements—not replaces—official emergency response.</p>
        <p className="mt-2">© {new Date().getFullYear()} SafeNow. Built for hackathon & real-world deployment.</p>
      </div>
    </footer>
  )
}
