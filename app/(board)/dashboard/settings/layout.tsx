import { DefaultRouteLayout } from "@/modules/shared/components";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DefaultRouteLayout>{children}</DefaultRouteLayout>;
} 