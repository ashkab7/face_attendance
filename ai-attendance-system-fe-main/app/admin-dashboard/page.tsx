"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  LayoutDashboard,
  UserCog,
  Eye,
  Settings,
  Edit2,
  Trash2,
  Plus,
  Download,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard")
  const [selectedDate, setSelectedDate] = useState("2024-01-15")
  const [selectedUser, setSelectedUser] = useState("")
  const [records] = useState([
    { id: 1, name: "John Doe", date: "2024-01-15", time: "09:00 AM", status: "Present" },
    { id: 2, name: "Jane Smith", date: "2024-01-15", time: "09:15 AM", status: "Present" },
    { id: 3, name: "Mike Johnson", date: "2024-01-15", time: "09:30 AM", status: "Present" },
    { id: 4, name: "Sarah Williams", date: "2024-01-15", time: "N/A", status: "Absent" },
    { id: 5, name: "Tom Brown", date: "2024-01-15", time: "N/A", status: "Absent" },
  ])

  const totalUsers = 150
  const presentToday = 142
  const absentToday = 8
  const attendanceAccuracy = 94.7

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "manage-users", label: "Manage Users", icon: UserCog },
    { id: "view-attendance", label: "View Attendance", icon: Eye },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const [userList] = useState([
    { id: 1, name: "John Doe", userId: "JD001", status: "Active" },
    { id: 2, name: "Jane Smith", userId: "JS002", status: "Active" },
    { id: 3, name: "Mike Johnson", userId: "MJ003", status: "Inactive" },
    { id: 4, name: "Sarah Williams", userId: "SW004", status: "Active" },
    { id: 5, name: "Tom Brown", userId: "TB005", status: "Active" },
  ])

  const [fullRecords] = useState([
    { id: 1, name: "John Doe", date: "2024-01-15", timeIn: "09:00 AM", timeOut: "05:30 PM", status: "Present" },
    { id: 2, name: "Jane Smith", date: "2024-01-15", timeIn: "09:15 AM", timeOut: "05:45 PM", status: "Present" },
    { id: 3, name: "Mike Johnson", date: "2024-01-15", timeIn: "09:30 AM", timeOut: "05:40 PM", status: "Present" },
    { id: 4, name: "Sarah Williams", date: "2024-01-15", timeIn: "09:45 AM", timeOut: "06:00 PM", status: "Late" },
    { id: 5, name: "Tom Brown", date: "2024-01-14", timeIn: "N/A", timeOut: "N/A", status: "Absent" },
  ])

  const [securityLogs] = useState([
    { id: 1, event: "Unknown face detected", timestamp: "2024-01-15 10:30 AM", severity: "warning" },
    { id: 2, event: "Failed recognition - Low confidence", timestamp: "2024-01-15 11:15 AM", severity: "info" },
    { id: 3, event: "Unknown face detected", timestamp: "2024-01-15 02:45 PM", severity: "warning" },
    { id: 4, event: "Failed recognition - Blurry image", timestamp: "2024-01-15 03:20 PM", severity: "info" },
    { id: 5, event: "System access log", timestamp: "2024-01-15 04:00 PM", severity: "info" },
  ])

  return (
    <div className="min-h-screen bg-black flex flex-col dashboard-bg">
      {/* Header */}
      <header className="relative z-10 border-b border-[#dadada] bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition">
            <ArrowLeft className="w-5 h-5 text-[#f4ede1]" />
            <span className="text-lg font-semibold text-[#f4ede1]">Back</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#f4ede1]">Admin Dashboard</h1>
          <div className="w-24"></div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-[#dadada] bg-black p-6 hidden md:flex flex-col">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeNav === item.id
                      ? "bg-white/10 text-[#f4ede1] border border-[#f4ede1]"
                      : "text-[#cccccc] hover:text-[#f4ede1] hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl space-y-8">
            {/* Analytics Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              {/* Total Users */}
              <div className="bg-black border border-[#dadada] rounded-xl p-6 hover:border-[#f4ede1] transition shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-[#cccccc] mb-1">Total Registered Users</p>
                    <p className="text-3xl font-bold text-[#f4ede1]">{totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-[#f4ede1]" />
                </div>
                <p className="text-xs text-[#cccccc]">Active in system</p>
              </div>

              {/* Present Today */}
              <div className="bg-black border border-[#dadada] rounded-xl p-6 hover:border-[#f4ede1] transition shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-[#cccccc] mb-1">Present Today</p>
                    <p className="text-3xl font-bold text-[#f4ede1]">{presentToday}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-[#f4ede1]" />
                </div>
                <p className="text-xs text-[#cccccc]">
                  {Math.round((presentToday / totalUsers) * 100)}% attendance rate
                </p>
              </div>

              {/* Absent Today */}
              <div className="bg-black border border-[#dadada] rounded-xl p-6 hover:border-[#f4ede1] transition shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-[#cccccc] mb-1">Absent Today</p>
                    <p className="text-3xl font-bold text-[#f4ede1]">{absentToday}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-[#f4ede1]" />
                </div>
                <p className="text-xs text-[#cccccc]">Need follow-up</p>
              </div>

              {/* Attendance Accuracy */}
              <div className="bg-black border border-[#dadada] rounded-xl p-6 hover:border-[#f4ede1] transition shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-[#cccccc] mb-1">Attendance Accuracy</p>
                    <p className="text-3xl font-bold text-[#f4ede1]">{attendanceAccuracy}%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-[#f4ede1]" />
                </div>
                <p className="text-xs text-[#cccccc]">Recognition rate</p>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-black border border-[#dadada] rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#f4ede1] mb-6">Weekly Attendance Trend</h2>
              <div className="h-64 bg-white/5 rounded-lg border border-[#dadada] flex items-center justify-center">
                <div className="flex items-end gap-4">
                  {[65, 80, 75, 88, 92, 78, 85].map((value, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div
                        className="w-8 bg-[#f4ede1] rounded-t transition hover:opacity-70"
                        style={{ height: `${value}px` }}
                      ></div>
                      <p className="text-xs text-[#cccccc]">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filters and Records */}
            <div className="bg-black border border-[#dadada] rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-[#f4ede1]">Recent Attendance Records</h2>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Calendar className="w-4 h-4 text-[#f4ede1]" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 bg-[#f4ede1] border border-[#dadada] rounded-lg text-black text-sm focus:border-[#f4ede1] focus:ring-1 focus:ring-[#f4ede1]/20 transition outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#dadada]">
                      <th className="text-left py-3 px-4 font-semibold text-[#f4ede1]">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#f4ede1]">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#f4ede1]">Time</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#f4ede1]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id} className="border-b border-[#dadada] hover:bg-white/5 transition">
                        <td className="py-3 px-4 font-medium text-[#f4ede1]">{record.name}</td>
                        <td className="py-3 px-4 text-[#cccccc]">{record.date}</td>
                        <td className="py-3 px-4 text-[#cccccc]">{record.time}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              record.status === "Present"
                                ? "bg-white border border-[#f4ede1] text-black"
                                : record.status === "Late"
                                  ? "bg-yellow-500/20 border border-yellow-500 text-yellow-400"
                                  : "bg-red-600/10 border border-red-600 text-red-600"
                            }`}
                          >
                            {record.status === "Present" && <CheckCircle className="w-3 h-3" />}
                            {record.status === "Late" && <AlertTriangle className="w-3 h-3" />}
                            {record.status === "Absent" && <XCircle className="w-3 h-3" />}
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Management Section */}
            <div className="bg-black border border-[#dadada] rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-[#f4ede1]">Manage Users</h2>
                <div className="flex gap-2 flex-wrap">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#f4ede1] text-black rounded-lg font-semibold text-sm hover:opacity-90 transition">
                    <Plus className="w-4 h-4" />
                    Add User
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-[#dadada] text-[#f4ede1] rounded-lg font-semibold text-sm hover:bg-white/5 transition">
                    <Edit2 className="w-4 h-4" />
                    Edit User
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-600/10 transition">
                    <Trash2 className="w-4 h-4" />
                    Delete User
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#dadada]">
                      <th className="text-left py-3 px-4 font-semibold text-[#f4ede1]">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#f4ede1]">User ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#f4ede1]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user) => (
                      <tr key={user.id} className="border-b border-[#dadada] hover:bg-white/5 transition">
                        <td className="py-3 px-4 font-medium text-[#f4ede1]">{user.name}</td>
                        <td className="py-3 px-4 text-[#cccccc]">{user.userId}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              user.status === "Active"
                                ? "bg-white/10 border border-[#f4ede1] text-[#f4ede1]"
                                : "bg-red-600/10 border border-red-600 text-red-600"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Full Attendance Records Section */}
            <div className="bg-black border border-[#dadada] rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-[#f4ede1]">Attendance Records</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#f4ede1] text-black rounded-lg font-semibold text-sm hover:opacity-90 transition">
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-[#f4ede1] mb-2">Select Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-[#f4ede1] border border-[#dadada] rounded-lg text-black text-sm focus:border-[#f4ede1] focus:ring-1 focus:ring-[#f4ede1]/20 transition outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#f4ede1] mb-2">Select User</label>
                  <select className="w-full px-4 py-2 bg-[#f4ede1] border border-[#dadada] rounded-lg text-black text-sm focus:border-[#f4ede1] focus:ring-1 focus:ring-[#f4ede1]/20 transition outline-none">
                    <option>All Users</option>
                    <option>John Doe</option>
                    <option>Jane Smith</option>
                    <option>Mike Johnson</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#dadada]">
                      <th className="text-left py-3 px-4 font-semibold text-[#f4ede1]">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#f4ede1]">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#f4ede1]">Time In</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#f4ede1]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fullRecords.map((record) => (
                      <tr key={record.id} className="border-b border-[#dadada] hover:bg-white/5 transition">
                        <td className="py-3 px-4 font-medium text-[#f4ede1]">{record.name}</td>
                        <td className="py-3 px-4 text-[#cccccc]">{record.date}</td>
                        <td className="py-3 px-4 text-[#cccccc]">{record.timeIn}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              record.status === "Present"
                                ? "bg-white border border-[#f4ede1] text-black"
                                : record.status === "Late"
                                  ? "bg-yellow-500/20 border border-yellow-500 text-yellow-400"
                                  : "bg-red-600/10 border border-red-600 text-red-600"
                            }`}
                          >
                            {record.status === "Present" && <CheckCircle className="w-3 h-3" />}
                            {record.status === "Late" && <AlertTriangle className="w-3 h-3" />}
                            {record.status === "Absent" && <XCircle className="w-3 h-3" />}
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="bg-black border border-[#dadada] rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#f4ede1] mb-6">Analytics Overview</h2>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white/5 border border-[#dadada] rounded-lg p-4">
                  <p className="text-sm text-[#cccccc] mb-2">Weekly Attendance Trend</p>
                  <p className="text-2xl font-bold text-[#f4ede1]">↑ 8.3%</p>
                  <p className="text-xs text-[#cccccc] mt-2">Compared to last week</p>
                </div>

                <div className="bg-white/5 border border-[#dadada] rounded-lg p-4">
                  <p className="text-sm text-[#cccccc] mb-2">Most Active Day</p>
                  <p className="text-2xl font-bold text-[#f4ede1]">Thursday</p>
                  <p className="text-xs text-[#cccccc] mt-2">142 check-ins</p>
                </div>

                <div className="bg-white/5 border border-[#dadada] rounded-lg p-4">
                  <p className="text-sm text-[#cccccc] mb-2">Attendance Percentage</p>
                  <p className="text-2xl font-bold text-[#f4ede1]">92.5%</p>
                  <p className="text-xs text-[#cccccc] mt-2">This month</p>
                </div>
              </div>

              <div className="h-64 bg-white/5 rounded-lg border border-[#dadada] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[#f4ede1] font-semibold mb-2">Attendance Chart</p>
                  <p className="text-[#cccccc] text-sm">Placeholder for analytics graph</p>
                  <div className="flex items-end justify-center gap-3 mt-6">
                    {[65, 80, 75, 88, 92, 78, 85].map((value, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div
                          className="w-6 bg-[#f4ede1] rounded-t transition hover:opacity-70"
                          style={{ height: `${value}px` }}
                        ></div>
                        <p className="text-xs text-[#cccccc]">{["M", "T", "W", "T", "F", "S", "S"][i]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Recognition Logs Section */}
            <div className="bg-black border border-[#dadada] rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#f4ede1] mb-6">Security & Recognition Logs</h2>

              <div className="space-y-3">
                {securityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 bg-white/5 border border-[#dadada] rounded-lg hover:bg-white/8 transition"
                  >
                    <div className="mt-1">
                      {log.severity === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                      {log.severity === "info" && <CheckCircle className="w-5 h-5 text-[#f4ede1]" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#f4ede1] text-sm">{log.event}</p>
                      <p className="text-xs text-[#cccccc] mt-1">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
