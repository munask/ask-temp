"use client"

import { ErrorState } from "@/components/common/error-boundary"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md">
        <ErrorState
          error={error.message || "حدث خطأ غير متوقع"}
          onRetry={reset}
          title="خطأ في التطبيق"
          description="حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
        />
      </div>
    </div>
  )
}
