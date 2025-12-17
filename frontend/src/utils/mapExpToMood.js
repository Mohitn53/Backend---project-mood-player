export const mapToMood = (expressions) => {
  const entries = Object.entries(expressions)
  entries.sort((a, b) => b[1] - a[1])

  const [topEmotion, topScore] = entries[0]

  // CONFIDENCE THRESHOLD
  if (topScore < 0.4) return "neutral"

  if (topEmotion === "happy") return "happy"
  if (topEmotion === "sad") return "sad"
  if (topEmotion === "angry") return "angry"
  if (topEmotion === "surprised") return "happy"

  return "neutral"
}
