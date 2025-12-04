"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  EditorState,
} from "lexical"
import { useState, useCallback, useEffect, JSX } from "react"
import { Undo2, Redo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function HistoryToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload: boolean) => {
        setCanUndo(payload)
        return false
      },
      2
    )
  }, [editor])

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload: boolean) => {
        setCanRedo(payload)
        return false
      },
      2
    )
  }, [editor])

  const handleUndo = useCallback(() => {
    editor.dispatchCommand(UNDO_COMMAND, undefined)
  }, [editor])

  const handleRedo = useCallback(() => {
    editor.dispatchCommand(REDO_COMMAND, undefined)
  }, [editor])

  return (
    <div className="flex gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={handleUndo}
            disabled={!canUndo}
            className="h-8 w-8 p-0"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Undo <span className="ml-2 text-xs text-muted-foreground">Ctrl+Z</span>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRedo}
            disabled={!canRedo}
            className="h-8 w-8 p-0"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Redo <span className="ml-2 text-xs text-muted-foreground">Ctrl+Y</span>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
