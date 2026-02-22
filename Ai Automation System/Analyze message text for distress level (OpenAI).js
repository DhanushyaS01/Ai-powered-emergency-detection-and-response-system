// Analyze message text for distress level
;(async () => {
  try {
    const messageText = getContext("messageText")
    if (!messageText) {
      console.error("Analyze distress error: messageText missing in context")
      setContext("distressLevel", "UNDETECTED")
      setContext("distressAnalysis", null)
      return // Gracefully exit step, do not abort workflow
    }
    // Call OpenAI via helper (TurboticOpenAI)
    const aiPrompt = `You are a crisis assessment specialist. Given this message: \"${messageText}\". Assess the likelihood this is a HIGH, MEDIUM, or LOW distress/emergency, and briefly justify. Example output: {\"distressLevel\":\"HIGH\", \"reason\":\"Explicit call for help, signs of panic or immediate threat detected.\"}`
    const result = await TurboticOpenAI([{ role: "user", content: aiPrompt }], { model: "gpt-4.1", temperature: 0 })
    let parsed
    try {
      parsed = JSON.parse(result.content)
    } catch (e) {
      console.error("Could not parse distress analysis output:", result.content)
      setContext("distressLevel", "UNDETECTED")
      setContext("distressAnalysis", result.content)
      return
    }
    setContext("distressLevel", parsed.distressLevel || "UNDETECTED")
    setContext("distressAnalysis", parsed)
    console.log("Distress analysis:", parsed)
  } catch (err) {
    console.error("Distress analysis error (critical):", err)
    setContext("distressLevel", "UNDETECTED")
    setContext("distressAnalysis", null)
    // No abort; step returns gracefully
    return
  }
})()
