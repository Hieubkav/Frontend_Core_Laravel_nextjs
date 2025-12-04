"use client"

import { useEffect, useRef, useState, JSX } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection"
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_EDITOR,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  NodeKey,
} from "lexical"

import { $isImageNode, ImageNode } from "@/components/editor/nodes/image-node"

type Props = {
  src: string
  altText: string
  width: number | "inherit"
  height: number | "inherit"
  maxWidth: number
  nodeKey: NodeKey
  showCaption?: boolean
  caption?: any
  captionsEnabled?: boolean
  resizable?: boolean
}

const MIN_W = 80
const MIN_H = 60
const MAX_W = 1600
const MAX_H = 1200

export default function ImageComponent({
  src,
  altText,
  width,
  height,
  nodeKey,
  resizable = true,
}: Props): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(
    nodeKey
  )
  const [isResizing, setIsResizing] = useState(false)
  const imageRef = useRef<HTMLImageElement | null>(null)

  // select on click
  useEffect(() => {
    return editor.registerCommand<MouseEvent>(
      CLICK_COMMAND,
      (event) => {
        if (event.target === imageRef.current) {
          if (event.shiftKey) setSelected(!isSelected)
          else {
            clearSelection()
            setSelected(true)
          }
          return true
        }
        return false
      },
      COMMAND_PRIORITY_LOW
    )
  }, [clearSelection, editor, isSelected, setSelected])

  // delete node when selected + backspace/delete
  useEffect(() => {
    return editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event) => {
        if (isSelected && $isNodeSelection($getSelection())) {
          event?.preventDefault()
          editor.update(() => {
            const node = $getNodeByKey(nodeKey)
            if ($isImageNode(node)) node?.remove()
          })
          return true
        }
        return false
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor, isSelected, nodeKey])

  useEffect(() => {
    return editor.registerCommand(
      KEY_DELETE_COMMAND,
      (event) => {
        if (isSelected && $isNodeSelection($getSelection())) {
          event?.preventDefault()
          editor.update(() => {
            const node = $getNodeByKey(nodeKey)
            if ($isImageNode(node)) node?.remove()
          })
          return true
        }
        return false
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor, isSelected, nodeKey])

  // resizing
  useEffect(() => {
    if (!isResizing || !resizable) return
    const img = imageRef.current
    if (!img) return

    const rect = img.getBoundingClientRect()
    const startW = rect.width
    const startH = rect.height
    const startX = window.event instanceof MouseEvent ? window.event.clientX : 0
    const startY = window.event instanceof MouseEvent ? window.event.clientY : 0
    const ratio = startW / startH || 1

    const onMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      let nextW = startW + deltaX
      let nextH = startH + deltaY
      // giữ tỷ lệ khi giữ Shift
      if (e.shiftKey) {
        nextH = nextW / ratio
      }
      nextW = Math.min(Math.max(nextW, MIN_W), MAX_W)
      nextH = Math.min(Math.max(nextH, MIN_H), MAX_H)

      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if ($isImageNode(node)) {
          node.setWidthAndHeight(Math.round(nextW), Math.round(nextH))
        }
      })
    }
    const onUp = () => setIsResizing(false)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [editor, isResizing, nodeKey, resizable])

  return (
    <span className="relative inline-block">
      <img
        ref={imageRef}
        src={src}
        alt={altText}
        className={`rounded-md ${isSelected ? "outline outline-2 outline-ring" : ""}`}
        style={{
          width: width === "inherit" ? undefined : width,
          height: height === "inherit" ? undefined : height,
          maxWidth: "100%",
          display: "block",
        }}
        draggable={false}
        onClick={(e) => {
          let isRange = false
          editor.getEditorState().read(() => {
            isRange = $isRangeSelection($getSelection())
          })
          if (isRange) return
          if (e.shiftKey) setSelected(!isSelected)
        }}
      />
      {resizable && isSelected && (
        <button
          type="button"
          className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize rounded border bg-background px-1 text-[10px] shadow"
          onMouseDown={(e) => {
            e.preventDefault()
            setIsResizing(true)
          }}
        >
          ⇔
        </button>
      )}
    </span>
  )
}
