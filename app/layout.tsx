import "./globals.css";
import Link from "next/link";
import { Metadata } from "next";

// METADADOS DE ELITE ANUBIS TECH [cite: 2026-02-13]
export const metadata: Metadata = {
  title: "Gestão Financeira | Natália Paião",
  description: "Sistema de Inteligência Financeira desenvolvido por Anubis Tech",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Financeiro Natália",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[#FAF8F5] min-h-screen overflow-x-hidden">
        {/* NAV REFINADA: Sombreamento e Fixação */}
        <header className="w-full bg-[#F1E7E4] border-b border-[#E4D5D1] sticky top-0 z-[150] shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-left">
              <h1 className="text-lg font-black text-[#6B4F4F] uppercase tracking-tighter italic">
                Natália Paião
              </h1>
              <div className="flex items-center gap-2">
                <span className="h-px w-4 bg-[#D4A5A5]"></span>
                <p className="text-[10px] font-bold text-[#A17C7C] uppercase tracking-[0.2em]">
                  Confeitaria
                </p>
              </div>
            </div>

            <nav className="flex gap-4">
              <Link
                href="/"
                className="px-6 py-2 rounded-xl bg-[#D4A5A5] text-white text-[11px] font-black uppercase tracking-widest shadow-md hover:bg-[#C99494] transition-all active:scale-95"
              >
                Dashboard
              </Link>

              <Link
                href="/contas"
                className="px-6 py-2 rounded-xl border-2 border-[#D4A5A5] text-[#6B4F4F] text-[11px] font-black uppercase tracking-widest hover:bg-[#D4A5A5]/10 transition-all active:scale-95"
              >
                Contas a Pagar
              </Link>
            </nav>
          </div>
        </header>

        {/* MAIN CONTAINER */}
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 relative">
          {children}
        </main>
      </body>
    </html>
  );
}