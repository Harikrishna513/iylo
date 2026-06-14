import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-ivory text-black hover:bg-cream hover:scale-[1.02] active:scale-[0.98]",
        gold:
          "bg-gold text-black hover:bg-gold/90 hover:scale-[1.02] active:scale-[0.98]",
        outline:
          "border border-ivory/30 text-ivory hover:border-gold hover:text-gold bg-transparent",
        ghost:
          "text-ivory/80 hover:text-ivory hover:bg-ivory/5",
        brown:
          "bg-brown text-ivory hover:bg-brown/90 hover:scale-[1.02]",
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
