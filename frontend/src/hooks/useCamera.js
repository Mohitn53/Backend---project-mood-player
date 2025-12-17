import { useRef, useState, useEffect } from "react"

export function useCamera() {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [isActive, setIsActive] = useState(false)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })
      setStream(mediaStream)
      setIsActive(true)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      setError("Camera access denied or unavailable")
    }
  }

  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop())
    setStream(null)
    setIsActive(false)
  }

  useEffect(() => {
    return () => stopCamera()
  }, [])

  return { videoRef, startCamera, stopCamera, isActive, error }
}
