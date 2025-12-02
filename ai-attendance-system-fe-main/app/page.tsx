"use client"

import Link from "next/link"
import { Camera, Shield, Clock, Menu } from "lucide-react"
import { useState } from "react"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 border-b border-[#dadada] bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f4ede1] rounded-lg flex items-center justify-center">
              <Camera className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold text-[#f4ede1]">FaceID Attendance</span>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#dadada]/20 transition"
          >
            <Menu className="w-6 h-6 text-[#f4ede1]" />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-[#f4ede1] hover:opacity-70 transition">
              Features
            </a>
            <a href="#about" className="text-[#f4ede1] hover:opacity-70 transition">
              About
            </a>
            <Link
              href="/mark-attendance"
              className="px-6 py-2 bg-[#f4ede1] text-black rounded-lg font-semibold hover:bg-[#dadada] transition bg-pink-600"
            >
              Get Started
            </Link>
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#dadada] bg-black p-4 space-y-3">
            <a href="#features" className="block text-[#f4ede1] hover:opacity-70 transition">
              Features
            </a>
            <a href="#about" className="block text-[#f4ede1] hover:opacity-70 transition">
              About
            </a>
            <Link
              href="/mark-attendance"
              className="block px-6 py-2 bg-[#f4ede1] text-black rounded-lg font-semibold text-center"
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="hero-bg max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-8 slide-in-top">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#f4ede1]">
              AI Face Recognition
              <br />
              <span className="text-[#f4ede1] text-pink-700">Attendance System</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#f4ede1] max-w-2xl mx-auto">Smart • Secure • Automated</p>
            <p className="text-base sm:text-lg text-[#cccccc] max-w-3xl mx-auto text-pink-600">
              Revolutionary attendance management powered by advanced facial recognition technology. Secure, fast, and
              accurate for educational institutions and enterprises.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-black border border-[#dadada] rounded-full">
                <Shield className="w-4 h-4 text-[#f4ede1]" />
                <span className="text-sm text-[#f4ede1]">Secure & Private</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-black border border-[#dadada] rounded-full">
                <Clock className="w-4 h-4 text-[#f4ede1]" />
                <span className="text-sm text-[#f4ede1]">Real-Time Processing</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-black border border-[#dadada] rounded-full">
                <Camera className="w-4 h-4 text-[#f4ede1]" />
                <span className="text-sm text-[#f4ede1]">High Accuracy</span>
              </div>
            </div>

            {/* Main CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/register-face"
                className="px-8 py-4 bg-[#f4ede1] text-black rounded-lg font-semibold text-lg hover:bg-[#cccccc] transition transform hover:scale-105 bg-pink-600"
              >
                Register Face
              </Link>
              <Link
                href="/mark-attendance"
                className="px-8 py-4 bg-[#f4ede1] text-black rounded-lg font-semibold text-lg hover:bg-[#cccccc] transition transform hover:scale-105 bg-pink-600"
              >
                Mark Attendance
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Camera,
              title: "Instant Recognition",
              desc: "Recognize faces in milliseconds with AI-powered technology",
            },
            { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption and privacy protection" },
            { icon: Clock, title: "Real-Time Reports", desc: "Generate attendance reports instantly" },
          ].map((feature, i) => (
            <div key={i} className="p-6 border border-[#dadada] rounded-xl bg-black hover:border-[#f4ede1] transition border-pink-500">
              <feature.icon className="w-12 h-12 text-[#f4ede1] mb-4" />
              <h3 className="text-xl font-semibold text-[#f4ede1] mb-2 text-pink-500">{feature.title}</h3>
              <p className="text-[#cccccc]">{feature.desc}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#dadada] bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-[#f4ede1]">
          <p>© 2025 AI Face Recognition Attendance System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
