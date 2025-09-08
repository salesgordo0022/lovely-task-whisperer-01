import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [@media(hover:hover)]:hover:scale-[1.02]",
  {
    variants: {
      variant: {
        default: "bg-gradient-button text-primary-foreground hover:shadow-primary shadow-medium",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-medium hover:shadow-large",
        outline: "border-2 border-primary/20 bg-background hover:bg-primary/5 hover:border-primary/40 text-foreground shadow-soft hover:shadow-medium",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft hover:shadow-medium",
        ghost: "hover:bg-accent/20 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-primary",
        professional: "bg-gradient-card text-card-foreground border border-border/30 hover:border-primary/30 hover:bg-gradient-button hover:text-primary-foreground shadow-medium hover:shadow-primary",
        accent: "bg-gradient-accent text-accent-foreground shadow-accent hover:shadow-elevated",
        success: "bg-gradient-success text-success-foreground shadow-success hover:shadow-elevated",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-medium hover:shadow-large",
        glass: "bg-background/80 backdrop-blur-sm border border-border/50 text-foreground hover:bg-background/90 hover:border-border shadow-soft hover:shadow-medium",
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
