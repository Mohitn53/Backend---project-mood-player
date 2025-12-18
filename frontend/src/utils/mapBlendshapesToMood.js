export function mapBlendshapesToMood(blendshapes) {
  const get = (name) =>
    blendshapes.find((b) => b.categoryName === name)?.score || 0;

  const smile =
    get("mouthSmileLeft") + get("mouthSmileRight");

  const frown =
    get("mouthFrownLeft") + get("mouthFrownRight");

  const browDown =
    get("browDownLeft") + get("browDownRight");

  if (smile > 0.6) return "happy";
  if (browDown > 0.6) return "angry";
  if (frown > 0.5) return "sad";

  return "neutral";
}
