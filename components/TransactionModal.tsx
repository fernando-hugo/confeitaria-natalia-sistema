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
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative bg-[#FAF8F5] w-full max-w-[500px] rounded-[32px] shadow-2xl my-8 flex flex-col">
        <div className="flex justify-between items-center px-8 py-6 border-b border-[#F1E7E4]">
          <h2 className="font-black text-[#6B4F4F] uppercase text-[12px] tracking-widest">Novo Lançamento</h2>
          <button onClick={onClose} className="text-[#A17C7C] hover:text-[#6B4F4F]"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex bg-[#E4D5D1]/30 p-1.5 rounded-2xl gap-2">
            <button type="button" onClick={() => setType("entrada")} className={`flex-1 py-3 rounded-xl font-black text-[10px] ${type === "entrada" ? "bg-[#10B981] text-white" : "text-[#A17C7C]"}`}>ENTRADA</button>
            <button type="button" onClick={() => setType("saida")} className={`flex-1 py-3 rounded-xl font-black text-[10px] ${type === "saida" ? "bg-[#EF4444] text-white" : "text-[#A17C7C]"}`}>SAÍDA</button>
          </div>

          <div className="space-y-4">
            <input placeholder="DESCRIÇÃO *" required value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#E4D5D1]/50 outline-none focus:border-[#D4A5A5]" />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="VALOR (R$)" required value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} className="p-4 rounded-xl border-2 border-[#E4D5D1]/50" />
              <select value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="p-4 rounded-xl border-2 border-[#E4D5D1]/50 bg-white">
                <option>Fixos</option><option>Variáveis</option><option>Insumos</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select value={formData.payMethod} onChange={e => setFormData({...formData, payMethod: e.target.value})} className="p-4 rounded-xl border-2 border-[#E4D5D1]/50 bg-white">
                <option>PIX</option><option>Cartão</option><option>Dinheiro</option>
              </select>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="p-4 rounded-xl border-2 border-[#E4D5D1]/50" />
            </div>
            <input placeholder="NÚMERO DA NF-E" value={formData.nfe} onChange={e => setFormData({...formData, nfe: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#E4D5D1]/50" />
            <textarea placeholder="OBSERVAÇÕES" value={formData.obs} onChange={e => setFormData({...formData, obs: e.target.value})} className="w-full p-4 rounded-xl border-2 border-[#E4D5D1]/50 h-24 resize-none" />
          </div>

          <button type="submit" disabled={loading} className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all ${type === "entrada" ? "bg-[#10B981]" : "bg-[#EF4444]"}`}>
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "FINALIZAR LANÇAMENTO ANUBIS"}
          </button>
        </form>
      </div>
    </div>
  );
}