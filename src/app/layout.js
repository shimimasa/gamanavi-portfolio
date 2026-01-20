import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL("https://gamanavi-portfolio.vercel.app"),
  title: {
    default: "gamanavi / portfolio",
    template: "%s | gamanavi / portfolio",
  },
  description: "教育現場で活用できる学習ゲーム／教材のポートフォリオ",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "gamanavi / portfolio",
    title: "gamanavi / portfolio",
    description: "教育現場で活用できる学習ゲーム／教材のポートフォリオ",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "gamanavi / portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "gamanavi / portfolio",
    description: "教育現場で活用できる学習ゲーム／教材のポートフォリオ",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
