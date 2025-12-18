import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Music } from "lucide-react";

const MusicPlayer = ({ 
  song, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrev, 
  currentTime, 
  duration, 
  onSeek 
}) => {
  const [imgError, setImgError] = useState(false);

  // Reset error state when song changes
  useEffect(() => {
    setImgError(false);
  }, [song]);

  if (!song) return null;

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2"
    >
      <div className="max-w-md mx-auto bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/50">
        
        {/* Progress Bar */}
        <div className="w-full mb-3 flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span>{formatTime(currentTime)}</span>
            <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="flex-1 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
            <span>{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-between">
            {/* Song Info & Art */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Album Art Handling */}
                <div className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''} shadow-lg`}>
                    {!imgError && song.cover ? (
                        <img 
                            src={song.cover} 
                            alt="Cover" 
                            onError={() => setImgError(true)}
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        // Fallback Gradient
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white/50">
                            <Music size={20} />
                        </div>
                    )}
                </div>

                <div className="min-w-0">
                    <h4 className="text-white font-semibold text-sm truncate">{song.title || "Unknown Title"}</h4>
                    <p className="text-slate-400 text-xs truncate">{song.artist || "Unknown Artist"}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                <button onClick={onPrev} className="text-slate-300 hover:text-white transition active:scale-90">
                    <SkipBack size={24} fill="currentColor" />
                </button>
                
                <button 
                    onClick={onPlayPause}
                    className="w-12 h-12 flex items-center justify-center bg-indigo-500 rounded-full text-white shadow-lg shadow-indigo-500/40 hover:bg-indigo-400 transition active:scale-95"
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                </button>

                <button onClick={onNext} className="text-slate-300 hover:text-white transition active:scale-90">
                    <SkipForward size={24} fill="currentColor" />
                </button>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;