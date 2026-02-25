import { Transaction } from "@/types/transaction";

export const transactions: Transaction[] = [
  {
    id: 1,
    description: "Venda de bolo de chocolate",
    category: "Vendas",
    amount: 10,
    type: "entrada",
    status: "pago",
  },
  {
    id: 2,
    description: "Compra de farinha e açúcar",
    category: "Ingredientes",
    dueDate: "27/02/2026",
    amount: 320.5,
    type: "saida",
    status: "pendente",
  },
  {
    id: 3,
    description: "Conta de luz - Enel",
    category: "Energia",
    dueDate: "14/02/2026",
    amount: 485,
    type: "saida",
    status: "vencido",
  },
];