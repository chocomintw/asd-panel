// app/page.tsx
'use client'

import { useAuth } from '@/context/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Settings, Activity, Shield, Mail, Bell, Key } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.displayName || 'User'}!</h1>
          <p className="text-muted-foreground">
            Here is an overview of all accessible tools and reports you can use.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Management Card */}
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors mr-4">
                <User className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Profile Management</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Update your personal information, profile picture, and account preferences.
              </p>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors mr-4">
                <Settings className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Application Settings</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure application preferences, themes, and display options.
              </p>
            </CardContent>
          </Card>

          {/* Activity Card */}
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition-colors mr-4">
                <Activity className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Activity Log</CardTitle>
                <CardDescription>Monitor your actions</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View your recent activity, login history, and account events.
              </p>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center group-hover:bg-orange-500/20 transition-colors mr-4">
                <Shield className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Security</CardTitle>
                <CardDescription>Protect your account</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage security settings, two-factor authentication, and session controls.
              </p>
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors mr-4">
                <Bell className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>Stay informed</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure notification preferences and alert settings for your account.
              </p>
            </CardContent>
          </Card>

          {/* Privacy Card */}
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-colors mr-4">
                <Key className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Privacy</CardTitle>
                <CardDescription>Control your data</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage your privacy settings, data sharing preferences, and visibility controls.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}