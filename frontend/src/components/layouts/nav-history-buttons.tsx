"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavHistory } from "@/context/nav-history-context"

export function NavHistoryButtons() {
  const { canGoBack, canGoForward, goBack, goForward } = useNavHistory()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={goBack}
        disabled={!canGoBack}
      >
        <ChevronRight className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={goForward}
        disabled={!canGoForward}
      >
        <ChevronLeft className="size-4" />
      </Button>
    </>
  )
}
