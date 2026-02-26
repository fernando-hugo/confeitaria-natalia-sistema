"use client";

import React, { useState, useEffect } from "react";
import { X, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: () => void;
  initialData?: any;
}

export function TransactionModal({ isOpen, onClose, onAddTransaction, initialData }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"entrada" | "saida">("entrada");

  const [formData, setFormData] = useState({
    desc: "",
    value: "",
    cat: "Fixos",
    payMethod: "PIX",
    date: new Date().toISOString().split("T")[0],
    nfe: "",
    obs: ""
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setType(initialData.amount < 0 ? "saida" : "entrada");
      setFormData({
        desc: initialData.description || "",
        value: Math.abs(initialData.amount || 0).toString(),
        cat: initialData.sector || "Fixos",
        payMethod: initialData.payment_method || "PIX",
        date: initialData.due_date || new Date().toISOString().split("T")[0],
        nfe: initialData.invoice_number || "",
        obs: initialData.notes || ""
      });
    } else if (isOpen) {
      setFormData({
        desc: "",
        value: "",
        cat: "Fixos",
        payMethod: "PIX",
        date: new Date().toISOString().split("T")[0],
        nfe: "",
        obs: ""
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const numericValue = Number(formData.value.replace(",", "."));
    
    const payload = {
      description: formData.desc,
      sector: formData.cat,
      due_date: formData.date,
      amount: type === "saida" ? -Math.abs(numericValue) : Math.abs(numericValue),
      status: type === "saida" ? "Pendente" : "Pago",
      paid: type !== "saida",
      payment_method: formData.payMethod,
      invoice_number: formData.nfe,
      notes: formData.obs
    };

    const { error } = initialData?.id 
      ? await supabase.from("financial_records").update(payload).eq("id", initialData.id)
      : await supabase.from("financial_records").insert([payload]);

    if (!error) {
      onAddTransaction();
      onClose();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm overflow-y-auto px-4 py-10 flex justify-center items-start">
      <div className="bg-[#FAF8F5] w-full max-w-[500px] rounded-[32px] shadow-2xl flex flex-col relative animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-8 py-6 border-b border-[#F1E7E4]">
          <h2 className="font-black text-[#6B4F4F] uppercase text-[12px] tracking-widest">
            {initialData ? "Editar Lançamento" : "Novo Lançamento"}
          </h2>
          <button onClick={onClose} className="text-[#A17C7C] hover:text-[#6B4F4F] transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 text-left">
          <div className="flex bg-[#E4D5D1]/30 p-1.5 rounded-2xl gap-2 border border-[#F1E7E4]">
            <button type="button" onClick={() => setType("entrada")} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${type === "entrada" ? "bg-[#10B981] text-white shadow-lg" : "text-[#A17C7C]"}`}>
              ENTRADA
            </button>
            <button type="button" onClick={() => setType("saida")} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${type === "saida" ? "bg-[#EF4444] text-white shadow-lg" : "text-[#A17C7C]"}`}>
              SAÍDA
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[9px] font-black text-[#A17C7C] uppercase tracking-widest ml-2">Descrição *</label>
              <input required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#E4D5D1]/50 outline-none focus:border-[#D4A5A5] text-[#4A3737] font-bold" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-black text-[#A17C7C] uppercase tracking-widest ml-2">Valor (R$) *</label>
                <input required value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#E4D5D1]/50 text-[#4A3737] font-bold" />
              </div>
              <div>
                <label className="text-[9px] font-black text-[#A17C7C] uppercase tracking-widest ml-2">Setor *</label>
                <select value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#E4D5D1]/50 bg-white text-[#4A3737] font-bold">
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
                  <option value="Taxas iFood">Taxas iFood</option>
                  <option value="Variáveis">Variáveis</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-black text-[#A17C7C] uppercase tracking-widest ml-2">Pagamento</label>
                <select value={formData.payMethod} onChange={e => setFormData({...formData, payMethod: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#E4D5D1]/50 bg-white text-[#4A3737] font-bold">
                  <option>PIX</option><option>Cartão</option><option>Dinheiro</option><option>Boleto</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black text-[#A17C7C] uppercase tracking-widest ml-2">Vencimento</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#E4D5D1]/50 text-[#4A3737] font-bold" />
              </div>
            </div>

            <div>
              <label className="text-[9px] font-black text-[#A17C7C] uppercase tracking-widest ml-2">NF-e</label>
              <input value={formData.nfe} onChange={e => setFormData({...formData, nfe: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#E4D5D1]/50 text-[#4A3737] font-bold" />
            </div>

            <div>
              <label className="text-[9px] font-black text-[#A17C7C] uppercase tracking-widest ml-2">Observações</label>
              <textarea value={formData.obs} onChange={e => setFormData({...formData, obs: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#E4D5D1]/50 h-24 resize-none text-[#4A3737] font-bold" />
            </div>
          </div>

          <button type="submit" disabled={loading} className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all uppercase tracking-[0.2em] text-[11px] ${type === "entrada" ? "bg-[#10B981]" : "bg-[#EF4444]"}`}>
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "FINALIZAR LANÇAMENTO"}
          </button>
        </form>
      </div>
    </div>
  );
}