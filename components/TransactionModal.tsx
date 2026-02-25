"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ADICIONE initialData NAS PROPS
export function TransactionModal({ isOpen, onClose, onAddTransaction, initialData }: any) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [sector, setSector] = useState("Produção");

  // SE HOUVER DADOS INICIAIS, PREENCHE O FORMULÁRIO PARA EDIÇÃO
  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      setAmount(initialData.amount.toString());
      setSector(initialData.sector);
    } else {
      setDescription("");
      setAmount("");
      setSector("Produção");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = { description, amount: parseFloat(amount), sector };

    if (initialData) {
      // LOGICA DE ATUALIZAÇÃO (UPDATE)
      await supabase.from('financial_records').update(data).eq('id', initialData.id);
    } else {
      // LOGICA DE NOVO LANÇAMENTO (INSERT)
      await supabase.from('financial_records').insert([data]);
    }

    onAddTransaction();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[30px] p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-black text-[#4A3737] uppercase italic mb-6">
          {initialData ? "Editar Registro" : "Novo Lançamento"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            className="p-4 bg-[#FAF8F5] rounded-xl border border-[#F1E7E4] font-bold outline-none focus:border-[#D4A5A5]" 
            placeholder="Descrição" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
          <input 
            className="p-4 bg-[#FAF8F5] rounded-xl border border-[#F1E7E4] font-bold outline-none focus:border-[#D4A5A5]" 
            type="number" 
            step="0.01" 
            placeholder="Valor (ex: -50 para saída)" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
          />
          <select 
            className="p-4 bg-[#FAF8F5] rounded-xl border border-[#F1E7E4] font-bold outline-none" 
            value={sector} 
            onChange={(e) => setSector(e.target.value)}
          >
            <option value="Produção">Produção</option>
            <option value="Insumos">Insumos</option>
            <option value="Fixas">Contas Fixas</option>
            <option value="Marketing">Marketing</option>
          </select>
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 p-4 font-black uppercase text-[10px] text-[#A17C7C]">Cancelar</button>
            <button type="submit" className="flex-1 p-4 bg-[#D4A5A5] text-white rounded-xl font-black uppercase text-[10px] shadow-lg">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}