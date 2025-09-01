"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { XIcon, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
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
  extends React.HTMLAttributes<HTMLDivElement>,
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
            onClick={() => setOpen(!open)}
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
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className={cn(
                    "cursor-pointer",
                    value.includes(option.value) ? "font-bold" : ""
                  )}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

MultiSelect.displayName = "MultiSelect"

export { MultiSelect }
