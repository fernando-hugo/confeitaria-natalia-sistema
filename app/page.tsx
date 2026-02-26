"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, Wallet, AlertCircle, Trash2, TrendingUp, TrendingDown, Loader2, Github, Instagram, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TransactionModal } from "@/components/TransactionModal";

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("financial_records").select("*").order("created_at", { ascending: false });
      if (data) setTransactions(data);
    } catch (err) {
      console.error("Erro Anubis:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir?")) {
      const { error } = await supabase.from("financial_records").delete().eq("id", id);
      if (!error) fetchData();
    }
  };

  const entradas = transactions.filter((t) => Number(t.amount) > 0).reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const saidas = transactions.filter((t) => Number(t.amount) < 0).reduce((acc, t) => acc + Math.abs(Number(t.amount || 0)), 0);
  const aPagar = transactions.filter((t) => !t.paid && Number(t.amount) < 0).reduce((acc, t) => acc + Math.abs(Number(t.amount || 0)), 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] relative">
      <div className="flex-grow p-4 md:px-12 py-8 flex flex-col gap-8 pb-40 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2">
            <Image src="/logo_natalia_paiao_2024_rosa.png" alt="Logo" width={220} height={140} className="object-contain" unoptimized />
            <p className="text-[8px] font-black text-[#A17C7C] tracking-[0.4em] uppercase opacity-60">Anubis Intelligence System</p>
          </div>
          <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="bg-[#D4A5A5] text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] shadow-xl">
            <Plus size={18} className="inline mr-2" /> Novo Lançamento
          </button>
        </div>

        <TransactionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }} onAddTransaction={fetchData} initialData={editingTransaction} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard title="Entradas" value={entradas} color="bg-[#E8F5F1]" textColor="text-[#1B806A]" />
          <SummaryCard title="Saídas" value={saidas} color="bg-[#FDECEF]" textColor="text-[#D14343]" />
          <SummaryCard title="Lucro" value={entradas - saidas} color="bg-[#F0F7FF]" textColor="text-[#3B82F6]" />
          <SummaryCard title="A Pagar" value={aPagar} color="bg-[#FFF1E6]" textColor="text-[#E67E22]" />
        </div>

        <div className="bg-white rounded-[35px] border border-[#F1E7E4] shadow-xl overflow-hidden mb-12">
          <table className="w-full text-left font-bold border-collapse">
            <thead>
              <tr className="border-b border-[#F1E7E4] text-[#A17C7C] text-[9px] uppercase tracking-widest italic font-black">
                <th className="px-8 py-6 text-left">Descrição</th>
                <th className="px-8 py-6 text-center">Valor</th>
                <th className="px-8 py-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF8F5]">
              {loading ? (
                <tr><td colSpan={3} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#D4A5A5]" /></td></tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-[#4A3737] uppercase">{t.description}</span>
                        <span className="text-[8px] font-black bg-[#F1E7E4] px-2 py-0.5 rounded text-[#A17C7C] w-fit mt-1">{t.sector}</span>
                      </div>
                    </td>
                    <td className={`px-8 py-5 text-center font-black ${Number(t.amount) > 0 ? "text-[#1B806A]" : "text-[#D14343]"}`}>
                      {Math.abs(Number(t.amount || 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => { setEditingTransaction(t); setIsModalOpen(true); }} className="p-2 bg-[#F1E7E4] rounded-lg"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(t.id)} className="p-2 bg-red-50 text-red-500 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-white/60 backdrop-blur-md border border-white/40 py-4 px-8 rounded-2xl shadow-lg z-[100] flex justify-between items-center">
        <p className="text-[9px] font-black text-[#6B4F4F] uppercase">© 2026 NATÁLIA PAIÃO | CNPJ: 42.804.763/0001-35</p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/fernando-hugo" target="_blank" className="text-[#6B4F4F]"><Github size={16} /></a>
          <a href="https://www.instagram.com/anubis.tec/" target="_blank" className="text-[#6B4F4F]"><Instagram size={16} /></a>
          <p className="text-[10px] font-black uppercase">Anubis <span className="text-[#A17C7C]">Tech</span></p>
        </div>
      </footer>
    </div>
  );
}

function SummaryCard({ title, value, color, textColor }: any) {
  return (
    <div className={`${color} p-5 rounded-[25px] border border-white shadow-sm`}>
      <p className={`text-[8px] uppercase font-black ${textColor} opacity-60 tracking-widest`}>{title}</p>
      <p className={`text-lg font-black ${textColor}`}>{value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
    </div>
  );
}