import { Loader } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
interface SubmitButtonProps {
  isLoading: boolean;
  buttonText?: string;
  className?: string;
}
export const SubmitButton = ({ isLoading, buttonText, className }: SubmitButtonProps) => {
  return (
    <Button type="submit" className={cn("w-full cursor-pointer", className)} disabled={isLoading}>
      {isLoading ? <Loader /> : buttonText}
    </Button>
  );
};

