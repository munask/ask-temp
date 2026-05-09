import Layouts from "@/components/layouts";

type Props = {
  children: React.ReactNode;
  params: Promise<Record<string, string | string[]>>;
};

export default async function DashboardLayout({ children, params }: Props) {
  void params;
  return (
    <Layouts>
      {children}
    </Layouts>
  );
}
