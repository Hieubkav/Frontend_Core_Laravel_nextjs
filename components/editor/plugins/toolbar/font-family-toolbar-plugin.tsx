"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection"
import { $getSelection, $isRangeSelection, BaseSelection } from "lexical"
import { Type } from "lucide-react"
import { useCallback, useState, JSX } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const FONT_FAMILIES = [
  { label: "Default", value: "inherit" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Comic Sans MS", value: "'Comic Sans MS', cursive" },
  { label: "Impact", value: "Impact, sans-serif" },
  { label: "Lucida Console", value: "'Lucida Console', monospace" },
  { label: "Tahoma", value: "Tahoma, sans-serif" },
  { label: "Palatino Linotype", value: "'Palatino Linotype', serif" },
  { label: "Garamond", value: "Garamond, serif" },
  { label: "Bookman", value: "Bookman, serif" },
  { label: "Comic Sans", value: "'Comic Sans', cursive" },
]

export function FontFamilyToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [fontFamily, setFontFamily] = useState("")

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, "font-family", "")
      )
    }
  }

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      editor.update(() => {
        const selection = $getSelection()
        editor.setEditable(false)
        if (selection !== null) {
          $patchStyleText(selection, styles)
        }
        editor.setEditable(true)
      })
    },
    [editor]
  )

  const onFontFamilySelect = useCallback(
    (value: string) => {
      applyStyleText({ "font-family": value })
      setFontFamily(value)
    },
    [applyStyleText]
  )

  return (
    <Select value={fontFamily} onValueChange={onFontFamilySelect}>
      <SelectTrigger className="h-8 w-[150px] text-xs">
        <Type className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Font" />
      </SelectTrigger>
      <SelectContent>
        {FONT_FAMILIES.map((font) => (
          <SelectItem key={font.value} value={font.value}>
            {font.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
