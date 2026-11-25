import { useState } from 'react';
import { MessageCircle, Sparkles, ArrowRight, X } from 'lucide-react';
import { sound } from '../utils/audio';
import { pixelService } from '../services/pixelService';

interface FloatingWhatsAppProps {
  onOpenFunnel: () => void;
}

export default function FloatingWhatsApp({ onOpenFunnel }: FloatingWhatsAppProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  const buildWhatsappHref = () => {
    const utmInfo = pixelService.formatUtmForWhatsApp();
    const directMsg = encodeURIComponent(
      `Olá 01 WEB! Vim pelo site e quero conversar sobre uma estrutura para minha empresa.${utmInfo}`
    );
    return `https://wa.me/5566999697087?text=${directMsg}`;
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {/* High-conversion banner tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2.5 p-3 rounded-xl bg-[#090D1A]/95 border border-cyan-500/30 text-white text-xs shadow-xl backdrop-blur-md max-w-xs animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <div className="flex-1">
            <span className="font-bold text-cyan-300">Consultoria Prioritária:</span>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Faça o diagnóstico do seu negócio e ganhe 1 ano de hospedagem inclusa.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-slate-500 hover:text-slate-300 p-1"
            aria-label="Fechar dica"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Fast Funnel Trigger */}
        <button
          type="button"
          onClick={() => {
            sound.playClick(900);
            onOpenFunnel();
          }}
          className="hidden md:inline-flex items-center gap-2 px-3.5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-bold text-xs shadow-lg transition-all cursor-pointer backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Diagnosticar Meu Negócio</span>
        </button>

        {/* WhatsApp Direct or Funnel Button */}
        <a
          href={buildWhatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            sound.playClick(900);
            pixelService.trackWhatsAppContact('Botão Flutuante WhatsApp');
          }}
          aria-label="Falar com Especialista no WhatsApp"
          className="group inline-flex items-center gap-2.5 px-4 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs shadow-xl shadow-emerald-950/60 transition-all duration-200 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 fill-slate-950 stroke-none" />
          <span className="hidden sm:inline">WhatsApp Oficial</span>
        </a>
      </div>
    </div>
  );
}
