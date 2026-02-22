export default function Hero({ onActivate }) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emergency-dark via-emergency-dark to-emergency-card" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(220,38,38,0.15),transparent)]" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p className="text-emergency-red font-display font-semibold tracking-wider uppercase text-sm mb-4">
          AI-Powered Women Safety
        </p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight text-balance mb-6">
          Every Second Matters in an Emergency
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
          Real-time distress detection and one-tap emergency alerts with live GPS location. 
          AI helps get you help faster—when it matters most.
        </p>
        <button
          onClick={onActivate}
          className="inline-flex items-center gap-2 bg-emergency-red hover:bg-red-600 text-white font-display font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-red-900/30 hover:shadow-red-600/40 hover:scale-105 active:scale-100"
        >
          Activate Safety
        </button>
      </div>
    </section>
  )
}
