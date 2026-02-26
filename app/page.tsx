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
    } catch (err) { console.error("Erro Anubis:", err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (confirm("ANUBIS SECURITY: Deseja realmente excluir?")) {
      const { error } = await supabase.from("financial_records").delete().eq("id", id);
      if (!error) fetchData();
    }
  };

  const entradas = transactions.filter((t) => Number(t.amount) > 0).reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const saidas = transactions.filter((t) => Number(t.amount) < 0).reduce((acc, t) => acc + Math.abs(Number(t.amount || 0)), 0);
  const aPagar = transactions.filter((t) => !t.paid && Number(t.amount) < 0).reduce((acc, t) => acc + Math.abs(Number(t.amount || 0)), 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] relative font-sans overflow-x-hidden">
      <div className="flex-grow p-4 md:px-12 py-6 flex flex-col gap-6 pb-48 text-left">
        
        {/* Header - Ajustado para empilhar no mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <Image src="/logo_natalia_paiao_2024_rosa.png" alt="Logo" width={180} height={100} className="object-contain" unoptimized />
            <p className="text-[7px] font-black text-[#A17C7C] tracking-[0.3em] uppercase opacity-60 italic text-center sm:text-left">Anubis Intelligence System</p>
          </div>
          <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="w-full sm:w-auto bg-[#D4A5A5] text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-[#C99494] active:scale-95 transition-all flex justify-center items-center gap-2">
            <Plus size={16} strokeWidth={4} /> Novo Lançamento
          </button>
        </div>

        <TransactionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }} onAddTransaction={fetchData} initialData={editingTransaction} />

        {/* Grid de Cards - 2 colunas no mobile, 4 no desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <SummaryCard title="Entradas" value={entradas} color="bg-[#E8F5F1]" textColor="text-[#1B806A]" icon={<TrendingUp size={14} />} />
          <SummaryCard title="Saídas" value={saidas} color="bg-[#FDECEF]" textColor="text-[#D14343]" icon={<TrendingDown size={14} />} />
          <SummaryCard title="Lucro" value={entradas - saidas} color="bg-[#F0F7FF]" textColor="text-[#3B82F6]" icon={<Wallet size={14} />} />
          <SummaryCard title="A Pagar" value={aPagar} color="bg-[#FFF1E6]" textColor="text-[#E67E22]" icon={<AlertCircle size={15} />} />
        </div>

        {/* Tabela Responsiva */}
        <div className="bg-white rounded-[25px] md:rounded-[35px] border border-[#F1E7E4] shadow-xl overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-bold border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-[#F1E7E4] text-[#A17C7C] text-[8px] md:text-[9px] uppercase tracking-widest font-black bg-[#FAF8F5]/50">
                  <th className="px-5 md:px-8 py-5">Detalhes</th>
                  <th className="px-5 md:px-8 py-5 text-center">Valor</th>
                  <th className="px-5 md:px-8 py-5 text-center">Status</th>
                  <th className="px-5 md:px-8 py-5 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF8F5]">
                {loading ? (
                  <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#D4A5A5]" size={28} /></td></tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="px-5 md:px-8 py-4">
                        <div className="flex flex-col">
                          <span className="text-[11px] md:text-sm font-black text-[#4A3737] uppercase leading-tight">{t.description}</span>
                          <span className="text-[7px] md:text-[8px] font-black bg-[#F1E7E4] px-2 py-0.5 rounded text-[#A17C7C] uppercase w-fit mt-1">{t.sector}</span>
                        </div>
                      </td>
                      <td className={`px-5 md:px-8 py-4 text-center text-[11px] md:text-sm font-black ${Number(t.amount) > 0 ? "text-[#1B806A]" : "text-[#D14343]"}`}>
                        {Math.abs(Number(t.amount || 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </td>
                      <td className="px-5 md:px-8 py-4 text-center">
                        <span className={`text-[7px] md:text-[8px] px-2 py-1 rounded-full font-black uppercase tracking-widest border ${t.paid ? "bg-green-50 text-green-600 border-green-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}>
                          {t.paid ? "Pago" : "Pendente"}
                        </span>
                      </td>
                      <td className="px-5 md:px-8 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(t)} className="p-1.5 md:p-2 bg-[#F1E7E4] text-[#6B4F4F] rounded-lg"><Pencil size={12} /></button>
                          <button onClick={() => handleDelete(t.id)} className="p-1.5 md:p-2 bg-red-50 text-[#D14343] rounded-lg"><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Responsivo Glass */}
      <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl bg-white/70 backdrop-blur-md border border-white/40 py-3 px-6 rounded-2xl shadow-lg z-[100] flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-[8px] font-black text-[#6B4F4F] tracking-widest uppercase text-center">
          © 2026 NATÁLIA PAIÃO | <span className="opacity-60 text-[7px]">CNPJ: 42.804.763/0001-35</span>
        </p>
        <div className="flex items-center gap-4">
          <div className="flex gap-3">
            <a href="https://github.com/fernando-hugo" target="_blank" className="text-[#6B4F4F]"><Github size={14} /></a>
            <a href="https://www.instagram.com/anubis.tec/" target="_blank" className="text-[#6B4F4F]"><Instagram size={14} /></a>
          </div>
          <div className="h-3 w-[1px] bg-[#6B4F4F]/20" />
          <p className="text-[9px] font-black text-black uppercase tracking-widest italic">Anubis <span className="text-[#A17C7C]">Tech</span></p>
        </div>
      </footer>
    </div>
  );
}

function SummaryCard({ title, value, color, textColor, icon }: any) {
  return (
    <div className={`${color} p-4 md:p-5 rounded-[20px] md:rounded-[25px] border border-white shadow-sm flex flex-col items-center sm:items-start`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={textColor}>{icon}</span>
        <p className={`text-[7px] md:text-[8px] uppercase font-black ${textColor} opacity-60 tracking-widest`}>{title}</p>
      </div>
      <p className={`text-xs md:text-lg font-black ${textColor} truncate w-full text-center sm:text-left`}>
        {value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </p>
    </div>
  );
}