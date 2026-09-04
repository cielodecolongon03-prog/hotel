"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Bell, Shield, Palette, Globe, Save, LogOut, Check } from "lucide-react"

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Profile state
  const [profile, setProfile] = useState({
    fullName: user?.full_name || "",
    email: user?.email || "",
    phone: "",
    bio: ""
  })
  
  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    tasks: true
  })
  
  // Appearance state
  const [theme, setTheme] = useState("system")
  const [accentColor, setAccentColor] = useState("blue")
  
  // Language state
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("PT")

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system"
    const savedAccent = localStorage.getItem("accentColor") || "blue"
    const savedLanguage = localStorage.getItem("language") || "en"
    const savedTimezone = localStorage.getItem("timezone") || "PT"
    const savedNotifications = localStorage.getItem("notifications")
    
    setTheme(savedTheme)
    setAccentColor(savedAccent)
    setLanguage(savedLanguage)
    setTimezone(savedTimezone)
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
    
    // Apply theme
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (themeValue: string) => {
    const root = document.documentElement
    if (themeValue === "dark") {
      root.classList.add("dark")
    } else if (themeValue === "light") {
      root.classList.remove("dark")
    } else {
      // System preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = "/login"
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
    setIsLoading(false)
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    localStorage.setItem("notifications", JSON.stringify(notifications))
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
    setIsLoading(false)
  }

  const handleSaveSecurity = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
    setIsLoading(false)
  }

  const handleSaveAppearance = async () => {
    setIsLoading(true)
    localStorage.setItem("theme", theme)
    localStorage.setItem("accentColor", accentColor)
    applyTheme(theme)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
    setIsLoading(false)
  }

  const handleSaveLanguage = async () => {
    setIsLoading(true)
    localStorage.setItem("language", language)
    localStorage.setItem("timezone", timezone)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
    setIsLoading(false)
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Settings saved successfully!</span>
            </div>
          )}

          {/* Settings Navigation */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="space-y-2">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("profile")}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant={activeTab === "notifications" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button
                variant={activeTab === "security" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("security")}
              >
                <Shield className="w-4 h-4 mr-2" />
                Security
              </Button>
              <Button
                variant={activeTab === "appearance" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("appearance")}
              >
                <Palette className="w-4 h-4 mr-2" />
                Appearance
              </Button>
              <Button
                variant={activeTab === "language" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("language")}
              >
                <Globe className="w-4 h-4 mr-2" />
                Language
              </Button>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {user?.full_name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">Change Photo</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Role</label>
                        <input
                          type="text"
                          defaultValue={user?.role || ""}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Bio</label>
                      <textarea
                        rows={3}
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "notifications" && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive email updates</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifications.email}
                        onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Push Notifications</h4>
                        <p className="text-sm text-gray-600">Receive push notifications</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifications.push}
                        onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Task Reminders</h4>
                        <p className="text-sm text-gray-600">Get reminded about tasks</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifications.tasks}
                        onChange={(e) => setNotifications({...notifications, tasks: e.target.checked})}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                    <Button 
                      onClick={handleSaveNotifications}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "security" && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Current Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <Button 
                      onClick={handleSaveSecurity}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "appearance" && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Theme</label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          variant={theme === "light" ? "default" : "outline"}
                          className={theme === "light" ? "bg-white border-gray-300" : "bg-white border-gray-300"}
                          onClick={() => setTheme("light")}
                        >
                          Light
                        </Button>
                        <Button 
                          variant={theme === "dark" ? "default" : "outline"}
                          className={theme === "dark" ? "bg-gray-800 text-white border-gray-600" : "bg-gray-800 text-white border-gray-600"}
                          onClick={() => setTheme("dark")}
                        >
                          Dark
                        </Button>
                        <Button 
                          variant={theme === "system" ? "default" : "outline"}
                          className={theme === "system" ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent" : "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent"}
                          onClick={() => setTheme("system")}
                        >
                          System
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Accent Color</label>
                      <div className="flex gap-2">
                        <div 
                          className={`w-8 h-8 bg-blue-500 rounded-full cursor-pointer ${accentColor === "blue" ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                          onClick={() => setAccentColor("blue")}
                        />
                        <div 
                          className={`w-8 h-8 bg-purple-500 rounded-full cursor-pointer ${accentColor === "purple" ? "ring-2 ring-offset-2 ring-purple-500" : ""}`}
                          onClick={() => setAccentColor("purple")}
                        />
                        <div 
                          className={`w-8 h-8 bg-green-500 rounded-full cursor-pointer ${accentColor === "green" ? "ring-2 ring-offset-2 ring-green-500" : ""}`}
                          onClick={() => setAccentColor("green")}
                        />
                        <div 
                          className={`w-8 h-8 bg-amber-500 rounded-full cursor-pointer ${accentColor === "amber" ? "ring-2 ring-offset-2 ring-amber-500" : ""}`}
                          onClick={() => setAccentColor("amber")}
                        />
                        <div 
                          className={`w-8 h-8 bg-red-500 rounded-full cursor-pointer ${accentColor === "red" ? "ring-2 ring-offset-2 ring-red-500" : ""}`}
                          onClick={() => setAccentColor("red")}
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handleSaveAppearance}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "language" && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Language Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Language</label>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English (US)</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Timezone</label>
                      <select 
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="PT">Pacific Time (PT)</option>
                        <option value="MT">Mountain Time (MT)</option>
                        <option value="CT">Central Time (CT)</option>
                        <option value="ET">Eastern Time (ET)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                    <Button 
                      onClick={handleSaveLanguage}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <Card className="border-0 shadow-lg border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Sign Out</h4>
                  <p className="text-sm text-gray-600">Sign out of your account</p>
                </div>
                <Button variant="destructive" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
