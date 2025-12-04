"use client"

import { useState, useCallback, JSX } from "react"
import { $createParagraphNode, $getRoot, CLEAR_HISTORY_COMMAND } from "lexical"
import { Trash2 } from "lucide-react"

import { useToolbarContext } from "@/components/editor/context/toolbar-context"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ClearEditorToolbarPlugin(): JSX.Element {
  const { activeEditor } = useToolbarContext()
  const [open, setOpen] = useState(false)

  const handleClear = useCallback(() => {
    activeEditor.update(() => {
      const root = $getRoot()
      root.clear()
      const paragraph = $createParagraphNode()
      root.append(paragraph)
      paragraph.selectStart()
    })
    activeEditor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined)
    activeEditor.focus()
    setOpen(false)
  }, [activeEditor])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              className="!size-8"
              aria-label="Clear editor"
              variant="outline"
              size="icon-sm"
            >
              <Trash2 className="size-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Xóa toàn bộ nội dung</TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Xóa nội dung</DialogTitle>
          <DialogDescription>
            Hành động này sẽ xóa toàn bộ nội dung trong trình soạn thảo. Bạn có chắc chắn?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleClear}>
            Xóa hết
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
