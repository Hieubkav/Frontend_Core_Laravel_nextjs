"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Pipette } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ColorPickerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> {
  value?: string
  onValueChange?: (value: string) => void
}

const ColorPicker = ({
  value = "#000000",
  onValueChange,
  children,
  open,
  ...props
}: ColorPickerProps) => (
  <PopoverPrimitive.Root open={open} {...props}>
    {children}
  </PopoverPrimitive.Root>
)
ColorPicker.displayName = "ColorPicker"

const ColorPickerTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <PopoverPrimitive.Trigger ref={ref} className={className} {...props}>
    {children}
  </PopoverPrimitive.Trigger>
))
ColorPickerTrigger.displayName = "ColorPickerTrigger"

const ColorPickerContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    value?: string
  }
>(({ className, children, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      className={cn("z-50 w-80 rounded-md border bg-white p-4 shadow-md", className)}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
))
ColorPickerContent.displayName = "ColorPickerContent"

const ColorPickerArea = React.forwardRef<
  HTMLCanvasElement,
  {
    value?: string
    onValueChange?: (value: string) => void
  }
>(({ value = "#000000", onValueChange }, ref) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [hue, setHue] = React.useState(0)

  React.useEffect(() => {
    const canvas = canvasRef.current || ref
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const hueColor = `hsl(${hue}, 100%, 50%)`

    const gradientH = ctx.createLinearGradient(0, 0, width, 0)
    gradientH.addColorStop(0, "white")
    gradientH.addColorStop(1, hueColor)
    ctx.fillStyle = gradientH
    ctx.fillRect(0, 0, width, height)

    const gradientV = ctx.createLinearGradient(0, 0, 0, height)
    gradientV.addColorStop(0, "rgba(0, 0, 0, 0)")
    gradientV.addColorStop(1, "black")
    ctx.fillStyle = gradientV
    ctx.fillRect(0, 0, width, height)
  }, [hue, ref])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current || ref
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const imageData = canvas.getContext("2d")?.getImageData(x, y, 1, 1)
    if (!imageData) return

    const [r, g, b] = imageData.data
    const hex =
      "#" +
      [r, g, b]
        .map((x) => {
          const h = x.toString(16)
          return h.length === 1 ? "0" + h : h
        })
        .join("")
        .toUpperCase()

    onValueChange?.(hex)
  }

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef || ref}
        width={300}
        height={200}
        onClick={handleCanvasClick}
        className="w-full border rounded cursor-crosshair"
      />
      <input
        type="range"
        min="0"
        max="360"
        value={hue}
        onChange={(e) => setHue(Number(e.target.value))}
        className="w-full h-2 rounded cursor-pointer"
        style={{
          background: `linear-gradient(to right, 
            hsl(0, 100%, 50%), 
            hsl(60, 100%, 50%), 
            hsl(120, 100%, 50%), 
            hsl(180, 100%, 50%), 
            hsl(240, 100%, 50%), 
            hsl(300, 100%, 50%), 
            hsl(360, 100%, 50%))`,
        }}
      />
    </div>
  )
})
ColorPickerArea.displayName = "ColorPickerArea"

const ColorPickerInput = React.forwardRef<
  HTMLInputElement,
  {
    value?: string
    onValueChange?: (value: string) => void
  }
>(({ value = "#000000", onValueChange }, ref) => {
  const [inputValue, setInputValue] = React.useState(value.toUpperCase())

  React.useEffect(() => {
    setInputValue(value.toUpperCase())
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value
    setInputValue(hex.toUpperCase())
    if (!hex.startsWith("#")) hex = "#" + hex
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      onValueChange?.(hex)
    }
  }

  return (
    <input
      ref={ref}
      type="text"
      value={inputValue}
      onChange={handleChange}
      placeholder="#000000"
      maxLength={7}
      className="w-full px-3 py-2 border rounded text-sm font-mono"
    />
  )
})
ColorPickerInput.displayName = "ColorPickerInput"

const ColorPickerHueSlider = React.forwardRef<
  HTMLInputElement,
  {
    value?: number
    onValueChange?: (value: number) => void
  }
>(({ value = 0, onValueChange }, ref) => (
  <input
    ref={ref}
    type="range"
    min="0"
    max="360"
    value={value}
    onChange={(e) => onValueChange?.(Number(e.target.value))}
    className="w-full h-2 rounded cursor-pointer"
    style={{
      background: `linear-gradient(to right, 
        hsl(0, 100%, 50%), 
        hsl(60, 100%, 50%), 
        hsl(120, 100%, 50%), 
        hsl(180, 100%, 50%), 
        hsl(240, 100%, 50%), 
        hsl(300, 100%, 50%), 
        hsl(360, 100%, 50%))`,
    }}
  />
))
ColorPickerHueSlider.displayName = "ColorPickerHueSlider"

const ColorPickerAlphaSlider = React.forwardRef<
  HTMLInputElement,
  {
    value?: number
    onValueChange?: (value: number) => void
  }
>(({ value = 100, onValueChange }, ref) => (
  <div className="flex items-center gap-2">
    <input
      ref={ref}
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onValueChange?.(Number(e.target.value))}
      className="flex-1 h-2 rounded cursor-pointer"
    />
    <span className="text-xs font-medium w-8">{value}%</span>
  </div>
))
ColorPickerAlphaSlider.displayName = "ColorPickerAlphaSlider"

const ColorPickerEyeDropper = React.forwardRef<
  HTMLButtonElement,
  {
    onValueChange?: (value: string) => void
  }
>(({ onValueChange }, ref) => {
  const handleEyeDropper = async () => {
    if (!("EyeDropper" in window)) {
      alert("Eye dropper is not supported in your browser")
      return
    }

    try {
      const eyeDropper = new (window as any).EyeDropper()
      const result = await eyeDropper.open()
      onValueChange?.(result.sRGBHex)
    } catch {
      // User cancelled
    }
  }

  return (
    <Button
      ref={ref}
      type="button"
      size="icon"
      variant="outline"
      onClick={handleEyeDropper}
      className="h-9 w-9"
    >
      <Pipette className="h-4 w-4" />
    </Button>
  )
})
ColorPickerEyeDropper.displayName = "ColorPickerEyeDropper"

const ColorPickerFormatSelect = React.forwardRef<
  HTMLSelectElement,
  {
    value?: string
    onValueChange?: (value: string) => void
  }
>(({ value = "hex", onValueChange }, ref) => (
  <select
    ref={ref}
    value={value}
    onChange={(e) => onValueChange?.(e.target.value)}
    className="px-3 py-2 border rounded text-sm"
  >
    <option value="hex">HEX</option>
    <option value="rgb">RGB</option>
    <option value="hsl">HSL</option>
  </select>
))
ColorPickerFormatSelect.displayName = "ColorPickerFormatSelect"

export {
  ColorPicker,
  ColorPickerTrigger,
  ColorPickerContent,
  ColorPickerArea,
  ColorPickerInput,
  ColorPickerHueSlider,
  ColorPickerAlphaSlider,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
}
