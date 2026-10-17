import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://haechuk-monitor-pasm-xi.vercel.app/"),
  alternates: { canonical: "/" },
  title: "해축모니터 | 축구 뉴스 한눈에",
  description: "EPL부터 K리그까지. 관심 있는 리그의 최신 축구 뉴스를 간편하게 살펴보세요.",
  applicationName: "해축모니터",
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#101b18" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
