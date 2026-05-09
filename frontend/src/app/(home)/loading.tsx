import { StatisticsCardsSkeleton, ChartSkeleton } from "@/components/common/skeleton-loader"

export default function DashboardLoading() {
  return (
    <div className="space-y-6" dir="rtl">
      <StatisticsCardsSkeleton />
      <div className="flex gap-4">
        <ChartSkeleton className="flex-[7]" />
        <div className="flex-[3]">
          <ChartSkeleton />
        </div>
      </div>
    </div>
  )
}
