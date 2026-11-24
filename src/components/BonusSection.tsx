import { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Gift,
  Sparkles,
  Server,
  Globe,
  Mail,
  ShieldCheck,
  Video,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Copy,
  Check
} from 'lucide-react';
import { EXCLUSIVE_BONUS_ITEMS, getTotalBonusValue } from '../utils/calculator';
import { sound } from '../utils/audio';
import { Scroll3DStage } from '../utils/scrollytelling';

export default function BonusSection() {
  const [copiedCode, setCopiedCode] = useState(false);
  const totalBonusValue = getTotalBonusValue();

  const handleClaimBonus = () => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#8a2be2', '#f59e0b', '#ffffff'],
      });
    } catch {
      // Ignore
    }

    const msg = encodeURIComponent(
      `Olá 01 WEB! Acessei através do site e quero resgatar o BÔNUS EXCLUSIVO DE R$ 1.030,00 ` +
      `(1 Ano de Hospedagem Edge CDN + 1 Ano de Domínio Próprio + E-mail Corporativo Grátis). ` +
      `Código VIP: [BONUS_SITE_01WEB]. Como podemos iniciar meu projeto?`
    );
    window.open(`https://wa.me/5566999697087?text=${msg}`, '_blank');
  };

  const handleCopyCode = () => {
    sound.playSelect();
    navigator.clipboard.writeText('BONUS_SITE_01WEB');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const bonusIcons: Record<string, React.ElementType> = {
    hosting: Server,
    domain: Globe,
    email: Mail,
    ssl: ShieldCheck,
    training: Video,
  };

  return (
    <section id="bonus-exclusivo" className="py-24 relative overflow-x-clip bg-gradient-to-b from-[#05060b] via-[#090d1c] to-[#05060b] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <Scroll3DStage intensity="medium">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono uppercase tracking-wider shadow-lg shadow-amber-500/10">
            <Gift className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="font-bold">EXCLUSIVO PARA QUEM CHEGOU ATRAVÉS DESTE SITE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight">
            Pacote de Bônus VIP:{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-amber-300 to-purple-400 bg-clip-text text-transparent">
              R$ {totalBonusValue.toLocaleString('pt-BR')},00 Grátis
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Se você fechar o seu projeto através deste site oficial,{' '}
            <strong className="text-white">nós bancamos 100% da sua infraestrutura digital</strong>.
            Você não paga servidor, não paga domínio e já entra no ar com presença de grande empresa.
          </p>

          {/* Included Infra Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#0e1424] border border-cyan-500/30 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">
              Infraestrutura Completa Inclusa:{' '}
              <strong className="text-emerald-400 font-bold">1 Ano de Hospedagem + Domínio Próprio + SSL</strong>
            </span>
          </div>
        </div>
        </Scroll3DStage>

        {/* 5 Exclusive Bonus Cards */}
        <Scroll3DStage intensity="dramatic">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {EXCLUSIVE_BONUS_ITEMS.map((item, idx) => {
            const Icon = bonusIcons[item.id] || Sparkles;
            return (
              <div
                key={item.id}
                className="relative rounded-3xl p-6 bg-[#0b0f1e]/90 border border-slate-800 hover:border-cyan-500/50 shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-mono text-slate-500 uppercase">
                      Bônus #0{idx + 1}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 line-through">
                    Valor Normal: R$ {item.realValue}
                  </span>
                  <span className="font-bold text-emerald-400">
                    Neste Site: R$ 0,00
                  </span>
                </div>
              </div>
            );
          })}

          {/* 6th Highlight Card: Summary Callout */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-cyan-950/40 via-[#0d1424] to-purple-950/40 border-2 border-cyan-400 shadow-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-cyan-400 text-slate-950 text-xs font-mono font-bold inline-block">
                ECONOMIA TOTAL NO SEU BOLSO
              </span>
              <h3 className="text-2xl font-black font-heading text-white">
                R$ {totalBonusValue.toLocaleString('pt-BR')},00 em Economia
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Você investe apenas a partir de <strong className="text-cyan-300">R$ 180</strong> no seu site
                e leva de presente mais de <strong className="text-emerald-400">R$ 1.000 em tecnologia</strong>{' '}
                e hospedagem profissional.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleClaimBonus}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-400/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Resgatar Este Bônus no WhatsApp</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-[11px] font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copiedCode ? 'Código [BONUS_SITE_01WEB] Copiado!' : 'Copiar Cupom: BONUS_SITE_01WEB'}</span>
              </button>
            </div>
          </div>
        </div>
        </Scroll3DStage>

        {/* Guarantee Banner */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Garantia Blindada de Satisfação 01 WEB</div>
              <p className="text-xs text-slate-400">
                Seu projeto só é publicado após sua aprovação total de layout, textos e velocidade.
              </p>
            </div>
          </div>

          <a
            href="#orcamento"
            onClick={() => sound.playClick()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-cyan-300 hover:text-white transition-colors shrink-0"
          >
            <span>Ver Preços no Simulador</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
