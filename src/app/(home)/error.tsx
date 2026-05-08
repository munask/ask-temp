"use client"

import { ErrorState } from "@/components/common/error-boundary"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center p-10" dir="rtl">
      <div className="w-full max-w-md">
        <ErrorState
          error={error.message || "حدث خطأ أثناء تحميل الصفحة"}
          onRetry={reset}
          title="خطأ في تحميل الصفحة"
          description="حدث خطأ أثناء تحميل هذه الصفحة. يرجى المحاولة مرة أخرى."
        />
      </div>
    </div>
  )
}
