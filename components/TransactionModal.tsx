"use client";

import React, { useState } from "react";
import { X, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: () => void;
}

export function TransactionModal({ isOpen, onClose, onAddTransaction }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"entrada" | "saida">("entrada");
  const [formData, setFormData] = useState({
    desc: "",
    value: "",
    cat: "Fixos",
    payMethod: "PIX",
    date: new Date().toISOString().split('T')[0],
    nfe: "",
    obs: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.desc || !formData.value) return;
    
    setLoading(true);
    const isSaida = type === "saida";
    const numericValue = Number(formData.value.replace(',', '.'));

    // EXECUÇÃO ANUBIS: Envio de 100% dos dados para o banco [cite: 2026-02-13]
    const { error } = await supabase
      .from('financial_records')
      .insert([{
        description: formData.desc,
        sector: formData.cat, // Mapeado para os setores da sua planilha
        due_date: formData.date,
        amount: isSaida ? -Math.abs(numericValue) : Math.abs(numericValue),
        status: isSaida ? "Pendente" : "Pago",
        paid: !isSaida, 
        payment_method: formData.payMethod,
        invoice_number: formData.nfe, // Coluna enviada ao banco
        notes: formData.obs // Coluna enviada ao banco
      }]);

    if (!error) {
      onAddTransaction(); 
      setFormData({ 
        desc: "", value: "", cat: "Fixos", payMethod: "PIX", 
        date: new Date().toISOString().split('T')[0], nfe: "", obs: "" 
      });
      onClose();
    } else {
      alert("Erro Crítico Anubis: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
      <div className="bg-[#FAF8F5] w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden border border-white max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center px-8 py-6 border-b border-[#F1E7E4]">
          <h2 className="text-2xl font-black text-[#6B4F4F] tracking-tighter uppercase text-xs tracking-[0.3em]">Novo Lançamento</h2>
          <button onClick={onClose} className="text-[#A17C7C] hover:text-[#6B4F4F] transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5 font-bold">
          {/* SELETOR DE FLUXO */}
          <div className="flex bg-[#E4D5D1]/30 p-1.5 rounded-2xl gap-2 border border-[#F1E7E4]">
            <button type="button" onClick={() => setType("entrada")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${type === "entrada" ? "bg-[#10B981] text-white shadow-lg" : "text-[#A17C7C]"}`}><TrendingUp size={16} /> Entrada</button>
            <button type="button" onClick={() => setType("saida")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${type === "saida" ? "bg-[#EF4444] text-white shadow-lg" : "text-[#A17C7C]"}`}><TrendingDown size={16} /> Saída</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[9px] font-black text-[#6B4F4F] uppercase tracking-[0.2em] mb-2 opacity-50">Descrição *</label>
              <input required value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-[#E4D5D1]/50 outline-none focus:border-[#D4A5A5] bg-white text-[#4A3737]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-[#6B4F4F] uppercase tracking-[0.2em] mb-2 opacity-50">Valor (R$) *</label>
                <input required value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} placeholder="0,00" className="w-full px-6 py-4 rounded-2xl border-2 border-[#E4D5D1]/50 bg-white" />
              </div>
              <div>
                <label className="block text-[9px] font-black text-[#6B4F4F] uppercase tracking-[0.2em] mb-2 opacity-50">Setor/Categoria *</label>
                <select value={formData.cat} onChange={(e) => setFormData({...formData, cat: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-[#E4D5D1]/50 bg-white text-xs">
                  {/* Setores extraídos da sua planilha */}
                  <option value="Bonificações">Bonificações</option>
                  <option value="Departamento Pessoal">Departamento Pessoal</option>
                  <option value="Divulgação/Marketing">Divulgação/Marketing</option>
                  <option value="Enel">Enel</option>
                  <option value="Fixos">Fixos</option>
                  <option value="Impostos Empresa">Impostos Empresa</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Melhorias">Melhorias</option>
                  <option value="Motoboy">Motoboy</option>
                  <option value="Taxas Bancárias">Taxas Bancárias</option>
                  <option value="Taxas ifood">Taxas ifood</option>
                  <option value="Variáveis">Variáveis</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-[#6B4F4F] uppercase tracking-[0.2em] mb-2 opacity-50">Forma de Pagamento</label>
                <select value={formData.payMethod} onChange={(e) => setFormData({...formData, payMethod: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-[#E4D5D1]/50 bg-white">
                  <option value="PIX">PIX</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Boleto">Boleto</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-black text-[#6B4F4F] uppercase tracking-[0.2em] mb-2 opacity-50">Vencimento</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-6 py-4 rounded-2xl border-2 border-[#E4D5D1]/50 bg-white" />
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-black text-[#6B4F4F] uppercase tracking-[0.2em] mb-2 opacity-50">Número da NF-e</label>
              <input value={formData.nfe} onChange={(e) => setFormData({...formData, nfe: e.target.value})} placeholder="000.000.000" className="w-full px-6 py-4 rounded-2xl border-2 border-[#E4D5D1]/50 bg-white" />
            </div>

            <div>
              <label className="block text-[9px] font-black text-[#6B4F4F] uppercase tracking-[0.2em] mb-2 opacity-50">Observações</label>
              <textarea value={formData.obs} onChange={(e) => setFormData({...formData, obs: e.target.value})} rows={2} className="w-full px-6 py-4 rounded-2xl border-2 border-[#E4D5D1]/50 bg-white resize-none font-medium" />
            </div>
          </div>

          <button type="submit" disabled={loading} className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] text-white shadow-2xl transition-all flex justify-center items-center gap-3 ${type === "entrada" ? "bg-[#10B981]" : "bg-[#EF4444]"}`}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Finalizar Lançamento Anubis"}
          </button>
        </form>
      </div>
    </div>
  );
}