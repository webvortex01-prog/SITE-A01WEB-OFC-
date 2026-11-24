import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Briefcase,
  Smartphone,
  Flame,
  Clock,
  Send,
  MessageCircle,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { leadService } from '../services/leadService';
import { LeadBottleneck, LeadNeed, LeadUrgency } from '../types/lead';

interface LeadFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSegment?: string;
}

const SEGMENTS = [
  { id: 'Advocacia / Jurídico', label: 'Advocacia & Jurídico', icon: '⚖️' },
  { id: 'Automotivo / Concessionária', label: 'Concessionária & Automotivo', icon: '🚗' },
  { id: 'Salão de Beleza / Barbearia', label: 'Salão de Beleza & Barbearia', icon: '💇' },
  { id: 'Loja de Roupas / Moda', label: 'Loja de Roupas & E-commerce', icon: '👗' },
  { id: 'Estúdio de Tatuagem / Body Art', label: 'Estúdio de Tatuagem & Piercing', icon: '💉' },
  { id: 'Saúde / Clínica / Estética', label: 'Clínica, Saúde & Estética', icon: '🏥' },
  { id: 'Serviços / Consultoria / B2B', label: 'Serviços & Consultoria', icon: '💼' },
  { id: 'Gastronomia / Alimentação', label: 'Restaurante & Gastronomia', icon: '🍽️' },
  { id: 'Outro Segmento', label: 'Outro Modelo de Negócio', icon: '⚡' },
];

const BOTTLENECKS: { id: LeadBottleneck; title: string; desc: string; icon: string }[] = [
  {
    id: 'ads_no_conversion',
    title: 'Gasto em anúncios mas ninguém compra',
    desc: 'O anúncio traz cliques, mas os clientes não mandam mensagem ou não fecham vendas.',
    icon: '💸',
  },
  {
    id: 'no_presence',
    title: 'Não tenho site nem catálogo próprio',
    desc: 'Fico mandando fotos soltas e PDFs pesados no WhatsApp e passo imagem amadora.',
    icon: '📵',
  },
  {
    id: 'slow_ugly_site',
    title: 'Meu site atual é lento, feio ou desatualizado',
    desc: 'O cliente clica, demora para abrir no celular e ele desiste antes de ver meu trabalho.',
    icon: '🐌',
  },
  {
    id: 'manual_support_chaos',
    title: 'Atendimento manual consome meu dia todo',
    desc: 'Passo horas respondendo perguntas repetitivas de preço e tentando controlar agendamentos.',
    icon: '🤯',
  },
];

const NEEDS: { id: LeadNeed; title: string; desc: string; badge: string }[] = [
  {
    id: 'landing_page',
    title: 'Apenas Landing Page de Alta Conversão',
    desc: 'Página ultra-rápida e focada em converter o tráfego dos anúncios diretamente em clientes.',
    badge: 'DIRETO AO PONTO',
  },
  {
    id: 'site_institucional',
    title: 'Site Institucional Multi-páginas',
    desc: 'Estrutura completa com autoridade, áreas de atuação, galeria e depoimentos.',
    badge: 'AUTORIDADE',
  },
  {
    id: 'sistema_gestao',
    title: 'Sistema Web de Gestão Sob Medida',
    desc: 'Painel exclusivo para gerenciar agendamentos, clientes, pedidos e equipe sem mensalidades.',
    badge: 'ORGANIZAÇÃO',
  },
  {
    id: 'combo_completo',
    title: 'Ecossistema Completo (Site + Sistema + WhatsApp)',
    desc: 'Site de alta performance + painel de controle + fluxo de automação no WhatsApp.',
    badge: 'MAIS RECOMENDADO',
  },
];

const URGENCIES: { id: LeadUrgency; label: string; desc: string; icon: any }[] = [
  {
    id: 'imediato',
    label: 'Imediato (esta semana)',
    desc: 'Já tenho verba ou anúncios rodando e preciso resolver isso agora.',
    icon: Flame,
  },
  {
    id: '15_30_dias',
    label: 'Próximos 15 a 30 dias',
    desc: 'Estou alinhando os detalhes e pretendo iniciar no próximo mês.',
    icon: Clock,
  },
  {
    id: 'apenas_orcando',
    label: 'Apenas orçando / Planejamento',
    desc: 'Quero entender os valores e comparar para meu planejamento futuro.',
    icon: Briefcase,
  },
];

export default function LeadFunnelModal({
  isOpen,
  onClose,
  initialSegment,
}: LeadFunnelModalProps) {
  const [step, setStep] = useState<number>(1);
  const [segment, setSegment] = useState<string>(initialSegment || SEGMENTS[0].id);
  const [bottleneck, setBottleneck] = useState<LeadBottleneck>('ads_no_conversion');
  const [need, setNeed] = useState<LeadNeed>('combo_completo');
  const [urgency, setUrgency] = useState<LeadUrgency>('imediato');

  // Contact inputs
  const [name, setName] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [problemDetails, setProblemDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  // Mask WhatsApp input as user types: (XX) XXXXX-XXXX + Silent Abandonment Auto-Capture
  const handleWhatsappChange = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 11);
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    if (raw.length > 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
    }
    setWhatsapp(formatted);

    if (raw.length >= 10) {
      leadService.captureAbandonedLead({
        name: name.trim() || 'Visitante (Funil de Qualificação)',
        whatsapp: raw,
        segment,
        contextNote: `Preencheu o Funil até a etapa final (${segment}) e digitou o WhatsApp.`,
      });
    }
  };

  const handleNextStep = () => {
    sound.playSelect();
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    sound.playClick(400);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const selectedBottleneckObj = BOTTLENECKS.find((b) => b.id === bottleneck);
  const selectedNeedObj = NEEDS.find((n) => n.id === need);
  const selectedUrgencyObj = URGENCIES.find((u) => u.id === urgency);

  const getSolutionPitch = () => {
    switch (bottleneck) {
      case 'ads_no_conversion':
        return 'Arquitetura de Alta Conversão com carregamento em menos de 1 segundo, copywriting persuasivo e botão WhatsApp com mensagem personalizada para fechar mais vendas.';
      case 'slow_ugly_site':
        return 'Reconstrução completa em tecnologia moderna com visual refinado e nota 95+ no Google PageSpeed para que nenhum cliente desista da navegação.';
      case 'manual_support_chaos':
        return 'Fluxo de atendimento estruturado no WhatsApp 24/7 com agendamento online e catálogo digital que filtram os clientes automaticamente.';
      default:
        return 'Ecossistema sob medida com vitrine digital moderna e painel administrativo intuitivo para centralizar seus contatos.';
    }
  };

  const handleFinishAndSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) {
      sound.playClick(260);
      return;
    }

    setIsSubmitting(true);
    sound.playSuccess();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22d3ee', '#34d399', '#38bdf8', '#ffffff'],
      });
    } catch {
      // ignore
    }

    const estimatedBudget =
      need === 'landing_page'
        ? 1200
        : need === 'site_institucional'
        ? 1800
        : need === 'sistema_gestao'
        ? 2200
        : 2600;

    const summary = `Gargalo: ${selectedBottleneckObj?.title}${
      problemDetails.trim() ? ` | Relato: "${problemDetails.trim()}"` : ''
    }. Solução 01 Web: ${getSolutionPitch()}`;

    // 1. SAVE LEAD TO ADMIN PANEL (WITH AUTOMATIC AI SOLUTION ARCHITECT)
    const newLead = leadService.addLead({
      name: name.trim(),
      businessName: businessName.trim() || 'Não informado',
      whatsapp: whatsapp.replace(/\D/g, ''),
      segment,
      bottleneck,
      bottleneckLabel: selectedBottleneckObj?.title || 'Não especificado',
      problemDetails: problemDetails.trim() || undefined,
      need,
      needLabel: selectedNeedObj?.title || 'Combo Completo',
      urgency,
      urgencyLabel: selectedUrgencyObj?.label || 'Imediato',
      budgetEstimate: estimatedBudget,
      source: 'funil_anuncio',
      diagnosticSummary: summary,
      notes: `Lead gerado pelo Funil de Qualificação.${
        problemDetails.trim() ? ` Problema descrito: "${problemDetails.trim()}".` : ''
      } Necessidade: ${selectedNeedObj?.title}. Urgência: ${selectedUrgencyObj?.label}.`,
    });

    setIsSubmitting(false);
    setIsCompleted(true);

    // 2. DISPATCH TO RD'S OFFICIAL WHATSAPP (5566999697087)
    const waText = encodeURIComponent(
      `🚀 *NOVO DIAGNÓSTICO DE QUALIFICAÇÃO — 01 WEB*\n\n` +
        `👤 *Nome:* ${name.trim()}\n` +
        `🏢 *Empresa:* ${businessName.trim() || 'Minha Empresa'}\n` +
        `📱 *WhatsApp:* ${whatsapp}\n` +
        `🎯 *Segmento:* ${segment}\n` +
        `⚠️ *Maior Dificuldade:* ${selectedBottleneckObj?.title}\n` +
        (problemDetails.trim() ? `📝 *Problema Descrito:* ${problemDetails.trim()}\n` : '') +
        `🛠️ *Necessidade:* ${selectedNeedObj?.title}\n` +
        `⏱️ *Urgência:* ${selectedUrgencyObj?.label}\n\n` +
        `🤖 *Solução IA Recomendada:* ${newLead.aiBlueprint?.recommendedSolution || summary}\n\n` +
        `_Vim pelo funil de qualificação do site e gostaria de agilizar meu atendimento!_`
    );

    const waUrl = `https://wa.me/5566999697087?text=${waText}`;

    // Open WhatsApp
    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-[#090D1A] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden my-auto text-left">
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#060810]/80">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-cyan-300">
              Funil de Qualificação & Diagnóstico Rápido
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick(400);
              onClose();
            }}
            aria-label="Fechar diagnóstico"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Funnel Progress Steps */}
        {!isCompleted && (
          <div className="px-6 pt-4 pb-2 bg-slate-950/40 border-b border-white/5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-cyan-400 font-bold">Etapa {step} de 5</span>
              <span>
                {step === 1 && 'Nicho do Negócio'}
                {step === 2 && 'Maior Dificuldade'}
                {step === 3 && 'Necessidade do Projeto'}
                {step === 4 && 'Prazo & Urgência'}
                {step === 5 && 'Dados para o Diagnóstico'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* ETAPA 1: SEGMENTO */}
            {step === 1 && !isCompleted && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                    Qual é o segmento da sua empresa?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Isso define os modelos de alta conversão e automações mais eficientes para o seu nicho.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {SEGMENTS.map((s) => {
                    const isSelected = segment === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          sound.playSelect();
                          setSegment(s.id);
                        }}
                        className={`flex items-center gap-3 p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-950/40 text-white'
                            : 'bg-slate-900/60 border-white/5 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <span className="text-xl shrink-0">{s.icon}</span>
                        <span className="text-xs sm:text-sm font-semibold">{s.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 ml-auto shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-cyan-950/50"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ETAPA 2: MAIOR DIFICULDADE (QUALIFICAÇÃO CRÍTICA) */}
            {step === 2 && !isCompleted && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                    Qual é o seu maior gargalo ou dificuldade hoje?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Seja sincero: nossa engenharia ataca diretamente a causa que faz você perder dinheiro ou tempo.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  {BOTTLENECKS.map((b) => {
                    const isSelected = bottleneck === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          sound.playSelect();
                          setBottleneck(b.id);
                        }}
                        className={`w-full flex items-start gap-3.5 p-4 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-950/40 text-white'
                            : 'bg-slate-900/60 border-white/5 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <span className="text-2xl shrink-0 mt-0.5">{b.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white flex items-center justify-between">
                            <span>{b.title}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{b.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-cyan-950/50"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ETAPA 3: NECESSIDADE ESPECÍFICA (SITE OU SISTEMA) */}
            {step === 3 && !isCompleted && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                    Do que sua empresa realmente necessita agora?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Você precisa apenas de uma página para vender ou de um sistema completo para operar?
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  {NEEDS.map((n) => {
                    const isSelected = need === n.id;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          sound.playSelect();
                          setNeed(n.id);
                        }}
                        className={`w-full flex flex-col p-4 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-950/40 text-white'
                            : 'bg-slate-900/60 border-white/5 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-bold text-white">{n.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-semibold">
                              {n.badge}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.desc}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-cyan-950/50"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ETAPA 4: PRAZO E URGÊNCIA */}
            {step === 4 && !isCompleted && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                    Qual é a previsão de início do projeto?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Isso nos ajuda a reservar capacidade técnica no cronograma de desenvolvimento da 01 Web.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  {URGENCIES.map((u) => {
                    const isSelected = urgency === u.id;
                    const IconComponent = u.icon;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          sound.playSelect();
                          setUrgency(u.id);
                        }}
                        className={`w-full flex items-center gap-3.5 p-4 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-950/40 text-white'
                            : 'bg-slate-900/60 border-white/5 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white flex items-center justify-between">
                            <span>{u.label}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{u.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-cyan-950/50"
                  >
                    <span>Avançar para Diagnóstico</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ETAPA 5: SEUS DADOS & GERAR DIAGNÓSTICO */}
            {step === 5 && !isCompleted && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Quase pronto! Gerando seu Raio-X exclusivo</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                    Onde enviamos o resultado do seu diagnóstico?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Preencha para receber a análise completa e ser atendido com prioridade pelo time técnico.
                  </p>
                </div>

                <form onSubmit={handleFinishAndSend} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dr. Roberto Alencar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                      Nome da Sua Empresa / Marca
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Alencar Advocacia ou Studio Belle"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                      Seu WhatsApp (com DDD) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(66) 99969-7087"
                      value={whatsapp}
                      onChange={(e) => handleWhatsappChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-cyan-300 mb-1.5">
                      Descreva seu problema ou o que deseja criar (Nossa IA vai analisar):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Preciso de um site rápido com agendamento automatico no WhatsApp porque perco muitos clientes demorando pra responder..."
                      value={problemDetails}
                      onChange={(e) => setProblemDetails(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  {/* Summary preview of their choices */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 text-xs space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Segmento:</span>
                      <span className="font-semibold text-white">{segment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gargalo:</span>
                      <span className="font-semibold text-cyan-300 truncate max-w-[240px]">
                        {selectedBottleneckObj?.title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Necessidade:</span>
                      <span className="font-semibold text-white">{selectedNeedObj?.title}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !name.trim() || !whatsapp.trim()}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-sm transition-all cursor-pointer shadow-lg shadow-emerald-950/60 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>{isSubmitting ? 'Gerando Diagnóstico...' : 'Ver Diagnóstico & Falar no WhatsApp'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* TELA DE SUCESSO & ENCANTAMENTO (DIAGNÓSTICO PRONTO) */}
            {isCompleted && (
              <motion.div
                key="step-completed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center py-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-400/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold uppercase">
                    Lead Qualificado · Prioridade no Atendimento
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    Diagnóstico Gerado com Sucesso, {name}!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                    Seus dados já foram registrados no nosso painel de atendimento prioritário e sua análise técnica foi concluída.
                  </p>
                </div>

                {/* Executive Breakdown Card */}
                <div className="bg-[#050811] border border-white/10 rounded-2xl p-5 text-left space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <span className="text-[11px] font-mono uppercase text-cyan-400 tracking-wider font-bold">
                      Resumo da Análise Técnica 01 Web
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      {businessName ? `${businessName} (${segment})` : segment}
                    </h4>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="text-slate-400 font-mono">1. Gargalo Crítico Detectado:</div>
                      <div className="text-rose-300 font-semibold mt-0.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{selectedBottleneckObj?.title}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 font-mono">2. Solução Recomendada pela 01 Web:</div>
                      <div className="text-emerald-300 font-semibold mt-0.5 leading-relaxed">
                        {getSolutionPitch()}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 font-mono">3. Estrutura Ideal:</div>
                      <div className="text-white font-semibold mt-0.5">
                        {selectedNeedObj?.title}
                      </div>
                    </div>
                  </div>

                  {/* Guaranteed VIP Perks */}
                  <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2 text-[11px] font-mono text-cyan-300">
                    <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
                      ✓ 1 Ano Hospedagem Nuvem
                    </span>
                    <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
                      ✓ Domínio .com.br Incluso
                    </span>
                    <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
                      ✓ Otimização Mobile 95+
                    </span>
                  </div>
                </div>

                {/* Direct Action */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleFinishAndSend()}
                    className="w-full inline-flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-sm sm:text-base transition-all duration-200 cursor-pointer shadow-xl shadow-emerald-950/60"
                  >
                    <MessageCircle className="w-5 h-5 fill-slate-950 stroke-none" />
                    <span>Abrir Conversa no WhatsApp com Este Diagnóstico</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-xs text-slate-500">
                    Nosso especialista receberá suas respostas na hora e já dará continuidade sem enrolação.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
