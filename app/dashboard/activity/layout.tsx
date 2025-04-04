import { DefaultRouteLayout } from "@/modules/shared/components";

export default function ActivityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DefaultRouteLayout>{children}</DefaultRouteLayout>;
} 