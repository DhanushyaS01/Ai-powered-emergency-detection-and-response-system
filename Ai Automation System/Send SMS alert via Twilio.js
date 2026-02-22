// Step sends SMS via Twilio if distress is high
const twilio = require("twilio")
;(async () => {
  try {
    let isHighDistress
    try {
      isHighDistress = getContext("isHighDistress")
    } catch {
      setContext("smsStatus", "SKIPPED")
      console.log("Skipped SMS alert: isHighDistress not set in context")
      return
    }
    if (!isHighDistress) {
      setContext("smsStatus", "SKIPPED")
      console.log("Skipped SMS alert: isHighDistress is missing or false")
      return
    }
    // Twilio credentials & numbers from env
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
    const SMS_FROM = process.env.TWILIO_SMS_FROM
    const SMS_TO = process.env.TWILIO_SMS_TO
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !SMS_FROM || !SMS_TO) {
      console.error("SMS alert error: Twilio SMS env vars missing")
      setContext("smsStatus", "ERROR")
      return
    }
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    const alertBody = `Distress Alert!\nLevel: HIGH\nMessage: ${getContext("messageText")}\nLocation: ${JSON.stringify(getContext("location"))}`
    const resp = await client.messages.create({
      body: alertBody,
      from: SMS_FROM,
      to: SMS_TO
    })
    setContext("smsStatus", resp.sid || "SENT")
    console.log("SMS sent. Message SID:", resp.sid)
  } catch (e) {
    setContext("smsStatus", "ERROR")
    console.error("SMS alert error:", e)
    return
  }
})()
