"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

interface NavHistoryContextType {
  canGoBack: boolean
  canGoForward: boolean
  goBack: () => void
  goForward: () => void
}

const NavHistoryContext = createContext<NavHistoryContextType>({
  canGoBack: false,
  canGoForward: false,
  goBack: () => {},
  goForward: () => {},
})

export function NavHistoryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const historyRef = useRef<string[]>([pathname])
  const indexRef = useRef(0)
  const isProgrammatic = useRef(false)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  useEffect(() => {
    if (isProgrammatic.current) {
      isProgrammatic.current = false
      setCanGoBack(indexRef.current > 0)
      setCanGoForward(indexRef.current < historyRef.current.length - 1)
      return
    }

    const newStack = historyRef.current.slice(0, indexRef.current + 1)
    if (newStack[newStack.length - 1] !== pathname) {
      newStack.push(pathname)
      historyRef.current = newStack
      indexRef.current = newStack.length - 1
    }
    setCanGoBack(indexRef.current > 0)
    setCanGoForward(indexRef.current < historyRef.current.length - 1)
  }, [pathname])

  const goBack = useCallback(() => {
    if (indexRef.current > 0) {
      indexRef.current -= 1
      isProgrammatic.current = true
      router.push(historyRef.current[indexRef.current])
    }
  }, [router])

  const goForward = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current += 1
      isProgrammatic.current = true
      router.push(historyRef.current[indexRef.current])
    }
  }, [router])

  return (
    <NavHistoryContext.Provider value={{ canGoBack, canGoForward, goBack, goForward }}>
      {children}
    </NavHistoryContext.Provider>
  )
}

export function useNavHistory() {
  return useContext(NavHistoryContext)
}
