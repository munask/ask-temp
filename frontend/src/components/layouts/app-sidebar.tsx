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
import { useAuthStore, useAuthStoreHydrated } from "@/store/auth/authStore";
import { navbarData, getFilteredNavbarDataByPermission } from "./navbarData";
import { ROLE_LABELS, ROLE_PERMISSIONS } from "@/types/permissions";
import type { Role, Permission, Resource } from "@/types/permissions";
import { collectPermissions } from "@/lib/permissions";

// Resources all authenticated users can read by default (for unknown roles)
const DEFAULT_READ_RESOURCES: Resource[] = [
  "dashboard", "profile", "settings", "data", "data-report", "showcase",
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const hydrated = useAuthStoreHydrated()
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();

  // If user is logged in via setAuth (not from rehydration), treat as hydrated immediately
  const effectiveHydrated = hydrated || (isAuthenticated && user && _hasHydrated === false && (user.roles?.length ?? 0) > 0);

  const filteredNavData = React.useMemo(() => {
    // Wait for hydration to complete before rendering
    if (!effectiveHydrated) {
      return { sections: [] };
    }

    // Not authenticated = no sidebar items
    if (!isAuthenticated || !user) {
      return { sections: [] };
    }

    // Get roles - may be undefined for old localStorage data
    let roles: Role[] = user.roles ?? [];

    // If no roles array but role string exists, build roles from it
    if (roles.length === 0 && user.role) {
      const rolePerms = ROLE_PERMISSIONS[user.role] ?? (
        DEFAULT_READ_RESOURCES.map((r) => ({ resource: r, action: "read" as const }))
      );
      roles = [{ id: user.role, name: user.role, permissions: rolePerms }];
    }

    const directPerms: Permission[] = user.permissions ?? [];
    const permissions = collectPermissions(roles, directPerms);

    // If permissions were resolved, use permission-based filtering
    if (permissions.length > 0) {
      return getFilteredNavbarDataByPermission(permissions);
    }

    // Fallback: show all nav items for any authenticated user
    return { sections: navbarData.sections };
  }, [user, isAuthenticated, _hasHydrated, effectiveHydrated]);

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
