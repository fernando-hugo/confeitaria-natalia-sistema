"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Wallet, AlertCircle, Trash2, TrendingUp, TrendingDown, Loader2, ShieldCheck, Github, Instagram, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TransactionModal } from "@/components/TransactionModal";

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  // BUSCA DE DADOS COM TRAVA DE SEGURANÇA [cite: 2026-02-13]
  async function fetchData() {
    try {
      setLoading(true);
      // Timeout de segurança: se o banco não responder, o loading para em 8s
      const timeout = setTimeout(() => setLoading(false), 8000);

      const { data, error } = await supabase
        .from('financial_records')
        .select('*')
        .order('created_at', { ascending: false });

      clearTimeout(timeout);

      if (error) {
        console.error("Erro Supabase:", error.message);
      } else {
        setTransactions(data || []);
      }
    } catch (err) {
      console.error("Erro de Conexão Anubis:", err);
    } finally {
      setLoading(false);
    }
  }

  // UseEffect simplificado para evitar loops na Vercel [cite: 2026-02-13]
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("ANUBIS SECURITY: Excluir registro?")) {
      const { error } = await supabase.from('financial_records').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const entradas = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + Number(t.amount), 0);
  const saidas = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);
  const aPagar = transactions.filter(t => !t.paid && t.amount < 0).reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <div className="flex-grow p-4 md:px-12 py-8 flex flex-col gap-8 pb-32">
        
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 text-left">
          <div className="flex flex-col gap-2">
            <Image src="/logo_natalia_paiao_2024_rosa.png" alt="Logo" width={220} height={140} className="object-contain" priority />
            <p className="text-[8px] font-black text-[#A17C7C] tracking-[0.4em] uppercase opacity-60 italic">Anubis Intelligence</p>
          </div>
          <button onClick={() => { setEditingTransaction(null); setIsModalOpen(true); }} className="bg-[#D4A5A5] text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] shadow-xl hover:scale-95 transition-all">
            <Plus size={18} className="inline mr-2" /> Novo Lançamento
          </button>
        </header>

        <TransactionModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }} onAddTransaction={fetchData} initialData={editingTransaction} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard title="Entradas" value={entradas} color="bg-[#E8F5F1]" textColor="text-[#1B806A]" icon={<TrendingUp size={16}/>} />
          <SummaryCard title="Saídas" value={saidas} color="bg-[#FDECEF]" textColor="text-[#D14343]" icon={<TrendingDown size={16}/>} />
          <SummaryCard title="Lucro" value={entradas - saidas} color="bg-[#F0F7FF]" textColor="text-[#3B82F6]" icon={<Wallet size={16}/>} />
          <SummaryCard title="A Pagar" value={aPagar} color="bg-[#FFF1E6]" textColor="text-[#E67E22]" icon={<AlertCircle size={18}/>} />
        </div>

        <div className="bg-white rounded-[35px] border border-[#F1E7E4] shadow-xl overflow-hidden">
          <div className="overflow-x-auto min-h-[300px] flex flex-col justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-4 text-[#A17C7C]">
                <Loader2 className="animate-spin" size={40} />
                <p className="font-black text-[10px] uppercase tracking-widest">Sincronizando Banco de Dados...</p>
              </div>
            ) : (
              <table className="w-full text-left font-bold border-collapse">
                <thead>
                  <tr className="border-b border-[#F1E7E4] text-[#A17C7C] text-[9px] uppercase font-black italic">
                    <th className="px-8 py-6">Descrição</th>
                    <th className="px-8 py-6 text-center">Valor</th>
                    <th className="px-8 py-6 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF8F5]">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="px-8 py-5">
                        <span className="text-sm font-black text-[#4A3737] uppercase italic leading-tight">{t.description}</span>
                        <p className="text-[9px] text-[#A17C7C]">{t.sector}</p>
                      </td>
                      <td className={`px-8 py-5 text-center font-black ${t.amount > 0 ? 'text-[#1B806A]' : 'text-[#D14343]'}`}>
                        {Math.abs(t.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="px-8 py-5 flex justify-center gap-3">
                        <button onClick={() => handleEdit(t)} className="p-2 bg-[#F1E7E4] rounded-lg text-[#6B4F4F]"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(t.id)} className="p-2 bg-red-50 rounded-lg text-[#D14343]"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <AnubisFooterCompact />
    </div>
  );
}

function SummaryCard({ title, value, color, textColor, icon }: any) {
  return (
    <div className={`${color} p-5 rounded-[25px] flex justify-between items-center shadow-sm`}>
      <div className="text-left">
        <p className={`text-[8px] uppercase font-black ${textColor} opacity-60 tracking-widest`}>{title}</p>
        <p className={`text-lg font-black ${textColor}`}>{value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
      </div>
      <div className={`${textColor} p-2 bg-white/50 rounded-lg`}>{icon}</div>
    </div>
  );
}

function AnubisFooterCompact() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#F1E7E4] py-3 px-8 z-[100] flex justify-between items-center">
      <div className="flex items-center gap-3">
        <ShieldCheck size={14} className="text-[#D4A5A5]" />
        <p className="text-[9px] font-black text-black uppercase tracking-[0.2em]">© 2026 Anubis Tech</p>
      </div>
      <div className="flex gap-4 opacity-50"><Github size={14} /><Instagram size={14} /></div>
    </footer>
  );
}