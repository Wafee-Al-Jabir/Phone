"use client"
import { useState, useRef, useEffect } from "react"
import { Camera, X, RotateCcw } from "lucide-react"

interface CameraInterfaceProps {
  onClose: () => void
}

export default function CameraInterface({ onClose }: CameraInterfaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })
      setStream(mediaStream)
      setHasPermission(true)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setHasPermission(false)
    }
  }

  const savePhotoLocally = (photoDataUrl: string) => {
    const savedPhotos = JSON.parse(localStorage.getItem("phonePhotos") || "[]")
    const newPhoto = {
      id: Date.now().toString(),
      dataUrl: photoDataUrl,
      timestamp: new Date().toISOString(),
    }
    savedPhotos.unshift(newPhoto) // Add to beginning
    localStorage.setItem("phonePhotos", JSON.stringify(savedPhotos))
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        // Flip the canvas horizontally to match the mirrored video
        context.scale(-1, 1)
        context.drawImage(video, -canvas.width, 0)
        const photoDataUrl = canvas.toDataURL("image/jpeg")
        setCapturedPhoto(photoDataUrl)
        savePhotoLocally(photoDataUrl)
      }
    }
  }

  const retakePhoto = () => {
    setCapturedPhoto(null)
  }

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    onClose()
  }

  if (hasPermission === false) {
    return (
      <div className="absolute inset-0 bg-black flex flex-col items-center justify-center text-white z-50">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        <Camera className="h-16 w-16 mb-4 text-gray-400" />
        <p className="text-center px-4">Camera access denied. Please allow camera permissions to take photos.</p>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 bg-black flex flex-col z-50">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors z-10"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      <div className="flex-grow relative overflow-hidden">
        {capturedPhoto ? (
          <img
            src={capturedPhoto || "/placeholder.svg"}
            alt="Captured"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />
        )}
      </div>

      <div className="flex justify-center items-center p-6 bg-black">
        {capturedPhoto ? (
          <button onClick={retakePhoto} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
            <RotateCcw className="h-8 w-8 text-white" />
          </button>
        ) : (
          <button onClick={takePhoto} className="p-4 rounded-full bg-white hover:bg-gray-200 transition-colors">
            <Camera className="h-8 w-8 text-black" />
          </button>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
