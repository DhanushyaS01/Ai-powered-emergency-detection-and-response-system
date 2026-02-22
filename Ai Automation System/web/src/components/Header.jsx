const links = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#demo', label: 'Demo' },
  { href: '#impact', label: 'Impact' },
  { href: '#contact', label: 'Contact' },
]

export default function Header({ onActivate }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-emergency-dark/90 backdrop-blur-md border-b border-gray-800">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-display font-bold text-xl text-white">
          SafeNow
        </a>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-6">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
          <button
            onClick={onActivate}
            className="bg-emergency-red hover:bg-red-600 text-white font-display font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Activate Safety
          </button>
        </div>
      </nav>
    </header>
  )
}
