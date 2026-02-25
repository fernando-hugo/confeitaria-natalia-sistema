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
    await supabase.from('financial_records').update({ paid: true }).eq('id', id);
    fetchContas();
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] p-4 md:px-12 py-8 flex flex-col">
      <div className="flex-grow pb-32">
        <Image src="/logo_natalia_paiao_2024_rosa.png" alt="Logo" width={180} height={120} className="object-contain mb-8" />
        <div className="space-y-4">
          {loading ? <Loader2 className="animate-spin mx-auto mt-20" size={32} /> : 
          contas.map((conta) => (
            <div key={conta.id} className="bg-white p-6 rounded-[30px] border border-[#F1E7E4] flex items-center justify-between shadow-sm">
              <div className="flex flex-col">
                <h3 className="text-lg font-black text-[#4A3737] uppercase italic">{conta.description}</h3>
                <p className="text-[10px] font-bold text-[#A17C7C] flex items-center gap-1 mt-1"><Clock size={12}/> Vence: {new Date(conta.due_date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-xl font-black text-[#D14343]">R$ {Math.abs(conta.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <button onClick={() => handlePagar(conta.id)} className="bg-[#10B981] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-md flex items-center gap-2">
                  <CheckCircle size={14}/> Pagar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnubisFooterCompact />
    </main>
  );
}

// COMPONENTE REUTILIZÁVEL CORRIGIDO
function AnubisFooterCompact() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#F1E7E4] py-3 px-8 z-[100] flex flex-col md:flex-row justify-between items-center gap-2">
      <div className="flex items-center gap-3">
        <ShieldCheck size={14} className="text-[#D4A5A5]" />
        <p className="text-[9px] font-black text-black uppercase tracking-[0.2em]">© 2026 Anubis Tech | CNPJ: 42.804.763/0001-35</p>
      </div>
      <div className="flex gap-4 opacity-50">
        <Github size={14} className="text-black" />
        <Instagram size={14} className="text-black" />
      </div>
    </footer>
  );
}