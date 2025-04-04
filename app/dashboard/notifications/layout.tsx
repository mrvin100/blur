import { DefaultRouteLayout } from "@/modules/shared/components";

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DefaultRouteLayout>{children}</DefaultRouteLayout>;
} 