"use client"

import { Home } from "lucide-react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { navbarData, generateRouteLabels } from "./navbarData"

const routeLabels = generateRouteLabels(navbarData)

export function DynamicBreadcrumb() {
  const pathname = usePathname()

  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const breadcrumbs: { href: string; label: string; isLast: boolean }[] = []

    let currentPath = ""
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      const label = routeLabels[currentPath] || segment
      breadcrumbs.push({ href: currentPath, label, isLast })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home icon link */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">
              <Home className="size-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.map((breadcrumb) => (
          <div key={breadcrumb.href} className="flex items-center">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {breadcrumb.isLast ? (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={breadcrumb.href}>
                  {breadcrumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
