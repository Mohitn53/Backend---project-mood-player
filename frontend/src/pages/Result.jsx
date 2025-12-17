import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Heart, 
  Share2, 
  MoreHorizontal,
  Sparkles
} from 'lucide-react';
import { MoodContext } from '../context/MoodContext';

const Result = () => {
  const [mood,setmood] = useContext(MoodContext)
  const [currentSong, setCurrentSong] = useState(null);

  // Mock Data
  const mockSongs = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      cover: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
      duration: "3:20"
    },
    {
      id: 2,
      title: "Levitating",
      artist: "Dua Lipa",
      cover: "https://i.scdn.co/image/ab67616d00001e02d53d88e2a5f8c0e8a17c9c91",
      duration: "3:23"
    },
    {
      id: 3,
      title: "Perfect",
      artist: "Ed Sheeran",
      cover: "https://i.scdn.co/image/ab67616d00001e02cdd9b50c1dfe2e4b4b7f1c59",
      duration: "4:23"
    },
    {
      id: 4,
      title: "As It Was",
      artist: "Harry Styles",
      cover: "https://i.scdn.co/image/ab67616d0000b273298f92d5a67756fa59862d5f",
      duration: "2:47"
    },
  ];

  // Animation Variants for Staggered List
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const handlePlay = (id) => {
    if (currentSong === id) {
      setCurrentSong(null); // Pause
    } else {
      setCurrentSong(id); // Play
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 px-4 py-8 relative overflow-hidden">
      
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[20%] w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[20%] w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full"
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* --- Header: Mood Reveal --- */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 mb-4 shadow-lg shadow-orange-500/20"
          >
            <Sparkles className="text-white w-8 h-8" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white mb-2"
          >
            You seem <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-400">{mood}</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-sm"
          >
            We've curated a vibe to match your energy.
          </motion.p>
        </div>

        {/* --- Playlist Card --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* List Header */}
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-white font-semibold">Your Mix</h3>
            <button className="text-xs text-indigo-300 hover:text-white transition-colors font-medium">
              Save Playlist
            </button>
          </div>

          {/* Songs List */}
          <motion.div 
            className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {mockSongs.map((song) => {
              const isPlaying = currentSong === song.id;
              
              return (
                <motion.div 
                  key={song.id} 
                  variants={itemVariants}
                  className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                    isPlaying ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent hover:border-white/5'
                  }`}
                  onClick={() => handlePlay(song.id)}
                >
                  {/* Album Art with Play Overlay */}
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <img 
                      src={song.cover} 
                      alt={song.title} 
                      className={`w-full h-full object-cover rounded-lg shadow-md transition-transform duration-300 ${isPlaying ? 'scale-105' : ''}`}
                    />
                    {/* Overlay Icon */}
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg transition-opacity duration-200 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {isPlaying ? <Pause size={16} className="text-white fill-current" /> : <Play size={16} className="text-white fill-current" />}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold truncate ${isPlaying ? 'text-indigo-300' : 'text-white'}`}>
                      {song.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {song.artist}
                    </p>
                  </div>

                  {/* Equalizer / Duration */}
                  <div className="text-right">
                    {isPlaying ? (
                       <div className="flex items-end gap-[2px] h-3">
                         <motion.div animate={{ height: [4, 12, 6, 12] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-indigo-400 rounded-full" />
                         <motion.div animate={{ height: [12, 6, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-indigo-400 rounded-full" />
                         <motion.div animate={{ height: [6, 12, 4, 8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-indigo-400 rounded-full" />
                       </div>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">{song.duration}</span>
                    )}
                  </div>
                  
                  {/* Options (Hidden on Mobile usually, visible on hover) */}
                  <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={16} className="text-slate-400 hover:text-white" />
                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* --- Bottom Actions --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-4 mt-8"
        >
          <Link to="/detect" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all active:scale-95">
              <RefreshCw size={18} />
              <span>Retake</span>
            </button>
          </Link>
          
          <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-900/40 hover:shadow-indigo-900/60 transition-all active:scale-95">
            <Share2 size={18} />
            <span>Share Vibe</span>
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default Result;