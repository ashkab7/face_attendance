"use client"

import { useState } from "react"
import { ArrowLeft, Camera, CheckCircle, Download, Clock } from "lucide-react"
import Link from "next/link"

export default function MarkAttendancePage() {
  const [recognized, setRecognized] = useState(false)
  const [personName, setPersonName] = useState("")
  const [attendanceList, setAttendanceList] = useState([
    { id: 1, name: "John Doe", time: "09:00 AM", status: "Present" },
    { id: 2, name: "Jane Smith", time: "09:15 AM", status: "Present" },
    { id: 3, name: "Mike Johnson", time: "09:30 AM", status: "Present" },
    { id: 4, name: "Sarah Williams", time: "09:45 AM", status: "Present" },
  ])

  const handleMark = () => {
    setRecognized(true)
    setPersonName("John Doe")
    setTimeout(() => setRecognized(false), 3000)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 border-b border-[#dadada] bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition">
            <ArrowLeft className="w-5 h-5 text-[#f4ede1] text-pink-500" />
            <span className="text-lg font-semibold text-[#f4ede1] text-pink-500">Back</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#f4ede1] text-pink-500">Mark Attendance</h1>
          <div className="w-12"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Live Camera Preview */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Camera Section */}
            <div className="bg-black border border-[#dadada] rounded-2xl p-6 shadow-sm border-pink-500">
              <h2 className="text-lg font-semibold text-[#f4ede1] mb-4 border-pink-500 text-pink-500">Live Camera</h2>

              <div className="relative w-full aspect-video bg-white border-2 border-[#f4ede1] rounded-lg overflow-hidden flex items-center justify-center group mb-4">
                <div className="absolute inset-0 bg-black/20"></div>
                <Camera className="w-16 h-16 text-black/40 group-hover:scale-110 transition" />
              </div>

              <button
                onClick={handleMark}
                className="w-full px-6 py-3 bg-[#f4ede1] text-black rounded-lg font-semibold hover:bg-[#cccccc] transition transform hover:scale-105"
              >
                Mark Attendance
              </button>
            </div>

            {/* Recognition Status */}
            <div className="space-y-4">
              {recognized && (
                <div className="bg-black border border-[#f4ede1] rounded-2xl p-6 shadow-sm animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-8 h-8 text-[#f4ede1]" />
                    <h3 className="text-xl font-bold text-[#f4ede1]">Face Recognized</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[#cccccc] mb-1">Person Name</p>
                      <p className="text-lg font-semibold text-[#f4ede1]">{personName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#cccccc] mb-1">Time Marked</p>
                      <p className="text-lg font-semibold text-[#f4ede1] flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#f4ede1]" />
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-[#dadada]">
                      <p className="text-sm font-semibold text-[#f4ede1]">✓ Status: Present</p>
                    </div>
                  </div>
                </div>
              )}

              {!recognized && (
                <div className="bg-white border border-[#dadada] rounded-2xl p-6 flex items-center justify-center h-full min-h-64 border-pink-600">
                  <p className="text-[#666666] text-center text-black">Position your face in front of the camera</p>
                </div>
              )}
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-black border border-[#dadada] rounded-2xl p-6 shadow-sm text-pink-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#f4ede1] text-pink-500">Today's Attendance</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#f4ede1] text-black rounded-lg font-semibold hover:bg-[#cccccc] transition">
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#dadada]">
                    <th className="text-left py-3 px-4 font-semibold text-[#f4ede1] text-pink-500">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#f4ede1] text-pink-500">Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#f4ede1] text-pink-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceList.map((record) => (
                    <tr key={record.id} className="border-b border-[#dadada] hover:bg-white/5 transition">
                      <td className="py-3 px-4 text-[#f4ede1]">{record.name}</td>
                      <td className="py-3 px-4 text-[#cccccc]">{record.time}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 border border-[#f4ede1] rounded-full text-black text-xs font-semibold bg-green-400">
                          <CheckCircle className="w-3 h-3" />
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
