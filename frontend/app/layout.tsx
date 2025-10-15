import 'bootstrap/dist/css/bootstrap.min.css';
import type { Metadata } from "next";
import Footer from './Components/Footer';
import { ThemeProvider } from './Components/ThemeContext';
import './globals.css';

export const metadata: Metadata = {
  title: "Custom LMS Escape Room",
  description: "Interactive Escape Room Learning Management System with OpenTelemetry",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
