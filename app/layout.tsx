import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Sistema Financeiro",
  description: "Gestão Financeira - Natália Paião",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="w-full bg-[#F1E7E4] border-b border-[#E4D5D1]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-lg font-semibold text-[#6B4F4F]">
                Natália Paião
              </h1>
              <p className="text-sm text-[#A17C7C]">
                Confeitaria
              </p>
            </div>

            <nav className="flex gap-4">
              <Link
                href="/"
                className="px-4 py-2 rounded-lg bg-[#D4A5A5] text-white text-sm"
              >
                Dashboard
              </Link>

              <Link
                href="/contas"
                className="px-4 py-2 rounded-lg border border-[#D4A5A5] text-[#6B4F4F] text-sm"
              >
                Contas a Pagar
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}