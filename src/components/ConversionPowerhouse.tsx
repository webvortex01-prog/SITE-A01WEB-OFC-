import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Sparkles,
  Palette,
  Gauge,
  ArrowRight,
  CheckCircle2,
  Bot,
  Smartphone,
  DollarSign,
  Play,
  RotateCcw,
  AlertTriangle,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { Scroll3DStage } from '../utils/scrollytelling';

interface ConversionPowerhouseProps {
  onOpenFunnel: (segment?: string) => void;
}

// ============================================================================
// DATA FOR IDEA #1: SIMULADOR AO VIVO DO CLIQUE AO LUCRO
// ============================================================================
interface FunnelSimulationScenario {
  id: string;
  niche: string;
  adSource: string;
  clickCost: string;
  pageAction: string;
  whatsappBotMsg: string;
  closedTicket: string;
  roiMultiplier: string;
  imageUrl: string;
}

const FUNNEL_SCENARIOS: FunnelSimulationScenario[] = [
  {
    id: 'advocacia',
    niche: 'Advocacia & Jurídico',
    adSource: 'Anúncio Google Ads ("Advogado Especialista")',
    clickCost: 'Custo do Clique: R$ 4,20',
    pageAction: 'Página abre em 0.5s com autoridade OAB e filtro por área do Direito',
    whatsappBotMsg:
      'Triagem 24/7: Cliente seleciona "Direito Trabalhista / Empresarial" e relata o caso',
    closedTicket: 'Honorários Fechados: R$ 3.500,00',
    roiMultiplier: 'Retorno imediato no 1º contrato',
    imageUrl:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'carros',
    niche: 'Loja de Carros & Showroom',
    adSource: 'Reels / Anúncio Instagram do Estoque',
    clickCost: 'Custo do Clique: R$ 1,80',
    pageAction: 'Vitrine Mobile abre na hora com fotos HD, ficha técnica e botão de troca',
    whatsappBotMsg:
      'Triagem 24/7: Comprador já envia o carro escolhido + entrada para financiar',
    closedTicket: 'Venda Concluída: Margem de R$ 6.800,00',
    roiMultiplier: 'Site se paga na 1ª venda do mês',
    imageUrl:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'estetica',
    niche: 'Clínica, Salão & Estética',
    adSource: 'Stories / Anúncio Meta Ads Local',
    clickCost: 'Custo do Clique: R$ 1,40',
    pageAction: 'Menu visual de procedimentos e resultados encanta a cliente em 3 segundos',
    whatsappBotMsg:
      'Triagem 24/7: Paciente escolhe o protocolo e horário de avaliação sozinha',
    closedTicket: 'Procedimento Agendado: R$ 1.450,00',
    roiMultiplier: 'Agenda lotada sem perder tempo no Zap',
    imageUrl:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'comercio',
    niche: 'Lojas, Moda & Serviços Locais',
    adSource: 'Link da Bio + Tráfego Pago Local',
    clickCost: 'Custo do Clique: R$ 0,95',
    pageAction: 'Catálogo interativo permite escolher itens/serviços pelo polegar',
    whatsappBotMsg:
      'Triagem 24/7: Pedido chega pronto com itens, valores e forma de pagamento',
    closedTicket: 'Dezenas de Pedidos Diretos / Semana',
    roiMultiplier: 'Zero comissão de aplicativos de terceiros',
    imageUrl:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
  },
];

// ============================================================================
// DATA FOR IDEA #2: PERSONALIZADOR DE IDENTIDADE VISUAL AO VIVO
// ============================================================================
interface BrandThemePreset {
  id: string;
  name: string;
  nicheTag: string;
  headline: string;
  subtitle: string;
  ctaLabel: string;
  bgGradient: string;
  borderAccent: string;
  badgeClass: string;
  btnClass: string;
  swatchColor: string;
  imageUrl: string;
}

const BRAND_THEMES: BrandThemePreset[] = [
  {
    id: 'gold-exec',
    name: 'Ouro Executivo',
    nicheTag: 'IDEAL PARA ADVOCACIA, IMOBILIÁRIAS & CONSULTORIAS',
    headline: 'Defesa Estratégica e Segurança para o Seu Patrimônio.',
    subtitle: 'Identidade sóbria em preto e dourado que transmite poder, tradição e alto ticket.',
    ctaLabel: 'Agendar Reunião Executiva',
    bgGradient: 'from-[#18130A] via-[#0B0A08] to-[#1E170B]',
    borderAccent: 'border-amber-400/60 shadow-amber-500/20',
    badgeClass: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    btnClass: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950',
    swatchColor: 'bg-amber-400',
    imageUrl:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'crimson-motor',
    name: 'Carbon & Red Sport',
    nicheTag: 'IDEAL PARA LOJAS DE CARROS, ESTÉTICA AUTOMOTIVA & ACADEMIAS',
    headline: 'Performance, Exclusividade e Aprovação Imediata.',
    subtitle: 'Contraste agressivo em fibra de carbono e vermelho esportivo que acelera a decisão.',
    ctaLabel: 'Simular Financiamento no WhatsApp',
    bgGradient: 'from-[#1D090C] via-[#09080C] to-[#1A0D0A]',
    borderAccent: 'border-rose-500/60 shadow-rose-500/20',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    btnClass: 'bg-gradient-to-r from-rose-500 to-orange-500 text-white',
    swatchColor: 'bg-rose-500',
    imageUrl:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'emerald-clinic',
    name: 'Esmeralda Clean & Saúde',
    nicheTag: 'IDEAL PARA CLÍNICAS MÉDICAS, ODONTOLOGIA & ESTÉTICA',
    headline: 'Tecnologia Avançada e Cuidado Humanizado em Cada Protocolo.',
    subtitle: 'Paleta limpa e acolhedora que transmite higiene, ciência e confiança imediata.',
    ctaLabel: 'Reservar Avaliação pelo WhatsApp',
    bgGradient: 'from-[#071A17] via-[#070E12] to-[#0A1D1B]',
    borderAccent: 'border-emerald-400/60 shadow-emerald-500/20',
    badgeClass: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40',
    btnClass: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950',
    swatchColor: 'bg-emerald-400',
    imageUrl:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'rose-luxury',
    name: 'Rose Gold & Glamour',
    nicheTag: 'IDEAL PARA SALÕES DE BELEZA, MODA FEMININA & SPA',
    headline: 'Realce Sua Essência com Sofisticação e Atendimento VIP.',
    subtitle: 'Acabamento refinado com brilho suave pensado para encantar o público feminino.',
    ctaLabel: 'Escolher Procedimento e Horário',
    bgGradient: 'from-[#1C0D16] via-[#0B0910] to-[#1B1018]',
    borderAccent: 'border-pink-400/60 shadow-pink-500/20',
    badgeClass: 'bg-pink-400/20 text-pink-300 border-pink-400/40',
    btnClass: 'bg-gradient-to-r from-pink-400 to-rose-400 text-slate-950',
    swatchColor: 'bg-pink-400',
    imageUrl:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'cyber-tech',
    name: 'Cyber Neon Future',
    nicheTag: 'IDEAL PARA EMPRESAS DE TECNOLOGIA, SAAS, ENERGIA SOLAR & B2B',
    headline: 'Automação, Escala e Engenharia Digital Para o Seu Negócio.',
    subtitle: 'Visual futurista de altíssimo impacto com iluminação neon e precisão técnica.',
    ctaLabel: 'Solicitar Demonstração Técnica',
    bgGradient: 'from-[#081624] via-[#060912] to-[#0A1428]',
    borderAccent: 'border-cyan-400/60 shadow-cyan-500/20',
    badgeClass: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40',
    btnClass: 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950',
    swatchColor: 'bg-cyan-400',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85',
  },
];

const MARQUEE_NICHES_TOP = [
  '⚖️ Escritórios de Advocacia',
  '🚗 Concessionárias & Multimarcas',
  '🏥 Clínicas Médicas & Estética',
  '💇 Salões de Beleza & Barbearias',
  '👗 Lojas de Moda & E-commerce',
  '🏢 Construtoras & Imobiliárias',
  '🦷 Clínicas Odontológicas',
  '🍽️ Restaurantes & Gastronomia',
];

const MARQUEE_MODULES_BOTTOM = [
  '⚡ Abertura Instantânea < 0.8s',
  '🤖 Bot de Triagem WhatsApp 24/7',
  '📱 Scrollytelling 3D Mobile-First',
  '💻 Painel Administrativo Próprio',
  '📅 Sistema de Pré-Agendamento Online',
  '🛒 Catálogo Digital com Pedido no Zap',
  '🔒 Código 100% Seu · Zero Mensalidade',
  '🎁 1 Ano de Domínio .com.br + Hospedagem Grátis',
];

export default function ConversionPowerhouse({ onOpenFunnel }: ConversionPowerhouseProps) {
  // State for Idea #1: Live Click-to-Profit Simulator
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number>(0);
  const [activePulseNode, setActivePulseNode] = useState<number>(0);

  // State for Idea #2: Live Brand Theme Tester
  const [selectedThemeIdx, setSelectedThemeIdx] = useState<number>(0);

  // State for Idea #3: Live 4G/5G Speed Race Benchmark
  const [raceRunning, setRaceRunning] = useState<boolean>(true);
  const [zeroOneProgress, setZeroOneProgress] = useState<number>(100);
  const [commonSiteProgress, setCommonSiteProgress] = useState<number>(38);
  const [raceElapsedMs, setRaceElapsedMs] = useState<number>(600);

  const currentScenario = FUNNEL_SCENARIOS[selectedScenarioIdx];
  const currentTheme = BRAND_THEMES[selectedThemeIdx];

  // Auto-advance the glowing pulse node (0 -> 1 -> 2 -> 3) in the Click-to-Profit Simulator
  useEffect(() => {
    const interval = window.setInterval(() => {
      setActivePulseNode((prev) => (prev + 1) % 4);
    }, 1800);
    return () => window.clearInterval(interval);
  }, []);

  // Live Speed Race animation
  useEffect(() => {
    if (!raceRunning) return;
    setZeroOneProgress(0);
    setCommonSiteProgress(0);
    setRaceElapsedMs(0);

    const startTime = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      setRaceElapsedMs(Math.min(5800, elapsed));

      // 01 WEB finishes 100% in 600ms!
      const p01 = Math.min(100, Math.round((elapsed / 600) * 100));
      setZeroOneProgress(p01);

      // Common site crawls slowly over 5800ms
      const pCommon = Math.min(100, Math.round((elapsed / 5800) * 100));
      setCommonSiteProgress(pCommon);

      if (elapsed >= 5800) {
        setRaceRunning(false);
        window.clearInterval(timer);
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, [raceRunning]);

  const handleRestartRace = () => {
    sound.playSelect();
    setRaceRunning(false);
    setTimeout(() => setRaceRunning(true), 40);
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-x-clip bg-[#06080F] border-b border-white/10 space-y-20">
      {/* =====================================================================
          IDEIA #4: ESTEIRA INFINITA 3D DE NICHOS & ENTREGÁVEIS (KINETIC MARQUEE)
         ===================================================================== */}
      <div className="space-y-3 overflow-hidden py-2">
        <div className="flex items-center gap-3 animate-[marquee_28s_linear_infinite] whitespace-nowrap">
          {[...MARQUEE_NICHES_TOP, ...MARQUEE_NICHES_TOP].map((item, i) => (
            <span
              key={`top-${i}`}
              className="px-4 py-2 rounded-xl bg-[#0B101E] border border-cyan-400/25 text-xs font-mono font-bold text-slate-200 shrink-0 shadow-md"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 animate-[marquee_32s_linear_infinite_reverse] whitespace-nowrap">
          {[...MARQUEE_MODULES_BOTTOM, ...MARQUEE_MODULES_BOTTOM].map((item, i) => (
            <span
              key={`bot-${i}`}
              className="px-4 py-2 rounded-xl bg-emerald-950/25 border border-emerald-400/30 text-xs font-mono font-bold text-emerald-300 shrink-0 shadow-md"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        {/* ===================================================================
            IDEIA #1: SIMULADOR AO VIVO "DO ANÚNCIO AO LUCRO NO CAIXA"
           =================================================================== */}
        <Scroll3DStage intensity="medium">
          <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#0A1122] via-[#070A14] to-[#08171A] border border-cyan-400/35 shadow-2xl space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SIMULADOR DE RETORNO · JORNADA DO CLIENTE EM TEMPO REAL</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
                  Veja Como um Simples Clique Vira{' '}
                  <span className="text-gradient-animated">Dinheiro no Caixa da Sua Empresa.</span>
                </h2>
              </div>

              {/* Niche Switcher Pills */}
              <div className="flex flex-wrap gap-1.5">
                {FUNNEL_SCENARIOS.map((sc, idx) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      sound.playSelect();
                      setSelectedScenarioIdx(idx);
                      setActivePulseNode(0);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      selectedScenarioIdx === idx
                        ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-lg'
                        : 'bg-[#06080F] text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {sc.niche}
                  </button>
                ))}
              </div>
            </div>

            {/* 4-Node Animated Circuit Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              {[
                {
                  step: '01. ORIGEM DO CLIQUE',
                  title: currentScenario.adSource,
                  badge: currentScenario.clickCost,
                  icon: Globe,
                  color: 'text-cyan-400 border-cyan-400/50',
                },
                {
                  step: '02. IMPACTO EM 0.5s',
                  title: currentScenario.pageAction,
                  badge: 'Retenção Visual 98%',
                  icon: Smartphone,
                  color: 'text-sky-400 border-sky-400/50',
                },
                {
                  step: '03. FILTRO WHATSAPP 24/7',
                  title: currentScenario.whatsappBotMsg,
                  badge: 'Zero Tempo Perdido',
                  icon: Bot,
                  color: 'text-emerald-400 border-emerald-400/50',
                },
                {
                  step: '04. VENDA NO SEU CAIXA',
                  title: currentScenario.closedTicket,
                  badge: currentScenario.roiMultiplier,
                  icon: DollarSign,
                  color: 'text-amber-300 border-amber-400/60',
                },
              ].map((node, idx) => {
                const Icon = node.icon;
                const isPulsing = activePulseNode === idx;
                return (
                  <motion.div
                    key={node.step}
                    onClick={() => {
                      sound.playSelect();
                      setActivePulseNode(idx);
                    }}
                    animate={{
                      scale: isPulsing ? 1.03 : 0.98,
                      y: isPulsing ? -4 : 0,
                    }}
                    transition={{ duration: 0.25 }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                      isPulsing
                        ? `bg-[#0D172A] ${node.color} shadow-[0_0_30px_rgba(34,211,238,0.22)]`
                        : 'bg-[#060912]/90 border-white/10 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-extrabold text-cyan-300">
                          {node.step}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isPulsing
                              ? 'bg-cyan-400 text-slate-950'
                              : 'bg-white/5 text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                        {node.title}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-400 font-bold">{node.badge}</span>
                      {isPulsing && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Scroll3DStage>

        {/* ===================================================================
            IDEIA #2: PERSONALIZADOR DE IDENTIDADE VISUAL AO VIVO (5 ESTILOS)
           =================================================================== */}
        <Scroll3DStage intensity="medium">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Explanation & Theme Swatches */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>TESTE A IDENTIDADE VISUAL DA SUA MARCA</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
                100% Adaptado Para as Cores e o{' '}
                <span className="text-gradient-animated">Padrão da Sua Empresa.</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Cada negócio exige uma psicologia de cores diferente. Clique nos estilos abaixo
                para ver como personalizamos a atmosfera visual do seu projeto sob medida:
              </p>

              {/* 5 Theme Buttons */}
              <div className="space-y-2.5">
                {BRAND_THEMES.map((theme, idx) => {
                  const isSelected = selectedThemeIdx === idx;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setSelectedThemeIdx(idx);
                      }}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#0D1426] border-cyan-400 shadow-lg scale-[1.01]'
                          : 'bg-[#090D18] border-white/10 hover:border-white/25 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-5 h-5 rounded-full ${theme.swatchColor} shrink-0 border-2 border-white shadow-sm`}
                        />
                        <div>
                          <div className="text-xs sm:text-sm font-extrabold text-white">
                            {theme.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 truncate max-w-[240px] sm:max-w-xs">
                            {theme.nicheTag}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg ${
                          isSelected
                            ? 'bg-cyan-400 text-slate-950'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {isSelected ? 'ATIVO' : 'TESTAR'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Live Morphing 3D Website Preview */}
            <div className="lg:col-span-7 scrolly-perspective">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTheme.id}
                  initial={{ opacity: 0, scale: 0.95, rotateY: -8 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.95, rotateY: 8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative rounded-3xl overflow-hidden border-2 ${currentTheme.borderAccent} shadow-2xl bg-gradient-to-br ${currentTheme.bgGradient}`}
                >
                  {/* Simulated Browser Chrome */}
                  <div className="px-4 py-3 bg-black/60 border-b border-white/10 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="ml-2 text-slate-300 text-[11px]">
                        suaempresa.com.br · {currentTheme.name}
                      </span>
                    </div>
                    <span className="text-emerald-400 font-bold text-[11px]">
                      100% PERSONALIZADO
                    </span>
                  </div>

                  {/* Visual Preview Content */}
                  <div className="relative min-h-[340px] sm:min-h-[380px] p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
                    <img
                      src={currentTheme.imageUrl}
                      alt={currentTheme.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/40" />

                    <div className="relative z-10">
                      <span
                        className={`inline-block px-3 py-1 rounded-full border text-[10px] font-mono font-extrabold uppercase ${currentTheme.badgeClass}`}
                      >
                        {currentTheme.nicheTag}
                      </span>
                    </div>

                    <div className="relative z-10 space-y-4 my-auto max-w-xl">
                      <h3 className="text-2xl sm:text-4xl font-extrabold font-heading text-white leading-tight">
                        {currentTheme.headline}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {currentTheme.subtitle}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            sound.playSuccess();
                            onOpenFunnel();
                          }}
                          className={`px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 shadow-xl cursor-pointer ${currentTheme.btnClass}`}
                        >
                          <span>{currentTheme.ctaLabel}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] font-mono text-slate-300">
                      <span>✓ Cores, Logo e Fotos da Sua Empresa</span>
                      <span>✓ Pronto em 3 a 7 Dias</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Scroll3DStage>

        {/* ===================================================================
            IDEIA #3: CORRIDA AO VIVO DE VELOCIDADE 4G/5G (BENCHMARK INTERATIVO)
           =================================================================== */}
        <Scroll3DStage intensity="medium">
          <div className="rounded-3xl p-6 sm:p-8 bg-[#090E1C] border border-emerald-400/35 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                  <Gauge className="w-4 h-4" />
                  <span>TESTE DE VELOCIDADE AO VIVO NO 4G/5G</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
                  Corrida de Carregamento: Estrutura 01 WEB vs. Site Comum
                </h3>
              </div>

              <button
                type="button"
                onClick={handleRestartRace}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs font-mono cursor-pointer shrink-0 shadow-md"
              >
                {raceRunning ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Testando... ({(raceElapsedMs / 1000).toFixed(1)}s)</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Disparar Corrida de Velocidade Novamente</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lane 1: 01 WEB */}
              <div className="p-5 rounded-2xl bg-[#050A14] border border-emerald-400/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                    <Zap className="w-4 h-4 fill-emerald-400" />
                    1º LUGAR: ARQUITETURA 01 WEB
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-400 text-slate-950 font-extrabold">
                    0.6 SEGUNDOS ({zeroOneProgress}%)
                  </span>
                </div>

                <div className="w-full h-4 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-emerald-500/30">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-75 shadow-[0_0_12px_#10b981]"
                    style={{ width: `${zeroOneProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-emerald-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {zeroOneProgress === 100
                      ? 'Site 100% aberto! Cliente já está clicando no seu WhatsApp.'
                      : 'Carregando código limpo instantâneo...'}
                  </span>
                  <span className="font-mono font-bold">100/100</span>
                </div>
              </div>

              {/* Lane 2: Common Site */}
              <div className="p-5 rounded-2xl bg-[#0A080C] border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-400 font-extrabold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    2º LUGAR: SITE COMUM / WORDPRESS PESADO
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                    5.8 SEGUNDOS ({commonSiteProgress}%)
                  </span>
                </div>

                <div className="w-full h-4 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-rose-500/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-75"
                    style={{ width: `${commonSiteProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-rose-300/90">
                  <span>
                    {commonSiteProgress < 100
                      ? '⏳ Tela branca carregando plugins... 84% dos clientes já fecharam a aba!'
                      : '⚠️ Abriu atrasado depois que a maioria já desistiu.'}
                  </span>
                  <span className="font-mono font-bold text-rose-400">41/100</span>
                </div>
              </div>
            </div>
          </div>
        </Scroll3DStage>
      </div>
    </section>
  );
}
