import { useState, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  ArrowLeftRight,
  Bot,
  Zap,
  MousePointerClick,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HeroProps {
  onOpenFunnel?: () => void;
}

export default function Hero({ onOpenFunnel }: HeroProps) {
  // revealPercent: 0% = 100% ANTES (Site Feio / Patrão Estressado)
  // 100% = 100% DEPOIS (A01 WEB / Patrão Feliz & Empresa Organizada)
  const [revealPercent, setRevealPercent] = useState<number>(0);
  const [isManualDrag, setIsManualDrag] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const heroTrackRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroTrackRef,
    offset: ['start start', 'end end'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 28,
    mass: 0.35,
  });

  // 3D depth effect on the cinema frame during scroll
  const frameScale = useTransform(smoothScroll, [0, 0.5, 1], [0.98, 1.01, 1]);
  const frameRotateX = useTransform(smoothScroll, [0, 0.4, 1], [3, 0, 0]);

  // As user scrolls through the pinned Hero track, revealPercent goes from 0% (Antes) -> 100% (Depois A01 WEB)
  useMotionValueEvent(smoothScroll, 'change', (v) => {
    if (v <= 0.02) {
      if (isManualDrag && !isDragging) setIsManualDrag(false);
    }
    if (!isManualDrag) {
      // Map scroll 0.03..0.82 to 0%..100% transformation
      const normalized = Math.max(0, Math.min(1, (v - 0.03) / 0.78));
      setRevealPercent(Math.round(normalized * 100));
    }
  });

  const handlePointerUpdate = (clientX: number) => {
    if (!frameRef.current) return;
    setIsManualDrag(true);
    const rect = frameRef.current.getBoundingClientRect();
    const rawPct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = rawPct <= 2 ? 0 : rawPct >= 98 ? 100 : rawPct;
    setRevealPercent(Math.round(Math.max(0, Math.min(100, clamped))));
  };

  const jumpToHeroState = (targetPct: number) => {
    sound.playSelect();
    setIsManualDrag(true);
    setRevealPercent(targetPct);
  };

  const isTransformed = revealPercent >= 50;

  return (
    <section
      ref={heroTrackRef}
      id="inicio"
      className="relative lg:min-h-[215vh] pt-18 pb-10 lg:py-0 overflow-x-clip border-b border-white/10 bg-[#06080F]"
    >
      {/* Subtle Ambient Background Glow that shifts from Crimson (Before) to Cyan/Emerald (After) */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-700 z-0"
        style={{
          background: isTransformed
            ? 'radial-gradient(circle at 50% 35%, rgba(34, 211, 238, 0.13) 0%, rgba(16, 185, 129, 0.07) 40%, transparent 75%)'
            : 'radial-gradient(circle at 50% 35%, rgba(244, 63, 94, 0.12) 0%, rgba(245, 158, 11, 0.06) 40%, transparent 75%)',
        }}
      />

      {/* Sticky Viewport Container */}
      <div className="lg:sticky lg:top-14 lg:py-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col justify-center space-y-3.5">
        {/* ===================================================================
            TOP COMPACT HEADER + SCROLL TRANSFORMATION CONTROLS
           =================================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span
                className={`px-2.5 py-0.5 rounded-full font-extrabold transition-colors duration-300 ${
                  isTransformed
                    ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {isTransformed
                  ? '✓ DEPOIS: EMPRESA ORGANIZADA COM A 01 WEB'
                  : '⚠️ ANTES: SITE FEIO, ATENDIMENTO LENTO & CAOS'}
              </span>
              <span className="text-cyan-400 font-bold">
                · ROLE O MOUSE OU ARRASTE A IMAGEM PARA VER A TRANSFORMAÇÃO ({revealPercent}%)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight font-heading text-white leading-[1.08]">
              {isTransformed ? (
                <>
                  Com a <span className="text-gradient-animated">01 WEB</span>: Seu Site Vende, o
                  Robô Atende 24/7 e Sua Empresa Funciona no Automático.
                </>
              ) : (
                <>
                  Cansado de <span className="text-rose-400">Site Feio, Atendimento Lento</span> e
                  Perder Clientes Todo Dia no WhatsApp?
                </>
              )}
            </h1>
          </div>

          {/* Quick Interactive Before / 50-50 / After Buttons */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0B0F1A]/95 border border-white/15 shrink-0 self-start lg:self-end shadow-xl">
            <button
              type="button"
              onClick={() => jumpToHeroState(0)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold transition-all cursor-pointer ${
                revealPercent < 25
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. 😱 Antes (Caos)
            </button>
            <button
              type="button"
              onClick={() => jumpToHeroState(50)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold transition-all cursor-pointer ${
                revealPercent >= 25 && revealPercent <= 75
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              50/50
            </button>
            <button
              type="button"
              onClick={() => jumpToHeroState(100)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold transition-all cursor-pointer ${
                revealPercent > 75
                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. 🚀 Depois (Padrão 01 WEB)
            </button>
          </div>
        </div>

        {/* ===================================================================
            CENTERPIECE: WIDESCREEN 16:9 BEFORE -> AFTER CINEMA STAGE
            Displays RD's 2 custom photos at full clarity with scroll-driven
            laser reveal AND pointer drag!
           =================================================================== */}
        <motion.div
          style={{
            scale: frameScale,
            rotateX: frameRotateX,
            transformStyle: 'preserve-3d',
          }}
          className="scrolly-perspective"
        >
          <div
            ref={frameRef}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setIsDragging(true);
              handlePointerUpdate(e.clientX);
            }}
            onPointerMove={(e) => {
              if (isDragging || e.buttons === 1) {
                handlePointerUpdate(e.clientX);
              }
            }}
            onPointerUp={(e) => {
              setIsDragging(false);
              try {
                e.currentTarget.releasePointerCapture(e.pointerId);
              } catch {
                // ignore
              }
            }}
            onPointerCancel={() => setIsDragging(false)}
            className={`relative w-full h-[270px] sm:h-[380px] lg:h-[430px] rounded-3xl overflow-hidden select-none cursor-ew-resize transition-colors duration-500 touch-pan-y ${
              isTransformed
                ? 'border-2 border-cyan-400 shadow-[0_20px_80px_-15px_rgba(34,211,238,0.4)]'
                : 'border-2 border-rose-500/50 shadow-[0_20px_80px_-15px_rgba(244,63,94,0.3)]'
            }`}
          >
            {/* ===============================================================
                BASE LAYER (z-10): ANTES — SITE FEIO / ATENDIMENTO LENTO / CAOS
               =============================================================== */}
            <div className="absolute inset-0 z-10 bg-[#0A080C]">
              <img
                src="/images/hero-antes-caos.jpg"
                alt="Antes: Site Feio, Atendimento Lento e Sem Organização"
                className="w-full h-full object-cover object-center pointer-events-none"
              />
              {/* Subtle top/bottom vignette so badges pop without covering the monitor or face */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#06080F]/90 to-transparent pointer-events-none" />

              {/* Top-Right Corner Warning Badge */}
              <div className="absolute top-3.5 right-3.5 z-20 px-3.5 py-1.5 rounded-xl bg-rose-950/90 backdrop-blur-md border border-rose-500/60 text-rose-200 text-xs font-mono font-extrabold flex items-center gap-2 shadow-xl">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>ANTES: SITE FEIO · ATENDIMENTO LENTO · SEM ORGANIZAÇÃO</span>
              </div>

              {/* Bottom-Left Prompt */}
              <div className="absolute bottom-3.5 left-4 z-20 flex items-center gap-2 text-xs font-mono text-rose-300 font-bold">
                <span>❌ Perda diária de orçamentos e estresse operacional</span>
              </div>
            </div>

            {/* ===============================================================
                TOP REVEAL LAYER (z-20): DEPOIS — A01 WEB EMPRESA ORGANIZADA
                Revealed from Left (0%) to Right (revealPercent%) as user scrolls!
               =============================================================== */}
            <div
              className="absolute inset-0 z-20 bg-[#07111E] overflow-hidden"
              style={{
                clipPath: `inset(0 ${100 - revealPercent}% 0 0)`,
                WebkitClipPath: `inset(0 ${100 - revealPercent}% 0 0)`,
              }}
            >
              <img
                src="/images/hero-depois-a01web.jpg"
                alt="Depois: A01 WEB Empresa Organizada e Automations"
                className="w-full h-full object-cover object-center pointer-events-none"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#06080F]/85 to-transparent pointer-events-none" />

              {/* Top-Left Corner Success Badge */}
              <div className="absolute top-3.5 left-3.5 z-20 px-3.5 py-1.5 rounded-xl bg-[#06151C]/90 backdrop-blur-md border border-emerald-400/70 text-emerald-300 text-xs font-mono font-extrabold flex items-center gap-2 shadow-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>DEPOIS: PADRÃO A01 WEB · EMPRESA ORGANIZADA & AUTOMAÇÃO 24/7</span>
              </div>

              {/* Bottom-Right Floating WhatsApp Bot Telemetry Pill */}
              <div className="absolute bottom-3.5 right-4 z-20 px-3.5 py-1.5 rounded-xl bg-[#060913]/90 backdrop-blur-md border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 shadow-xl">
                <Bot className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>✓ Robô de WhatsApp 24/7 + Painel Próprio Sem Mensalidade</span>
              </div>
            </div>

            {/* ===============================================================
                VERTICAL LASER TRANSFORMATION BEAM (z-30)
               =============================================================== */}
            <div
              className="absolute inset-y-0 -ml-6 w-12 flex items-center justify-center pointer-events-none z-30"
              style={{ left: `${revealPercent}%` }}
            >
              <div className="absolute inset-y-0 w-[3px] bg-gradient-to-b from-cyan-300 via-emerald-400 to-cyan-300 shadow-[0_0_24px_5px_rgba(34,211,238,0.95)]" />
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.95)] border-2 border-white">
                <ArrowLeftRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===================================================================
            BOTTOM ACTION & CONVERSION DECK (FITS 100% IN VIEWPORT)
           =================================================================== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0F1A]/95 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xl">
          <div className="space-y-1 max-w-xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <MousePointerClick className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-emerald-400 font-bold">
                Projetos a partir de R$ 180 · Entrega em 3 a 7 dias úteis
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-cyan-300">1 Ano de Domínio + Hospedagem Grátis</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Saia do improviso hoje: entregamos seu{' '}
              <strong className="text-white">
                Site de Alta Conversão + Automação no WhatsApp + Painel de Gestão
              </strong>{' '}
              prontos e sem aluguel mensal.
            </p>
          </div>

          {/* Primary Conversion Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onOpenFunnel && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick(950);
                  onOpenFunnel();
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm whitespace-nowrap cursor-pointer shadow-lg shadow-cyan-950/60"
              >
                <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
                <span>Organizar Minha Empresa Agora</span>
                <ArrowRight className="w-4 h-4 text-slate-950 shrink-0" />
              </button>
            )}

            <a
              href="#portfolio"
              onClick={() => sound.playClick(900)}
              className="btn-cyber-primary inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 font-bold text-xs sm:text-sm whitespace-nowrap cursor-pointer"
            >
              <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Ver 6 Projetos Reais</span>
            </a>

            <a
              href="#orcamento"
              onClick={() => sound.playSelect()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#06080F] hover:bg-slate-900 border border-white/15 hover:border-cyan-400/50 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Simular Valor</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
