"use client"

import Link from "next/link"
import { Sun, Moon, Monitor } from "lucide-react"
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { DynamicBreadcrumb } from "@/components/layouts/dynamic-breadcrumb";
import { NavHistoryButtons } from "@/components/layouts/nav-history-buttons";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from "@/context/theme-context"
import { NavHistoryProvider } from "@/context/nav-history-context";
import { useAuthStore } from "@/store/auth/authStore"

function HeaderThemeToggle() {
  const { toggleTheme, getThemeIcon, mounted } = useTheme()

  const getIcon = () => {
    if (!mounted) return <Sun className="h-4 w-4" />
    const iconType = getThemeIcon()
    if (iconType === "moon") return <Moon className="h-4 w-4" />
    if (iconType === "sun") return <Sun className="h-4 w-4" />
    return <Monitor className="h-4 w-4" />
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleTheme}
          >
            {getIcon()}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>تبديل المظهر</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function HeaderProfileButton() {
  const { user } = useAuthStore()

  if (!user) return null

  const initial = user.fullName?.charAt(0)?.toUpperCase() || 'U'

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <span className="text-xs font-bold">{initial}</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{user.fullName}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default function Layouts({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="!h-screen overflow-y-scroll">
        {/* 3px gradient accent strip */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] z-30"
          style={{ background: "linear-gradient(90deg, var(--brand-gradient-a), var(--brand-gradient-b))" }}
        />
        {/* Sticky frosted-glass header */}
        <header
          className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
          style={{
            backgroundColor: "color-mix(in oklch, var(--background) 88%, transparent)",
            backdropFilter: "blur(12px) saturate(1.3)",
          }}
        >
          <NavHistoryProvider>
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <NavHistoryButtons />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <DynamicBreadcrumb />
            </div>
          </NavHistoryProvider>
          <div className="mr-auto flex items-center gap-1 px-4">
            <HeaderThemeToggle />
            <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
            <HeaderProfileButton />
          </div>
        </header>
        <div className="bg-dot-grid p-10 pt-5 page-enter">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
