// Writes incident to a new row on Google Sheets
const { GoogleSpreadsheet } = require("google-spreadsheet")
;(async () => {
  try {
    let isHighDistress
    try {
      isHighDistress = getContext("isHighDistress")
    } catch {
      setContext("googleSheetsStatus", "SKIPPED")
      console.log("Skipped Google Sheets log: isHighDistress not set in context")
      return
    }
    if (!isHighDistress) {
      setContext("googleSheetsStatus", "SKIPPED")
      console.log("Skipped Google Sheets log: isHighDistress is missing or false")
      return
    }
    const SHEET_ID = process.env.GSHEET_ID
    const CLIENT_EMAIL = process.env.GSHEET_CLIENT_EMAIL
    const PRIVATE_KEY = process.env.GSHEET_PRIVATE_KEY
    if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
      setContext("googleSheetsStatus", "ERROR")
      console.error("Google Sheets log error: Google Sheets env vars missing")
      return
    }
    const doc = new GoogleSpreadsheet(SHEET_ID)
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY.replace(/\\n/g, "\n")
    })
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0] // first sheet
    const timestamp = new Date().toISOString()
    const incidentData = getContext("incidentData") || {}
    const distressLevel = getContext("distressLevel")
    const sheetObj = {
      ...incidentData,
      distressLevel,
      timestamp
    }
    await sheet.addRow(sheetObj)
    setContext("googleSheetsStatus", "SAVED")
    console.log("Incident logged to Google Sheets.")
  } catch (e) {
    setContext("googleSheetsStatus", "ERROR")
    console.error("Sheet log error:", e)
    return
  }
})()
