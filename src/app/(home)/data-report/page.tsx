import DataReport from "@/components/features/data/data-report"

export default async function DataReportPage({
  params,
}: {
  params: Promise<Record<string, string | string[]>>;
}) {
  void params;
  return <DataReport />;
}
