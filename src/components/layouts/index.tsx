import { AppSidebar } from "@/components/layouts/app-sidebar";
import { DynamicBreadcrumb } from "@/components/layouts/dynamic-breadcrumb";
import { NavHistoryButtons } from "@/components/layouts/nav-history-buttons";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavHistoryProvider } from "@/context/nav-history-context";

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
        </header>
        <div className="bg-dot-grid p-10 pt-5 page-enter">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
