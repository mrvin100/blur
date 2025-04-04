import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface DefaultLoaderProps {
  text?: string;
  className?: string;
  actionContent?: React.ReactNode;
}
export function DefaultLoader({
  text,
  className,
  actionContent,
}: Readonly<DefaultLoaderProps>) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-4">
        <h2>
          <Loader2 className={cn("animate-spin", className)} />
          {text && (
            <span className="text-sm text-muted-foreground">{text}</span>
          )}
        </h2>
        {actionContent && <div className="mt-4">{actionContent}</div>}
      </div>
    </div>
  );
}
