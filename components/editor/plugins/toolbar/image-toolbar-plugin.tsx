"use client"

import { useState, useCallback, JSX } from "react"
import type { ChangeEvent, KeyboardEvent } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ImagePlus } from "lucide-react"

import { INSERT_IMAGE_COMMAND } from "@/components/editor/nodes/image-node"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ImageToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [alt, setAlt] = useState("")

  const reset = () => {
    setUrl("")
    setAlt("")
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === "string") {
        setUrl(result)
        if (!alt) setAlt(file.name.replace(/\.[^/.]+$/, ""))
      }
    }
    reader.readAsDataURL(file)
  }

  const insertImage = useCallback(() => {
    const trimmed = url.trim()
    if (!trimmed) return

    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      src: trimmed,
      altText: alt.trim(),
    })
    reset()
    setOpen(false)
  }, [editor, url, alt])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") insertImage()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (!value) reset()
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              className="!size-8"
              aria-label="Chèn ảnh"
              variant="outline"
              size="icon-sm"
            >
              <ImagePlus className="size-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Chèn ảnh (URL hoặc upload)</TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Chèn ảnh</DialogTitle>
          <DialogDescription>
            Dán URL hoặc chọn file ảnh. Alt text là tùy chọn.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Image URL</label>
            <input
              autoFocus
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Hoặc chọn file ảnh</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/80"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Alt text</label>
            <input
              placeholder="Mô tả ngắn cho ảnh"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button onClick={insertImage} disabled={!url.trim()}>
            Chèn ảnh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
