'use client';

import { Settings, User, Bell, Shield, Palette, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
              Settings
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Manage your application preferences
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 w-full">
          {/* Profile Settings */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Manage your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="username" className="text-xs sm:text-sm">Username</Label>
                <Input id="username" placeholder="admin" disabled className="h-9 sm:h-10" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                <Input id="email" type="email" placeholder="admin@example.com" disabled className="h-9 sm:h-10" />
              </div>
              <Button disabled className="w-full sm:w-auto" size="sm">Update Profile</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                Notifications
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <Label className="text-xs sm:text-sm md:text-base">Race Start Notifications</Label>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                    Get notified when a new race starts
                  </p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <Label className="text-xs sm:text-sm md:text-base">Score Submission Alerts</Label>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                    Alerts when scores are submitted
                  </p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <Label className="text-xs sm:text-sm md:text-base">Party Invitations</Label>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                    Notifications for party invitations
                  </p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                Security
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Manage your security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="current-password" className="text-xs sm:text-sm">Current Password</Label>
                <Input id="current-password" type="password" disabled className="h-9 sm:h-10" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="new-password" className="text-xs sm:text-sm">New Password</Label>
                <Input id="new-password" type="password" disabled className="h-9 sm:h-10" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="confirm-password" className="text-xs sm:text-sm">Confirm Password</Label>
                <Input id="confirm-password" type="password" disabled className="h-9 sm:h-10" />
              </div>
              <Button disabled className="w-full sm:w-auto" size="sm">Change Password</Button>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
                Appearance
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Customize the look and feel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <Label className="text-xs sm:text-sm md:text-base">Dark Mode</Label>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                    Use system theme setting
                  </p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* Application Settings */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                Application
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">General application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <Label className="text-xs sm:text-sm md:text-base">Auto-refresh Data</Label>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                    Automatically refresh race data every 30 seconds
                  </p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <Separator />
              <div className="space-y-1 sm:space-y-2">
                <Label className="text-xs sm:text-sm md:text-base">Language</Label>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                  Currently: Français
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
