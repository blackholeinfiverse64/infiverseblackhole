import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "space-button glow-hover hover:scale-105 active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground glass-card hover:glow-hover hover:scale-105 active:scale-95",
        outline:
          "border border-border glass hover:glow-hover hover:text-primary hover:border-primary/50 hover:scale-105 active:scale-95",
        secondary:
          "space-button-secondary glow-hover hover:scale-105 active:scale-95",
        ghost: "glass hover:text-primary hover:scale-105 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-2xl px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    >
      {/* Space shimmer effect for primary buttons */}
      {variant === "default" && (
        <>
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <div className="absolute inset-0 cosmic-grid opacity-20"></div>
        </>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Comp>
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
