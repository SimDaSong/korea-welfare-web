import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: "복지 혜택 검색 | AI 복지 도우미",
  description:
    "AI가 나에게 맞는 복지 혜택을 찾아드립니다. 나이, 지역, 상황을 알려주세요.",
  openGraph: {
    title: "복지 혜택 검색 | AI 복지 도우미",
    description:
      "AI가 나에게 맞는 복지 혜택을 찾아드립니다. 나이, 지역, 상황을 알려주세요.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
