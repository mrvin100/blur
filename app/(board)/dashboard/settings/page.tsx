'use client';

import { useMemo, useState } from 'react';
import { Settings, User, Bell, Shield, Palette, Globe, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useAuth } from '@/modules/auth/context/AuthContext';
import { useCurrentUser, useUpdateUserProfile } from '@/hooks';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { isAdmin } = useAuth();
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const updateProfile = useUpdateUserProfile();

  // Security form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const canSubmitPasswordChange = useMemo(() => {
    return !!currentUser?.id && !!currentPassword && !!newPassword && newPassword === confirmPassword;
  }, [currentUser?.id, currentPassword, newPassword, confirmPassword]);

  const handleChangePassword = async () => {
    if (!currentUser?.id) return;

    if (!canSubmitPasswordChange) {
      toast.error('Veuillez vérifier les champs du mot de passe');
      return;
    }

    try {
      await updateProfile.mutateAsync({
        id: currentUser.id,
        data: {
          currentPassword,
          password: newPassword,
        },
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Mot de passe modifié avec succès');
    } catch {
      // errors handled by handleApiError in hook
    }
  };

  return (
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
                <Input
                  id="username"
                  placeholder={isLoadingUser ? 'Chargement...' : ''}
                  value={currentUser?.userName ?? ''}
                  disabled
                  className="h-9 sm:h-10"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={isLoadingUser ? 'Chargement...' : ''}
                  value={currentUser?.email ?? ''}
                  disabled
                  className="h-9 sm:h-10"
                />
              </div>
              <Button
                disabled
                className="w-full sm:w-auto"
                size="sm"
                title={
                  isAdmin
                    ? "Les champs email/username se gèrent via la page Utilisateurs"
                    : "Vous ne pouvez pas modifier votre email/username ici"
                }
              >
                Update Profile
              </Button>
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
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-9 sm:h-10 pr-10"
                    disabled={isLoadingUser || updateProfile.isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    disabled={isLoadingUser || updateProfile.isPending}
                    aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                    title={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="new-password" className="text-xs sm:text-sm">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-9 sm:h-10 pr-10"
                    disabled={isLoadingUser || updateProfile.isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isLoadingUser || updateProfile.isPending}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="confirm-password" className="text-xs sm:text-sm">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-9 sm:h-10 pr-10"
                    disabled={isLoadingUser || updateProfile.isPending}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoadingUser || updateProfile.isPending}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleChangePassword}
                disabled={!canSubmitPasswordChange || isLoadingUser || updateProfile.isPending}
                className="w-full sm:w-auto"
                size="sm"
              >
                Change Password
              </Button>
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
  );
}
