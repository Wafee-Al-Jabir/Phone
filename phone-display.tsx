"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Camera, Fingerprint, Phone, Signal, Wifi, BatteryCharging, Search } from "lucide-react"
import MobileKeyboard from "@/components/mobile-keyboard"
import CameraInterface from "@/components/camera-interface"
import PhotosGallery from "@/components/photos-gallery"

export default function PhoneDisplay() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [isHomeScreenActive, setIsHomeScreenActive] = useState(true)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isBrowserActive, setIsBrowserActive] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isPhotosActive, setIsPhotosActive] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [iframeSrc, setIframeSrc] = useState("")
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Swipe gesture state
  const [startY, setStartY] = useState<number | null>(null)
  const [currentY, setCurrentY] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const timeString = currentDateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const dateString = currentDateTime.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const handleMouseEnterFingerprint = () => {
    hoverTimerRef.current = setTimeout(() => {
      setIsHomeScreenActive(false)
      setIsUnlocked(true)
    }, 1000)
  }

  const handleMouseLeaveFingerprint = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }

  const handleKahfBrowserClick = () => {
    setIsUnlocked(false)
    setIsBrowserActive(true)
    setIsKeyboardVisible(true)
    inputRef.current?.focus()
    setIframeSrc("about:blank")
  }

  const handlePhotosClick = () => {
    setIsUnlocked(false)
    setIsPhotosActive(true)
  }

  const handleCameraClick = () => {
    setIsCameraActive(true)
  }

  const handleCameraClose = () => {
    setIsCameraActive(false)
  }

  const handlePhotosClose = () => {
    setIsPhotosActive(false)
  }

  const goBackToLockScreen = useCallback(() => {
    setIsBrowserActive(false)
    setIsUnlocked(false)
    setIsHomeScreenActive(true)
    setIsCameraActive(false)
    setIsPhotosActive(false)
    setIsKeyboardVisible(false)
    setSearchTerm("")
    setIframeSrc("")
  }, [])

  // Swipe gesture handlers
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const y = "touches" in e ? e.touches[0].clientY : e.clientY
    setStartY(y)
    setCurrentY(y)
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (startY === null) return
      const y = "touches" in e ? e.touches[0].clientY : e.clientY
      setCurrentY(y)
    },
    [startY],
  )

  const handleTouchEnd = useCallback(() => {
    if (startY === null || currentY === null) return

    const deltaY = startY - currentY
    const swipeThreshold = 50

    if (deltaY > swipeThreshold) {
      goBackToLockScreen()
    }

    setStartY(null)
    setCurrentY(null)
  }, [startY, currentY, goBackToLockScreen])

  // Keyboard handlers
  const handleKeyPress = useCallback((key: string) => {
    setSearchTerm((prev) => prev + key)
  }, [])

  const handleDelete = useCallback(() => {
    setSearchTerm((prev) => prev.slice(0, -1))
  }, [])

  const handleSpace = useCallback(() => {
    setSearchTerm((prev) => prev + " ")
  }, [])

  const handleEnter = useCallback(() => {
    if (searchTerm.trim()) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm.trim())}`
      setIframeSrc(searchUrl)
    } else {
      setIframeSrc("about:blank")
    }
    setIsKeyboardVisible(false)
    inputRef.current?.blur()
  }, [searchTerm])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="relative w-[320px] h-[640px] border-[10px] border-gray-800 dark:border-gray-200 rounded-[40px] bg-gray-900 dark:bg-gray-800 shadow-2xl overflow-hidden select-none">
        {/* Speaker/Camera notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-2 bg-gray-700 dark:bg-gray-300 rounded-b-lg z-50"></div>

        {/* Phone Screen */}
        <div className="absolute inset-[10px] rounded-[30px] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 dark:from-gray-300 dark:via-gray-400 dark:to-gray-500 flex flex-col items-center justify-start overflow-hidden">
          {/* Glossy Overlay */}
          <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-white/60 via-white/10 to-black/40 opacity-70"></div>

          {/* Status Bar */}
          <div className="relative w-full flex justify-between items-center px-4 py-2 text-white dark:text-gray-100 text-sm z-20">
            <div className="flex items-center gap-1">
              <Signal className="h-4 w-4" />
              <Wifi className="h-4 w-4" />
            </div>
            <div className="font-medium">{timeString}</div>
            <div className="flex items-center gap-1">
              <BatteryCharging className="h-4 w-4" />
              <span>85%</span>
            </div>
          </div>

          {/* Camera Interface */}
          {isCameraActive && <CameraInterface onClose={handleCameraClose} />}

          {/* Photos Gallery */}
          {isPhotosActive && <PhotosGallery onClose={handlePhotosClose} />}

          {/* Lock Screen Content */}
          <div
            className={`absolute inset-x-0 top-0 bottom-0 flex flex-col items-center justify-start p-6 pt-10 transition-transform duration-500 ${
              isHomeScreenActive ? "translate-y-0" : "-translate-y-full"
            } z-10`}
          >
            <div className="flex flex-col items-center z-10 mt-0">
              <div className="text-7xl font-bold text-white dark:text-gray-100 mb-2">{timeString}</div>
              <div className="text-lg text-gray-300 dark:text-gray-400">{dateString}</div>
            </div>

            <div className="flex-grow"></div>

            {/* Bottom Buttons */}
            <div className="relative w-full flex justify-between items-end px-0 pb-2 z-10">
              {/* Call Button (Bottom Left, lower position) */}
              <button
                className="p-2 rounded-full bg-gray-200/80 hover:bg-gray-300/80 dark:bg-gray-700/80 dark:hover:bg-gray-600/80 transition-colors shadow-lg mb-2 ml-2"
                onClick={() => console.log("Call button clicked")}
              >
                <Phone className="h-5 w-5 text-gray-800 dark:text-white" />
              </button>

              {/* Fingerprint (Middle Bottom) */}
              <button
                className="p-4 rounded-full bg-gray-200/80 hover:bg-gray-300/80 dark:bg-gray-700/80 dark:hover:bg-gray-600/80 transition-colors shadow-lg mb-8"
                onMouseEnter={handleMouseEnterFingerprint}
                onMouseLeave={handleMouseLeaveFingerprint}
              >
                <Fingerprint className="h-7 w-7 text-gray-800 dark:text-white" />
              </button>

              {/* Camera Button (Bottom Right, lower position) */}
              <button
                className="p-2 rounded-full bg-gray-200/80 hover:bg-gray-300/80 dark:bg-gray-700/80 dark:hover:bg-gray-600/80 transition-colors shadow-lg mb-2 mr-2"
                onClick={handleCameraClick}
              >
                <Camera className="h-5 w-5 text-gray-800 dark:text-white" />
              </button>
            </div>
          </div>

          {/* Home Screen Content (App Grid) */}
          <div
            className={`absolute inset-x-0 top-0 bottom-0 flex flex-col items-center justify-start p-6 pt-20 transition-opacity duration-500 ${
              isUnlocked ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            } z-10`}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* App Icons Grid */}
            <div className="flex-grow flex items-start justify-center pt-12 gap-8">
              <button
                className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={handleKahfBrowserClick}
              >
                <Image
                  src="/images/kahf-browser-icon.png"
                  alt="Kahf Browser Icon"
                  width={48}
                  height={48}
                  className="rounded-xl shadow-md"
                />
                <span className="text-white text-xs font-medium">Kahf Browser</span>
              </button>
              <button
                className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={handlePhotosClick}
              >
                <Image
                  src="/images/photos-icon.png"
                  alt="Photos Icon"
                  width={48}
                  height={48}
                  className="rounded-xl shadow-md"
                />
                <span className="text-white text-xs font-medium">Photos</span>
              </button>
            </div>

            {/* Bottom Buttons (same as lock screen) */}
            <div className="relative w-full flex justify-between items-end px-0 pb-2 z-10">
              {/* Call Button (Bottom Left, lower position) */}
              <button
                className="p-2 rounded-full bg-gray-200/80 hover:bg-gray-300/80 dark:bg-gray-700/80 dark:hover:bg-gray-600/80 transition-colors shadow-lg mb-2 ml-2"
                onClick={() => console.log("Call button clicked")}
              >
                <Phone className="h-5 w-5 text-gray-800 dark:text-white" />
              </button>

              {/* Fingerprint (Middle Bottom) */}
              <button
                className="p-4 rounded-full bg-gray-200/80 hover:bg-gray-300/80 dark:bg-gray-700/80 dark:hover:bg-gray-600/80 transition-colors shadow-lg mb-8"
                onMouseEnter={handleMouseEnterFingerprint}
                onMouseLeave={handleMouseLeaveFingerprint}
              >
                <Fingerprint className="h-7 w-7 text-gray-800 dark:text-white" />
              </button>

              {/* Camera Button (Bottom Right, lower position) */}
              <button
                className="p-2 rounded-full bg-gray-200/80 hover:bg-gray-300/80 dark:bg-gray-700/80 dark:hover:bg-gray-600/80 transition-colors shadow-lg mb-2 mr-2"
                onClick={handleCameraClick}
              >
                <Camera className="h-5 w-5 text-gray-800 dark:text-white" />
              </button>
            </div>
          </div>

          {/* Browser Screen Content */}
          <div
            className={`absolute inset-x-0 top-0 bottom-0 flex flex-col transition-transform duration-500 ${
              isBrowserActive ? "translate-y-0" : "translate-y-full"
            } z-10 bg-white dark:bg-gray-900`}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full px-4 pt-4 pb-2 bg-white dark:bg-gray-900" style={{ paddingTop: "100px" }}>
              <div className="relative w-[90%] max-w-xs mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search Google or type a URL"
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsKeyboardVisible(true)}
                  onBlur={() => setIsKeyboardVisible(false)}
                />
              </div>
            </div>

            <div className="flex-grow relative overflow-hidden">
              {iframeSrc && (
                <iframe
                  src={iframeSrc}
                  className="absolute inset-0 w-full h-full border-none"
                  title="Search Results"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                ></iframe>
              )}
            </div>

            <div
              className={`transition-transform duration-300 ease-out ${
                isKeyboardVisible ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <MobileKeyboard
                onKeyPress={handleKeyPress}
                onDelete={handleDelete}
                onEnter={handleEnter}
                onSpace={handleSpace}
              />
            </div>
          </div>

          {/* Swipe-up indicator line */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-400 rounded-full z-40 cursor-grab"
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          ></div>
        </div>
      </div>
    </div>
  )
}
