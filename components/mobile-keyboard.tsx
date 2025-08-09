"use client"

import type React from "react"

interface MobileKeyboardProps {
  onKeyPress: (key: string) => void
  onDelete: () => void
  onEnter: () => void
  onSpace: () => void
}

export default function MobileKeyboard({ onKeyPress, onDelete, onEnter, onSpace }: MobileKeyboardProps) {
  const rows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ]

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-200 dark:bg-gray-800 p-2 rounded-t-xl shadow-lg z-50">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 mb-1">
          {rowIndex === 2 && <div className="w-6"></div>}
          {row.map((key) => (
            <button
              key={key}
              className="flex-1 h-8 bg-gray-300 dark:bg-gray-700 rounded-md text-gray-800 dark:text-white text-sm font-medium active:bg-gray-400 dark:active:bg-gray-600 transition-colors"
              onClick={() => onKeyPress(key)}
              onMouseDown={handleMouseDown}
            >
              {key.toUpperCase()}
            </button>
          ))}
          {rowIndex === 2 && <div className="w-6"></div>}
        </div>
      ))}
      <div className="flex justify-center gap-1 mt-2">
        <button
          className="flex-1 h-8 bg-gray-300 dark:bg-gray-700 rounded-md text-gray-800 dark:text-white text-sm font-medium active:bg-gray-400 dark:active:bg-gray-600 transition-colors"
          onClick={onDelete}
          onMouseDown={handleMouseDown}
        >
          Delete
        </button>
        <button
          className="flex-[2] h-8 bg-gray-300 dark:bg-gray-700 rounded-md text-gray-800 dark:text-white text-sm font-medium active:bg-gray-400 dark:active:bg-gray-600 transition-colors"
          onClick={onSpace}
          onMouseDown={handleMouseDown}
        >
          Space
        </button>
        <button
          className="flex-1 h-8 bg-blue-500 rounded-md text-white text-sm font-medium active:bg-blue-600 transition-colors"
          onClick={onEnter}
          onMouseDown={handleMouseDown}
        >
          Enter
        </button>
      </div>
    </div>
  )
}
