import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Music } from 'lucide-react';

const Landing = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 px-6">
      
      {/* --- Ambient Background Animations --- */}
      {/* Purple Blob */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"
      />
      {/* Blue Blob */}
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          x: [0, 50, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 -right-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"
      />
      
      {/* --- Main Content Card (Glassmorphism) --- */}
      <div className="relative z-10 max-w-2xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl text-center"
        >
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6"
          >
            <Sparkles size={14} />
            <span>AI-Powered Experience</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white"
          >
            Music that <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              feels like you.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed"
          >
            Don't just listen—experience. Let our AI analyze your mood through your camera and curate the perfect soundscape for this exact moment.
          </motion.p>

          {/* Call to Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link to="/detect">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]"
              >
                <span>Detect My Mood</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                
                {/* Button Glow Effect */}
                <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/50 transition-all" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Footer / Trust signal */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex items-center justify-center gap-6 text-slate-500 text-sm"
          >
            <div className="flex items-center gap-2">
              <Music size={16} />
              <span>1M+ Tracks</span>
            </div>
            <div className="w-1 h-1 bg-slate-700 rounded-full" />
            <div>Real-time Analysis</div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

export default Landing;