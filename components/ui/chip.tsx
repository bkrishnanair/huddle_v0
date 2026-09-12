"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-full text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-11 px-3",
        md: "h-11 px-4",
        lg: "h-12 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof chipVariants> {
  isActive?: boolean
  color?: string
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, size, isActive, color, style, ...props }, ref) => {

    let inlineStyle: React.CSSProperties = { ...style };
    if (color && isActive) {
      inlineStyle.backgroundColor = color;
      inlineStyle.color = "#ffffff";
      inlineStyle.borderColor = color;
      inlineStyle.boxShadow = `0 0 16px -1px ${color}80`;
    } else if (color && !isActive) {
      // Distinct category border, tinted backdrop, and colored text for high vibrancy
      inlineStyle.borderColor = `${color}55`;
      inlineStyle.backgroundColor = `${color}12`;
      inlineStyle.color = color;
    }

    return (
      <button
        className={cn(
          chipVariants({ variant: isActive ? "primary" : "default", size }),
          className
        )}
        style={inlineStyle}
        ref={ref}
        {...props}
      />
    )
  }
)
Chip.displayName = "Chip"

export { Chip, chipVariants }
