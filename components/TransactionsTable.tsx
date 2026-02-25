"use client";

import StatusBadge from "./StatusBadge";

type Transaction = {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: "entrada" | "saida";
  status: "pendente" | "pago";
  invoiceNumber?: string;
  dueDate?: string;
};

type Props = {
  transactions: Transaction[];
  onDelete: (id: string) => void;
};

export default function TransactionsTable({ transactions, onDelete }: Props) {
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-md overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[#F8EFEA] text-[#6B4F4F] text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-6 py-4">Descrição</th>
            <th className="text-left px-6 py-4">Categoria</th>
            <th className="text-left px-6 py-4">Nota Fiscal</th>
            <th className="text-left px-6 py-4">Vencimento</th>
            <th className="text-left px-6 py-4">Valor</th>
            <th className="text-left px-6 py-4">Status</th>
            <th className="text-left px-6 py-4">Ações</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr
              key={t.id}
              className="border-t border-[#F1E7E4] hover:bg-[#FAF5F2] transition"
            >
              <td className="px-6 py-4 font-medium text-[#3E2E2E]">
                {t.description}
              </td>

              <td className="px-6 py-4 text-[#8A6F6F]">
                {t.category}
              </td>

              <td className="px-6 py-4 text-[#8A6F6F]">
                {t.invoiceNumber || "-"}
              </td>

              <td className="px-6 py-4 text-[#8A6F6F]">
                {t.dueDate || "-"}
              </td>

              <td
                className={`px-6 py-4 font-semibold ${
                  t.type === "entrada"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {t.type === "entrada" ? "+" : "-"}{" "}
                {t.amount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>

              <td className="px-6 py-4">
                <StatusBadge status={t.status} />
              </td>

              <td className="px-6 py-4">
                <button
                  onClick={() => onDelete(t.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}