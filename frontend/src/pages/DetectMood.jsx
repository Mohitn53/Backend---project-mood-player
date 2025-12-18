import React, { useContext, useState, useEffect, useRef } from "react";
import CameraView from "../components/ui/CameraView";
import { useCamera } from "../hooks/useCamera";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MoodContext } from "../context/MoodContext";
import {
  Camera,
  CameraOff,
  ShieldCheck,
  BrainCircuit,
  Loader2,
  AlertCircle,
  ScanFace,
  Sparkles
} from "lucide-react";

import { initFaceLandmarker } from "../utils/initFaceLandmarker";
import { mapBlendshapesToMood } from "../utils/mapBlendshapesToMood";
import axios from "axios";

const DetectMood = () => {
  const { videoRef, startCamera, stopCamera, isActive, error } = useCamera();
  const [mood, setMood] = useContext(MoodContext);
  const navigate = useNavigate();

  const [loadingAI, setLoadingAI] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const landmarkerRef = useRef(null);

  /* ================= AI INITIALIZATION ================= */
  useEffect(() => {
    const init = async () => {
      try {
        landmarkerRef.current = await initFaceLandmarker();
        setModelsLoaded(true);
      } catch (e) {
        console.error("Failed to load MediaPipe:", e);
      }
    };
    init();
  }, []);

  /* ================= DETECT MOOD ================= */
  const detectMood = async () => {
    if (!videoRef.current || !landmarkerRef.current || loadingAI) return;

    const video = videoRef.current;

    if (video.readyState < 2 || video.videoWidth === 0) {
      alert("Camera not ready. Please wait a moment.");
      return;
    }

    setLoadingAI(true);

    try {
      const results = landmarkerRef.current.detectForVideo(
        video,
        performance.now()
      );

      if (!results.faceBlendshapes?.length) {
        alert("No face detected. Please align your face in the frame.");
        setLoadingAI(false); // Stop loading if no face
        return;
      }

      const blendshapes = results.faceBlendshapes[0].categories;
      const detectedMood = mapBlendshapesToMood(blendshapes);

      setMood(detectedMood);
      console.log("Detected:", detectedMood);
      
      const response = await axios.get(
        `http://localhost:3000/song?mood=${detectedMood}`
      );
      
      navigate("/result", { state: { songs: response.data } });
    } catch (err) {
      console.error("Detection error:", err);
      alert("Mood detection failed. Please try again.");
    } finally {
      setLoadingAI(false);
    }
  };

  /* ================= UI RENDER ================= */
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 px-4 py-6 relative overflow-hidden">
      
      {/* --- 1. Ambient Background --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <motion.div 
           animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }}
           transition={{ duration: 15, repeat: Infinity }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/20 blur-[100px] rounded-full"
         />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">

        {/* --- 2. Header --- */}
        <div className="text-center space-y-2">
          <motion.h2 
             initial={{ opacity: 0, y: -10 }} 
             animate={{ opacity: 1, y: 0 }}
             className="text-3xl font-bold text-white tracking-tight"
          >
            Mood Detection
          </motion.h2>
          <div className="flex items-center justify-center gap-2 text-indigo-200/60 text-xs uppercase tracking-wider">
            <ShieldCheck size={14} />
            <span>Privacy Active • MediaPipe Engine</span>
          </div>
        </div>

        {/* --- 3. Viewfinder / Camera Frame --- */}
        <div className="relative mx-auto w-full aspect-[3/4] max-w-sm rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-2xl z-20">
          
          {/* Status Pill (Floating Top) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white/90">
            {loadingAI ? (
                <>
                  <Loader2 size={12} className="animate-spin text-indigo-400"/>
                  <span>Analyzing...</span>
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

          {/* Video Container */}
          <div className="absolute inset-0 w-full h-full bg-slate-900">
             
             {/* Placeholder (When inactive) */}
             {!isActive && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                    <ScanFace size={64} strokeWidth={1} className="relative" />
                  </div>
                  <p className="text-sm font-medium tracking-widest uppercase">Initialize Camera</p>
                </div>
             )}

             {/* The Actual Video */}
             <div className={`relative w-full h-full ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                <CameraView videoRef={videoRef} />
             </div>

             {/* Error Message */}
             {error && (
               <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center z-40">
                 <AlertCircle className="text-red-500 mb-2" size={32} />
                 <p className="text-white text-sm">{error}</p>
               </div>
             )}

             {/* --- HUD Overlays (Scanner & Brackets) --- */}
             <AnimatePresence>
                {(isActive || loadingAI) && (
                   <motion.div 
                     initial={{ opacity: 0 }} 
                     animate={{ opacity: 1 }} 
                     exit={{ opacity: 0 }}
                     className="absolute inset-0 z-20 pointer-events-none"
                   >
                      {/* Scanning Laser Line */}
                      <motion.div 
                        animate={{ top: ["10%", "90%", "10%"] }}
                        transition={{ duration: loadingAI ? 1.5 : 4, ease: "linear", repeat: Infinity }}
                        className={`absolute left-0 right-0 h-[2px] shadow-[0_0_20px_rgba(99,102,241,0.8)] ${loadingAI ? 'bg-green-400 shadow-green-400/50' : 'bg-indigo-500'}`}
                      />
                      
                      {/* Focus Ring (Only when not loading) */}
                      {!loadingAI && (
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 border border-indigo-500/30 rounded-[45%] opacity-50" />
                      )}

                      {/* Analysis Grid (Only when loading) */}
                      {loadingAI && (
                        <motion.div 
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                           className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[1px]" 
                        />
                      )}
                   </motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Corner Brackets */}
          <div className="absolute top-6 left-6 w-5 h-5 border-l-2 border-t-2 border-white/40 rounded-tl-lg pointer-events-none z-30" />
          <div className="absolute top-6 right-6 w-5 h-5 border-r-2 border-t-2 border-white/40 rounded-tr-lg pointer-events-none z-30" />
          <div className="absolute bottom-6 left-6 w-5 h-5 border-l-2 border-b-2 border-white/40 rounded-bl-lg pointer-events-none z-30" />
          <div className="absolute bottom-6 right-6 w-5 h-5 border-r-2 border-b-2 border-white/40 rounded-br-lg pointer-events-none z-30" />

        </div>

        {/* --- 4. Controls --- */}
        <div className="space-y-4 pt-2">
          {!isActive ? (
             <button
               onClick={startCamera}
               disabled={!modelsLoaded}
               className="group w-full relative overflow-hidden py-4 rounded-2xl font-bold bg-white text-slate-900 shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <span className="relative z-10 flex items-center justify-center gap-2">
                 {modelsLoaded ? <Camera size={20} /> : <Loader2 size={20} className="animate-spin" />}
                 <span>{modelsLoaded ? "Start Camera" : "Loading AI Models..."}</span>
               </span>
             </button>
          ) : (
            <div className="flex w-full gap-3">
               <button
                 onClick={stopCamera}
                 disabled={loadingAI}
                 className="px-6 py-4 rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
               >
                 <CameraOff size={20} />
               </button>

               <button
                 onClick={detectMood}
                 disabled={loadingAI}
                 className="flex-1 relative overflow-hidden py-4 rounded-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/40 transition-all active:scale-95 disabled:opacity-80"
               >
                 <div className="flex items-center justify-center gap-2">
                   {loadingAI ? (
                     <>
                       <Loader2 size={20} className="animate-spin" />
                       <span>Analyzing...</span>
                     </>
                   ) : (
                     <>
                       <BrainCircuit size={20} />
                       <span>Detect Mood</span>
                     </>
                   )}
                 </div>
               </button>
            </div>
          )}

          <div className="text-center">
            <Link to="/result" className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors">
              Skip & Browse Manually
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetectMood;