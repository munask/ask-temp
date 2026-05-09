import DataList from "@/components/features/data/data-list"

export default async function DataPage({
  params,
}: {
  params: Promise<Record<string, string | string[]>>;
}) {
  void params;
  return <DataList />;
}
