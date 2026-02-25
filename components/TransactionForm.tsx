"use client";

import { useState } from "react";
import { Transaction } from "@/types/transaction";

type Props = {
  onAdd: (transaction: Transaction) => void;
};

export default function TransactionForm({ onAdd }: Props) {

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [type, setType] = useState<"entrada" | "saida">("entrada");
  const [status, setStatus] = useState<"pago" | "pendente" | "vencido">("pendente");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount) return;

    const newTransaction: Transaction = {
  id: Date.now(),
  description,
  category,
  invoiceNumber, // 👈 novo campo
  amount: Number(amount),
  type,
  status,
};

    onAdd(newTransaction);

    setDescription("");
    setCategory("");
    setAmount("");
    setInvoiceNumber("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm mt-8 grid grid-cols-1 md:grid-cols-6 gap-4"
    >
      <input
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded-md"
      />

      <input
        placeholder="Categoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded-md"
      />

      <input
        placeholder="Valor"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 rounded-md"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value as any)}
        className="border p-2 rounded-md"
      >
        <option value="entrada">Entrada</option>
        <option value="saida">Saída</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as any)}
        className="border p-2 rounded-md"
      >
        <option value="pago">Pago</option>
        <option value="pendente">Pendente</option>
        <option value="vencido">Vencido</option>
      </select>

      <button
        type="submit"
        className="bg-[#D4A5A5] text-white rounded-md font-semibold"
      >
        Adicionar
      </button>
    </form>
  );
}