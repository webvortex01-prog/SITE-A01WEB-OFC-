import { useState } from 'react';
import {
  TrendingDown,
  DollarSign,
  Users,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { calculateRevenueLeakage } from '../utils/calculator';
import { sound } from '../utils/audio';
import { leadService } from '../services/leadService';
import { Scroll3DStage } from '../utils/scrollytelling';
import { pixelService } from '../services/pixelService';

export default function LossCalculator() {
  const [visitors, setVisitors] = useState<number>(1500);
  const [ticket, setTicket] = useState<number>(180);

  // Quick Lead Capture inside the Financial Leakage Calculator
  const [quickName, setQuickName] = useState<string>('');
  const [quickPhone, setQuickPhone] = useState<string>('');
  const [quickProblem, setQuickProblem] = useState<string>('');
  const [quickSent, setQuickSent] = useState<boolean>(false);

  const leakage = calculateRevenueLeakage(visitors, ticket);

  const handleVisitorChange = (val: number) => {
    setVisitors(val);
    sound.playClick(400 + val / 15);
    pixelService.trackInitiateCheckout('Calculadora de Prejuízo', 1850);
  };

  const handleTicketChange = (val: number) => {
    setTicket(val);
    sound.playClick(350 + val / 5);
    pixelService.trackInitiateCheckout('Calculadora de Prejuízo', 1850);
  };

  const handleSendRecoveryPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickPhone.trim()) return;

    sound.playSuccess();

    const lossDescription = `Calculou vazamento de R$ ${leakage.lostRevenueMonthly.toLocaleString(
      'pt-BR'
    )}/mês (${leakage.lostLeadsMonthly} clientes perdidos/mês com ${visitors} visitas e ticket de R$ ${ticket}).${
      quickProblem.trim() ? ` Relato: "${quickProblem.trim()}"` : ''
    }`;

    // 1. Save straight to CEO Admin Panel with AI Solution Architect
    const savedLead = leadService.addLead({
      name: quickName.trim(),
      businessName: 'Diagnóstico Financeiro',
      whatsapp: quickPhone.replace(/\D/g, ''),
      segment: 'Diagnóstico de Vazamento de Caixa',
      bottleneck: 'ads_no_conversion',
      bottleneckLabel: `Perdendo ~R$ ${leakage.lostRevenueMonthly.toLocaleString('pt-BR')}/mês em vendas`,
      problemDetails: lossDescription,
      need: 'combo_completo',
      needLabel: 'Estrutura de Alta Conversão + Automação WhatsApp',
      urgency: 'imediato',
      urgencyLabel: 'Imediato (esta semana)',
      investmentTier: '1000_2500',
      investmentRange: 'R$ 1.000 a R$ 2.500',
      budgetEstimate: 1850,
      source: 'calculadora_orcamento',
      diagnosticSummary: lossDescription,
      notes: `Lead capturado na Calculadora de Prejuízo Invisível. Perda anual estimada: R$ ${leakage.potentialRecoveredYearly.toLocaleString(
        'pt-BR'
      )}.`,
    });

    setQuickSent(true);

    // 2. Dispatch straight to RD's Official WhatsApp (5566999697087)
    const waText = encodeURIComponent(
      `🚨 *DIAGNÓSTICO DE VAZAMENTO DE CAIXA — 01 WEB*\n\n` +
        `👤 *Nome:* ${quickName.trim()}\n` +
        `📱 *WhatsApp:* ${quickPhone.trim()}\n` +
        `📊 *Visitantes/mês:* ${visitors.toLocaleString('pt-BR')} pessoas\n` +
        `💰 *Ticket Médio:* R$ ${ticket.toLocaleString('pt-BR')}\n` +
        `⚠️ *Vazamento Calculado:* R$ ${leakage.lostRevenueMonthly.toLocaleString('pt-BR')}/mês (~${leakage.lostLeadsMonthly} clientes perdidos)\n` +
        (quickProblem.trim() ? `📝 *Meu Caso:* ${quickProblem.trim()}\n` : '') +
        `\n🤖 *Solução IA Recomendada:* ${savedLead.aiBlueprint?.recommendedSolution || 'Estrutura 01 WEB'}\n` +
        pixelService.formatUtmForWhatsApp() +
        `\n\n_Quero estancar esse prejuízo e montar minha estrutura com a 01 WEB!_`
    );

    setTimeout(() => {
      window.open(`https://wa.me/5566999697087?text=${waText}`, '_blank', 'noopener,noreferrer');
    }, 350);
  };

  return (
    <section
      id="prejuizo"
      className="py-20 relative overflow-x-clip bg-[#070a14] border-y border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Scroll3DStage intensity="dramatic">
          <div className="rounded-3xl p-6 sm:p-12 bg-gradient-to-br from-[#0c1322] via-[#080b14] to-[#120f24] border border-cyan-500/30 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left: Explanations & Sliders */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>DIAGNÓSTICO FINANCEIRO DO SEU NEGÓCIO</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
                  Quanto dinheiro sua empresa está{' '}
                  <span className="text-rose-400 underline decoration-rose-500/60 decoration-2 underline-offset-4">
                    deixando na mesa
                  </span>{' '}
                  todo mês?
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Quando alguém pesquisa seu serviço no Google ou entra no seu perfil do Instagram
                  e encontra um site amador, lento ou inexistente, ele{' '}
                  <strong className="text-white">compra do seu concorrente</strong>. Ajuste os
                  controles abaixo e veja o impacto real no seu bolso:
                </p>

                {/* Slider 1: Monthly Visitors */}
                <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-cyan-400" />
                      Visitantes / Interessados por mês:
                    </span>
                    <span className="text-cyan-300 font-mono font-bold text-base">
                      {visitors.toLocaleString('pt-BR')} pessoas
                    </span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="10000"
                    step="100"
                    value={visitors}
                    onChange={(e) => handleVisitorChange(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    aria-label="Visitantes mensais"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>200 pessoas</span>
                    <span>5.000 pessoas</span>
                    <span>10.000 pessoas</span>
                  </div>
                </div>

                {/* Slider 2: Ticket Médio */}
                <div className="space-y-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      Valor médio do seu serviço/produto (Ticket Médio):
                    </span>
                    <span className="text-emerald-300 font-mono font-bold text-base">
                      R$ {ticket.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="2000"
                    step="20"
                    value={ticket}
                    onChange={(e) => handleTicketChange(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    aria-label="Ticket Médio"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>R$ 40</span>
                    <span>R$ 1.000</span>
                    <span>R$ 2.000+</span>
                  </div>
                </div>
              </div>

              {/* Right: Shock-Value Loss Metric Card + Direct Recovery Capture */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl p-6 sm:p-7 bg-[#0b0e1b] border-2 border-rose-500/40 shadow-2xl shadow-rose-950/40 text-center space-y-5">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-mono tracking-wider text-rose-400 font-bold">
                      Prejuízo Invisível Estimado
                    </span>
                    <div className="text-4xl sm:text-5xl font-black font-heading text-rose-400 text-glow-rose">
                      R$ {leakage.lostRevenueMonthly.toLocaleString('pt-BR')}
                      <span className="text-lg font-mono text-slate-400">/mês</span>
                    </div>
                    <p className="text-xs text-slate-400 pt-1">
                      Aproximadamente{' '}
                      <strong className="text-white">
                        {leakage.lostLeadsMonthly} clientes perdidos
                      </strong>{' '}
                      todo mês para concorrentes que passam mais credibilidade.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1 text-left">
                    <div className="flex items-center justify-between text-rose-300 font-bold text-xs">
                      <span className="flex items-center gap-1.5">
                        <TrendingDown className="w-4 h-4 shrink-0" />
                        <span>Em 1 ano são mais de:</span>
                      </span>
                      <span className="text-lg font-black font-mono text-white">
                        R$ {leakage.potentialRecoveredYearly.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Direct Lead Capture to Stop the Leakage */}
                  {!quickSent ? (
                    <form onSubmit={handleSendRecoveryPlan} className="space-y-2.5 text-left">
                      <div className="text-[11px] font-mono uppercase text-cyan-300 font-bold text-center">
                        ⚡ Receba o Plano Para Recuperar Esse Valor:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Seu Nome *"
                          value={quickName}
                          onChange={(e) => setQuickName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080F] border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Seu WhatsApp *"
                          value={quickPhone}
                          onChange={(e) => setQuickPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080F] border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Qual seu ramo ou maior dificuldade hoje? (Opcional)"
                        value={quickProblem}
                        onChange={(e) => setQuickProblem(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080F] border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                      />

                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-cyan-400/25 hover:scale-[1.02] transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>Estancar Esse Prejuízo no WhatsApp Agora</span>
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                      </button>
                    </form>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-950/35 border border-emerald-400/40 space-y-2 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-emerald-300 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Diagnóstico Enviado para o WhatsApp e Painel!</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQuickSent(false)}
                        className="text-[11px] font-mono text-cyan-300 underline cursor-pointer"
                      >
                        Recalcular com outros valores
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Projetos que se pagam já nas primeiras semanas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Scroll3DStage>
      </div>
    </section>
  );
}
