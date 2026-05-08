"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface TabItem {
  value: string
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
}

interface TabLayoutProps {
  tabs: TabItem[]
  defaultValue?: string
  className?: string
  onValueChange?: (value: string) => void
}

export function TabLayout({
  tabs,
  defaultValue,
  className,
  onValueChange,
}: TabLayoutProps) {
  const defaultTab = defaultValue || tabs[0]?.value

  return (
    <Tabs
      defaultValue={defaultTab}
      className={cn("w-full", className)}
      dir="rtl"
      onValueChange={onValueChange}
    >
      <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-muted/50 p-1">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="gap-1.5 text-xs data-[state=active]:bg-background"
          >
            {tab.icon}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
