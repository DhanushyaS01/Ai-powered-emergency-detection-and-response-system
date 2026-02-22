const steps = [
  { label: 'Panic Trigger', desc: 'One tap or voice trigger' },
  { label: 'GPS Capture', desc: 'Live location sent' },
  { label: 'AI Analysis', desc: 'Distress level & summary' },
  { label: 'Alert Sent', desc: 'Contacts & authorities' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white text-center mb-4">
          How It Works
        </h2>
        <p className="text-gray-400 text-center max-w-xl mx-auto mb-16">
          From the moment you need help to the moment help is on the way.
        </p>
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-8 sm:gap-4">
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center flex-1">
              <div className="w-14 h-14 rounded-full bg-emergency-red/20 border-2 border-emergency-red flex items-center justify-center text-emergency-red font-display font-bold text-lg shrink-0">
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-7 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gray-700 -translate-y-1/2 pointer-events-none" aria-hidden />
              )}
              <h3 className="font-display font-semibold text-white mt-4">{step.label}</h3>
              <p className="text-gray-500 text-sm mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
