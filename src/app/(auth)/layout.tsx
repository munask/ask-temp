type Props = {
  children: React.ReactNode;
  params: Promise<Record<string, string | string[]>>;
};

export default async function AuthLayout({ children, params }: Props) {
  void params;
  return (
    <>
      {children}
    </>
  );
}
