"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection"
import { $getSelection, $isRangeSelection, BaseSelection } from "lexical"
import { BaselineIcon } from "lucide-react"
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

export function FontColorToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [fontColor, setFontColor] = useState("#000000")

  const $updateToolbar = useCallback((selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      setFontColor(
        $getSelectionStyleValueForProperty(selection, "color", "#000000")
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

  const onFontColorSelect = useCallback(
    (value: string) => {
      setFontColor(value)
      applyStyleText({ color: value })
    },
    [applyStyleText]
  )

  return (
    <ColorPicker
      value={fontColor}
      onValueChange={onFontColorSelect}
    >
      <ColorPickerTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <BaselineIcon className="h-4 w-4" />
        </Button>
      </ColorPickerTrigger>
      <ColorPickerContent>
        <ColorPickerArea value={fontColor} onValueChange={onFontColorSelect} />
        <div className="flex items-center gap-2">
          <ColorPickerEyeDropper onValueChange={onFontColorSelect} />
          <div className="flex-1">
            <ColorPickerHueSlider />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPickerFormatSelect />
          <ColorPickerInput value={fontColor} onValueChange={onFontColorSelect} />
        </div>
      </ColorPickerContent>
    </ColorPicker>
  )
}
