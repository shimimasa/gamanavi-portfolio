import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "gamanavi portfolio",
  description: "教育現場で“回る”学習ゲーム／教材のポートフォリオ"
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
