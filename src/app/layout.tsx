import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeutschBrücke",
  description: "DeutschBrücke — B1 → B2 com microtarefas, feedback imediato e SRS",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh`}
      >
        <div className="relative min-h-dvh">
          {/* Subtle gradient blob background */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[var(--accent)]/[0.04] blur-[100px]" />
            <div className="absolute -bottom-24 right-0 h-[300px] w-[300px] rounded-full bg-[var(--gradient-end)]/[0.03] blur-[80px]" />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
