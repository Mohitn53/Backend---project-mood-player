export default function CameraView({ videoRef }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-black shadow-xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Face guide overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-64 border-2 border-dashed border-white/50 rounded-xl" />
      </div>
    </div>
  )
}
