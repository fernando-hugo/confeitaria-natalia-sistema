type Props = {
  status: "pago" | "pendente" | "vencido";
};

export default function StatusBadge({ status }: Props) {
  const base =
    "px-3 py-1 rounded-full text-xs font-semibold";

  if (status === "pago") {
    return (
      <span className={`${base} bg-green-100 text-green-700`}>
        Pago
      </span>
    );
  }

  if (status === "pendente") {
    return (
      <span className={`${base} bg-yellow-100 text-yellow-700`}>
        Pendente
      </span>
    );
  }

  return (
    <span className={`${base} bg-red-100 text-red-700`}>
      Vencido
    </span>
  );
}