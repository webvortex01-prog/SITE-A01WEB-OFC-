import { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'motion/react';
import {
  Layers,
  Zap,
  Smartphone,
  Bot,
  Globe,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Rocket,
  Code2,
  MousePointerClick,
  Check,
} from 'lucide-react';
import { sound } from '../utils/audio';
import ScrollReactiveImage from './ScrollReactiveImage';
import { useIsDesktop } from '../utils/scrollytelling';

interface InteractiveTechShowcaseProps {
  onOpenFunnel: () => void;
}

export default function InteractiveTechShowcase({ onOpenFunnel }: InteractiveTechShowcaseProps) {
  const isDesktop = useIsDesktop();
  const [activeLayer, setActiveLayer] = useState<number>(0);
  // activeStep: 0 = Step 1, 1 = Step 2, 2 = Step 3, 3 = Step 4, 4 = ALL 4 COMPLETED FINALE!
  const [activeStep, setActiveStep] = useState<number>(0);

  const layersTrackRef = useRef<HTMLDivElement | null>(null);
  const timelineTrackRef = useRef<HTMLDivElement | null>(null);
  const layerInspectorRef = useRef<HTMLDivElement | null>(null);
  const stepInspectorRef = useRef<HTMLDivElement | null>(null);

  // 1. Scroll-driven Layer Progression (Pinned Section 1 on Desktop + Viewport Scroll on Mobile)
  const { scrollYProgress: layersProgress } = useScroll({
    target: layersTrackRef,
    offset: ['start 20%', 'end 80%'],
  });

  useMotionValueEvent(layersProgress, 'change', (v) => {
    const clamped = Math.min(0.999, Math.max(0, v));
    const nextIdx = Math.min(3, Math.max(0, Math.floor(clamped * 4)));
    setActiveLayer((prev) => (prev !== nextIdx ? nextIdx : prev));
  });

  // 2. Scroll-driven Vertical Top-to-Bottom Timeline Progression (Pinned Section 2)
  // 5 states: 0 (Step 1), 1 (Step 2), 2 (Step 3), 3 (Step 4), 4 (All 4 Completed Finale)
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineTrackRef,
    offset: ['start 20%', 'end 85%'],
  });

  const smoothTimelineProgress = useSpring(timelineProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
  });

  // Vertical laser beam grows top-to-bottom (from 12% to 100%)
  const laserScaleY = useTransform(smoothTimelineProgress, [0, 0.85, 1], [0.12, 1, 1]);

  useMotionValueEvent(timelineProgress, 'change', (v) => {
    let nextStep = 0;
    if (v < 0.2) nextStep = 0;
    else if (v < 0.4) nextStep = 1;
    else if (v < 0.6) nextStep = 2;
    else if (v < 0.78) nextStep = 3;
    else nextStep = 4; // Finale: All 4 stages completed!

    setActiveStep((prev) => (prev !== nextStep ? nextStep : prev));
  });

  // Helper to jump scroll to a specific step in a pinned track (or inspector card on Mobile timeline)
  const jumpToTrackIndex = (
    trackRef: React.RefObject<HTMLDivElement | null>,
    index: number,
    totalPhases: number,
    setter: (val: number) => void,
    mobileTargetRef?: React.RefObject<HTMLDivElement | null>
  ) => {
    sound.playSelect();
    setter(index);

    if (window.innerWidth < 1024 && trackRef === timelineTrackRef) {
      if (mobileTargetRef?.current) {
        const rect = mobileTargetRef.current.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.75 || rect.bottom < 120) {
          mobileTargetRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
      return;
    }

    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const trackTop = rect.top + window.scrollY;
    const scrollable = Math.max(0, el.offsetHeight - window.innerHeight);
    const targetRatio = (index + 0.3) / totalPhases;
    window.scrollTo({
      top: trackTop + scrollable * targetRatio,
      behavior: 'smooth',
    });
  };

  const blueprintLayers = [
    {
      id: 0,
      code: 'CAMADA 01',
      title: 'Design Imersivo & Autoridade Imediata',
      subtitle: 'O cliente percebe o alto padrão da sua empresa nos primeiros 3 segundos',
      description:
        'Criamos interfaces modernas com animações fluidas, tipografia limpa e organização visual que destacam seus diferenciais logo na primeira dobra da tela.',
      imageUrl:
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=85',
      metricLabel: 'Impacto Visual',
      metricValue: '100% Sob Medida',
      accent: 'from-cyan-400 to-sky-500',
      border: 'border-cyan-400/50',
      badge: 'IDENTIDADE VISUAL EXCLUSIVA',
      icon: Sparkles,
      previewNodes: [
        'Título claro focando na dor do seu cliente',
        'Visual adaptado para transmitir confiança imediata',
        'Animações suaves que valorizam seu serviço ou produto',
      ],
    },
    {
      id: 1,
      code: 'CAMADA 02',
      title: 'Motor de Velocidade Mobile (4G & 5G)',
      subtitle: 'Carregamento instantâneo para não perder nenhum clique de anúncio',
      description:
        'Enquanto templates prontos demoram vários segundos para abrir e fazem o visitante fechar a aba, nossa arquitetura em código limpo abre na hora em qualquer celular.',
      imageUrl:
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=85',
      metricLabel: 'Performance Mobile',
      metricValue: 'Código Ultra-Leve',
      accent: 'from-emerald-400 to-teal-500',
      border: 'border-emerald-400/50',
      badge: 'OTIMIZADO PARA TRÁFEGO PAGO',
      icon: Zap,
      previewNodes: [
        'Zero plugins pesados travando a rolagem da tela',
        'Imagens e componentes otimizados para celulares',
        'Experiência fluida tanto no iPhone quanto no Android',
      ],
    },
    {
      id: 2,
      code: 'CAMADA 03',
      title: 'Triagem Inteligente & Automação WhatsApp',
      subtitle: 'O visitante já chega no seu WhatsApp dizendo exatamente o que precisa',
      description:
        'Integramos botões inteligentes, catálogos interativos e fluxos de atendimento 24/7 que filtram o interesse do cliente antes mesmo de você digitar a primeira resposta.',
      imageUrl:
        'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1000&q=85',
      metricLabel: 'Atendimento',
      metricValue: 'Ativo 24h / 7 dias',
      accent: 'from-sky-400 to-indigo-500',
      border: 'border-sky-400/50',
      badge: 'CONVERSÃO DIRETA NO ZAP',
      icon: Bot,
      previewNodes: [
        'Catálogo, agendamento ou simulador integrado à página',
        'Mensagem já chega formatada no WhatsApp da sua empresa',
        'Respostas imediatas fora do horário comercial',
      ],
    },
    {
      id: 3,
      code: 'CAMADA 04',
      title: 'Painel Próprio & Infraestrutura Completa',
      subtitle: 'Domínio, 1 Ano de Hospedagem e Certificado SSL já inclusos no pacote',
      description:
        'Entregamos tudo configurado no nome da sua empresa: desde o registro do domínio próprio (.com.br) e hospedagem rápida até painéis gerenciais sem mensalidade.',
      imageUrl:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85',
      metricLabel: 'Mensalidade de Uso',
      metricValue: 'R$ 0,00 / mês',
      accent: 'from-amber-400 to-orange-500',
      border: 'border-amber-400/50',
      badge: '1 ANO DE HOSPEDAGEM + DOMÍNIO',
      icon: ShieldCheck,
      previewNodes: [
        'Domínio próprio + 12 meses de hospedagem inclusos',
        'Certificado de segurança SSL (Cadeado HTTPS) ativo',
        'Sem cobrança de aluguel mensal pela sua estrutura',
      ],
    },
  ];

  const steps = [
    {
      number: '01',
      tag: 'ETAPA 1 · DIA 1',
      title: 'Mapeamento do Seu Negócio',
      subtitle: 'Alinhamento rápido direto pelo WhatsApp sem reuniões intermináveis',
      description:
        'Você nos conta o que sua empresa vende, seu público-alvo e suas referências. Definimos juntos a melhor estrutura para transformar visitantes em clientes.',
      deliverable: 'Arquitetura da página + estratégia de conversão definidas',
      imageUrl:
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=85',
      icon: Code2,
      accentText: 'text-cyan-400',
      accentBg: 'from-cyan-400 to-sky-500',
      borderActive: 'border-cyan-400 shadow-cyan-500/20',
    },
    {
      number: '02',
      tag: 'ETAPA 2 · DIAS 2 A 4',
      title: 'Construção Visual & Scrollytelling',
      subtitle: 'Desenvolvimento em código limpo com visual de alto padrão',
      description:
        'Construímos sua página ou sistema com layout exclusivo, textos persuasivos, animações fluidas e total adaptação para abrir rápido no celular.',
      deliverable: 'Link de Preview Ao Vivo liberado para você testar no celular',
      imageUrl:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=85',
      icon: Cpu,
      accentText: 'text-emerald-400',
      accentBg: 'from-emerald-400 to-teal-500',
      borderActive: 'border-emerald-400 shadow-emerald-500/20',
    },
    {
      number: '03',
      tag: 'ETAPA 3 · DIAS 4 A 6',
      title: 'Integração WhatsApp & Painel',
      subtitle: 'Automação de triagem e controles prontos para a sua rotina',
      description:
        'Conectamos os botões de ação, formulários inteligentes, catálogo ou painel administrativo diretamente ao número oficial de WhatsApp da sua empresa.',
      deliverable: 'Fluxo de atendimento e agendamentos/pedidos 100% testados',
      imageUrl:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=85',
      icon: Smartphone,
      accentText: 'text-sky-400',
      accentBg: 'from-sky-400 to-indigo-500',
      borderActive: 'border-sky-400 shadow-sky-500/20',
    },
    {
      number: '04',
      tag: 'ETAPA 4 · ENTREGA OFICIAL',
      title: 'Aprovação & Projeto no Ar',
      subtitle: 'Seu site publicado com Domínio Próprio + 1 Ano de Hospedagem',
      description:
        'Após você testar e aprovar 100% do visual e das funções, publicamos seu projeto no seu domínio oficial (.com.br) com Certificado SSL ativo.',
      deliverable: 'Projeto no ar + 1 Ano de Hospedagem e Domínio Grátis ativos',
      imageUrl:
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1000&q=85',
      icon: Rocket,
      accentText: 'text-amber-400',
      accentBg: 'from-amber-400 to-orange-500',
      borderActive: 'border-amber-400 shadow-amber-500/20',
    },
  ];

  const currentLayer = blueprintLayers[activeLayer];
  const CurrentLayerIcon = currentLayer.icon;

  const isAllCompleted = activeStep === 4;
  const focusedStepIdx = Math.min(3, activeStep);
  const currentStepObj = steps[focusedStepIdx];
  const CurrentStepIcon = currentStepObj.icon;

  return (
    <section
      id="engenharia"
      className="relative overflow-x-clip bg-[#06080F] border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* =====================================================================
            PART 1: PINNED SCROLL-STEPPED 4 LAYERS (SCROLL OR CLICK TO ADVANCE)
           ===================================================================== */}
        <div ref={layersTrackRef} className="relative min-h-[260vh] lg:min-h-[240vh] py-4 lg:py-0">
          <div className="sticky top-16 lg:top-15 py-2 lg:py-3 flex flex-col justify-center space-y-3 lg:space-y-4">
            {/* Section Header + Live Scroll Step Indicator */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-2.5 lg:gap-3">
              <div className="space-y-1 max-w-2xl">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono text-cyan-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>02. ENGENHARIA INTERATIVA 01 WEB</span>
                  <span aria-hidden="true" className="hidden sm:inline text-slate-600">·</span>
                  <span className="hidden sm:inline text-emerald-400 font-bold">
                    ROLE O MOUSE OU CLIQUE PARA AVANÇAR AS CAMADAS
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white tracking-tight leading-tight">
                  Anatomia de uma Estrutura Feita Para{' '}
                  <span className="text-gradient-animated">Converter Visitantes em Clientes.</span>
                </h2>
              </div>

              {/* Scroll Progress Pill for Layers */}
              <div className="relative z-20 lg:static flex items-center justify-between sm:justify-start gap-2 sm:gap-3 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl bg-[#0B0F1A]/95 backdrop-blur-md border border-cyan-400/30 shrink-0 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <MousePointerClick className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-400 hidden sm:inline">Camada Ativa: </span>
                  <strong className="text-cyan-300">0{activeLayer + 1} / 04</strong>
                </div>
                <div className="flex items-center gap-1 ml-1">
                  {[0, 1, 2, 3].map((dot) => (
                    <button
                      key={dot}
                      type="button"
                      onClick={() =>
                        jumpToTrackIndex(
                          layersTrackRef,
                          dot,
                          blueprintLayers.length,
                          setActiveLayer,
                          layerInspectorRef
                        )
                      }
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all duration-300 cursor-pointer ${
                        activeLayer === dot
                          ? 'bg-cyan-400 text-slate-950 shadow-[0_0_8px_#22d3ee]'
                          : activeLayer > dot
                          ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      0{dot + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main 2-Column Interactive + Scroll-Driven Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Left: 4 Interactive Layer Cards (Desktop — on mobile, top pills + scroll drive the holographic stage directly) */}
              <div className="hidden lg:block lg:col-span-6 space-y-3 scrolly-perspective">
                {blueprintLayers.map((layer, idx) => {
                  const Icon = layer.icon;
                  const isSelected = activeLayer === idx;
                  const isPassed = activeLayer > idx;
                  return (
                    <motion.button
                      key={layer.id}
                      type="button"
                      onClick={() =>
                        jumpToTrackIndex(
                          layersTrackRef,
                          idx,
                          blueprintLayers.length,
                          setActiveLayer,
                          layerInspectorRef
                        )
                      }
                      animate={{
                        scale: isDesktop ? (isSelected ? 1.02 : 0.97) : 1,
                        x: isDesktop && isSelected ? 12 : 0,
                      }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? `bg-[#0C1324] ${layer.border} shadow-2xl scrolly-glow-border`
                          : isPassed
                          ? 'bg-[#090D18]/90 border-emerald-500/25 opacity-90 hover:opacity-100'
                          : 'bg-[#090D18]/65 border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${layer.accent} text-slate-950 flex items-center justify-center shrink-0 shadow-md`}
                        >
                          <Icon className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[11px] font-mono">
                            <span className="text-cyan-400 font-bold">{layer.code}</span>
                            <span className="text-slate-600">·</span>
                            <span className="text-slate-300 truncate">{layer.metricValue}</span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold font-heading text-white sm:truncate">
                            {layer.title}
                          </h3>
                        </div>
                      </div>

                      <div
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold shrink-0 ${
                          isSelected
                            ? 'bg-cyan-400 text-slate-950'
                            : isPassed
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        {isSelected ? 'EM FOCO' : isPassed ? '✓ OK' : 'VER'}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Right: Animated 3D Holographic Inspection Stage */}
              <div ref={layerInspectorRef} className="lg:col-span-6 scrolly-perspective scroll-mt-28">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentLayer.id}
                    initial={{ opacity: 0, y: 24, scale: 0.95, rotateX: 8 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95, rotateX: -8 }}
                    transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                    className={`rounded-3xl p-4 sm:p-6 bg-[#0B0F1A] border ${currentLayer.border} scrolly-glow-border space-y-2.5 sm:space-y-3.5`}
                  >
                    <div className="flex items-center justify-between gap-2 sm:gap-3 pb-2 sm:pb-2.5 border-b border-white/10">
                      <span className="px-2.5 sm:px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold truncate">
                        {currentLayer.badge}
                      </span>
                      <span className="text-[11px] sm:text-xs font-mono text-emerald-400 font-bold shrink-0">
                        {currentLayer.code} DE 04
                      </span>
                    </div>

                    <div className="space-y-1 sm:space-y-1.5">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br ${currentLayer.accent} text-slate-950 flex items-center justify-center shrink-0`}
                        >
                          <CurrentLayerIcon className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <h3 className="text-base sm:text-xl font-extrabold font-heading text-white leading-tight">
                          {currentLayer.title}
                        </h3>
                      </div>
                      <p className="text-[11px] sm:text-xs text-cyan-300 font-medium">
                        {currentLayer.subtitle}
                      </p>
                      <p className="text-[11.5px] sm:text-xs text-slate-300 leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">
                        {currentLayer.description}
                      </p>
                    </div>

                    {/* High-Impact Scroll-Reactive Visual Preview */}
                    <ScrollReactiveImage
                      src={currentLayer.imageUrl}
                      alt={currentLayer.title}
                      badgeText={currentLayer.code}
                      metricText={currentLayer.metricValue}
                      accentColor={currentLayer.accent}
                      aspectClass="h-24 sm:h-32"
                      overlayTitle={currentLayer.title}
                      overlaySubtitle={currentLayer.subtitle}
                    />

                    {/* Interactive Animated Checklist Nodes */}
                    <div className="space-y-1.5 p-3 rounded-2xl bg-[#06080F] border border-white/10">
                      {currentLayer.previewNodes.map((node, i) => (
                        <motion.div
                          key={node}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                          className="flex items-center gap-2.5 text-xs text-slate-200"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{node}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Progress bar inside holographic card */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>PROGRESSO DE INSPEÇÃO DA ARQUITETURA</span>
                        <span className="text-cyan-400 font-bold">{(activeLayer + 1) * 25}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                        <motion.div
                          animate={{ width: `${(activeLayer + 1) * 25}%` }}
                          transition={{ duration: 0.3 }}
                          className={`h-full bg-gradient-to-r ${currentLayer.accent}`}
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="text-xs font-mono text-slate-400">
                        <span>{currentLayer.metricLabel}: </span>
                        <strong className="text-white">{currentLayer.metricValue}</strong>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick(900);
                          onOpenFunnel();
                        }}
                        className="btn-cyber-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5 text-slate-950" />
                        <span>Aplicar no Meu Projeto</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            PART 2: PINNED VERTICAL TOP-TO-BOTTOM TIMELINE + ALL COMPLETED FINALE
           ===================================================================== */}
        <div
          ref={timelineTrackRef}
          className="relative lg:min-h-[280vh] py-10 lg:py-0 border-t border-white/10"
        >
          <div className="lg:sticky lg:top-15 lg:py-3 flex flex-col justify-center space-y-3.5">
            {/* Header + Active Vertical Step Readout */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
              <div className="space-y-1 max-w-2xl">
                <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                  JORNADA GUIADA PELO SCROLL · DO ZERO AO AR EM 3 A 7 DIAS
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                  Como Tiramos Seu Projeto do Papel{' '}
                  <span className="text-gradient-animated">Passo a Passo</span>
                </h3>
              </div>

              <div className="relative z-20 lg:static flex items-center justify-between sm:justify-start gap-2 sm:gap-3 px-3.5 py-2.5 rounded-2xl bg-[#0B0F1A]/95 backdrop-blur-md border border-emerald-400/35 shrink-0 shadow-lg">
                <span className="text-xs font-mono text-slate-300">
                  {isAllCompleted ? (
                    <strong className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="hidden sm:inline">TODAS AS 4 ETAPAS </span>CONCLUÍDAS!
                    </strong>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Descendo pelas etapas: </span>
                      <strong className="text-cyan-300">
                        Etapa 0{activeStep + 1} / 04
                      </strong>
                    </>
                  )}
                </span>

                <div className="flex items-center gap-1">
                  {steps.map((s, idx) => {
                    const done = isAllCompleted || activeStep > idx;
                    const current = !isAllCompleted && activeStep === idx;
                    return (
                      <button
                        key={s.number}
                        type="button"
                        onClick={() =>
                          jumpToTrackIndex(
                            timelineTrackRef,
                            idx,
                            5,
                            setActiveStep,
                            stepInspectorRef
                          )
                        }
                        className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all ${
                          done
                            ? 'bg-emerald-400 text-slate-950'
                            : current
                            ? 'bg-cyan-400 text-slate-950 scale-110'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {done ? '✓' : s.number}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() =>
                      jumpToTrackIndex(timelineTrackRef, 4, 5, setActiveStep, stepInspectorRef)
                    }
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-extrabold cursor-pointer transition-all ${
                      isAllCompleted
                        ? 'bg-emerald-400 text-slate-950 shadow-[0_0_10px_#10b981]'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                    }`}
                    title="Ver todas as 4 etapas concluídas"
                  >
                    ✓ 100%
                  </button>
                </div>
              </div>
            </div>

            {/* Main 2-Column Vertical Timeline + Finale Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              {/* LEFT COLUMN (col-span-7): Vertical Top-to-Bottom Pipeline */}
              <div className="lg:col-span-7 relative pl-12 sm:pl-14 space-y-3">
                {/* Vertical Background Track Line */}
                <div className="absolute left-5 sm:left-6 top-6 bottom-6 w-[3px] bg-slate-800/90 rounded-full overflow-hidden">
                  <motion.div
                    style={{ scaleY: laserScaleY }}
                    className={`w-full h-full origin-top transition-colors duration-300 ${
                      isAllCompleted
                        ? 'bg-emerald-400 shadow-[0_0_18px_#10b981]'
                        : 'bg-gradient-to-b from-cyan-400 via-emerald-400 to-amber-400 shadow-[0_0_14px_#22d3ee]'
                    }`}
                  />
                </div>

                {steps.map((st, idx) => {
                  const isCurrent = !isAllCompleted && activeStep === idx;
                  const isCompleted = isAllCompleted || activeStep > idx;

                  return (
                    <motion.div
                      key={st.number}
                      onClick={() =>
                        jumpToTrackIndex(
                          timelineTrackRef,
                          idx,
                          5,
                          setActiveStep,
                          stepInspectorRef
                        )
                      }
                      animate={
                        isDesktop
                          ? {
                              x: isCurrent ? 8 : 0,
                              scale: isAllCompleted
                                ? 1
                                : isCurrent
                                ? 1.015
                                : isCompleted
                                ? 0.99
                                : 0.95,
                              opacity: isAllCompleted
                                ? 1
                                : isCurrent
                                ? 1
                                : isCompleted
                                ? 0.9
                                : 0.38,
                            }
                          : {
                              x: 0,
                              scale: isCurrent ? 1.01 : 1,
                              opacity: isAllCompleted || isCurrent || isCompleted ? 1 : 0.72,
                            }
                      }
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className={`relative p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isAllCompleted
                          ? 'bg-[#09151B]/95 border-emerald-400/60 shadow-lg shadow-emerald-950/30'
                          : isCurrent
                          ? `bg-[#0C1324] ${st.borderActive} shadow-xl scrolly-glow-border`
                          : isCompleted
                          ? 'bg-[#0A111D] border-emerald-500/35'
                          : 'bg-[#090C15]/70 border-white/10 hover:border-white/25'
                      }`}
                    >
                      {/* Vertical Node Circle on the Left Spine */}
                      <div
                        className={`absolute -left-12 sm:-left-13 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center font-mono font-extrabold text-xs transition-all duration-300 shadow-lg ${
                          isCompleted
                            ? 'bg-emerald-400 text-slate-950 shadow-emerald-400/40 scale-105'
                            : isCurrent
                            ? `bg-gradient-to-br ${st.accentBg} text-slate-950 shadow-cyan-400/40 scale-110`
                            : 'bg-[#06080F] border border-slate-700 text-slate-500'
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : st.number}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[10px] font-mono font-bold ${
                                isAllCompleted ? 'text-emerald-400' : st.accentText
                              }`}
                            >
                              {st.tag}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                isCompleted
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : isCurrent
                                  ? 'bg-cyan-400 text-slate-950'
                                  : 'bg-slate-900 text-slate-500'
                              }`}
                            >
                              {isCompleted
                                ? '✓ ETAPA CONCLUÍDA'
                                : isCurrent
                                ? '● EM EXECUÇÃO AGORA'
                                : 'AGUARDANDO SCROLL'}
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-bold font-heading text-white">
                            {st.title}
                          </h4>
                          <p className="text-xs text-slate-300 leading-snug">
                            {st.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* RIGHT COLUMN (col-span-5): Live Step Details OR "All 4 Completed" Finale */}
              <div ref={stepInspectorRef} className="lg:col-span-5 flex flex-col scroll-mt-28">
                <AnimatePresence mode="wait">
                  {!isAllCompleted ? (
                    <motion.div
                      key={`step-detail-${currentStepObj.number}`}
                      initial={{ opacity: 0, y: 20, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -16, scale: 0.96 }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-3xl p-5 sm:p-6 bg-[#0B0F1A] border ${currentStepObj.borderActive} scrolly-glow-border flex flex-col justify-between space-y-3.5`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                          <span className="px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold">
                            PASSO 0{focusedStepIdx + 1} DE 04
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            Role para descer ↓
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentStepObj.accentBg} text-slate-950 flex items-center justify-center shrink-0 shadow-lg`}
                          >
                            <CurrentStepIcon className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          <div>
                            <div className={`text-xs font-mono font-bold ${currentStepObj.accentText}`}>
                              {currentStepObj.tag}
                            </div>
                            <h4 className="text-lg sm:text-xl font-extrabold font-heading text-white">
                              {currentStepObj.title}
                            </h4>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {currentStepObj.subtitle}. {currentStepObj.description}
                        </p>

                        <ScrollReactiveImage
                          src={currentStepObj.imageUrl}
                          alt={currentStepObj.title}
                          badgeText={currentStepObj.tag}
                          metricText={`PASSO ${currentStepObj.number}`}
                          accentColor={currentStepObj.accentBg}
                          aspectClass="h-28 sm:h-32"
                          overlayTitle={currentStepObj.title}
                          overlaySubtitle={currentStepObj.deliverable}
                        />

                        <div className="p-3 rounded-2xl bg-[#06080F] border border-white/10 space-y-1">
                          <div className="text-[10px] font-mono uppercase text-slate-400">
                            ENTREGA GARANTIDA NESTA ETAPA:
                          </div>
                          <div className="flex items-start gap-2 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{currentStepObj.deliverable}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2.5 border-t border-white/10">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>AVANÇO DA JORNADA</span>
                          <span className="text-cyan-400 font-bold">
                            {(focusedStepIdx + 1) * 25}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                          <motion.div
                            animate={{ width: `${(focusedStepIdx + 1) * 25}%` }}
                            className={`h-full bg-gradient-to-r ${currentStepObj.accentBg}`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="all-steps-completed-finale"
                      initial={{ opacity: 0, scale: 0.94, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#081C18] via-[#0B1220] to-[#071A1E] border-2 border-emerald-400 shadow-2xl shadow-emerald-950/50 flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/25">
                          <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-mono font-extrabold">
                            ✓ JORNADA 100% CONCLUÍDA
                          </span>
                          <span className="text-xs font-mono text-emerald-300 font-bold">
                            4 / 4 ETAPAS PRONTAS
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="text-2xl sm:text-3xl font-extrabold font-heading text-white leading-tight">
                            Todas as Etapas Concluídas: Sua Estrutura Pronta Para Vender!
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                            Em apenas <strong className="text-emerald-300">3 a 7 dias úteis</strong>, sua empresa sai do zero e recebe toda a estrutura publicada e funcionando:
                          </p>
                        </div>

                        {/* Summary of all 4 completed steps */}
                        <div className="space-y-2 p-4 rounded-2xl bg-[#06080F]/90 border border-emerald-500/30">
                          {steps.map((s) => (
                            <div
                              key={s.number}
                              className="flex items-center justify-between gap-2 text-xs py-1 border-b border-white/5 last:border-0"
                            >
                              <span className="flex items-center gap-2 text-white font-semibold">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>
                                  {s.number}. {s.title}
                                </span>
                              </span>
                              <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                                CONCLUÍDA ✓
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <a
                          href="#orcamento"
                          onClick={() => sound.playSuccess()}
                          className="btn-cyber-primary w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl cursor-pointer"
                        >
                          <Rocket className="w-4 h-4 text-slate-950 shrink-0" />
                          <span>Iniciar Meu Projeto no Simulador Agora</span>
                          <ArrowRight className="w-4 h-4 text-slate-950 shrink-0" />
                        </a>
                        <div className="text-center text-[11px] font-mono text-emerald-300">
                          Domínio Próprio + 1 Ano de Hospedagem + SSL Inclusos
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
