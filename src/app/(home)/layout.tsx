import Layouts from "@/components/layouts";

 
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return ( 
    <Layouts >
        {children}    
    </Layouts>
  );
}
