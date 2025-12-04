"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection"
import { $getSelection, $isRangeSelection, EditorState } from "lexical"
import { useCallback, useEffect, useState, JSX } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const FONT_SIZES = [
  "12px",
  "14px",
  "15px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
  "48px",
] as const

export function FontSizeToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [fontSize, setFontSize] = useState<string>("16px")

  const applyStyleText = useCallback(
    (size: string) => {
      editor.update(() => {
        const selection = $getSelection()
        if (selection !== null) {
          $patchStyleText(selection, { "font-size": size })
        }
      })
    },
    [editor]
  )

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }: { editorState: EditorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const currentSize = $getSelectionStyleValueForProperty(
            selection,
            "font-size",
            "16px"
          )
          setFontSize(currentSize)
        }
      })
    })
  }, [editor])

  const handleChange = useCallback(
    (value: string) => {
      setFontSize(value)
      applyStyleText(value)
    },
    [applyStyleText]
  )

  return (
    <Select value={fontSize} onValueChange={handleChange}>
      <SelectTrigger className="h-8 w-[90px] text-xs">
        <SelectValue placeholder="Size" />
      </SelectTrigger>
      <SelectContent>
        {FONT_SIZES.map((size) => (
          <SelectItem key={size} value={size}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
