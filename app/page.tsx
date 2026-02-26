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
      const { data, error } = await supabase
        .from("financial_records")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error("Erro Anubis Cloud:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (confirm("ANUBIS SECURITY: Deseja realmente excluir este registro permanentemente?")) {
      const { error } = await supabase.from("financial_records").delete().eq("id", id);
      if (!error) fetchData();
    }
  };

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const entradas = transactions.filter((t) => Number(t.amount) > 0).reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const saidas = transactions.filter((t) => Number(t.amount) < 0).reduce((acc, t) => acc + Math.abs(Number(t.amount || 0)), 0);
  const aPagar = transactions.filter((t) => !t.paid && Number(t.amount) < 0).reduce((acc, t) => acc + Math.abs(Number(t.amount || 0)), 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-left">
      <div className="flex-grow p-4 md:px-12 py-8 flex flex-col gap-8 pb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2">
            <Image src="/logo_natalia_paiao_2024_rosa.png" alt="Logo" width={220} height={140} className="object-contain" unoptimized />
            <p className="text-[8px] font-black text-[#A17C7C] tracking-[0.4em] uppercase opacity-60 italic">Anubis Intelligence System</p>
          </div>
          <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="bg-[#D4A5A5] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-[#C99494] transition-all active:scale-95 flex items-center gap-2">
            <Plus size={18} strokeWidth={4} /> Novo Lançamento
          </button>
        </div>

        <TransactionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }} onAddTransaction={fetchData} initialData={editingTransaction} />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard title="Entradas" value={entradas} color="bg-[#E8F5F1]" textColor="text-[#1B806A]" icon={<TrendingUp size={16} />} />
          <SummaryCard title="Saídas" value={saidas} color="bg-[#FDECEF]" textColor="text-[#D14343]" icon={<TrendingDown size={16} />} />
          <SummaryCard title="Lucro" value={entradas - saidas} color="bg-[#F0F7FF]" textColor="text-[#3B82F6]" icon={<Wallet size={16} />} />
          <SummaryCard title="A Pagar" value={aPagar} color="bg-[#FFF1E6]" textColor="text-[#E67E22]" icon={<AlertCircle size={18} />} />
        </div>

        <div className="bg-white rounded-[35px] border border-[#F1E7E4] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-bold border-collapse">
              <thead>
                <tr className="border-b border-[#F1E7E4] text-[#A17C7C] text-[9px] uppercase tracking-[0.2em] font-black italic">
                  <th className="px-8 py-6">Descrição & Detalhes</th>
                  <th className="px-8 py-6 text-center">Valor</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF8F5]">
                {loading ? (
                  <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#D4A5A5]" size={32} /></td></tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-[#4A3737] uppercase italic leading-tight">{t.description}</span>
                          {t.notes && <span className="text-[10px] font-bold text-[#6B4F4F] mt-1 italic opacity-80">{t.notes}</span>}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[8px] font-black bg-[#F1E7E4] px-2 py-0.5 rounded text-[#A17C7C] uppercase">{t.sector}</span>
                            <span className="text-[8px] font-black text-[#A17C7C] uppercase tracking-widest opacity-60">
                              {t.created_at ? new Date(t.created_at).toLocaleDateString("pt-BR") : "-"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className={`px-8 py-5 text-center text-sm font-black ${Number(t.amount) > 0 ? "text-[#1B806A]" : "text-[#D14343]"}`}>
                        {Math.abs(Number(t.amount || 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className={`text-[8px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest border ${t.paid ? "bg-green-50 text-green-600 border-green-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}>
                          {t.paid ? "Pago" : "Pendente"}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => handleEdit(t)} className="p-2.5 bg-[#F1E7E4] text-[#6B4F4F] hover:bg-[#D4A5A5] hover:text-white rounded-xl transition-all shadow-sm"><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(t.id)} className="p-2.5 bg-red-50 text-[#D14343] hover:bg-[#D14343] hover:text-white rounded-xl transition-all shadow-sm"><Trash2 size={14} /></button>
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
      <AnubisFooterCompact />
    </div>
  );
}

function AnubisFooterCompact() {
  return (
    <footer className="relative bg-white/80 backdrop-blur-lg border-t border-[#F1E7E4] py-3 px-8 z-[100]">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-black">
        <p className="text-[9px] font-black uppercase tracking-[0.2em]">© 2026 <span className="text-[#A17C7C]">Anubis Tech</span></p>
        <div className="flex gap-4"><Github size={15} /><Instagram size={15} /></div>
      </div>
    </footer>
  );
}

function SummaryCard({ title, value, color, textColor, icon }: any) {
  return (
    <div className={`${color} p-5 rounded-[25px] border border-white shadow-sm flex justify-between items-start`}>
      <div>
        <p className={`text-[8px] uppercase font-black ${textColor} opacity-60 tracking-[0.2em]`}>{title}</p>
        <p className={`text-lg font-black ${textColor}`}>{value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
      </div>
      <div className={`${textColor}`}>{icon}</div>
    </div>
  );
}