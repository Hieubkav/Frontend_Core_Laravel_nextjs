import { useState } from "react"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { ImagesPlugin } from "@/components/editor/plugins/images-plugin"
import { ImageToolbarPlugin } from "@/components/editor/plugins/toolbar/image-toolbar-plugin"

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <div className="sticky top-0 z-10 flex gap-2 overflow-auto border-b bg-background p-2">
        <ImageToolbarPlugin />
      </div>

      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable placeholder={"Start typing ..."} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ImagesPlugin />
      </div>
    </div>
  )
}
