import { DefaultRouteLayout } from "@/modules/shared/components";

export default function GamingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DefaultRouteLayout>{children}</DefaultRouteLayout>;
} 