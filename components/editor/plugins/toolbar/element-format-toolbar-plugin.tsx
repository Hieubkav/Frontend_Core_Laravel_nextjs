"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getSelection, $isRangeSelection, ElementNode, EditorState } from "lexical"
import { useState, useCallback, useEffect, JSX } from "react"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ElementFormatToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [blockFormat, setBlockFormat] = useState<string>("left")

  const updateBlockFormat = useCallback(
    (alignment: "left" | "center" | "right" | "justify") => {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const nodes = selection.getNodes()
          nodes.forEach((node) => {
            const parent = node.getParent()
            if (parent && parent instanceof ElementNode) {
              parent.setFormat(alignment)
            } else if (node instanceof ElementNode) {
              node.setFormat(alignment)
            }
          })
        }
      })
    },
    [editor]
  )

  const updateIndent = useCallback(
    (direction: "increase" | "decrease") => {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const nodes = selection.getNodes()
          nodes.forEach((node) => {
            const parent = node.getParent()
            const targetNode = parent instanceof ElementNode ? parent : node
            
            if (targetNode instanceof ElementNode) {
              const currentIndent = targetNode.getIndent() || 0
              if (direction === "increase") {
                targetNode.setIndent(currentIndent + 1)
              } else if (currentIndent > 0) {
                targetNode.setIndent(currentIndent - 1)
              }
            }
          })
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
          const nodes = selection.getNodes()
          if (nodes.length > 0) {
            let targetNode = nodes[0]
            if (!(targetNode instanceof ElementNode)) {
              const parent = targetNode.getParent()
              if (parent instanceof ElementNode) {
                targetNode = parent
              }
            }
            if (targetNode instanceof ElementNode) {
              const format = targetNode.getFormatType() || "left"
              setBlockFormat(format)
            }
          }
        }
      })
    })
  }, [editor])

  const alignments = [
    { value: "left", icon: AlignLeft, label: "Align left" },
    { value: "center", icon: AlignCenter, label: "Align center" },
    { value: "right", icon: AlignRight, label: "Align right" },
    { value: "justify", icon: AlignJustify, label: "Justify" },
  ] as const

  return (
    <div className="flex gap-1">
      {alignments.map(({ value, icon: Icon, label }) => (
        <Tooltip key={value}>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={blockFormat === value ? "default" : "outline"}
              onClick={() =>
                updateBlockFormat(value as "left" | "center" | "right" | "justify")
              }
              className="h-8 w-8 p-0"
            >
              <Icon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateIndent("decrease")}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Decrease indent</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateIndent("increase")}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Increase indent</TooltipContent>
      </Tooltip>
    </div>
  )
}
