"use client"

import React, { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Mail, Building2, Users, Shield, Sparkles, ChevronRight, Eye, EyeOff } from "lucide-react"

export function EnhancedLoginForm() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [focusedInput, setFocusedInput] = useState<"email" | "password" | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
      console.log("Attempting login with:", email)
      await signIn(email, password)
      console.log("Login successful - redirecting to dashboard")
      // Use Next.js router for redirect
      window.location.href = '/dashboard'
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Login failed. Please check your credentials.")
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Hotel Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <img 
            src="/images/crown-jewel-hotel.jpg" 
            alt="Crown Jewel Hotel Tboli, South Cotabato" 
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-amber-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Decorative gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-64 h-64 bg-amber-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center h-full p-12 text-white">
          {/* Hotel Logo */}
          <div className="mb-8 animate-bounce" style={{ animationDuration: '2s' }}>
            <div className="w-32 h-32 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-amber-300 hover:scale-110 transition-transform duration-300">
              <Building2 className="w-16 h-16 text-amber-900" />
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-4 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Crown Jewel Hotel
          </h1>
          <p className="text-xl text-amber-100 text-center mb-12 max-w-md animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Experience world-class hospitality and exceptional service
          </p>

          <div className="space-y-6 w-full max-w-md">
            {[
              { icon: Shield, title: "Secure System", desc: "Enterprise-grade security" },
              { icon: Users, title: "Team Management", desc: "Efficient staff coordination" },
              { icon: Building2, title: "Task Excellence", desc: "Streamlined operations" },
            ].map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 bg-black/40 backdrop-blur-md rounded-xl hover:bg-black/50 transition-all duration-300 transform hover:scale-105 cursor-pointer animate-fade-in border border-white/20"
                style={{ animationDelay: `${0.6 + index * 0.2}s` }}
              >
                <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center animate-pulse shadow-lg">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-amber-200">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 via-white to-amber-50 relative">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-amber-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fade-in">
            <CardHeader className="space-y-3 text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center shadow-lg lg:hidden animate-bounce" style={{ animationDuration: '2s' }}>
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base animate-fade-in" style={{ animationDelay: '0.3s' }}>
                Sign in to access Crown Jewel Hotel Management System
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedInput === 'email' ? 'text-amber-600' : 'text-gray-400'
                    }`} />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      required
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 ${
                        focusedInput === 'email' 
                          ? 'border-amber-500 ring-2 ring-amber-200' 
                          : 'border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                      } hover:border-amber-400`}
                    />
                  </div>
                </div>

                <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedInput === 'password' ? 'text-amber-600' : 'text-gray-400'
                    }`} />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      required
                      className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 ${
                        focusedInput === 'password' 
                          ? 'border-amber-500 ring-2 ring-amber-200' 
                          : 'border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                      } hover:border-amber-400`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-sm animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="luxury"
                  size="lg"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: '0.7s' }}
                >
                  Sign In
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              <div className="mt-6 space-y-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full hover:border-amber-500 hover:text-amber-600 transition-all duration-300" disabled>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="w-full hover:border-amber-500 hover:text-amber-600 transition-all duration-300" disabled>
                    Microsoft
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600 animate-fade-in" style={{ animationDelay: '0.9s' }}>
                <p className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Secure login powered by Supabase
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Need help? Contact hotel IT support
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  © 2024 Crown Jewel Hotel. All rights reserved.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}