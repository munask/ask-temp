"use client";

import * as React from "react";
import { AudioWaveform } from "lucide-react";

import { NavGroup } from "@/components/layouts/NavGroup";
import { NavUser } from "@/components/layouts/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth/authStore";
import { navbarData, getFilteredNavbarDataByPermission } from "./navbarData";
import { ROLE_LABELS } from "@/types/permissions";
import { collectPermissions } from "@/lib/permissions";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  const filteredNavData = React.useMemo(() => {
    if (!user) return { sections: [] };

    // Collect permissions from user's roles + direct overrides
    const roles = user.roles ?? [];
    const directPerms = user.permissions ?? [];

    if (roles.length > 0) {
      const permissions = collectPermissions(roles, directPerms);
      // If permissions were resolved, use permission-based filtering
      if (permissions.length > 0) {
        return getFilteredNavbarDataByPermission(permissions);
      }
    }

    // Fallback: show all nav items for authenticated users
    // This handles unknown roles or old data where no permissions are mapped
    return { sections: navbarData.sections };
  }, [user]);

  const roleLabel = user?.role
    ? (ROLE_LABELS[user.role] ?? user.role)
    : "";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div
            className="flex aspect-square size-8 items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b))",
              color: "var(--sidebar-primary-foreground)",
            }}
          >
            <AudioWaveform className="size-4" />
          </div>
          <div className="grid flex-1 text-right text-sm leading-tight">
            <span className="truncate font-semibold">نظام الإدارة</span>
            <span className="truncate text-xs text-muted-foreground">{roleLabel}</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        {filteredNavData.sections.map((section) => (
          <NavGroup key={section.label} items={section.items} groupLabel={section.label} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
