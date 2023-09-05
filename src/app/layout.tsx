import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/app/Providers";
import "node_modules/react-grid-layout/css/styles.css";
import "node_modules/react-resizable/css/styles.css";

export const metadata: Metadata = {
  title: "Dashboard demo",
  description: "A simple demo to show how to build custom dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
