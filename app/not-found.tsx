import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] grid place-items-center bg-background px-4">
      <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-4xl font-semibold text-foreground mb-2">404</h1>
          <p className="text-muted-foreground">Hey guys where are you going?</p>
        </div>

        <Button asChild variant="default">
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
