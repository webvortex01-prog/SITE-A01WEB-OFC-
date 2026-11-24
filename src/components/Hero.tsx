import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import {
  ArrowRight,
  Bot,
  Cpu,
  Layers,
  Calculator,
  CheckCircle2,
  RotateCcw,
  Smartphone,
  Send,
  Sparkles,
} from 'lucide-react';
import { sound } from '../utils/audio';

type ActiveDemo = 'automation' | 'speed' | 'systems';

interface HeroProps {
  onOpenFunnel?: () => void;
}

export default function Hero({ onOpenFunnel }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const smoothHeroScroll = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.4,
  });

  // Parallax & 3D transforms driven by scroll
  const orb1Y = useTransform(smoothHeroScroll, [0, 1], [0, 150]);
  const orb1Scale = useTransform(smoothHeroScroll, [0, 1], [1, 1.38]);
  const orb2Y = useTransform(smoothHeroScroll, [0, 1], [0, -110]);
  const leftColY = useTransform(smoothHeroScroll, [0, 1], [0, -32]);
  const leftColScale = useTransform(smoothHeroScroll, [0, 1], [1, 0.96]);
  const leftColOpacity = useTransform(smoothHeroScroll, [0, 0.85, 1], [1, 0.9, 0.55]);
  const rightColY = useTransform(smoothHeroScroll, [0, 1], [0, -56]);
  const rightColRotateX = useTransform(smoothHeroScroll, [0, 1], [0, 7]);
  const rightColScale = useTransform(smoothHeroScroll, [0, 1], [1, 0.95]);
  const stripY = useTransform(smoothHeroScroll, [0, 0.5, 1], [24, 0, -20]);

  const [activeDemo, setActiveDemo] = useState<ActiveDemo>('automation');
  const [chatChoice, setChatChoice] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Speed race simulation state
  const [raceRunId, setRaceRunId] = useState<number>(0);
  const [fastProgress, setFastProgress] = useState<number>(100);
  const [slowProgress, setSlowProgress] = useState<number>(38);

  // Interactive mini-system state (Functional Modules instead of fake client names)
  const [systemItems, setSystemItems] = useState([
    { id: '1', client: 'Módulo de Agendamento & Horários', service: 'Integrado direto ao seu WhatsApp', time: '24/7', done: true },
    { id: '2', client: 'Catálogo Digital & Pedidos PIX', service: 'Sem taxas ou comissões por venda', time: 'Ativo', done: true },
    { id: '3', client: 'Painel de Controle de Clientes', service: 'Acesso fácil pelo celular ou PC', time: 'Sob Medida', done: false },
  ]);

  const chatReplies = [
    {
      buttonLabel: '1. Catálogo & PIX',
      userText: 'Quero ver o catálogo completo e a tabela de valores.',
      botResponse:
        'Perfeito! Aqui está nosso catálogo digital atualizado com valores e condições no PIX ou cartão. Qual opção mais te interessou?',
    },
    {
      buttonLabel: '2. Agendar Horário',
      userText: 'Quais horários vocês têm disponíveis para amanhã?',
      botResponse:
        'Temos horário livre amanhã às 10:30 e às 15:00! Clique abaixo para já deixar reservado no seu nome:',
    },
    {
      buttonLabel: '3. Especialista',
      userText: 'Tenho uma dúvida específica antes de fechar.',
      botResponse:
        'Claro! Já separei suas informações e nosso especialista acabou de ser notificado para te responder agora mesmo.',
    },
  ];

  const handleSelectChatChoice = (index: number) => {
    sound.playSelect();
    setChatChoice(index);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 320);
  };

  // Run visual loading race when switching to 'speed' tab or clicking replay
  useEffect(() => {
    if (activeDemo !== 'speed') return;
    setFastProgress(0);
    setSlowProgress(0);

    const fastTimer = setTimeout(() => {
      setFastProgress(100);
    }, 120);

    const slowInterval = setInterval(() => {
      setSlowProgress((prev) => {
        if (prev >= 42) {
          clearInterval(slowInterval);
          return 42;
        }
        return prev + 7;
      });
    }, 140);

    return () => {
      clearTimeout(fastTimer);
      clearInterval(slowInterval);
    };
  }, [activeDemo, raceRunId]);

  const handleToggleSystemItem = (id: string) => {
    sound.playSelect();
    setSystemItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleSpotlightMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative pt-22 pb-12 md:pt-26 md:pb-16 overflow-hidden border-b border-white/10 scrolly-perspective"
    >
      {/* Subtle architectural ambient light with scroll parallax (GPU-optimized radial gradient) */}
      <motion.div
        style={{
          y: orb1Y,
          scale: orb1Scale,
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.11) 0%, transparent 70%)',
        }}
        className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[440px] rounded-full pointer-events-none"
      />
      <motion.div
        style={{
          y: orb2Y,
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.09) 0%, transparent 70%)',
        }}
        className="absolute bottom-10 right-1/4 w-[460px] h-[320px] rounded-full pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: High-Converting Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: leftColY, scale: leftColScale, opacity: leftColOpacity }}
            className="lg:col-span-7 flex flex-col justify-between text-left space-y-5"
          >
            <div className="space-y-4">
              {/* Clean unboxed metadata kicker (Zero-Pill Discipline) */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400 tracking-wide">
                <span>ENGENHARIA DIGITAL 01 WEB</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300">SITES RÁPIDOS</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300">SISTEMAS SOB MEDIDA</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300">AUTOMAÇÃO WHATSAPP</span>
              </div>

              {/* Headline */}
              <h1
                className="font-extrabold tracking-tight font-heading text-white leading-[1.05]"
                style={{ fontSize: 'clamp(2.25rem, 3.8vw, 3.45rem)' }}
              >
                Seu anúncio atrai o clique.{' '}
                <span className="text-gradient-animated">
                  Sua estrutura digital define se o cliente fecha com você.
                </span>
              </h1>

              {/* Concrete Value Proposition */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                Quando um potencial cliente clica no seu anúncio ou perfil do Instagram, ele julga o profissionalismo da sua empresa em poucos segundos. Na{' '}
                <strong className="text-white font-semibold">01 Web</strong>, criamos{' '}
                <strong className="text-white font-semibold">
                  sites modernos e leves, sistemas de gestão personalizados e fluxos de atendimento no WhatsApp
                </strong>{' '}
                que organizam e agilizam suas vendas.
              </p>

              {/* Editorial Numbered Capabilities Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div
                  onMouseMove={handleSpotlightMove}
                  className="spotlight-card p-4 rounded-xl"
                >
                  <div className="text-xs font-mono text-cyan-400 font-semibold">
                    01. Apresentação de Alto Padrão
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Design exclusivo e carregamento imediato no celular para transmitir confiança desde o primeiro acesso.
                  </p>
                </div>
                <div
                  onMouseMove={handleSpotlightMove}
                  className="spotlight-card p-4 rounded-xl"
                >
                  <div className="text-xs font-mono text-cyan-400 font-semibold">
                    02. Atendimento & Gestão Prática
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Triagem inteligente no WhatsApp 24h, catálogo ou agendamento online e sistema próprio sem mensalidades.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs & Direct Offer */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {onOpenFunnel && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick(950);
                      onOpenFunnel();
                    }}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-sm sm:text-base whitespace-nowrap shrink-0 cursor-pointer shadow-lg shadow-cyan-950/60"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
                    <span>Qualificar Meu Negócio Grátis</span>
                    <ArrowRight className="w-4 h-4 text-slate-950 shrink-0" />
                  </button>
                )}

                <a
                  href="#portfolio"
                  onClick={() => sound.playClick(900)}
                  className="btn-cyber-primary inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 font-bold text-sm sm:text-base whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Testar 6 Projetos Reais</span>
                </a>

                <a
                  href="#orcamento"
                  onClick={() => sound.playSelect()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#0B0F1A] hover:bg-slate-900 border border-white/15 hover:border-cyan-400/50 text-slate-300 hover:text-white font-semibold text-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Simulador Online</span>
                </a>
              </div>

              {/* Clean unboxed trust line */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 font-mono">
                <span className="text-emerald-400 font-semibold">Projetos a partir de R$ 180</span>
                <span aria-hidden="true">·</span>
                <span>1 Ano de Hospedagem + Domínio Inclusos</span>
                <span aria-hidden="true">·</span>
                <span>Entrega em 3 a 7 dias úteis</span>
                <span aria-hidden="true">·</span>
                <a
                  href="#bastidores"
                  onClick={() => sound.playSelect()}
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline decoration-cyan-400/50 underline-offset-4"
                >
                  ▶ Assistir Tour de 40s
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Executive Live Simulator Console */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{
              y: rightColY,
              rotateX: rightColRotateX,
              scale: rightColScale,
              transformStyle: 'preserve-3d',
            }}
            className="lg:col-span-5 flex flex-col"
          >
            <div
              onMouseMove={handleSpotlightMove}
              className="spotlight-card rounded-2xl p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4"
            >
              {/* Top Console Header & Segmented Controls */}
              <div className="space-y-3 pb-3.5 border-b border-white/10">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-200 font-semibold">LABORATÓRIO INTERATIVO 01 WEB</span>
                  <span className="text-cyan-400">Clique para testar</span>
                </div>

                {/* Interactive Segmented Control */}
                <div className="grid grid-cols-3 gap-1 bg-[#06080F] p-1 rounded-xl border border-white/10 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playSelect();
                      setActiveDemo('automation');
                    }}
                    className={`py-2 px-2 rounded-lg text-center transition-colors cursor-pointer whitespace-nowrap truncate ${
                      activeDemo === 'automation'
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Atendimento 24h
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playSelect();
                      setActiveDemo('speed');
                    }}
                    className={`py-2 px-2 rounded-lg text-center transition-colors cursor-pointer whitespace-nowrap truncate ${
                      activeDemo === 'speed'
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Velocidade Mobile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playSelect();
                      setActiveDemo('systems');
                    }}
                    className={`py-2 px-2 rounded-lg text-center transition-colors cursor-pointer whitespace-nowrap truncate ${
                      activeDemo === 'systems'
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sistemas Web
                  </button>
                </div>
                {/* Dynamic Visual Preview Banner inside the Console */}
                <div className="relative h-28 rounded-xl overflow-hidden border border-white/15 bg-[#05070E]">
                  <img
                    src={
                      activeDemo === 'automation'
                        ? 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=900&q=80'
                        : activeDemo === 'speed'
                        ? 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80'
                        : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80'
                    }
                    alt="Preview Engenharia 01 WEB"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-65 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-[#06080F]/45 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-white font-bold">
                      {activeDemo === 'automation'
                        ? '⚡ Triagem WhatsApp 24/7 em Tempo Real'
                        : activeDemo === 'speed'
                        ? '🚀 Motor Mobile-First < 0.8s (100 PageSpeed)'
                        : '💻 Painel & Sistema Próprio Sem Mensalidade'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-extrabold text-[10px]">
                      AO VIVO
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated Mode Container */}
              <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {/* Mode 1: Interactive Automation 24/7 */}
                  {activeDemo === 'automation' && (
                    <motion.div
                      key="automation"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-3"
                    >
                      <div className="p-3.5 rounded-xl bg-[#06080F] border border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                          <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                            <Bot className="w-4 h-4" />
                            Teste a Resposta Automática
                          </span>
                          <span className="text-emerald-400">Online 24/7</span>
                        </div>

                        {/* Interactive Quick Reply Selector */}
                        <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                          {chatReplies.map((reply, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectChatChoice(idx)}
                              className={`px-2 py-1.5 rounded-lg text-[11px] font-mono transition-colors cursor-pointer whitespace-nowrap truncate ${
                                chatChoice === idx
                                  ? 'bg-cyan-400/20 border border-cyan-400 text-cyan-300 font-semibold'
                                  : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
                              }`}
                            >
                              {reply.buttonLabel}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-2 text-xs pt-1">
                          <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] text-slate-400 font-mono block mb-0.5">
                                Cliente vindo do seu Anúncio:
                              </span>
                              "{chatReplies[chatChoice].userText}"
                            </div>
                            <Send className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-1" />
                          </div>

                          <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-400/30 text-slate-100 min-h-[68px] flex flex-col justify-center">
                            <span className="text-[10px] text-cyan-300 font-mono block mb-0.5">
                              Atendimento Automático 01 WEB:
                            </span>
                            {isTyping ? (
                              <span className="text-xs font-mono text-cyan-300">
                                Digitando resposta imediata...
                              </span>
                            ) : (
                              <motion.p
                                key={chatChoice}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                "{chatReplies[chatChoice].botResponse}"
                              </motion.p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-[#06080F] border border-white/10">
                          <div className="text-slate-400 text-[11px]">Triagem Inicial</div>
                          <div className="text-xs font-bold text-emerald-400 mt-0.5">
                            Cliente já chega filtrado
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#06080F] border border-white/10">
                          <div className="text-slate-400 text-[11px]">Disponibilidade</div>
                          <div className="text-xs font-bold text-cyan-300 mt-0.5">
                            Ativo 24h · 7 dias
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Mode 2: Live Visual Loading Race (01 WEB vs Template Comum) */}
                  {activeDemo === 'speed' && (
                    <motion.div
                      key="speed"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                          Simulação de Abertura no 4G
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            sound.playSelect();
                            setRaceRunId((prev) => prev + 1);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#06080F] border border-cyan-400/40 text-cyan-300 hover:text-white text-[11px] font-mono cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Repetir Teste</span>
                        </button>
                      </div>

                      {/* 01 WEB Fast Bar */}
                      <div className="p-3.5 rounded-xl bg-[#06080F] border border-emerald-500/40 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-emerald-400 font-bold">ESTRUTURA 01 WEB (CÓDIGO LEVE)</span>
                          <span className="text-white font-bold tabular-nums">{fastProgress}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                            style={{ width: `${fastProgress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-300">
                          <span>Carregamento imediato no celular</span>
                          <span className="text-emerald-400 font-mono font-semibold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Página Pronta</span>
                          </span>
                        </div>
                      </div>

                      {/* Slow Common Template Bar */}
                      <div className="p-3.5 rounded-xl bg-[#06080F] border border-rose-500/30 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-rose-400 font-bold">TEMPLATE COMUM PESADO</span>
                          <span className="text-rose-300 font-bold tabular-nums">{slowProgress}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                          <div
                            className="h-full bg-rose-500/80 transition-all duration-300"
                            style={{ width: `${slowProgress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Excesso de plugins travando a tela</span>
                          <span className="text-rose-400 font-mono">Risco de fechar a aba</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Mode 3: Interactive Mini-System Preview */}
                  {activeDemo === 'systems' && (
                    <motion.div
                      key="systems"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-3"
                    >
                      <div className="p-3.5 rounded-xl bg-[#06080F] border border-white/10 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                            <Cpu className="w-4 h-4" />
                            Painel Gerencial Interativo
                          </span>
                          <span className="text-emerald-400 font-bold">Clique para Marcar</span>
                        </div>

                        <div className="space-y-1.5 text-xs font-mono">
                          {systemItems.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleToggleSystemItem(item.id)}
                              className="w-full p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800/90 border border-white/5 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <CheckCircle2
                                  className={`w-4 h-4 shrink-0 transition-colors ${
                                    item.done ? 'text-emerald-400' : 'text-slate-600'
                                  }`}
                                />
                                <div className="truncate">
                                  <span className="text-white font-semibold block truncate">
                                    {item.client}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {item.service} · {item.time}
                                  </span>
                                </div>
                              </div>
                              <span
                                className={`text-[10px] font-bold shrink-0 ${
                                  item.done ? 'text-emerald-400' : 'text-amber-300'
                                }`}
                              >
                                {item.done ? 'Confirmado' : 'Pendente'}
                              </span>
                            </button>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                          <span className="text-slate-400">Mensalidade de Plataforma</span>
                          <span className="font-bold text-cyan-300 tabular-nums">R$ 0,00 / mês</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Console Action */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Navegue em 6 projetos reais rodando ao vivo</span>
                <a
                  href="#portfolio"
                  onClick={() => sound.playClick()}
                  className="font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 whitespace-nowrap"
                >
                  <span>Abrir Vitrine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Honest Capabilities Strip Below the Split */}
        <motion.div
          style={{ y: stripY }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10"
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.02, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleSpotlightMove}
            className="spotlight-card p-5 rounded-2xl"
          >
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
              100% Mobile
            </div>
            <div className="text-xs font-semibold text-cyan-400 mt-1">
              Otimizado para Celular e 4G
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Projetado para abrir rápido quando seu cliente clica no anúncio do Instagram ou pesquisa no Google.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleSpotlightMove}
            className="spotlight-card p-5 rounded-2xl"
          >
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
              Sob Medida
            </div>
            <div className="text-xs font-semibold text-white mt-1">
              Design Exclusivo para Seu Nicho
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Estrutura visual pensada para valorizar seus serviços, transmitir confiança e facilitar o orçamento.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleSpotlightMove}
            className="spotlight-card p-5 rounded-2xl"
          >
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tabular-nums">
              24/7
            </div>
            <div className="text-xs font-semibold text-cyan-400 mt-1">
              Atendimento Organizado no Zap
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Seu cliente já chega no WhatsApp dizendo o que precisa, economizando tempo no seu dia a dia.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleSpotlightMove}
            className="spotlight-card p-5 rounded-2xl"
          >
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300 tabular-nums">
              1 Ano Grátis
            </div>
            <div className="text-xs font-semibold text-white mt-1">
              Domínio + Hospedagem Inclusos
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Entregamos seu projeto pronto e publicado na internet com domínio próprio e certificado SSL.
            </p>
          </motion.div>
        </motion.div>

        {/* High-Conversion Authority & Triggers Ribbon */}
        <div className="pt-2">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#091224] via-[#0B1722] to-[#08151E] border border-cyan-400/25 flex flex-wrap items-center justify-around gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              ⚡ ABERTURA &lt; 0.8s NO CELULAR
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-emerald-300 font-bold">
              🤖 TRIAGEM AUTOMÁTICA NO SEU WHATSAPP 24/7
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-amber-300 font-bold">
              🔒 CÓDIGO 100% SEU · R$ 0 MENSALIDADE
            </span>
            <span className="text-slate-600 hidden lg:inline">|</span>
            <span className="text-white font-bold">
              🎁 1 ANO DE DOMÍNIO .COM.BR + HOSPEDAGEM GRÁTIS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
