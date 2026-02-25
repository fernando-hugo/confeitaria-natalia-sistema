export type Transaction = {
  id: number;
  description: string;
  category: string;
  invoiceNumber?: string; // 👈 novo campo
  dueDate?: string;
  amount: number;
  type: "entrada" | "saida";
  status: "pago" | "pendente" | "vencido";
};
