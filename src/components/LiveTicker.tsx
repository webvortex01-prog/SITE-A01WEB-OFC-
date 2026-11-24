import { useState, useEffect } from 'react';
import { Sparkles, Flame, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface ActivityItem {
  id: string;
  name: string;
  city: string;
  action: string;
  timeAgo: string;
  type: 'bonus' | 'order' | 'quote';
}

export default function LiveTicker() {
  const activities: ActivityItem[] = [
    { id: '1', name: 'Lucas M.', city: 'São Paulo/SP', action: 'garantiu o Bônus de 1 Ano de Hospedagem Grátis (Barbearia)', timeAgo: 'há 4 min', type: 'bonus' },
    { id: '2', name: 'Hamburgueria Burger Smash', city: 'Curitiba/PR', action: 'solicitou o Combo Supremo com Painel do CEO', timeAgo: 'há 11 min', type: 'order' },
    { id: '3', name: 'Dra. Beatriz Santos', city: 'Belo Horizonte/MG', action: 'garantiu a vaga de inauguração com Domínio Grátis', timeAgo: 'há 19 min', type: 'bonus' },
    { id: '4', name: 'Studio Black Tattoo', city: 'Rio de Janeiro/RJ', action: 'iniciou desenvolvimento de One Page de Alta Conversão', timeAgo: 'há 27 min', type: 'quote' },
    { id: '5', name: 'Dr. Leonardo Castilho', city: 'Porto Alegre/RS', action: 'fechou projeto para Advocacia de Elite', timeAgo: 'há 38 min', type: 'order' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activities.length]);

  const current = activities[currentIndex];

  return (
    <div className="bg-[#04060d] border-b border-cyan-500/15 py-2 px-4 text-xs font-mono relative overflow-hidden z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Live Pulse */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider hidden sm:inline">
            AO VIVO • ATIVIDADE NO SITE:
          </span>
        </div>

        {/* Dynamic Activity Item */}
        <div className="flex-1 truncate text-center sm:text-left transition-all duration-300">
          <span className="text-white font-semibold">{current.name}</span>{' '}
          <span className="text-slate-500">({current.city})</span>{' '}
          <span className="text-cyan-300">{current.action}</span>{' '}
          <span className="text-slate-500 text-[10px]">[{current.timeAgo}]</span>
        </div>

        {/* Right Urgency Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] shrink-0">
          <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>Restam apenas 2 Bônus de Hospedagem</span>
        </div>
      </div>
    </div>
  );
}
