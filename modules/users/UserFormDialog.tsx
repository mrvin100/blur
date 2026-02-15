"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import type { User } from "@/types/user.types"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Eye, EyeOff } from "lucide-react"

export type UserFormDialogMode = "create" | "update"

export type UserFormDialogValues = {
  userName: string
  email?: string
  password?: string
  roles: string[]
  enabled?: boolean
  accountNonLocked?: boolean
}

function buildSchema(mode: UserFormDialogMode) {
  return z
    .object({
      userName: z.string().min(3, "Username must be at least 3 characters"),
      email: z
        .string()
        .email("Invalid email")
        .optional()
        .or(z.literal("")),
      password:
        mode === "create"
          ? z.string().min(6, "Password must be at least 6 characters")
          : z.string().optional().or(z.literal("")),
      roles: z.array(z.string()).min(1, "Select at least one role"),
      enabled: z.boolean().optional(),
      accountNonLocked: z.boolean().optional(),
    })
    .transform((v) => ({
      ...v,
      email: v.email || undefined,
      password: v.password || undefined,
    }))
}

export interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: UserFormDialogMode
  title?: string
  submitLabel?: string
  isSubmitting?: boolean
  availableRoles: string[]
  initialUser?: User | null
  onSubmit: (values: UserFormDialogValues) => Promise<void> | void
}

export function UserFormDialog({
  open,
  onOpenChange,
  mode,
  title,
  submitLabel,
  isSubmitting,
  availableRoles,
  initialUser,
  onSubmit,
}: UserFormDialogProps) {
  const schema = React.useMemo(() => buildSchema(mode), [mode])

  const defaultRoles = React.useMemo<string[]>(() => {
    if (initialUser?.roles?.length) return initialUser.roles
    if (initialUser?.role) return [initialUser.role]
    return []
  }, [initialUser])

  const form = useForm<UserFormDialogValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      userName: initialUser?.userName ?? "",
      email: initialUser?.email ?? "",
      password: "",
      roles: defaultRoles,
      enabled: initialUser?.enabled ?? true,
      accountNonLocked: initialUser?.accountNonLocked ?? true,
    },
  })

  // Keep form synced when switching between users / modes
  React.useEffect(() => {
    if (!open) return
    form.reset({
      userName: initialUser?.userName ?? "",
      email: initialUser?.email ?? "",
      password: "",
      roles: defaultRoles,
      enabled: initialUser?.enabled ?? true,
      accountNonLocked: initialUser?.accountNonLocked ?? true,
    })
  }, [open, initialUser, defaultRoles, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {title ?? (mode === "create" ? "Create User" : "Update User")}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit(values)
          })}
          className="space-y-6"
        >
          <FieldSet>
            <FieldLegend>Account</FieldLegend>
            <FieldGroup className="@container/field-group flex flex-col gap-6">
              <Controller
                name="userName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      placeholder="john_doe"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="john@example.com"
                    />
                    <FieldDescription>Optional.</FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => {
                  const [showPassword, setShowPassword] = React.useState(false);
                  
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        {mode === "create" ? "Password" : "New password"}
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id={field.name}
                          type={showPassword ? "text" : "password"}
                          aria-invalid={fieldState.invalid}
                          placeholder={mode === "create" ? "********" : "Leave empty to keep"}
                          autoComplete="new-password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FieldDescription>
                        {mode === "create"
                          ? "Minimum 6 characters."
                          : "Leave empty to keep current password."}
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  );
                }}
              />

              <Controller
                name="enabled"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                    <Checkbox
                      id="enabled"
                      checked={!!field.value}
                      onCheckedChange={(v) => field.onChange(!!v)}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel htmlFor="enabled">Enabled</FieldLabel>
                  </Field>
                )}
              />

              <Controller
                name="accountNonLocked"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                    <Checkbox
                      id="accountNonLocked"
                      checked={!!field.value}
                      onCheckedChange={(v) => field.onChange(!!v)}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel htmlFor="accountNonLocked">Account non locked</FieldLabel>
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend>Roles</FieldLegend>
            <FieldDescription>Select one or more roles for this user.</FieldDescription>
            <FieldGroup data-slot="checkbox-group" className="@container/field-group flex flex-col gap-3">
              <Controller
                name="roles"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    {availableRoles.map((role) => (
                      <Field key={role} orientation="horizontal" data-invalid={fieldState.invalid}>
                        <Checkbox
                          id={`role-${role}`}
                          checked={(field.value || []).includes(role)}
                          onCheckedChange={(checked) => {
                            const current = field.value || []
                            if (checked) field.onChange(Array.from(new Set([...current, role])))
                            else field.onChange(current.filter((r) => r !== role))
                          }}
                        />
                        <FieldLabel htmlFor={`role-${role}`} className="font-normal">
                          {role}
                        </FieldLabel>
                      </Field>
                    ))}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </>
                )}
              />
            </FieldGroup>
          </FieldSet>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!!isSubmitting}>
              {submitLabel ?? (mode === "create" ? "Create" : "Update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
