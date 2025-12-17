import React from 'react'
import { Play, Heart } from "lucide-react"

const SongCard = ({song}) => {
    return (
<div className="bg-card rounded-xl p-4 flex gap-4 items-center hover:bg-gray-800 transition">
    <img
    src={song.cover}
    alt={song.title}
    className="w-14 h-14 rounded-lg object-cover"
    />

    <div className="flex-1">
    <p className="font-medium">{song.title}</p>
    <p className="text-sm text-gray-400">{song.artist}</p>
    </div>

    <button className="p-2 hover:text-primary transition">
    <Play size={20} />
    </button>

    <button className="p-2 hover:text-red-400 transition">
    <Heart size={20} />
    </button>
</div>
)
}

export default SongCard




