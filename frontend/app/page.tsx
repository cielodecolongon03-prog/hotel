import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Crown, Sparkles, Shield, Users, Star, MessageSquare } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-white to-amber-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="z-10 max-w-5xl w-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center shadow-2xl mb-6"
          >
            <Crown className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
            Crown Jewel Hotel Management
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Task Management and Employee Rating System
          </p>
          <Link href="/login">
            <Button 
              variant="luxury" 
              size="lg"
              className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl"
            >
              Sign In to Dashboard
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Task Management</h2>
            <p className="text-gray-600">
              Digital task assignment, monitoring, and verification with real-time updates
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Employee Performance</h2>
            <p className="text-gray-600">
              Standardized ratings and performance tracking with objective metrics
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <Star className="w-7 h-7 text-amber-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-900">Guest Feedback</h2>
            <p className="text-gray-600">
              Collect and analyze guest ratings and feedback for continuous improvement
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Sparkles className="w-5 h-5" />
            <p className="text-sm">Built with world-class engineering and design principles</p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
