import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex touch-manipulation items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold transition-[background-color,color,box-shadow,transform] motion-reduce:transform-none motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_8px_18px_-8px_var(--primary)] hover:bg-primary-light hover:-translate-y-0.5",
        gold: "bg-accent text-foreground shadow-[0_8px_18px_-8px_var(--accent-dark)] hover:bg-accent-dark hover:-translate-y-0.5",
        outline: "border bg-card text-foreground hover:bg-primary-bg",
        ghost: "text-foreground hover:bg-primary-bg",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-7 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}
export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
