// Decision: if distress is high OR trigger is panic, set flag for downstream (e.g. WhatsApp)
// Use this version so the panic button always triggers the WhatsApp alert.
;(async () => {
  const distressLevel = getContext("distressLevel")
  let incidentData
  try {
    incidentData = getContext("incidentData") || getContext("webhookData") || {}
  } catch {
    incidentData = {}
  }
  const triggerType = (incidentData.trigger_type || "").toLowerCase()

  let isHighDistress
  if (triggerType === "panic") {
    isHighDistress = true
    console.log("Panic trigger: forcing HIGH distress for WhatsApp alert.")
  } else if (!distressLevel) {
    console.error("No distressLevel in context. Assuming NOT HIGH.")
    isHighDistress = false
  } else {
    isHighDistress = distressLevel.toUpperCase() === "HIGH"
  }

  setContext("isHighDistress", isHighDistress)
  console.log("Distress branching result:", { distressLevel, triggerType, isHighDistress })
})()
