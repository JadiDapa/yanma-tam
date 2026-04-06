import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/sonner";
import Providers from "../providers/Providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "YANMA | Taruna Anugerah Mandiri",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body suppressHydrationWarning className={`${poppins.className}`}>
        <Toaster richColors position="top-right" theme="dark" />
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
