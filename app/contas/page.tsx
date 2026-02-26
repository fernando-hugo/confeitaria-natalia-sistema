"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Clock, TrendingDown, Loader2, CheckCircle, ShieldCheck, Github, Instagram } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ContasAPagar() {
  const [contas, setContas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContas = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("financial_records")
        .select("*")
        .eq("paid", false)
        .lt("amount", 0)
        .order("due_date", { ascending: true });

      if (error) throw error;
      setContas(data || []);
    } catch (err) {
      console.error("Erro Contas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContas();
  }, [fetchContas]);

  const handlePagar = async (id: string) => {
    const { error } = await supabase.from("financial_records").update({ paid: true }).eq("id", id);
    if (!error) setContas((prev) => prev.filter((item) => item.id !== id));
  };

  const getStatus = (date: string | null) => {
    if (!date) return { label: "Sem vencimento", style: "bg-gray-50 text-gray-600 border-gray-200" };
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const venc = new Date(date);
    if (isNaN(venc.getTime())) return { label: "Data inválida", style: "bg-gray-50 text-gray-600 border-gray-200" };
    venc.setHours(0, 0, 0, 0);
    const diff = Math.ceil((venc.getTime() - hoje.getTime()) / 86400000);
    if (diff < 0) return { label: "Vencida", style: "bg-red-50 text-red-600 border-red-200" };
    if (diff === 0) return { label: "Hoje", style: "bg-amber-50 text-amber-600 border-amber-200" };
    return { label: `Em ${diff} dias`, style: "bg-blue-50 text-blue-600 border-blue-100" };
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] p-4 md:px-12 py-8 text-left flex flex-col">
      <div className="flex-grow pb-40">
        <header className="mb-10">
          <Image src="/logo_natalia_paiao_2024_rosa.png" alt="Logo" width={200} height={140} className="object-contain" priority />
          <p className="text-[#A17C7C] font-black mt-2 uppercase text-[9px] tracking-[0.3em]">Anubis Gestão de Saídas</p>
        </header>

        <div className="space-y-4">
          {loading ? (
            <div className="p-20 flex justify-center"><Loader2 className="animate-spin" size={40} /></div>
          ) : contas.length === 0 ? (
            <div className="text-center text-[#A17C7C] font-bold text-sm py-20">Nenhuma conta pendente.</div>
          ) : (
            contas.map((conta) => {
              const status = getStatus(conta.due_date);
              return (
                <div key={conta.id} className="bg-white p-6 rounded-[30px] border border-[#F1E7E4] shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="bg-[#FDECEF] p-4 rounded-2xl text-[#D14343]"><TrendingDown size={24} /></div>
                    <div>
                      <h3 className="text-xl font-black text-[#4A3737] uppercase italic">{conta.description}</h3>
                      {conta.notes && <p className="text-[11px] font-bold text-[#6B4F4F] italic">{conta.notes}</p>}
                      <span className="text-[9px] font-black text-[#A17C7C] uppercase block mt-1">Lançado: {conta.created_at ? new Date(conta.created_at).toLocaleDateString("pt-BR") : "-"} | NF: {conta.invoice_number || "-"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <p className="text-2xl font-black text-[#D14343]">R$ {Math.abs(Number(conta.amount || 0)).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                    <div className="flex items-center gap-3">
                      <span className={`${status.style} text-[9px] font-black px-4 py-1.5 rounded-full border uppercase`}>{status.label}</span>
                      <button onClick={() => handlePagar(conta.id)} className="bg-[#10B981] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all flex items-center gap-2"><CheckCircle size={14} /> Pagar</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-[#F1E7E4] py-3 px-8 z-[100] flex justify-between items-center">
        <div className="flex items-center gap-3"><ShieldCheck size={14} className="text-[#D4A5A5]" /><p className="text-[9px] font-black text-black uppercase tracking-[0.2em]">© 2026 Anubis Tech</p></div>
        <div className="flex gap-4"><Github size={15} /><Instagram size={15} /></div>
      </footer>
    </main>
  );
}