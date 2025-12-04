"use client"

import { useCallback, useEffect, useRef, useState, JSX } from "react"
import { $createTextNode, $getSelection, $isRangeSelection } from "lexical"
import { Mic, Square } from "lucide-react"

import { useToolbarContext } from "@/components/editor/context/toolbar-context"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type SpeechRecognitionResultListLike = {
  length: number
  [index: number]: {
    0: { transcript: string }
    length: number
  }
}

type SpeechRecognitionEventLike = Event & {
  results: SpeechRecognitionResultListLike
}

interface SpeechRecognitionInstance {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onaudiostart?: () => void
  onresult?: (event: SpeechRecognitionEventLike) => void
  onerror?: (event: Event) => void
  onend?: () => void
}

type SpeechRecognitionType = SpeechRecognitionInstance

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
    SpeechRecognition?: new () => SpeechRecognitionInstance
  }
}

export function SpeechToTextToolbarPlugin(): JSX.Element {
  const { activeEditor } = useToolbarContext()
  const recognitionRef = useRef<SpeechRecognitionType | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    const SpeechRecognitionImpl: (new () => SpeechRecognitionInstance) | undefined =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : undefined

    if (SpeechRecognitionImpl) {
      recognitionRef.current = new SpeechRecognitionImpl()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "vi-VN"
      setSupported(true)
    }

    return () => {
      recognitionRef.current?.stop()
    }
  }, [])

  const handleResult = useCallback(
    (event: SpeechRecognitionEventLike) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim()

      if (!transcript) return

      activeEditor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          selection.insertText(transcript)
        } else {
          selection?.insertText(transcript)
        }
      })
    },
    [activeEditor]
  )

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return

    recognitionRef.current.onresult = handleResult
    recognitionRef.current.onerror = () => setIsListening(false)
    recognitionRef.current.onend = () => setIsListening(false)

    recognitionRef.current.start()
    setIsListening(true)
  }, [handleResult])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  if (!supported) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="!size-8"
            aria-label="Speech to text không hỗ trợ"
            variant="outline"
            size="icon-sm"
            disabled
          >
            <Mic className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Trình duyệt không hỗ trợ Speech Recognition</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="!size-8"
          aria-label="Speech to text"
          variant={isListening ? "default" : "outline"}
          size="icon-sm"
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? <Square className="size-4" /> : <Mic className="size-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isListening ? "Đang nghe... bấm để dừng" : "Nhấn để nói và chèn vào editor"}
      </TooltipContent>
    </Tooltip>
  )
}
