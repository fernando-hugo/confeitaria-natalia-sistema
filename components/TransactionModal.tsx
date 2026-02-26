"use client";

import React, { useState, useEffect } from "react";
import { X, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ModalProps { isOpen: boolean; onClose: () => void; onAddTransaction: () => void; initialData?: any; }

export function TransactionModal({ isOpen, onClose, onAddTransaction, initialData }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"entrada" | "saida">("entrada");
  const [formData, setFormData] = useState({ desc: "", value: "", cat: "Fixos", payMethod: "PIX", date: new Date().toISOString().split("T")[0], nfe: "", obs: "" });

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
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
    } else {
      setFormData({ desc: "", value: "", cat: "Fixos", payMethod: "PIX", date: new Date().toISOString().split("T")[0], nfe: "", obs: "" });
    }
  }, [isOpen, initialData]); // initialData aqui é seguro se o fetchData no Home for useCallback

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.desc || !formData.value) return;
    setLoading(true);
    const numericValue = Number(formData.value.replace(",", "."));
    const payload = {
      description: formData.desc, sector: formData.cat, due_date: formData.date,
      amount: type === "saida" ? -Math.abs(numericValue) : Math.abs(numericValue),
      status: type === "saida" ? "Pendente" : "Pago", paid: type !== "saida",
      payment_method: formData.payMethod, invoice_number: formData.nfe, notes: formData.obs
    };

    const { error } = initialData?.id 
      ? await supabase.from("financial_records").update(payload).eq("id", initialData.id)
      : await supabase.from("financial_records").insert([payload]);

    if (!error) { onAddTransaction(); onClose(); }
    else { alert("Erro: " + error.message); }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
      <div className="bg-[#FAF8F5] w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden border border-white max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center px-8 py-6 border-b border-[#F1E7E4]">
          <h2 className="font-black text-[#6B4F4F] uppercase text-[10px] tracking-[0.3em]">{initialData ? "Editar Lançamento" : "Novo Lançamento"}</h2>
          <button onClick={onClose} className="text-[#A17C7C]"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5 font-bold overflow-y-auto">
          <div className="flex bg-[#E4D5D1]/30 p-1.5 rounded-2xl gap-2">
            <button type="button" onClick={() => setType("entrada")} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest ${type === "entrada" ? "bg-[#10B981] text-white shadow-lg" : "text-[#A17C7C]"}`}>Entrada</button>
            <button type="button" onClick={() => setType("saida")} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest ${type === "saida" ? "bg-[#EF4444] text-white shadow-lg" : "text-[#A17C7C]"}`}>Saída</button>
          </div>
          <div>
            <label className="block text-[9px] font-black text-[#6B4F4F] uppercase tracking-[0.2em] mb-2">Descrição *</label>
            <input required value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} className="w-full px-6 py-4 rounded-2xl border-2 border-[#E4D5D1]/50 bg-white" />
          </div>
          <div>
            <label className="block text-[9px] font-black text-[#6B4F4F] uppercase tracking-[0.2em] mb-2">Valor (R$) *</label>
            <input required value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="w-full px-6 py-4 rounded-2xl border-2 border-[#E4D5D1]/50 bg-white" />
          </div>
          <button type="submit" disabled={loading} className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] text-white ${type === "entrada" ? "bg-[#10B981]" : "bg-[#EF4444]"}`}>
            {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : initialData ? "Atualizar" : "Finalizar"}
          </button>
        </form>
      </div>
    </div>
  );
}