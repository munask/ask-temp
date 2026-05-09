import Link from "next/link"
import { FileQuestion, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center" dir="rtl">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-gradient-a), var(--brand-gradient-b))",
          }}
        >
          <FileQuestion className="h-10 w-10 text-white" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground/30">404</h1>
          <h2 className="text-2xl font-bold">الصفحة غير موجودة</h2>
          <p className="text-muted-foreground max-w-md">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى عنوان آخر.
          </p>
        </div>

        <Button asChild size="lg">
          <Link href="/">
            <Home className="ml-2 h-4 w-4" />
            العودة للرئيسية
          </Link>
        </Button>
      </div>
    </div>
  )
}
