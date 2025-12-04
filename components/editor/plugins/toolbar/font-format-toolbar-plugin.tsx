"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  EditorState,
  TextFormatType,
} from "lexical"
import { useState, useCallback, useEffect, JSX } from "react"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FormatState {
  bold: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
  code: boolean
}

const FORMATS = [
  {
    name: "bold",
    icon: Bold,
    command: "bold",
    label: "Bold (Ctrl+B)",
    shortcut: "Ctrl+B",
  },
  {
    name: "italic",
    icon: Italic,
    command: "italic",
    label: "Italic (Ctrl+I)",
    shortcut: "Ctrl+I",
  },
  {
    name: "underline",
    icon: Underline,
    command: "underline",
    label: "Underline (Ctrl+U)",
    shortcut: "Ctrl+U",
  },
  {
    name: "strikethrough",
    icon: Strikethrough,
    command: "strikethrough",
    label: "Strikethrough",
    shortcut: "",
  },
  {
    name: "code",
    icon: Code,
    command: "code",
    label: "Code",
    shortcut: "",
  },
] as const

export function FontFormatToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [formatState, setFormatState] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
  })

  const updateFormat = useCallback((format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
  }, [editor])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }: { editorState: EditorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          setFormatState({
            bold: selection.hasFormat("bold"),
            italic: selection.hasFormat("italic"),
            underline: selection.hasFormat("underline"),
            strikethrough: selection.hasFormat("strikethrough"),
            code: selection.hasFormat("code"),
          })
        }
      })
    })
  }, [editor])

  return (
    <div className="flex gap-1">
      {FORMATS.map(({ name, icon: Icon, command, label, shortcut }) => (
        <Tooltip key={name}>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={
                formatState[name as keyof FormatState] ? "default" : "outline"
              }
              onClick={() => updateFormat(command as TextFormatType)}
              className="h-8 w-8 p-0"
            >
              <Icon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {label}
            {shortcut && <span className="ml-2 text-xs text-muted-foreground">{shortcut}</span>}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
