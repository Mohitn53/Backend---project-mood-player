import React, { useContext, useState } from 'react';
import CameraView from '../components/ui/CameraView';
import { useCamera } from "../hooks/useCamera";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MoodContext, useMood } from "../context/MoodContext"; 
import { 
  Camera, 
  CameraOff, 
  ScanLine, 
  ChevronRight, 
  AlertCircle, 
  ShieldCheck,
  BrainCircuit,
  Loader2
} from "lucide-react";
import * as faceapi from "face-api.js"
import { loadModels } from "../utils/loadmodels"
import { mapToMood } from "../utils/mapExpToMood"
import { useEffect } from "react"




const DetectMood = () => {
  const {
    videoRef,
    startCamera,
    stopCamera,
    isActive,
    error,
  } = useCamera();

  const [mood,setMood]  = useContext(MoodContext); // Access Global Context
  const navigate = useNavigate();
  const [loadingAI, setLoadingAI] = useState(false)
  useEffect(() => {
    loadModels()
}, [])


const detectMood = async () => {
  if (!videoRef.current) return

  setLoadingAI(true)

  let expressionsList = []

  for (let i = 0; i < 5; i++) {
    const detection = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceExpressions()

    if (detection?.expressions) {
      expressionsList.push(detection.expressions)
    }

    await new Promise(res => setTimeout(res, 300))
  }

  if (expressionsList.length === 0) {
    setLoadingAI(false)
    return
  }

  const finalMood = averageExpressions(expressionsList)
  setMood(finalMood)
  navigate("/result")
  setLoadingAI(false)
}


  
  // Local state for the "Scanning" UI effect
  const [isScanning, setIsScanning] = useState(false);

  // Function to handle the "Analyze" action
  const handleCaptureMood = async () => {
    setIsScanning(true);

    // 1. Simulate AI Processing Delay (2 seconds)
    // In a real app, this is where you'd await face-api.js or your backend
    setTimeout(() => {
      
      // 2. Mock Detection Logic (Replace this with real detection result)
      const detected = Math.random() > 0.5 ? "Happy" : "Melancholy";
      
      // 3. Update Global Context
      setMood(detected);

      // 4. Navigate to Results
      navigate("/result");
      
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 px-4 py-6 relative overflow-hidden">
      
      {/* --- Ambient Background --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <motion.div 
           animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
           transition={{ duration: 10, repeat: Infinity }}
           className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-900/20 blur-[100px] rounded-full"
         />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-8">
        
        {/* --- Header --- */}
        <div className="text-center space-y-2">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white tracking-tight"
          >
            Mood Detection
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-2 text-indigo-200/60 text-sm"
          >
            <ShieldCheck size={14} />
            <span>Privacy enabled: Processing happens locally</span>
          </motion.div>
        </div>

        {/* --- Viewfinder --- */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mx-auto w-full aspect-[3/4] max-w-sm rounded-3xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl backdrop-blur-sm"
        >
          
          {/* Status Pill */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-medium text-white/80">
            {isScanning ? (
               <>
                <Loader2 size={12} className="animate-spin text-indigo-400"/>
                <span className="text-indigo-200">Analyzing...</span>
               </>
            ) : isActive ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span>Live Feed</span>
              </>
            ) : (
              <>
                <CameraOff size={12} />
                <span>Camera Off</span>
              </>
            )}
          </div>

          {/* Camera Container */}
          <div className="relative h-full w-full bg-black/20">
            
            {/* Placeholder */}
            {!isActive && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white/20 gap-4">
                <motion.div
                   animate={{ opacity: [0.5, 1, 0.5] }}
                   transition={{ duration: 2, repeat: Infinity }}
                >
                   <ScanLine size={48} strokeWidth={1} />
                </motion.div>
                <p className="text-sm font-light tracking-wide uppercase">Waiting for signal...</p>
              </div>
            )}
            
            {/* Video Component */}
            <div className={`relative h-full w-full object-cover transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      // This ensures perfect centering and coverage
                      className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" 
                    />
            </div>

            {/* Error Overlay */}
            {error && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-6 z-40">
                <AlertCircle className="text-red-500 mb-2" size={32} />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Scanning Overlay (Enhanced) */}
            <AnimatePresence>
              {(isActive || isScanning) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 pointer-events-none"
                >
                  {/* The moving laser line */}
                  <motion.div 
                    animate={{ top: ["5%", "95%", "5%"] }}
                    transition={{ duration: isScanning ? 1.5 : 4, ease: "linear", repeat: Infinity }}
                    className={`absolute left-0 right-0 h-[2px] shadow-[0_0_20px_rgba(99,102,241,0.8)] ${isScanning ? 'bg-green-400 shadow-green-400/50' : 'bg-indigo-500'}`}
                  />
                  
                  {/* Grid Overlay during scan */}
                  {isScanning && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* HUD Brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/30 rounded-tl-lg pointer-events-none z-20" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/30 rounded-tr-lg pointer-events-none z-20" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/30 rounded-bl-lg pointer-events-none z-20" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/30 rounded-br-lg pointer-events-none z-20" />
          
        </motion.div>


        {/* --- Controls Section --- */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="space-y-4"
        >
          <div className="flex gap-4">
            
            {!isActive ? (
                // State 1: Camera is Off -> Show Start
                <button
                    onClick={startCamera}
                    className="group flex-1 relative overflow-hidden py-4 rounded-2xl font-semibold bg-white text-slate-900 hover:bg-indigo-50 hover:shadow-indigo-500/20 transition-all shadow-lg"
                >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                        <Camera size={20} />
                        <span>Start Camera</span>
                    </div>
                </button>
            ) : (
                // State 2: Camera is On -> Show Analyze or Stop
                <div className="flex w-full gap-3">
                    <button
                        onClick={stopCamera}
                        disabled={isScanning}
                        className="px-6 py-4 rounded-2xl font-semibold bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-50"
                    >
                        <CameraOff size={20} />
                    </button>

                    <button
                        onClick={handleCaptureMood}
                        disabled={isScanning}
                        className="flex-1 relative overflow-hidden py-4 rounded-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-95 disabled:opacity-80"
                    >
                        <div className="flex items-center justify-center gap-2">
                            {isScanning ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <BrainCircuit size={20} />
                                    <button
                                        onClick={detectMood}
                                        disabled={loadingAI}
                                        className="w-full bg-primary py-3 rounded-xl font-medium disabled:opacity-50"
                                        >
                                        {loadingAI ? "Analyzing mood..." : "Detect Mood"}
                                    </button>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            )}
          </div>

          {/* Alternative Link (Only if they want to skip) */}
          <div className="text-center">
             <Link to="/result" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Skip detection and browse manually
             </Link>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default DetectMood;
