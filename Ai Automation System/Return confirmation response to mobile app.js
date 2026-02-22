// Robust confirmation response: checks for context, never aborts on missing data
;(async () => {
  try {
    let isHighDistress = null
    let distressLevel = null
    let incidentSummary = null
    try {
      isHighDistress = getContext("isHighDistress")
    } catch {}
    try {
      incidentSummary = getContext("incidentSummary")
    } catch {}
    try {
      distressLevel = getContext("distressLevel")
    } catch {}

    let response
    if (isHighDistress === true) {
      response = {
        status: "ALERT_TRIGGERED",
        distressLevel: distressLevel || "HIGH",
        summary: incidentSummary || "High distress alert processed."
      }
      console.log("Confirmation response: high distress branch.")
    } else if (isHighDistress === false) {
      response = {
        status: "NO_ALERT",
        distressLevel: distressLevel || "LOW",
        summary: incidentSummary || "No high-risk action needed."
      }
      console.log("Confirmation response: low distress/no alert branch.")
    } else {
      response = {
        status: "UNKNOWN",
        distressLevel: distressLevel || "UNDETECTED",
        summary: "No incident detected or insufficient data."
      }
      console.log("Confirmation fallback: missing context, returning default response.")
    }
    setContext("confirmationResponse", response)
  } catch (e) {
    console.error("Confirmation response fatal error:", e)
    // Never abort for context issues; always return something
    setContext("confirmationResponse", {
      status: "UNKNOWN",
      distressLevel: "UNDETECTED",
      summary: "Workflow error: see logs for details."
    })
  }
})()
