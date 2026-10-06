import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StackTrace Memory",
  description:
    "A debugging partner that remembers your stack, failed fixes, and next steps.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
