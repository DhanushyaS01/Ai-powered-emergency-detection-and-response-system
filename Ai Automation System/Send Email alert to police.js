// Step: Send email alert to police if distress is HIGH
;(async () => {
  try {
    let isHighDistress
    try {
      isHighDistress = getContext("isHighDistress")
    } catch {
      setContext("policeEmailStatus", "SKIPPED")
      console.log("Skipped police email alert: isHighDistress not set in context")
      return
    }
    if (!isHighDistress) {
      setContext("policeEmailStatus", "SKIPPED")
      console.log("Skipped police email alert: isHighDistress is missing or false")
      return
    }
    const policeEmail = process.env.POLICE_EMAIL
    if (!policeEmail) {
      setContext("policeEmailStatus", "ERROR")
      console.error("Police email alert error: POLICE_EMAIL env var missing")
      return
    }
    const messageText = getContext("messageText")
    const location = getContext("location")
    const eventType = getContext("eventType")
    const email = await sendEmailViaTurbotic({
      to: policeEmail,
      subject: `HIGH Distress Alert from Safety App`,
      text: `Incident: ${eventType || "Button/Voice"}\nMessage: ${messageText}\nLocation: ${JSON.stringify(location)}\nTime: ${new Date().toISOString()}`
    })
    setContext("policeEmailStatus", email.success ? "SENT" : "FAIL")
    console.log("Police email sent:", email.success)
  } catch (err) {
    setContext("policeEmailStatus", "ERROR")
    console.error("Police email alert error:", err)
    return
  }
})()
