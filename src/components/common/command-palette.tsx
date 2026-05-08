"use client"

import { useEffect, useState } from "react"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"

interface CommandItemConfig {
  label: string
  href: string
  icon?: React.ReactNode
  keywords?: string[]
}

interface CommandGroupConfig {
  name: string
  items: CommandItemConfig[]
}

interface CommandPaletteProps {
  groups?: CommandGroupConfig[]
}

const defaultGroups: CommandGroupConfig[] = [
  {
    name: "الصفحات",
    items: [
      { label: "الرئيسية", href: "/", keywords: ["home", "dashboard", "رئيسية"] },
      { label: "البيانات", href: "/data", keywords: ["data", "بيانات"] },
      { label: "التقارير", href: "/data-report", keywords: ["report", "تقارير"] },
      { label: "الإعدادات", href: "/settings", keywords: ["settings", "إعدادات"] },
      { label: "الملف الشخصي", href: "/profile", keywords: ["profile", "ملف"] },
    ],
  },
]

export function CommandPalette({ groups }: CommandPaletteProps) {
  const resolvedGroups: CommandGroupConfig[] = groups ?? defaultGroups
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runAction = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="ابحث عن صفحة أو إجراء..." />
      <CommandList>
        <CommandEmpty>لا توجد نتائج</CommandEmpty>
        {resolvedGroups.map((group) => (
          <CommandGroup key={group.name} heading={group.name}>
            {group.items.map((item) => (
              <CommandItem
                key={item.href}
                value={`${item.label} ${item.keywords?.join(" ") || ""}`}
                onSelect={() => runAction(item.href)}
              >
                {item.icon}
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
