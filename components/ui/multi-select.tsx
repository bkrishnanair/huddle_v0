"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { XIcon, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const multiSelectVariants = cva(
  "flex items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "w-full min-h-10 h-auto",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface MultiSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
  VariantProps<typeof multiSelectVariants> {
  options: {
    value: string
    label: string
  }[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ options, value, onChange, placeholder = "Select options...", className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)

    const handleSelect = (selectedValue: string) => {
      if (value.includes(selectedValue)) {
        onChange(value.filter((v) => v !== selectedValue))
      } else {
        onChange([...value, selectedValue])
      }
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            ref={ref}
            className={cn(multiSelectVariants(), className, "cursor-pointer")}
            {...props}
          >
            <div className="flex flex-wrap gap-1">
              {value.length > 0 ? (
                value.map((val) => (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="mr-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect(val)
                    }}
                  >
                    {options.find((o) => o.value === val)?.label}
                    <XIcon className="ml-2 h-4 w-4" />
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-slate-950 border border-white/10 shadow-3xl rounded-xl overflow-hidden" align="start">
          <div className="max-h-[300px] overflow-y-auto p-1.5 space-y-1 custom-scrollbar">
            {options.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-sm italic">No options found.</div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(option.value);
                  }}
                  className={cn(
                    "flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-bold transition-all text-left group",
                    value.includes(option.value)
                      ? "bg-primary/20 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "mr-3 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-all",
                    value.includes(option.value)
                      ? "bg-primary border-primary text-primary-foreground shadow-[0_0_8px_rgba(234,88,12,0.3)]"
                      : "border-white/20 opacity-50 group-hover:opacity-100 group-hover:border-white/40"
                  )}>
                    {value.includes(option.value) && (
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="flex-1">{option.label}</span>
                  {value.includes(option.value) && (
                    <span className="ml-2 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  }
)

MultiSelect.displayName = "MultiSelect"

export { MultiSelect }
