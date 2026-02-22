// Generates full incident summary for response/log
;(async () => {
  try {
    let isHighDistress
    try {
      isHighDistress = getContext("isHighDistress")
    } catch {
      setContext("incidentSummary", "Distress not detected, no full summary generated.")
      console.log("No GenAI summary needed: isHighDistress not set in context")
      return
    }
    if (!isHighDistress) {
      setContext("incidentSummary", "Distress not detected, no full summary generated.")
      console.log("No GenAI summary needed (distress false)")
      return
    }
    const distressLevel = getContext("distressLevel")
    const incidentData = getContext("incidentData")
    const aiPrompt = `Summarize this incident for a police/law enforcement report in 5-7 lines. Highlight distress signs and suggested action.\nIncident: ${JSON.stringify(incidentData)}\nDistress level: ${distressLevel}`
    const result = await TurboticOpenAI([{ role: "user", content: aiPrompt }], { model: "gpt-4.1", temperature: 0 })
    setContext("incidentSummary", result.content)
    console.log("Incident summary generated:", result.content)
  } catch (e) {
    setContext("incidentSummary", "GENAI ERROR")
    console.error("Error generating incident summary:", e)
    return
  }
})()
