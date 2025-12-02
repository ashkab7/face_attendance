"use client"

import { useState } from "react"
import { Camera, ArrowLeft, Check, X } from "lucide-react"
import Link from "next/link"

export default function RegisterFacePage() {
  const [name, setName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [captured, setCaptured] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const handleCapture = () => {
    if (!name || !studentId) {
      setMessage({ type: "error", text: "Please enter name and student ID" })
      return
    }
    setCaptured(true)
    setMessage({ type: "success", text: "Face captured successfully!" })
    setTimeout(() => setMessage({ type: "", text: "" }), 3000)
  }

  const handleSave = () => {
    setMessage({ type: "success", text: "Face registered successfully! You can now mark attendance." })
    setTimeout(() => {
      setName("")
      setStudentId("")
      setCaptured(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 border-b border-[#dadada] bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition text-pink-600">
            <ArrowLeft className="w-5 h-5 text-[#f4ede1] text-pink-600" />
            <span className="text-lg font-semibold text-[#f4ede1] text-pink-600">Back</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#f4ede1] text-pink-600">Register Face</h1>
          <div className="w-12"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Card Container */}
          <div className="bg-black border border-[#dadada] rounded-2xl p-8 shadow-sm text-pink-600 border-pink-500">
            {/* Camera Preview Box */}
            <div className="mb-8">
              <div className="relative w-full aspect-video bg-[#ffffff] border-2 border-[#f4ede1] rounded-lg overflow-hidden flex items-center justify-center group hover:border-[#cccccc] transition">
                <div className="absolute inset-0 bg-black/20 border-pink-500"></div>
                {captured ? (
                  <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                    <div className="text-center">
                      <Check className="w-12 h-12 text-black mx-auto mb-2" />
                      <p className="text-black text-sm font-semibold">Face Captured</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-black/60 mx-auto mb-2 group-hover:scale-110 transition" />
                    <p className="text-[#666666] text-sm">Camera Ready</p>
                  </div>
                )}
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#f4ede1] mb-2 text-pink-600">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-white border border-[#dadada] rounded-lg text-black placeholder-[#999999] focus:border-[#f4ede1] focus:ring-1 focus:ring-[#f4ede1]/20 transition outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#f4ede1] mb-2 text-pink-600">Student ID</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="STU-12345"
                  className="w-full px-4 py-2 border border-[#dadada] rounded-lg placeholder-[#999999] focus:border-[#f4ede1] focus:ring-1 focus:ring-[#f4ede1]/20 transition outline-none text-black bg-input"
                />
              </div>
            </div>

            {/* Message Area */}
            {message.text && (
              <div
                className={`mb-6 p-3 rounded-lg flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-white border border-[#f4ede1] text-black"
                    : "bg-white border border-red-400 text-red-700"
                }`}
              >
                {message.type === "success" ? (
                  <Check className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCapture}
                className="w-full px-6 py-3 bg-[#f4ede1] text-black rounded-lg font-semibold hover:bg-[#cccccc] transition transform hover:scale-105 bg-pink-500"
              >
                {captured ? "Capture Again" : "Capture Image"}
              </button>
              {captured && (
                <button
                  onClick={handleSave}
                  className="w-full px-6 py-3 bg-[#f4ede1] text-black rounded-lg font-semibold hover:bg-[#cccccc] transition transform hover:scale-105"
                >
                  Save Face
                </button>
              )}
            </div>

            {/* Info */}
            <p className="text-xs text-[#cccccc] text-center mt-6">
              📷 Position your face in front of the camera. Ensure good lighting for best accuracy.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
