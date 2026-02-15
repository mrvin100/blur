'use client';

import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useTheme } from 'next-themes';
import { Settings, User, Bell, Shield, Palette, Globe, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useAuth } from '@/modules/auth/context/AuthContext';
import { useCurrentUser, useUpdateUserProfile } from '@/hooks';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { isAdmin } = useAuth();
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const updateProfile = useUpdateUserProfile();
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode state based on current theme
  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  // Handle dark mode toggle
  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    setTheme(checked ? 'dark' : 'light');
  };

  const profileSchema = z.object({
    userName: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
  });

  type ProfileValues = z.infer<typeof profileSchema>;

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userName: '',
      email: '',
    },
  });

  useEffect(() => {
    if (!currentUser) return;
    profileForm.reset({
      userName: currentUser.userName ?? '',
      email: currentUser.email ?? '',
    });
  }, [currentUser, profileForm]);

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
                <FieldLabel htmlFor="username" className="text-xs sm:text-sm">Username</FieldLabel>
                <Input
                  id="username"
                  placeholder={isLoadingUser ? 'Chargement...' : ''}
                  value={currentUser?.userName ?? ''}
                  disabled
                  className="h-9 sm:h-10"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <FieldLabel htmlFor="email" className="text-xs sm:text-sm">Email</FieldLabel>
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
                  <FieldLabel className="text-xs sm:text-sm md:text-base">Race Start Notifications</FieldLabel>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                    Get notified when a new race starts
                  </p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <FieldLabel className="text-xs sm:text-sm md:text-base">Score Submission Alerts</FieldLabel>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                    Alerts when scores are submitted
                  </p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <FieldLabel className="text-xs sm:text-sm md:text-base">Party Invitations</FieldLabel>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                    Notifications for party invitations
                  </p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* Profile */}
          <Card>
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Profile
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                View and update your account information.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
              <form
                className="space-y-4"
                onSubmit={profileForm.handleSubmit(async (values) => {
                  if (!currentUser?.id) return;
                  try {
                    await updateProfile.mutateAsync({
                      id: currentUser.id,
                      data: {
                        userName: values.userName,
                        email: values.email || undefined,
                      },
                    });
                  } catch {
                    toast.error('Failed to update profile');
                  }
                })}
              >
                <FieldSet>
                  <FieldLegend variant="label">Account</FieldLegend>
                  <FieldGroup className="@container/field-group flex flex-col gap-6">
                    <Controller
                      name="userName"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            autoComplete="off"
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      name="email"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            type="email"
                            aria-invalid={fieldState.invalid}
                          />
                          <FieldDescription>Optional.</FieldDescription>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </FieldSet>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoadingUser || updateProfile.isPending}
                    className="cursor-pointer"
                  >
                    {updateProfile.isPending ? 'Saving...' : 'Save profile'}
                  </Button>
                </div>
              </form>
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
                <FieldLabel htmlFor="current-password" className="text-xs sm:text-sm">Current Password</FieldLabel>
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
                <FieldLabel htmlFor="new-password" className="text-xs sm:text-sm">New Password</FieldLabel>
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
                <FieldLabel htmlFor="confirm-password" className="text-xs sm:text-sm">Confirm Password</FieldLabel>
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
                  <FieldLabel className="text-xs sm:text-sm md:text-base">Dark Mode</FieldLabel>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                    Enable dark mode theme
                  </p>
                </div>
                <Switch 
                  checked={isDarkMode} 
                  onCheckedChange={handleDarkModeToggle}
                  className="shrink-0" 
                />
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
                  <FieldLabel className="text-xs sm:text-sm md:text-base">Auto-refresh Data</FieldLabel>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                    Automatically refresh race data every 30 seconds
                  </p>
                </div>
                <Switch defaultChecked className="shrink-0" />
              </div>
              <Separator />
              <div className="space-y-1 sm:space-y-2">
                <FieldLabel className="text-xs sm:text-sm md:text-base">Language</FieldLabel>
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
