import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-150 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [@media(hover:hover)]:hover:scale-[1.02]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-medium",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft hover:shadow-medium",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-soft hover:shadow-medium",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft hover:shadow-medium",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-primary via-accent-foreground to-primary bg-size-200 hover:bg-pos-0 text-primary-foreground shadow-glow hover:shadow-elevated",
        professional: "bg-card text-card-foreground border border-border/50 hover:border-primary/20 hover:bg-accent/30 shadow-medium hover:shadow-large",
      },
      size: {
        default: "h-11 px-4 py-2 sm:h-10 sm:px-4 sm:py-2 min-w-[44px]",
        sm: "h-10 rounded-md px-3 sm:h-9 sm:px-3 min-w-[40px]",
        lg: "h-12 rounded-md px-6 sm:h-11 sm:px-8 text-base sm:text-sm min-w-[48px]",
        icon: "h-11 w-11 sm:h-10 sm:w-10 min-w-[44px]",
        mobile: "h-12 px-6 text-base min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
