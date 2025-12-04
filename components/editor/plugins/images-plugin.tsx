"use client"

import { useEffect, useState } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils"
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  LexicalCommand,
  LexicalEditor,
} from "lexical"
import type { JSX } from "react"

import {
  $createImageNode,
  $isImageNode,
  ImageNode,
  InsertImagePayload,
  INSERT_IMAGE_COMMAND,
} from "@/components/editor/nodes/image-node"

type DragEventWithRange = DragEvent & {
  rangeParent?: Node | null
  rangeOffset?: number
}

const getDOMSelection = (targetWindow: Window | null): Selection | null =>
  typeof window !== "undefined"
    ? (targetWindow || window).getSelection()
    : null

export function ImagesPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor")
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload)
          $insertNodes([imageNode])
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd()
          }
          return true
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        (event) => $onDragStart(event),
        COMMAND_PRIORITY_HIGH
      ),
        editor.registerCommand<DragEvent>(
        DRAGOVER_COMMAND,
        (event) => $onDragover(event),
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => $onDrop(event, editor),
        COMMAND_PRIORITY_HIGH
      )
    )
  }, [editor])

  return null
}

type InsertImageDialogProps = {
  activeEditor: LexicalEditor
  onClose: () => void
}

const toDimension = (value: string): number | undefined => {
  if (!value.trim()) return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

export function InsertImageDialog({
  activeEditor,
  onClose,
}: InsertImageDialogProps): JSX.Element {
  const [src, setSrc] = useState("")
  const [altText, setAltText] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [captionsEnabled, setCaptionsEnabled] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!src.trim()) return

    const payload: InsertImagePayload = {
      src: src.trim(),
      altText: altText.trim(),
      width: toDimension(width),
      height: toDimension(height),
      captionsEnabled,
    }

    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)
    onClose()
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          URL anh *
        </label>
        <input
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          required
          placeholder="https://example.com/image.jpg"
          className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Alt text
        </label>
        <input
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Mo ta ngan"
          className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Width (px)
          </label>
          <input
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="Vi du: 600"
            className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Height (px)
          </label>
          <input
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Vi du: 400"
            className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
        <input
          type="checkbox"
          checked={captionsEnabled}
          onChange={(e) => setCaptionsEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
        />
        Cho phep caption
      </label>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm"
        >
          Huy
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 text-white px-3 py-2 text-sm disabled:opacity-50"
          disabled={!src.trim()}
        >
          Chen anh
        </button>
      </div>
    </form>
  )
}

function $getImageNodeInSelection(): ImageNode | null {
  const selection = $getSelection()
  if (!$isNodeSelection(selection)) return null
  const nodes = selection.getNodes()
  const node = nodes[0]
  return $isImageNode(node) ? node : null
}

function $onDragStart(event: DragEvent): boolean {
  const node = $getImageNodeInSelection()
  if (!node) return false
  const dataTransfer = event.dataTransfer
  if (!dataTransfer) return false

  const img = document.createElement("img")
  img.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
  dataTransfer.setDragImage(img, 0, 0)
  dataTransfer.setData(
    "application/x-lexical-drag",
    JSON.stringify({
      type: "image",
      data: {
        src: node.getSrc(),
        altText: node.getAltText(),
        width: node.__width,
        height: node.__height,
      },
    })
  )
  return true
}

function $onDragover(event: DragEvent): boolean {
  const node = $getImageNodeInSelection()
  if (!node) return false
  if (!canDropImage(event)) event.preventDefault()
  return true
}

function $onDrop(event: DragEvent, editor: any): boolean {
  const node = $getImageNodeInSelection()
  if (!node) return false
  const data = getDragImageData(event)
  if (!data) return false
  event.preventDefault()
  if (canDropImage(event)) {
    const range = getDragSelection(event)
    node.remove()
    const rangeSelection = $createRangeSelection()
    if (range) {
      rangeSelection.applyDOMRange(range)
    }
    $setSelection(rangeSelection)
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data)
  }
  return true
}

function canDropImage(event: DragEvent): boolean {
  const target = event.target
  return !!(
    target &&
    target instanceof HTMLElement &&
    !target.closest("code, span.editor-image") &&
    target.parentElement &&
    target.parentElement.closest("div.ContentEditable__root")
  )
}

function getDragImageData(event: DragEvent): null | InsertImagePayload {
  const dragData = event.dataTransfer?.getData("application/x-lexical-drag")
  if (!dragData) return null
  const { type, data } = JSON.parse(dragData)
  if (type !== "image") return null
  return data
}

function getDragSelection(event: DragEvent): Range | null | undefined {
  let range
  const target = event.target as null | Element | Document
  const targetWindow =
    target == null
      ? null
      : target.nodeType === 9
        ? (target as Document).defaultView
        : (target as Element).ownerDocument.defaultView
  const domSelection = getDOMSelection(targetWindow)
  const dragEvent = event as DragEventWithRange
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY)
  } else if (dragEvent.rangeParent && domSelection !== null) {
    domSelection.collapse(dragEvent.rangeParent, dragEvent.rangeOffset ?? 0)
    range = domSelection.rangeCount > 0 ? domSelection.getRangeAt(0) : null
  }
  return range ?? null
}
