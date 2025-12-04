"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, EditorState, COMMAND_PRIORITY_CRITICAL, LexicalNode } from "lexical"
import { TOGGLE_LINK_COMMAND } from "@lexical/link"
import { useState, useCallback, useEffect, useRef, JSX } from "react"
import { Link as LinkIcon, Unlink } from "lucide-react"
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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function LinkToolbarPlugin(): JSX.Element {
    const [editor] = useLexicalComposerContext()
    const [isLinkMode, setIsLinkMode] = useState(false)
    const [url, setUrl] = useState("")
    const [isLinkActive, setIsLinkActive] = useState(false)
    const [hasTextSelection, setHasTextSelection] = useState(false)

    // Check if text is selected and open dialog
    const handleOpenDialog = useCallback(() => {
        let hasSelection = false
        editor.read(() => {
            const selection = $getSelection()
            hasSelection = $isRangeSelection(selection) && !selection.isCollapsed()
        })

        if (!hasSelection) {
            alert("Please select some text first to add a link")
            return
        }

        setIsLinkMode(true)
        setHasTextSelection(true)
    }, [editor])

    const insertLink = useCallback(
        (urlToInsert: string) => {
            if (!urlToInsert.trim()) {
                return
            }

            let finalUrl = urlToInsert
            if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
                finalUrl = "https://" + finalUrl
            }

            editor.update(() => {
                const selection = $getSelection()
                if ($isRangeSelection(selection) && !selection.isCollapsed()) {
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, finalUrl)
                }
            })

            setUrl("")
            setIsLinkMode(false)
            setHasTextSelection(false)
        },
        [editor]
    )

    const removeLink = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
            }
        })
    }, [editor])

    useEffect(() => {
        const unregisterListener = editor.registerUpdateListener(({ editorState }: { editorState: EditorState }) => {
            editorState.read(() => {
                const selection = $getSelection()
                if ($isRangeSelection(selection)) {
                    // Check if selection contains or is within a link
                    const nodes = selection.getNodes()
                    let foundLink = false

                    for (const node of nodes) {
                        let current: LexicalNode | null = node
                        while (current) {
                            if (current.getType() === "link") {
                                foundLink = true
                                break
                            }
                            current = current.getParent()
                        }
                        if (foundLink) break
                    }

                    setIsLinkActive(foundLink)
                } else {
                    setIsLinkActive(false)
                }
            })
        })

        const unregisterCommand = editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                editor.read(() => {
                    const selection = $getSelection()
                    if ($isRangeSelection(selection) && !selection.isCollapsed()) {
                        const nodes = selection.getNodes()
                        let foundLink = false

                        for (const node of nodes) {
                            let current: LexicalNode | null = node
                            while (current) {
                                if (current.getType() === "link") {
                                    foundLink = true
                                    break
                                }
                                current = current.getParent()
                            }
                            if (foundLink) break
                        }

                        setIsLinkActive(foundLink)
                    } else {
                        setIsLinkActive(false)
                    }
                })
                return false
            },
            COMMAND_PRIORITY_CRITICAL
        )

        return () => {
            unregisterListener()
            unregisterCommand()
        }
    }, [editor])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            insertLink(url)
        } else if (e.key === "Escape") {
            setIsLinkMode(false)
            setUrl("")
            setHasTextSelection(false)
        }
    }

    return (
        <div className="flex gap-1">
            <Dialog open={isLinkMode} onOpenChange={setIsLinkMode}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            variant={isLinkActive ? "default" : "outline"}
                            className="h-8 w-8 p-0"
                            onClick={handleOpenDialog}
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add link</TooltipContent>
                </Tooltip>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Link</DialogTitle>
                        <DialogDescription>
                            Enter the URL you want to link to. HTTPS will be added automatically if not specified.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2">
                        <input
                            autoFocus
                            type="text"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        />
                        <Button
                            onClick={() => insertLink(url)}
                            disabled={!url.trim()}
                        >
                            Insert
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {isLinkActive && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={removeLink}
                            className="h-8 w-8 p-0"
                        >
                            <Unlink className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove link</TooltipContent>
                </Tooltip>
            )}
        </div>
    )
}
