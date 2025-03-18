import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  isLoading: boolean;
  buttonText: string;
  className?: string;
}

export const SubmitButton = ({ isLoading, buttonText, className }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className={cn("relative", className)} 
      disabled={isLoading}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {isLoading ? `${buttonText}ing...` : buttonText}
    </Button>
  );
};

