"use client";

import React, { useState, useEffect } from "react";
import { X, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: () => void;
  initialData?: any; // ✅ AGORA EXISTE
}

export function TransactionModal({
  isOpen,
  onClose,
  onAddTransaction,
  initialData
}: ModalProps) {

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

  // ✅ AUTO PREENCHER QUANDO FOR EDIÇÃO
useEffect(() => {
  if (!isOpen) return;

  if (initialData) {
    const isSaida = initialData.amount < 0;

    setType(isSaida ? "saida" : "entrada");

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
    // reset quando não for edição
    setType("entrada");
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
    if (!formData.desc || !formData.value) return;

    setLoading(true);

    const isSaida = type === "saida";
    const numericValue = Number(formData.value.replace(",", "."));

    const payload = {
      description: formData.desc,
      sector: formData.cat,
      due_date: formData.date,
      amount: isSaida ? -Math.abs(numericValue) : Math.abs(numericValue),
      status: isSaida ? "Pendente" : "Pago",
      paid: !isSaida,
      payment_method: formData.payMethod,
      invoice_number: formData.nfe,
      notes: formData.obs
    };

    let error;

    // ✅ SE ESTIVER EDITANDO → UPDATE
    if (initialData?.id) {
      const response = await supabase
        .from("financial_records")
        .update(payload)
        .eq("id", initialData.id);

      error = response.error;
    } 
    // ✅ SE NÃO → INSERT
    else {
      const response = await supabase
        .from("financial_records")
        .insert([payload]);

      error = response.error;
    }

    if (!error) {
      onAddTransaction();
      onClose();
    } else {
      alert("Erro: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
      <div className="bg-[#FAF8F5] w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden border border-white max-h-[95vh] overflow-y-auto">

        <div className="flex justify-between items-center px-8 py-6 border-b border-[#F1E7E4]">
          <h2 className="text-2xl font-black text-[#6B4F4F] tracking-tighter uppercase text-xs tracking-[0.3em]">
            {initialData ? "Editar Lançamento" : "Novo Lançamento"}
          </h2>

          <button
            onClick={onClose}
            className="text-[#A17C7C] hover:text-[#6B4F4F] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5 font-bold">

          {/* Tipo */}
          <div className="flex bg-[#E4D5D1]/30 p-1.5 rounded-2xl gap-2 border border-[#F1E7E4]">
            <button
              type="button"
              onClick={() => setType("entrada")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                type === "entrada"
                  ? "bg-[#10B981] text-white shadow-lg"
                  : "text-[#A17C7C]"
              }`}
            >
              <TrendingUp size={16} />
              Entrada
            </button>

            <button
              type="button"
              onClick={() => setType("saida")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                type === "saida"
                  ? "bg-[#EF4444] text-white shadow-lg"
                  : "text-[#A17C7C]"
              }`}
            >
              <TrendingDown size={16} />
              Saída
            </button>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-[9px] font-black text-[#6B4F4F] uppercase tracking-[0.2em] mb-2 opacity-50">
              Descrição *
            </label>
            <input
              required
              value={formData.desc}
              onChange={(e) =>
                setFormData({ ...formData, desc: e.target.value })
              }
              className="w-full px-6 py-4 rounded-2xl border-2 border-[#E4D5D1]/50 outline-none focus:border-[#D4A5A5] bg-white text-[#4A3737]"
            />
          </div>

          {/* Valor */}
          <div>
            <label className="block text-[9px] font-black text-[#6B4F4F] uppercase tracking-[0.2em] mb-2 opacity-50">
              Valor (R$) *
            </label>
            <input
              required
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value })
              }
              placeholder="0,00"
              className="w-full px-6 py-4 rounded-2xl border-2 border-[#E4D5D1]/50 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] text-white shadow-2xl transition-all flex justify-center items-center gap-3 ${
              type === "entrada" ? "bg-[#10B981]" : "bg-[#EF4444]"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : initialData ? (
              "Atualizar Lançamento"
            ) : (
              "Finalizar Lançamento"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}