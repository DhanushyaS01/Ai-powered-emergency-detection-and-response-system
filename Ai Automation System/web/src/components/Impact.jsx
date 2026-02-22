const points = [
  {
    title: 'Women safety first',
    text: 'Built for real-world scenarios where every second counts. One tap can alert trusted contacts and authorities with your live location.',
  },
  {
    title: 'Real-time response',
    text: 'AI analyzes distress signals in real time and automates alerts—no need to type or explain when you can\'t.',
  },
  {
    title: 'AI for social good',
    text: 'We use generative AI to detect distress, summarize incidents, and coordinate response—technology in service of safety.',
  },
]

export default function Impact() {
  return (
    <section id="impact" className="py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white text-center mb-4">
          Our Impact
        </h2>
        <p className="text-gray-400 text-center max-w-xl mx-auto mb-16">
          Technology that stands with you when it matters most.
        </p>
        <div className="space-y-8">
          {points.map((p, i) => (
            <div
              key={i}
              className="bg-emergency-card border border-gray-800 rounded-2xl p-6 md:p-8 hover:border-red-900/40 transition-colors"
            >
              <h3 className="font-display font-semibold text-xl text-emergency-red mb-2">{p.title}</h3>
              <p className="text-gray-400 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
