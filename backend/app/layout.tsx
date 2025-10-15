import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom LMS Backend API",
  description: "Backend API for Custom LMS Escape Room Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
