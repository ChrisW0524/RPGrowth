import React from "react";
import { cn } from "@/utils";

type Props =
  | {
      className?: string;
      children: React.ReactNode;
    }
  | React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ className = "", children, ...props }: Props) {
  return (
    <button
      className={cn(
        "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
