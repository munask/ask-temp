export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center" dir="rtl">
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="text-muted-foreground">جاري التحميل...</span>
      </div>
    </div>
  )
}
