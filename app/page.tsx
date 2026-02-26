"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Wallet, AlertCircle, Trash2, TrendingUp, TrendingDown, Loader2, BrainCircuit, Clock, Info, ShieldCheck, Download, Github, Instagram, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TransactionModal } from "@/components/TransactionModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('financial_records').select('*').order('created_at', { ascending: false });
    if (data) setTransactions(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const entradas = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + Number(t.amount), 0);
  const saidas = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);
  const aPagar = transactions.filter(t => !t.paid && t.amount < 0).reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);

  const generatePDF = () => {
    const doc = new jsPDF();
    const filtered = transactions.filter(t => {
      const date = t.due_date || t.created_at.split('T')[0];
      return date >= dateRange.start && date <= dateRange.end;
    });
    autoTable(doc, {
      head: [['DATA', 'DESCRIÇÃO', 'SETOR', 'VALOR', 'STATUS']],
      body: filtered.map(t => [
        new Date(t.due_date || t.created_at).toLocaleDateString('pt-BR'),
        t.description,
        t.sector,
        `R$ ${Math.abs(t.amount).toLocaleString('pt-BR')}`,
        t.paid ? 'PAGO' : 'PENDENTE'
      ]),
      headStyles: { fillColor: [74, 55, 55] }
    });
    doc.save(`Relatorio_Anubis_Natalia.pdf`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-left animate-in fade-in duration-700">
      <div className="flex-grow p-4 md:px-12 py-8 flex flex-col gap-8 pb-40">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-4 text-left">
            <Image src="/logo_natalia_paiao_2024_rosa.png" alt="Logo" width={240} height={160} className="object-contain" priority />
            <div className="flex items-center gap-2">
              <h2 className="text-[9px] font-black text-[#A17C7C] tracking-[0.4em] uppercase opacity-60">Anubis Tech</h2>
              <span className="h-px w-6 bg-[#D4A5A5] opacity-20"></span>
              <p className="text-[8px] font-bold text-[#D4A5A5] uppercase tracking-[0.2em] italic">Intelligence System</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-[28px] border border-[#F1E7E4] shadow-xl flex items-center gap-6">
            <div className="flex gap-3">
              <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="text-[9px] font-black bg-[#FAF8F5] rounded-xl p-2 outline-none uppercase" />
              <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="text-[9px] font-black bg-[#FAF8F5] rounded-xl p-2 outline-none uppercase" />
            </div>
            <button onClick={generatePDF} className="bg-[#4A3737] text-white p-3.5 rounded-xl hover:bg-[#6B4F4F] transition-all flex items-center gap-2">
              <Download size={16} />
              <span className="text-[9px] font-black uppercase tracking-widest">Relatório</span>
            </button>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-[#D4A5A5] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
            <Plus size={18} className="inline mr-2" strokeWidth={4} /> Novo Lançamento
          </button>
        </div>
        <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTransaction={fetchData} />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SummaryCard title="Entradas" value={entradas} color="bg-[#E8F5F1]" textColor="text-[#1B806A]" icon={<TrendingUp size={18}/>} />
          <SummaryCard title="Saídas" value={saidas} color="bg-[#FDECEF]" textColor="text-[#D14343]" icon={<TrendingDown size={18}/>} />
          <SummaryCard title="Lucro" value={entradas - saidas} color="bg-[#F0F7FF]" textColor="text-[#3B82F6]" icon={<Wallet size={18}/>} />
          <SummaryCard title="A Pagar" value={aPagar} color="bg-[#FFF1E6]" textColor="text-[#E67E22]" icon={<AlertCircle size={18}/>} />
        </div>
        <div className="bg-white rounded-[40px] border border-[#F1E7E4] shadow-2xl overflow-hidden">
          <table className="w-full text-left font-bold">
            <thead>
              <tr className="border-b border-[#F1E7E4] text-[#A17C7C] text-[10px] uppercase tracking-[0.2em] font-black italic">
                <th className="px-10 py-6 italic text-left">Descrição & Rastreabilidade</th>
                <th className="px-10 py-6 text-center">Valor</th>
                <th className="px-10 py-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF8F5]">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                  <td className="px-10 py-5 text-left">
                    <div className="flex flex-col text-left">
                      <span className="text-base font-black text-[#4A3737] uppercase italic leading-tight">{t.description}</span>
                      {t.notes && <span className="text-[11px] font-bold text-[#6B4F4F] mt-0.5">{t.notes}</span>}
                      <span className="text-[9px] font-black text-[#A17C7C] uppercase tracking-widest mt-1.5 opacity-60">
                        {new Date(t.created_at).toLocaleDateString('pt-BR')} {new Date(t.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} | {t.sector} {t.invoice_number && `| NF: ${t.invoice_number}`}
                      </span>
                    </div>
                  </td>
                  <td className={`px-10 py-5 text-center font-black ${t.amount > 0 ? 'text-[#1B806A]' : 'text-[#D14343]'}`}>
                    {Math.abs(t.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-10 py-5 text-center">
                    <span className={`text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest ${t.paid ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                      {t.paid ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AnubisFooter />
    </div>
  );
}

function SummaryCard({ title, value, color, textColor, icon }: any) {
  return (
    <div className={`${color} p-8 rounded-[35px] border border-white shadow-lg flex justify-between items-start text-left hover:scale-[1.02] transition-all`}>
      <div className="text-left"><p className={`text-[10px] uppercase font-black ${textColor} opacity-60 tracking-widest`}>{title}</p><p className={`text-2xl font-black ${textColor} mt-1`}>{value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></div>
      <div className={`${textColor} p-3 rounded-2xl bg-white/40 shadow-sm`}>{icon}</div>
    </div>
  );
}

function AnubisFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#FAF8F5]/90 backdrop-blur-xl py-8 px-12 flex flex-col md:flex-row justify-between items-center border-t border-[#E4D5D1] z-[100] shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-6">
        <div className="bg-[#4A3737] p-3 rounded-2xl shadow-xl"><ShieldCheck size={22} className="text-[#D4A5A5]" /></div>
        <div className="text-left">
          <p className="text-[11px] font-black text-black uppercase tracking-[0.3em]">© 2026 <span className="text-[#6B4F4F]">Anubis Tech</span></p>
          <p className="text-[9px] font-bold text-black uppercase tracking-widest mt-1">CNPJ: 42.804.763/0001-35 | Todos os direitos reservados.</p>
        </div>
      </div>
      <div className="flex items-center gap-10 mt-6 md:mt-0">
        <div className="flex gap-6">
          <a href="https://github.com/fernando-hugo" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#D4A5A5]"><Github size={20} /></a>
          <a href="https://www.instagram.com/anubis.tec/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#D4A5A5]"><Instagram size={20} /></a>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-[#A17C7C] uppercase tracking-widest mb-1 italic">Status: <span className="text-[#10B981]">Operacional</span></p>
        </div>
      </div>
    </footer>
  );
}