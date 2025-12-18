import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Play, Pause, MoreHorizontal, Sparkles, Music } from 'lucide-react'; // Added Music Icon
import { MoodContext } from '../context/MoodContext';
import MusicPlayer from '../components/ui/MusicPlayer'; 

const Result = () => {
  const [mood] = useContext(MoodContext);
  const location = useLocation();
  const incomingData = location.state?.songs;
  const apiSongs = incomingData?.songs || [];

  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);

  // --- HANDLERS ---
  const handleSongSelect = (index) => {
    if (currentSongIndex === index) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
    } else {
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
  };

  const playNext = () => {
    if (currentSongIndex !== null) {
      setCurrentSongIndex((currentSongIndex + 1) % apiSongs.length);
    }
  };

  const playPrev = () => {
    if (currentSongIndex !== null) {
      setCurrentSongIndex((currentSongIndex - 1 + apiSongs.length) % apiSongs.length);
    }
  };

  const handleSeek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  useEffect(() => {
    if (currentSongIndex !== null && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = apiSongs[currentSongIndex].url;
      audioRef.current.load();
      if (isPlaying) audioRef.current.play().catch(e => console.error("Play error:", e));
    }
  }, [currentSongIndex]);

  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);

  // Animation
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 px-4 py-8 relative overflow-hidden pb-32">
      
      <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={playNext} onPlay={onPlay} onPause={onPause} />

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }} className="absolute -top-[20%] -right-[20%] w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full" />
        <motion.div animate={{ rotate: [360, 0] }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }} className="absolute -bottom-[20%] -left-[20%] w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 mb-4 shadow-lg shadow-orange-500/20">
            <Sparkles className="text-white w-8 h-8" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold text-white mb-2">
            You seem <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-400 capitalize">{mood || "Neutral"}</span>
          </motion.h2>
          <p className="text-slate-400 text-sm">We've curated a vibe to match your energy.</p>
        </div>

        {/* Playlist */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-white font-semibold">Your Mix</h3>
            <button className="text-xs text-indigo-300 hover:text-white transition-colors">Save Playlist</button>
          </div>

          <motion.div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar" variants={containerVariants} initial="hidden" animate="visible">
             {Array.isArray(apiSongs) && apiSongs.length > 0 ? (
                apiSongs.map((song, index) => {
                  const active = currentSongIndex === index;
                  
                  return (
                    <motion.div 
                      key={song._id || index} 
                      variants={itemVariants}
                      onClick={() => handleSongSelect(index)}
                      className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                        active ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent hover:border-white/5'
                      }`}
                    >
                      {/* --- Album Art Logic --- */}
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-slate-800">
                         {song.cover ? (
                           <img
                             src={song.cover}
                             alt={song.title}
                             className="w-full h-full object-cover"
                             onError={(e) => {
                               // If image fails, hide image and show fallback sibling
                               e.target.style.display = 'none';
                               e.target.nextSibling.style.display = 'flex';
                             }}
                           />
                         ) : null}
                         
                         {/* Fallback Gradient (Visible if no cover OR if onError triggers) */}
                         <div 
                           style={{ display: song.cover ? 'none' : 'flex' }}
                           className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center"
                         >
                            <Music size={16} className="text-white/60" />
                         </div>

                         {/* Play/Pause Overlay */}
                         <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${active && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                           {active && isPlaying ? <Pause size={16} className="text-white fill-current" /> : <Play size={16} className="text-white fill-current" />}
                         </div>
                      </div>

                      {/* Song Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-semibold truncate ${active ? 'text-indigo-300' : 'text-white'}`}>
                          {song.title || "Unknown Track"}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">{song.artist || "Unknown Artist"}</p>
                      </div>

                      {/* Playing Visualizer */}
                      <div className="text-right">
                        {active && isPlaying ? (
                           <div className="flex items-end gap-[2px] h-3">
                             <motion.div animate={{ height: [4, 12, 6, 12] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-indigo-400 rounded-full" />
                             <motion.div animate={{ height: [12, 6, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-indigo-400 rounded-full" />
                             <motion.div animate={{ height: [6, 12, 4, 8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-indigo-400 rounded-full" />
                           </div>
                        ) : (
                          <span className="text-xs text-slate-500">{song.duration || "3:00"}</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })
             ) : (
                <div className="text-center py-8 text-slate-500">No songs found.</div>
             )}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8 px-4">
          <Link to="/detect">
            <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white text-slate-900 font-bold shadow-lg hover:scale-[1.02] transition-all">
              <RefreshCw size={18} />
              <span>Detect Another Mood</span>
            </button>
          </Link>
        </motion.div>

        {/* --- FLOATING MUSIC PLAYER --- */}
        <AnimatePresence>
          {currentSongIndex !== null && (
            <MusicPlayer
              song={apiSongs[currentSongIndex]}
              isPlaying={isPlaying}
              onPlayPause={togglePlayPause}
              onNext={playNext}
              onPrev={playPrev}
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Result;