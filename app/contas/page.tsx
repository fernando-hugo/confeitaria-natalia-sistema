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
    // Busca registros não pagos e que sejam saídas (valores negativos)
    const { data } = await supabase
      .from('financial_records')
      .select('*')
      .eq('paid', false)
      .lt('amount', 0)
      .order('due_date', { ascending: true });
    
    if (data) setContas(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchContas();
  }, []);

  const handlePagar = async (id: string) => {
    const { error } = await supabase
      .from('financial_records')
      .update({ paid: true })
      .eq('id', id);
    
    if (!error) {
      fetchContas();
    }
  };

  const getStatus = (date: string) => {
    const hoje = new Date(); 
    hoje.setHours(0,0,0,0);
    const venc = new Date(date); 
    venc.setHours(0,0,0,0);
    const diff = Math.ceil((venc.getTime() - hoje.getTime()) / 86400000);
    
    if (diff < 0) return { label: "Vencida", style: "bg-red-50 text-red-600 border-red-200" };
    if (diff === 0) return { label: "Hoje", style: "bg-amber-50 text-amber-600 border-amber-200" };
    return { label: `Em ${diff} dias`, style: "bg-blue-50 text-blue-600 border-blue-100" };
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] p-4 md:px-12 py-8 flex flex-col">
      <div className="flex-grow pb-32">
        <header className="mb-10 text-left">
          <Image 
            src="/logo_natalia_paiao_2024_rosa.png" 
            alt="Logo" 
            width={180} 
            height={120} 
            className="object-contain" 
            priority 
          />
          <p className="text-[#A17C7C] font-black mt-2 uppercase text-[9px] tracking-[0.3em]">
            Anubis Gestão de Saídas
          </p>
        </header>

        <div className="space-y-4 text-left">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#D4A5A5]" size={40} />
            </div>
          ) : contas.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[30px] border border-dashed border-[#F1E7E4]">
              <p className="text-[#A17C7C] font-bold uppercase text-[10px] tracking-widest">Nenhuma conta pendente</p>
            </div>
          ) : (
            contas.map((conta) => {
              const status = getStatus(conta.due_date);
              return (
                <div key={conta.id} className="bg-white p-6 rounded-[30px] border border-[#F1E7E4] flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-6">
                    <div className="bg-[#FDECEF] p-4 rounded-2xl text-[#D14343]">
                      <TrendingDown size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-black text-[#4A3737] uppercase italic leading-tight">
                        {conta.description}
                      </h3>
                      <div className="flex flex-col gap-1 mt-1">
                        <span className="text-[10px] font-bold text-[#A17C7C] flex items-center gap-1 opacity-80">
                          <Clock size={12}/> Vence: {new Date(conta.due_date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="text-[9px] font-black bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#F1E7E4] text-[#A17C7C] uppercase w-fit">
                          {conta.sector}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                    <p className="text-2xl font-black text-[#D14343] tracking-tighter">
                      R$ {Math.abs(conta.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className={`${status.style} text-[8px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest`}>
                        {status.label}
                      </span>
                      <button 
                        onClick={() => handlePagar(conta.id)} 
                        className="bg-[#10B981] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all flex items-center gap-2"
                      >
                        <CheckCircle size={14}/> Pagar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FOOTER COMPACTO COM RETURN CORRIGIDO */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#F1E7E4] py-3 px-8 z-[100] flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-3">
          <ShieldCheck size={14} className="text-[#D4A5A5]" />
          <p className="text-[9px] font-black text-black uppercase tracking-[0.2em]">
            © 2026 <span className="text-[#A17C7C]">Anubis Tech</span> | <span className="opacity-60">CNPJ: 42.804.763/0001-35</span>
          </p>
        </div>
        <div className="flex items-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
          <Github size={14} className="text-black" />
          <Instagram size={14} className="text-black" />
        </div>
      </footer>
    </main>
  );
}