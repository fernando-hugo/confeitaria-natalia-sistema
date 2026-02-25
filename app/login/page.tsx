"use client";

import { useState, useEffect } from "react";
import { Search, AlertCircle, Clock, TrendingDown, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Verifique se este caminho está correto

export default function ContasAPagar() {
  const [contas, setContas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .select('*')
        .eq('paid', false)
        .lt('amount', 0)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setContas(data || []);
    } catch (err: any) {
      console.error("Erro ao buscar contas:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContas();
  }, []);

  // FUNÇÃO CRÍTICA DO BOTÃO PAGAR
  const handleLiquidarConta = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_records')
        .update({ 
          paid: true, 
          status: 'Pago',
          payment_date: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        alert("Erro no Banco: " + error.message);
        return;
      }

      // IMPORTANTE: Atualiza o estado local para o item sumir imediatamente [cite: 2026-02-13]
      setContas((prev) => prev.filter(item => item.id !== id));
      
    } catch (err: any) {
      alert("Falha na execução: " + err.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] p-4 md:px-12 py-8 text-left">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-[#6B4F4F] tracking-tighter uppercase">Contas a Pagar</h1>
        <p className="text-[#A17C7C] font-bold mt-1 uppercase text-[10px] tracking-widest">Sincronização Anubis Tech Ativa</p>
      </header>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#D4A5A5]" size={40} /></div>
        ) : contas.length === 0 ? (
          <div className="p-20 text-center opacity-30 font-black uppercase text-xs tracking-widest">Nenhuma conta pendente encontrada.</div>
        ) : (
          contas.map((conta) => (
            <div key={conta.id} className="bg-white p-6 rounded-[30px] border border-[#F1E7E4] shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="bg-[#FDECEF] p-4 rounded-2xl text-[#D14343]"><TrendingDown size={24} /></div>
                <div>
                  <h3 className="text-lg font-black text-[#4A3737] lowercase">{conta.description}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#A17C7C] bg-[#FAF8F5] px-3 py-1 rounded-lg border border-[#F1E7E4]">{conta.sector}</span>
                    <span className="text-[10px] font-bold text-[#A17C7C] flex items-center gap-1"><Clock size={12}/> {new Date(conta.due_date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <p className="text-2xl font-black text-[#D14343] tracking-tighter">R$ {Math.abs(conta.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                {/* BOTÃO COM CHAMADA CORRIGIDA */}
                <button 
                  onClick={() => handleLiquidarConta(conta.id)}
                  className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
                >
                  <CheckCircle size={16} strokeWidth={3}/> Pagar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}