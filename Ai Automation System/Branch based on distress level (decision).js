// Decision: if distress is high, set a flag in context for downstream steps
;(async () => {
  const distressLevel = getContext("distressLevel")
  let isHighDistress
  if (!distressLevel) {
    console.error("No distressLevel in context. Assuming NOT HIGH.")
    isHighDistress = false
  } else {
    isHighDistress = distressLevel.toUpperCase() === "HIGH"
  }
  setContext("isHighDistress", isHighDistress)
  console.log("Distress branching result:", { distressLevel, isHighDistress })
})()
