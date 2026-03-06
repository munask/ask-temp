import {
  Settings2,
  SquareTerminal,
  LucideIcon,
  Database,
  FileText,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
  roles?: string[];
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
        },
        {
          title: "الإعدادات",
          url: "/settings",
          icon: Settings2,
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
        },
        {
          title: "تقرير البيانات",
          url: "/data-report",
          icon: FileText,
        },
      ],
    },
  ],
};

export function filterNavItemsByRole(items: NavItem[], userRole?: string): NavItem[] {
  if (!userRole) return [];

  return items
    .filter(item => !item.roles || item.roles.length === 0 || item.roles.includes(userRole))
    .map(item => ({
      ...item,
      items: item.items ? filterNavItemsByRole(item.items, userRole) : undefined,
    }));
}

export function getFilteredNavbarData(userRole?: string): NavbarData {
  const sections = navbarData.sections
    .map(section => ({
      ...section,
      items: filterNavItemsByRole(section.items, userRole),
    }))
    .filter(section => section.items.length > 0);

  return { sections };
}

export function generateRouteLabels(data: NavbarData): Record<string, string> {
  const labels: Record<string, string> = {};

  const extract = (items: NavItem[]) => {
    items.forEach(item => {
      labels[item.url] = item.title.trim();
      if (item.items) extract(item.items);
    });
  };

  data.sections.forEach(section => extract(section.items));

  return labels;
}
