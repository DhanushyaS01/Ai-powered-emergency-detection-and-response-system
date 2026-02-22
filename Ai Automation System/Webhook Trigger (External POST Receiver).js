;(async () => {
  const reqBody = {
    trigger_type: "voice",
    text: "help me someone is following me",
    latitude: 13.0827,
    longitude: 80.2707,
    user_id: "U1001"
  }

  console.log("Webhook received:", reqBody)
  setContext("webhookData", reqBody)
})()