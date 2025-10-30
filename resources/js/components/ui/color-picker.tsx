import * as React from "react"
import { cn } from "@/lib/utils"

export interface ColorPickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ className, value = '#6366F1', onChange, ...props }, ref) => {
    return (
      <div className="flex gap-2 items-center">
        <input
          type="color"
          className={cn(
            "h-10 w-20 cursor-pointer rounded-md border border-input bg-transparent p-1",
            className
          )}
          value={value}
          onChange={onChange}
          {...props}
        />
        <input
          type="text"
          className={cn(
            "border-input flex h-10 w-25 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm uppercase",
            className
          )}
          value={value}
          onChange={onChange}
          pattern="^#[0-9A-F]{6}$"
          placeholder="#000000"
        />
      </div>
    )
  }
)
ColorPicker.displayName = "ColorPicker"

export { ColorPicker }

