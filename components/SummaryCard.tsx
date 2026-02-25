type Props = {
  title: string;
  value: string;
  bgColor: string;
};

export default function SummaryCard({ title, value, bgColor }: Props) {
  return (
    <div className={`rounded-xl p-6 shadow-sm ${bgColor}`}>
      <p className="text-sm text-[#6B4F4F] mb-2">{title}</p>
      <h3 className="text-2xl font-bold text-[#3E2E2E]">{value}</h3>
    </div>
  );
}
