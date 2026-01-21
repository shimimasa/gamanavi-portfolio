import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL("https://www.gamanavi.com"),
  title: {
    default: "学習に困り感のある子どものための教育ゲーム開発ポートフォリオ｜gamanavi",
    template: "%s｜gamanavi",
  },
  description: "学習に困り感のある子ども向けに、漢字や計算をテーマとした教育ゲームを個人開発。設計思想と実際に遊べる作品を紹介しています。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "gamanavi / portfolio",
    title: "学習に困り感のある子どものための教育ゲーム開発ポートフォリオ｜gamanavi",
    description: "学習に困り感のある子ども向けに、漢字や計算をテーマとした教育ゲームを個人開発。設計思想と実際に遊べる作品を紹介しています。",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "gamanavi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "学習に困り感のある子どものための教育ゲーム開発ポートフォリオ｜gamanavi",
    description: "学習に困り感のある子ども向けに、漢字や計算をテーマとした教育ゲームを個人開発。設計思想と実際に遊べる作品を紹介しています。",
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
