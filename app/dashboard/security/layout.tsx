import { DefaultRouteLayout } from "@/modules/shared/components";

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DefaultRouteLayout>{children}</DefaultRouteLayout>;
} 