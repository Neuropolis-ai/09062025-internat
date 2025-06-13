import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "../contexts/AdminContext";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Админ-портал | Лицей-интернат «Подмосковный»",
  description: "Административная панель управления Лицеем-интернатом «Подмосковный»",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <AdminProvider>
          {children}
        </AdminProvider>
      </body>
    </html>
  );
}
