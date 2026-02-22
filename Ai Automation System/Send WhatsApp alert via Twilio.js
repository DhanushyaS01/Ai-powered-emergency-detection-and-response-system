// Step sends WhatsApp via Twilio if distress is high
const twilio = require("twilio")
;(async () => {
  try {
    let isHighDistress
    try {
      isHighDistress = getContext("isHighDistress")
    } catch {
      setContext("whatsappStatus", "SKIPPED")
      console.log("Skipped WhatsApp alert: isHighDistress not set in context")
      return
    }
    if (!isHighDistress) {
      setContext("whatsappStatus", "SKIPPED")
      console.log("Skipped WhatsApp alert: isHighDistress is missing or false")
      return
    }
    // Twilio credentials & numbers from env
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
    const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM // e.g. 'whatsapp:+14155238886'
    const WHATSAPP_TO = process.env.TWILIO_WHATSAPP_TO // e.g. 'whatsapp:+919812345678'
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !WHATSAPP_FROM || !WHATSAPP_TO) {
      console.error("WhatsApp alert error: Twilio WhatsApp env vars missing")
      setContext("whatsappStatus", "ERROR")
      return
    }
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    const messageText = getContext("messageText") || "No message provided"
const incidentData = getContext("incidentData") || {}
const userId = incidentData.user_id || "Unknown"
const triggerType = incidentData.trigger_type || "Unknown"
const latitude = incidentData.latitude
const longitude = incidentData.longitude

const alertBody = `🚨 HIGH DISTRESS ALERT 🚨

User ID: ${userId}
Trigger: ${triggerType}
Message: "${messageText}"

Location:
https://maps.google.com/?q=${latitude},${longitude}

Immediate response required.`
    const resp = await client.messages.create({
      body: alertBody,
      from: WHATSAPP_FROM,
      to: WHATSAPP_TO
    })
    setContext("whatsappStatus", resp.sid || "SENT")
    console.log("WhatsApp sent. Message SID:", resp.sid)
  } catch (e) {
    setContext("whatsappStatus", "ERROR")
    console.error("WhatsApp alert error:", e)
    return
  }
})()
