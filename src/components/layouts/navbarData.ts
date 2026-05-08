import {
  Settings2,
  SquareTerminal,
  LucideIcon,
  Database,
  FileText,
  User,
  LayoutGrid,
} from "lucide-react";
import type { Resource, Action, Permission } from "@/types/permissions";
import { hasPermission } from "@/lib/permissions";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
  /** @deprecated Use permission instead */
  roles?: string[];
  /** Resource-action permission required to see this nav item */
  permission?: { resource: Resource; action: Action };
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface NavbarData {
  sections: NavSection[];
}

export const navbarData: NavbarData = {
  sections: [
    {
      label: "الرئيسية",
      items: [
        {
          title: "لوحة التحكم",
          url: "/",
          icon: SquareTerminal,
          permission: { resource: "dashboard", action: "read" },
        },
        {
          title: "الملف الشخصي",
          url: "/profile",
          icon: User,
          permission: { resource: "profile", action: "read" },
        },
        {
          title: "الإعدادات",
          url: "/settings",
          icon: Settings2,
          permission: { resource: "settings", action: "read" },
        },
      ],
    },
    {
      label: "البيانات",
      items: [
        {
          title: "البيانات",
          url: "/data",
          icon: Database,
          permission: { resource: "data", action: "read" },
        },
        {
          title: "تقرير البيانات",
          url: "/data-report",
          icon: FileText,
          permission: { resource: "data-report", action: "read" },
        },
        {
          title: "عرض المكونات",
          url: "/showcase",
          icon: LayoutGrid,
          permission: { resource: "showcase", action: "read" },
        },
      ],
    },
  ],
};

// ─── Permission-based Filtering (new) ────────────────────────────────────

export function filterNavItemsByPermission(
  items: NavItem[],
  userPermissions: Permission[]
): NavItem[] {
  return items
    .filter((item) => {
      if (!item.permission) return true; // No permission required = visible to all
      return hasPermission(
        userPermissions,
        item.permission.resource,
        item.permission.action
      );
    })
    .map((item) => ({
      ...item,
      items: item.items
        ? filterNavItemsByPermission(item.items, userPermissions)
        : undefined,
    }));
}

export function getFilteredNavbarDataByPermission(
  userPermissions: Permission[]
): NavbarData {
  const sections = navbarData.sections
    .map((section) => ({
      ...section,
      items: filterNavItemsByPermission(section.items, userPermissions),
    }))
    .filter((section) => section.items.length > 0);

  return { sections };
}

// ─── Role-based Filtering (legacy) ───────────────────────────────────────

export function filterNavItemsByRole(
  items: NavItem[],
  userRole?: string
): NavItem[] {
  if (!userRole) return [];

  return items
    .filter(
      (item) => !item.roles || item.roles.length === 0 || item.roles.includes(userRole)
    )
    .map((item) => ({
      ...item,
      items: item.items ? filterNavItemsByRole(item.items, userRole) : undefined,
    }));
}

export function getFilteredNavbarData(userRole?: string): NavbarData {
  const sections = navbarData.sections
    .map((section) => ({
      ...section,
      items: filterNavItemsByRole(section.items, userRole),
    }))
    .filter((section) => section.items.length > 0);

  return { sections };
}

// ─── Route Labels (for breadcrumbs) ──────────────────────────────────────

export function generateRouteLabels(data: NavbarData): Record<string, string> {
  const labels: Record<string, string> = {};

  const extract = (items: NavItem[]) => {
    items.forEach((item) => {
      labels[item.url] = item.title.trim();
      if (item.items) extract(item.items);
    });
  };

  data.sections.forEach((section) => extract(section.items));

  return labels;
}
