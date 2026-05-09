"use client"

import React from "react";
import { ThemeProvider } from "@/context/theme-context";
import { SidebarProvider } from "@/context/sidebar-context";
import { ThemeApplicator } from "@/context/theme-applicator";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <ThemeApplicator />
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </ThemeProvider>
  );
}