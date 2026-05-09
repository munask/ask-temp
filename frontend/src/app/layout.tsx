import type { Metadata } from "next";
import { Cairo, Tajawal, IBM_Plex_Sans_Arabic, Noto_Sans_Arabic } from "next/font/google";
import { Toaster } from "sonner";
import "@/styles/globals.css";
import { Providers } from "./Providers";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSans = Noto_Sans_Arabic({
  variable: "--font-noto-sans",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "نظام الإدارة",
  description: "منصة متكاملة لإدارة البيانات والسجلات",
};

type Props = {
  children: React.ReactNode;
  params: Promise<Record<string, string | string[]>>;
};

export default async function RootLayout({ children, params }: Props) {
  await params;
  return (
    <html lang="ar" suppressHydrationWarning>
      <body
        dir="rtl"
        className={`${cairo.variable} ${tajawal.variable} ${ibmPlex.variable} ${notoSans.variable} antialiased`}
        style={{ fontFamily: "var(--font-cairo), Cairo, system-ui, sans-serif" }}
      >
        <Providers>{children}</Providers>
        <Toaster
          position="bottom-center"
          dir="rtl"
          gap={12}
          richColors
          closeButton
          visibleToasts={1}
          toastOptions={{
            unstyled: false,
            className: "toast-branded",
            duration: 4000,
            style: {
              direction: "rtl",
              fontFamily: "var(--font-cairo), Cairo, system-ui, sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
