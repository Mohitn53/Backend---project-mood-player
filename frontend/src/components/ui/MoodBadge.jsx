import { moodColors } from "../../utils/moodColors"
import React from 'react'

const MoodBadge = ({mood}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${moodColors[mood]}`}
    >
      <span className="text-xl">
        {mood === "happy" && "😊"}
        {mood === "sad" && "😔"}
        {mood === "angry" && "😡"}
        {mood === "calm" && "😌"}
        {mood === "neutral" && "😐"}
      </span>
      <span className="capitalize">{mood} mood</span>
    </div>
  )
}

export default MoodBadge

