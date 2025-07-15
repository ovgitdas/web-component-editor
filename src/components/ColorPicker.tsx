"use client"

import { useState, useEffect } from "react"
import { Input } from "./ui/Input"
import { Label } from "./ui/Label"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [color, setColor] = useState(value)

  useEffect(() => {
    setColor(value)
  }, [value])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
    onChange(e.target.value)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
  }

  const handleTextBlur = () => {
    onChange(color)
  }

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="color"
        value={color.startsWith("#") ? color : "#ffffff"}
        onChange={handleColorChange}
        className="p-1 h-9 w-9"
      />
      <Input
        type="text"
        value={color}
        onChange={handleTextChange}
        onBlur={handleTextBlur}
        placeholder="e.g. #RRGGBB, rgba(...), transparent"
      />
    </div>
  )
}
