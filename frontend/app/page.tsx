'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from './Components/header';
import { useTheme } from './Components/ThemeContext';

export default function Home() {
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // Redirect to escape room page
    router.push('/escape-room');
  }, [router]);

  return (
    <div style={{ backgroundColor: theme === 'light' ? '#ffffff' : 'var(--background)', padding: "0", marginBottom: "0px", minHeight: "100vh" }} className="theme-transition" data-theme={theme}>
      <Header studentNumber="21406232" />
      <div style={{ marginTop: "135px", padding: "20px", textAlign: "center" }}>
        <p>Redirecting to Escape Room...</p>
      </div>
    </div>
  );
}
