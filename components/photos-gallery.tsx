"use client"

import { useState, useEffect } from "react"
import { X, Download, Trash2 } from "lucide-react"

interface Photo {
  id: string
  dataUrl: string
  timestamp: string
}

interface PhotosGalleryProps {
  onClose: () => void
}

export default function PhotosGallery({ onClose }: PhotosGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = () => {
    const savedPhotos = JSON.parse(localStorage.getItem("phonePhotos") || "[]")
    setPhotos(savedPhotos)
  }

  const deletePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter((photo) => photo.id !== photoId)
    setPhotos(updatedPhotos)
    localStorage.setItem("phonePhotos", JSON.stringify(updatedPhotos))
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null)
    }
  }

  const downloadPhoto = (photo: Photo) => {
    const link = document.createElement("a")
    link.href = photo.dataUrl
    link.download = `photo-${photo.id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (selectedPhoto) {
    return (
      <div className="absolute inset-0 bg-black flex flex-col z-50">
        <div className="flex justify-between items-center p-4 bg-black">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => downloadPhoto(selectedPhoto)}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Download className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={() => deletePhoto(selectedPhoto.id)}
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <img
            src={selectedPhoto.dataUrl || "/placeholder.svg"}
            alt="Selected photo"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col z-50">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Photos</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-gray-500 dark:text-gray-400">No photos yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Take some photos with the camera!</p>
          </div>
        </div>
      ) : (
        <div className="flex-grow overflow-auto p-2">
          <div className="grid grid-cols-3 gap-1">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square relative cursor-pointer group"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.dataUrl || "/placeholder.svg"}
                  alt={`Photo ${photo.id}`}
                  className="w-full h-full object-cover rounded-sm group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-sm"></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
