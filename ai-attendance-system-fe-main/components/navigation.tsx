"use client"

import Link from "next/link"
import { Camera } from "lucide-react"

export function Navigation() {
  return (
    <header className="border-b border-[#dadada] bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="w-10 h-10 bg-[#f4ede1] rounded-lg flex items-center justify-center">
            <Camera className="w-6 h-6 text-black" />
          </div>
          <span className="text-xl font-bold text-[#f4ede1]">FaceID</span>
        </Link>
      </div>
    </header>
  )
}
