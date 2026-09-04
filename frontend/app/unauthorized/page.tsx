"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldX, Home } from "lucide-react"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50 p-4">
      <Card className="max-w-md w-full border-0 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ShieldX className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Access Denied
          </CardTitle>
          <CardDescription className="text-base">
            You don't have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              This area requires specific role permissions. Please contact your administrator if you believe this is an error.
            </p>
          </div>
          
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full"
            size="lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
          
          <Button
            onClick={() => router.push('/login')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
