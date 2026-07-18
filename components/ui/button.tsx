import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-blue/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-mist-blue text-maroon hover:bg-light-blue hover:scale-[1.02] active:scale-[0.98]",
        gold:
          "bg-light-blue text-maroon hover:bg-light-blue/90 hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border border-mist-blue/40 text-mist-blue hover:border-light-blue hover:text-light-blue bg-transparent",
        ghost:
          "text-mist-blue/80 hover:text-mist-blue hover:bg-mist-blue/10",
        brown:
          "bg-maroon text-mist-blue hover:bg-rosewood hover:scale-[1.02]",
      },
      size: {
        default: "h-12 px-8 text-sm tracking-wide uppercase",
        sm: "h-10 px-6 text-xs tracking-wider uppercase",
        lg: "h-14 px-10 text-sm tracking-wide uppercase",
        icon: "h-12 w-12",
      },
      rounded: {
        default: "rounded-none",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
