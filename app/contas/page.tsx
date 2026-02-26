"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, TrendingDown, Loader2, CheckCircle, ShieldCheck, Github, Instagram } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ContasAPagar() {
  const [contas, setContas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContas = async () => {
    setLoading(true);
    const { data } = await supabase.from('financial_records').select('*').eq('paid', false).lt('amount', 0).order('due_date', { ascending: true });
    if (data) setContas(data);
    setLoading(false);
  };

  useEffect(() => { fetchContas(); }, []);

  const handlePagar = async (id: string) => {
    const { error } = await supabase.from('financial_records').update({ paid: true }).eq('id', id);
    if (!error) setContas((prev) => prev.filter(item => item.id !== id));
  };

  const getStatus = (date: string) => {
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const venc = new Date(date); venc.setHours(0,0,0,0);
    const diff = Math.ceil((venc.getTime() - hoje.getTime()) / 86400000);
    if (diff < 0) return { label: "Vencida", style: "bg-red-50 text-red-600 border-red-200" };
    if (diff === 0) return { label: "Hoje", style: "bg-amber-50 text-amber-600 border-amber-200" };
    return { label: `Em ${diff} dias`, style: "bg-blue-50 text-blue-600 border-blue-100" };
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] p-4 md:px-12 py-8 text-left flex flex-col animate-in fade-in">
      <div className="flex-grow pb-40">
        <header className="mb-10 text-left">
          <Image src="/logo_natalia_paiao_2024_rosa.png" alt="Logo" width={200} height={140} className="object-contain" priority />
          <p className="text-[#A17C7C] font-black mt-2 uppercase text-[9px] tracking-[0.3em]">Anubis Gestão de Saídas</p>
        </header>
        <div className="space-y-4">
          {loading ? <div className="p-20 flex justify-center"><Loader2 className="animate-spin" size={40} /></div> : 
          contas.map((conta) => {
            const status = getStatus(conta.due_date);
            return (
              <div key={conta.id} className="bg-white p-6 rounded-[30px] border border-[#F1E7E4] shadow-sm flex items-center justify-between group text-left">
                <div className="flex items-center gap-6">
                  <div className="bg-[#FDECEF] p-4 rounded-2xl text-[#D14343]"><TrendingDown size={24} /></div>
                  <div className="text-left">
                    <h3 className="text-xl font-black text-[#4A3737] uppercase italic mb-0.5">{conta.description}</h3>
                    {conta.notes && <p className="text-[11px] font-bold text-[#6B4F4F] mb-1.5 italic">{conta.notes}</p>}
                    <span className="text-[9px] font-black text-[#A17C7C] uppercase tracking-wider block">Lançado: {new Date(conta.created_at).toLocaleDateString('pt-BR')} | NF: {conta.invoice_number}</span>
                    <span className="text-[10px] font-bold text-[#A17C7C] flex items-center gap-1 opacity-60 mt-1"><Clock size={12}/> Venc: {new Date(conta.due_date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 text-right">
                  <p className="text-2xl font-black text-[#D14343]">R$ {Math.abs(conta.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <div className="flex items-center gap-3">
                    <span className={`${status.style} text-[9px] font-black px-4 py-1.5 rounded-full border uppercase`}>{status.label}</span>
                    <button onClick={() => handlePagar(conta.id)} className="bg-[#10B981] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all flex items-center gap-2"><CheckCircle size={14}/> Pagar</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 bg-[#FAF8F5]/90 backdrop-blur-xl py-8 px-12 flex flex-col md:flex-row justify-between items-center border-t border-[#E4D5D1] z-[100] shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-6">
          <div className="bg-[#4A3737] p-3 rounded-2xl shadow-xl"><ShieldCheck size={22} className="text-[#D4A5A5]" /></div>
          <div className="text-left">
            <p className="text-[11px] font-black text-black uppercase tracking-[0.3em]">© 2026 <span className="text-[#6B4F4F]">Anubis Tech</span></p>
            <p className="text-[9px] font-bold text-black uppercase tracking-widest mt-1">CNPJ: 42.804.763/0001-35</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://github.com/fernando-hugo" className="text-black"><Github size={20} /></a>
          <a href="https://www.instagram.com/anubis.tec/" className="text-black"><Instagram size={20} /></a>
        </div>
      </footer>
    </main>
  );
}