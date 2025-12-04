"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection"
import { $getSelection, $isRangeSelection, BaseSelection } from "lexical"
import { Highlighter } from "lucide-react"
import { useCallback, useState, JSX } from "react"
import { Button } from "@/components/ui/button"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerTrigger,
} from "@/components/editor/editor-ui/color-picker"
import { useUpdateToolbarHandler } from "@/components/editor/editor-hooks/use-update-toolbar"

export function FontBackgroundToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [bgColor, setBgColor] = useState("")

  const $updateToolbar = useCallback((selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      setBgColor(
        $getSelectionStyleValueForProperty(selection, "background-color", "")
      )
    }
  }, [])

  useUpdateToolbarHandler($updateToolbar)

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles)
        }
      })
    },
    [editor]
  )

  const onBgColorSelect = useCallback(
    (value: string) => {
      setBgColor(value)
      applyStyleText({ "background-color": value })
    },
    [applyStyleText]
  )

  return (
    <ColorPicker
      value={bgColor}
      onValueChange={onBgColorSelect}
    >
      <ColorPickerTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <Highlighter className="h-4 w-4" />
        </Button>
      </ColorPickerTrigger>
      <ColorPickerContent>
        <ColorPickerArea value={bgColor} onValueChange={onBgColorSelect} />
        <div className="flex items-center gap-2">
          <ColorPickerEyeDropper onValueChange={onBgColorSelect} />
          <div className="flex-1">
            <ColorPickerHueSlider />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPickerFormatSelect />
          <ColorPickerInput value={bgColor} onValueChange={onBgColorSelect} />
        </div>
      </ColorPickerContent>
    </ColorPicker>
  )
}
