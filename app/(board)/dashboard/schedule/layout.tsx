import { DefaultRouteLayout } from "@/modules/shared/components";

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DefaultRouteLayout>{children}</DefaultRouteLayout>;
} 