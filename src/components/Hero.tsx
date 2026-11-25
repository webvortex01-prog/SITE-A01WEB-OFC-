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
  ArrowRight,
  Sparkles,
  Layers,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Zap,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  ArrowLeftRight,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { useIsDesktop } from '../utils/scrollytelling';

interface HeroProps {
  onOpenFunnel?: () => void;
}

function HeroMobile({ onOpenFunnel }: HeroProps) {
  const [revealPercent, setRevealPercent] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const updateFromClientX = (clientX: number) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const clamped = raw <= 2 ? 0 : raw >= 98 ? 100 : raw;
    setRevealPercent(Math.round(Math.max(0, Math.min(100, clamped))));
  };

  const isAfterPhase = revealPercent >= 48;

  return (
    <section
      id="inicio"
      className="relative w-full bg-[#04060C] pt-20 pb-8 px-4 overflow-x-clip border-b border-white/10"
    >
      <div className="max-w-xl mx-auto space-y-3.5">
        {/* Compact Phase Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#080C18] border border-white/15 shadow-lg w-full">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isAfterPhase
                ? 'bg-emerald-400 shadow-[0_0_10px_#10b981] animate-ping'
                : 'bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-pulse'
            }`}
          />
          <span className="text-[11px] font-mono font-extrabold tracking-wide uppercase text-white leading-snug">
            {isAfterPhase
              ? 'FASE 02 · PADRÃO A01 WEB: VENDENDO 24/7'
              : 'FASE 01 · REALIDADE COMUM: SITE FEIO & CAOS'}
          </span>
        </div>

        {/* Interactive 16:10 Full-Frame Before/After Visual Box (Zero face obstruction!) */}
        <div
          ref={stageRef}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setIsDragging(true);
            updateFromClientX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (isDragging) {
              updateFromClientX(e.clientX);
            }
          }}
          onPointerUp={(e) => {
            if (!isDragging) return;
            setIsDragging(false);
            try {
              e.currentTarget.releasePointerCapture(e.pointerId);
            } catch {
              // ignore
            }
          }}
          onPointerCancel={() => setIsDragging(false)}
          className="aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/20 relative touch-pan-y select-none shadow-2xl bg-[#080508]"
        >
          {/* Base Image: Antes */}
          <img
            src="/images/hero-antes-caos.jpg"
            alt="Antes: Site Feio, Atendimento Lento e Sem Organização"
            className="w-full h-full object-cover object-center pointer-events-none"
          />

          {/* Top Clipped Image: Depois A01 WEB */}
          <div
            className="absolute inset-0 z-10 overflow-hidden"
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
          </div>

          {/* Non-intrusive top corner badges */}
          <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md bg-rose-950/90 border border-rose-500/60 text-rose-200 text-[10px] font-mono font-extrabold shadow">
              ANTES
            </span>
          </div>
          <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-400/60 text-emerald-300 text-[10px] font-mono font-extrabold shadow">
              A01 WEB
            </span>
          </div>

          {/* Vertical glowing cyan/emerald laser beam & compact orb */}
          <div
            className="absolute inset-y-0 -ml-5 w-10 flex items-center justify-center pointer-events-none z-30"
            style={{ left: `${revealPercent}%` }}
          >
            <div className="absolute inset-y-0 w-6 bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent blur-sm" />
            <div className="absolute inset-y-0 w-[2.5px] bg-gradient-to-b from-cyan-300 via-emerald-400 to-cyan-300 shadow-[0_0_20px_3px_rgba(34,211,238,0.9)]" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.95)] border-2 border-white">
              <ArrowLeftRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Thumb-Friendly Transformation Controls right below the photo */}
        <div className="p-3 rounded-2xl bg-[#070B16] border border-white/15 space-y-2.5 shadow-xl">
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                setRevealPercent(0);
              }}
              className={`py-2 px-2 rounded-xl text-[11px] font-mono font-extrabold transition-all cursor-pointer ${
                revealPercent < 25
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'bg-slate-900/90 text-slate-300 border border-white/10'
              }`}
            >
              😱 Antes
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                setRevealPercent(50);
              }}
              className={`py-2 px-2 rounded-xl text-[11px] font-mono font-extrabold transition-all cursor-pointer ${
                revealPercent >= 25 && revealPercent <= 75
                  ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30'
                  : 'bg-slate-900/90 text-slate-300 border border-white/10'
              }`}
            >
              ⚡ 50/50
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                setRevealPercent(100);
              }}
              className={`py-2 px-2 rounded-xl text-[11px] font-mono font-extrabold transition-all cursor-pointer ${
                revealPercent > 75
                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-md shadow-emerald-400/30'
                  : 'bg-slate-900/90 text-slate-300 border border-white/10'
              }`}
            >
              🚀 A01 WEB
            </button>
          </div>

          <div className="flex items-center gap-2.5 px-1">
            <span className="text-[10px] font-mono text-rose-400 font-bold shrink-0">CAOS</span>
            <input
              type="range"
              min="0"
              max="100"
              value={revealPercent}
              onChange={(e) => setRevealPercent(Number(e.target.value))}
              aria-label="Arrastar para comparar Antes e Depois"
              className="w-full h-2 rounded-lg appearance-none bg-slate-800 accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
              01 WEB
            </span>
          </div>
        </div>

        {/* Full-Width High-Conversion Copy & CTA Card below controls */}
        <motion.div
          key={isAfterPhase ? 'mob-after' : 'mob-before'}
          initial={{ opacity: 0.35 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22 }}
          className={`p-5 rounded-3xl bg-[#070B16] border shadow-2xl space-y-4 ${
            isAfterPhase ? 'border-cyan-400/45' : 'border-rose-500/35'
          }`}
        >
          {!isAfterPhase ? (
            <>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-[11px] font-mono font-extrabold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>ARRASTE A BARRA ACIMA PARA TRANSFORMAR ↑</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight text-white leading-[1.12]">
                Site Feio e Atendimento Lento Estão{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-rose-500">
                  Entregando Seus Clientes Para o Concorrente.
                </span>
              </h1>

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                Quando o cliente clica no seu anúncio e encontra uma página amadora ou demora no
                WhatsApp, você perde a venda em segundos. Puxe o laser na foto acima e veja o padrão{' '}
                <strong className="text-white">01 WEB</strong>:
              </p>

              <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-rose-300 font-extrabold">
                  <span>DIAGNÓSTICO SEM A 01 WEB</span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    CRÍTICO
                  </span>
                </div>
                <div className="text-xs font-bold text-white">
                  ❌ 84% fecham o site antes de carregar
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/50 text-emerald-300 text-[11px] font-mono font-extrabold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>PADRÃO 01 WEB ATIVO ({revealPercent}%)</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight text-white leading-[1.12]">
                Empresa Organizada,{' '}
                <span className="text-gradient-animated">
                  Site de Elite & Robô Vendendo 24/7 no Seu WhatsApp.
                </span>
              </h1>

              <p className="text-slate-100 text-xs sm:text-sm leading-relaxed">
                Na <strong className="text-cyan-300">01 WEB</strong>, sua estrutura fica pronta em{' '}
                <strong className="text-emerald-300">3 a 7 dias</strong>: visual de alto padrão,
                triagem automática 24h no WhatsApp e painel próprio sem mensalidade.
              </p>

              <div className="p-3 rounded-2xl bg-[#05141C] border border-emerald-400/50 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300 font-extrabold">
                  <span className="flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    ROBÔ WHATSAPP 01 WEB · 24/7
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950">
                    AO VIVO
                  </span>
                </div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>&ldquo;Novo Cliente Qualificado & Pronto p/ Fechar!&rdquo;</span>
                </div>
              </div>
            </>
          )}

          <div className="space-y-2 pt-1">
            {onOpenFunnel && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick(950);
                  onOpenFunnel();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.4)]"
              >
                <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
                <span>Quero Organizar Minha Empresa Agora</span>
                <ArrowRight className="w-4 h-4 text-slate-950 shrink-0" />
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <a
                href="#portfolio"
                onClick={() => sound.playClick(900)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl bg-white/10 text-white border border-white/20 font-bold text-xs cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Ver 6 Projetos</span>
              </a>

              <a
                href="#orcamento"
                onClick={() => sound.playSelect()}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl bg-[#060913] text-cyan-300 border border-cyan-400/40 font-bold text-xs cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Simular Orçamento</span>
              </a>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] font-mono text-emerald-300 font-bold text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>1 Ano Domínio + Hospedagem Grátis · Pronto em 3 a 7 dias</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroDesktop({ onOpenFunnel }: HeroProps) {
  // revealPercent: 0 = 100% ANTES (Caos Full-Screen), 100 = 100% DEPOIS (A01 WEB Full-Screen)
  const [revealPercent, setRevealPercent] = useState<number>(0);
  const [isManualControl, setIsManualControl] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const heroSectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end end'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.4,
  });

  // Full-screen background parallax zoom & 3D camera movement on scroll
  const beforeBgScale = useTransform(smoothScroll, [0, 0.6, 1], [1.01, 1.08, 1.12]);
  const afterBgScale = useTransform(smoothScroll, [0, 0.4, 1], [1.1, 1.03, 1.0]);
  const textParallaxY = useTransform(smoothScroll, [0, 0.5, 1], [0, -10, -18]);
  const hudFloatY = useTransform(smoothScroll, [0, 0.5, 1], [12, 0, -12]);

  useMotionValueEvent(smoothScroll, 'change', (v) => {
    if (v <= 0.02 && isManualControl && !isDragging) {
      setIsManualControl(false);
    }
    if (!isManualControl) {
      const normalized = Math.max(0, Math.min(1, (v - 0.02) / 0.78));
      setRevealPercent(Math.round(normalized * 100));
    }
  });

  const updateFromClientX = (clientX: number) => {
    if (!stageRef.current) return;
    setIsManualControl(true);
    const rect = stageRef.current.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const clamped = raw <= 2 ? 0 : raw >= 98 ? 100 : raw;
    setRevealPercent(Math.round(Math.max(0, Math.min(100, clamped))));
  };

  const isAfterPhase = revealPercent >= 48;

  return (
    <section
      ref={heroSectionRef}
      id="inicio"
      className="relative h-[250vh] w-full bg-[#04060C] select-none"
    >
      {/* =====================================================================
          FULL-SCREEN (100vw x 100vh) STICKY CINEMA VIEWPORT
         ===================================================================== */}
      <div
        ref={stageRef}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest('button, a, input')) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          setIsDragging(true);
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (isDragging) {
            updateFromClientX(e.clientX);
          }
        }}
        onPointerUp={(e) => {
          if (!isDragging) return;
          setIsDragging(false);
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {
            // ignore
          }
        }}
        onPointerCancel={() => setIsDragging(false)}
        className="sticky top-0 left-0 w-full h-screen overflow-hidden cursor-ew-resize touch-pan-y"
      >
        {/* ===================================================================
            BACKGROUND LAYER 1 (z-10): FULL-SCREEN "ANTES" (CAOS & SITE FEIO)
            Left side kept CLEAR & BRIGHT so the monitor "SITE FEIO" and the
            stressed businessman's face are 100% visible!
           =================================================================== */}
        <div className="absolute inset-0 z-10 overflow-hidden bg-[#080508]">
          <motion.img
            src="/images/hero-antes-caos.jpg"
            alt="Antes: Site Feio, Atendimento Lento e Sem Organização"
            style={{ scale: beforeBgScale }}
            className="w-full h-full object-cover object-center pointer-events-none will-change-transform"
          />

          {/* Subtle gradient: transparent on the Left (where the guy's face & monitor are!), darker on the Right (where the text card sits!) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, rgba(6,5,10,0.12) 0%, rgba(10,6,12,0.18) 45%, rgba(10,5,10,0.82) 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(6,8,15,0.55) 0%, transparent 22%, transparent 72%, rgba(6,8,15,0.92) 100%)',
            }}
          />
        </div>

        {/* ===================================================================
            BACKGROUND LAYER 2 (z-20): FULL-SCREEN "DEPOIS" (A01 WEB PATRÃO FELIZ)
            Right side kept CLEAR & BRIGHT so the smiling businessman in the suit
            is 100% visible!
           =================================================================== */}
        <div
          className="absolute inset-0 z-20 overflow-hidden bg-[#040B14]"
          style={{
            clipPath: `inset(0 ${100 - revealPercent}% 0 0)`,
            WebkitClipPath: `inset(0 ${100 - revealPercent}% 0 0)`,
          }}
        >
          <motion.img
            src="/images/hero-depois-a01web.jpg"
            alt="Depois: A01 WEB Empresa Organizada e Automations"
            style={{ scale: afterBgScale }}
            className="w-full h-full object-cover object-center pointer-events-none will-change-transform"
          />

          {/* Subtle gradient: darker on the Left (where the Phase 2 text card sits), completely clear on the Right (where the smiling businessman's face is!) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, rgba(4,9,18,0.78) 0%, rgba(6,14,26,0.22) 50%, rgba(4,12,20,0.10) 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(6,8,15,0.55) 0%, transparent 22%, transparent 72%, rgba(6,8,15,0.92) 100%)',
            }}
          />
        </div>

        {/* ===================================================================
            FULL-SCREEN VERTICAL LASER SHOCKWAVE BEAM (z-30)
           =================================================================== */}
        <div
          className="absolute inset-y-0 -ml-8 w-16 flex items-center justify-center pointer-events-none z-30"
          style={{ left: `${revealPercent}%` }}
        >
          <div className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent blur-md" />
          <div className="absolute inset-y-0 w-[3px] bg-gradient-to-b from-cyan-300 via-emerald-400 to-cyan-300 shadow-[0_0_30px_6px_rgba(34,211,238,0.95)]" />
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(34,211,238,1)] border-2 border-white">
            <ArrowLeftRight className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        {/* ===================================================================
            FOREGROUND LAYER (z-40): DYNAMIC LEFT <-> RIGHT SWAP
            - In FASE 01 (Antes / Site Feio):
              * Small Red Diagnostic Card is on the BOTTOM-LEFT
              * Big Headline Box is on the RIGHT (leaving the guy's face & "SITE FEIO" monitor 100% uncovered on the left!)
            - In FASE 02 (Depois / Site Bonito A01 WEB):
              * Big Headline Box swaps to the LEFT
              * Small Green Bot Card swaps to the BOTTOM-RIGHT (leaving the smiling businessman's face 100% uncovered on the right!)
           =================================================================== */}
        <div className="relative z-40 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-5 flex flex-col justify-between pointer-events-none">
          {/* TOP ROW: Floating Phase Status & Quick-Jump Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#060913]/80 backdrop-blur-xl border border-white/15 shadow-2xl">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isAfterPhase
                    ? 'bg-emerald-400 shadow-[0_0_12px_#10b981] animate-ping'
                    : 'bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-pulse'
                }`}
              />
              <span className="text-xs font-mono font-extrabold tracking-wider uppercase text-white">
                {isAfterPhase
                  ? 'FASE 02 · PADRÃO A01 WEB: EMPRESA ORGANIZADA & VENDENDO 24/7'
                  : 'FASE 01 · REALIDADE COMUM: SITE FEIO, ATENDIMENTO LENTO & CAOS'}
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#060913]/85 backdrop-blur-xl border border-white/20 shadow-2xl">
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  setIsManualControl(true);
                  setRevealPercent(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold transition-all cursor-pointer ${
                  revealPercent < 25
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                😱 Antes (0%)
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  setIsManualControl(true);
                  setRevealPercent(50);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold transition-all cursor-pointer ${
                  revealPercent >= 25 && revealPercent <= 75
                    ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/40'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ⚡ 50/50
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  setIsManualControl(true);
                  setRevealPercent(100);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold transition-all cursor-pointer ${
                  revealPercent > 75
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-400/40'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🚀 Depois A01 WEB (100%)
              </button>
            </div>
          </div>

          {/* =================================================================
              MIDDLE ROW: DYNAMIC SIDE-SWAPPING LAYOUT!
              - When !isAfterPhase (ANTES):
                Left Col (col-span-6) = Small Diagnostic Pill at bottom-left (Guy's face & monitor above it are 100% FREE!)
                Right Col (col-span-6) = Big Headline Card on the Right!
              - When isAfterPhase (DEPOIS A01 WEB):
                Left Col (col-span-6) = Big Headline Card on the Left!
                Right Col (col-span-6) = Small Bot Pill at bottom-right (Smiling Boss's face above it is 100% FREE!)
             ================================================================= */}
          <div className="my-auto w-full">
            <AnimatePresence mode="wait">
              {!isAfterPhase ? (
                /* -------------------------------------------------------------
                   FASE 01 (ANTES): SMALL CARD ON LEFT, BIG HEADLINE ON RIGHT!
                   ------------------------------------------------------------- */
                <motion.div
                  key="layout-before-phase"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end"
                >
                  {/* LEFT SIDE (col-span-6): Kept open at top/center so guy's face & monitor show 100%! Only compact badge at bottom-left */}
                  <motion.div
                    style={{ y: hudFloatY }}
                    className="lg:col-span-6 flex flex-col items-start justify-end pointer-events-auto order-2 lg:order-1"
                  >
                    <div className="w-full max-w-sm p-4 rounded-2xl bg-rose-950/85 backdrop-blur-xl border border-rose-500/50 shadow-2xl space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-rose-300 font-extrabold">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          DIAGNÓSTICO SEM A 01 WEB
                        </span>
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                          CRÍTICO
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white">
                        ❌ 84% fecham o site antes de carregar
                      </div>
                      <p className="text-[11px] text-rose-200/90 leading-snug">
                        Você paga pelo clique no anúncio, mas o cliente desiste ou fica esperando
                        resposta manual no WhatsApp.
                      </p>
                    </div>
                  </motion.div>

                  {/* RIGHT SIDE (col-span-6): BIG HEADLINE CARD ON THE RIGHT */}
                  <motion.div
                    style={{ y: textParallaxY }}
                    className="lg:col-span-6 space-y-3.5 p-5 sm:p-6 rounded-3xl bg-[#050811]/75 backdrop-blur-md border border-rose-500/30 shadow-[0_25px_80px_rgba(0,0,0,0.8)] pointer-events-auto order-1 lg:order-2"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-extrabold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>ROLE O MOUSE PARA TRANSFORMAR ESSE CENÁRIO ↓</span>
                    </div>

                    <h1
                      className="font-extrabold font-heading tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
                      style={{ fontSize: 'clamp(1.75rem, 3.1vw, 2.85rem)' }}
                    >
                      Site Feio e Atendimento Lento Estão{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-rose-500 drop-shadow-[0_0_25px_rgba(244,63,94,0.55)]">
                        Entregando Seus Clientes Para o Concorrente.
                      </span>
                    </h1>

                    <p className="text-slate-200 text-xs sm:text-sm leading-relaxed drop-shadow">
                      Quando o cliente clica no seu anúncio e encontra uma página amadora ou demora
                      para ser atendido no WhatsApp, você perde a venda em segundos.{' '}
                      <strong className="text-cyan-300 underline decoration-cyan-400/60">
                        Role a página ou arraste o laser na foto
                      </strong>{' '}
                      e veja o que a <strong className="text-white">01 WEB</strong> faz pela sua
                      empresa:
                    </p>

                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      {onOpenFunnel && (
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick(950);
                            onOpenFunnel();
                          }}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm whitespace-nowrap cursor-pointer shadow-[0_0_25px_rgba(34,211,238,0.45)] transition-transform hover:scale-[1.02]"
                        >
                          <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
                          <span>Quero Organizar Minha Empresa Agora</span>
                          <ArrowRight className="w-4 h-4 text-slate-950 shrink-0" />
                        </button>
                      )}

                      <a
                        href="#portfolio"
                        onClick={() => sound.playClick(900)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/25 font-bold text-xs whitespace-nowrap cursor-pointer transition-all"
                      >
                        <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Ver 6 Projetos Ao Vivo</span>
                      </a>

                      <a
                        href="#orcamento"
                        onClick={() => sound.playSelect()}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#060913]/85 hover:bg-[#0B1224] text-cyan-300 border border-cyan-400/40 font-bold text-xs whitespace-nowrap cursor-pointer transition-all"
                      >
                        <Calculator className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Simular Orçamento</span>
                      </a>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                /* -------------------------------------------------------------
                   FASE 02 (DEPOIS A01 WEB): BIG HEADLINE ON LEFT, SMALL BOT CARD ON RIGHT!
                   Leaves the smiling businessman's face on the right 100% visible!
                   ------------------------------------------------------------- */
                <motion.div
                  key="layout-after-phase"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end"
                >
                  {/* LEFT SIDE (col-span-6): BIG HEADLINE CARD ON THE LEFT */}
                  <motion.div
                    style={{ y: textParallaxY }}
                    className="lg:col-span-6 space-y-3.5 p-5 sm:p-6 rounded-3xl bg-[#050811]/78 backdrop-blur-md border border-cyan-400/45 shadow-[0_25px_80px_rgba(0,0,0,0.8)] pointer-events-auto"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-extrabold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>TRANSFORMAÇÃO 01 WEB CONCLUÍDA ({revealPercent}%)</span>
                    </div>

                    <h1
                      className="font-extrabold font-heading tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
                      style={{ fontSize: 'clamp(1.75rem, 3.1vw, 2.85rem)' }}
                    >
                      Empresa Organizada,{' '}
                      <span className="text-gradient-animated drop-shadow-[0_0_25px_rgba(34,211,238,0.5)]">
                        Site de Elite & Robô Vendendo 24/7 no Seu WhatsApp.
                      </span>
                    </h1>

                    <p className="text-slate-100 text-xs sm:text-sm leading-relaxed drop-shadow">
                      Na <strong className="text-cyan-300">01 WEB</strong>, substituímos o caos por
                      uma estrutura completa pronta em{' '}
                      <strong className="text-emerald-300">3 a 7 dias</strong>: design
                      Scrollytelling que impõe autoridade, triagem automática 24h no WhatsApp e
                      painel próprio sem mensalidade.
                    </p>

                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      {onOpenFunnel && (
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick(950);
                            onOpenFunnel();
                          }}
                          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm whitespace-nowrap cursor-pointer shadow-[0_0_25px_rgba(34,211,238,0.45)] transition-transform hover:scale-[1.02]"
                        >
                          <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
                          <span>Quero Organizar Minha Empresa Agora</span>
                          <ArrowRight className="w-4 h-4 text-slate-950 shrink-0" />
                        </button>
                      )}

                      <a
                        href="#portfolio"
                        onClick={() => sound.playClick(900)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/25 font-bold text-xs whitespace-nowrap cursor-pointer transition-all"
                      >
                        <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Ver 6 Projetos Ao Vivo</span>
                      </a>

                      <a
                        href="#orcamento"
                        onClick={() => sound.playSelect()}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#060913]/85 hover:bg-[#0B1224] text-cyan-300 border border-cyan-400/40 font-bold text-xs whitespace-nowrap cursor-pointer transition-all"
                      >
                        <Calculator className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Simular Orçamento</span>
                      </a>
                    </div>
                  </motion.div>

                  {/* RIGHT SIDE (col-span-6): Kept open at top/center so the smiling businessman's face is 100% FREE! Compact Bot HUD at bottom-right */}
                  <motion.div
                    style={{ y: hudFloatY }}
                    className="lg:col-span-6 flex flex-col items-end justify-end space-y-2 pointer-events-auto"
                  >
                    <div className="w-full max-w-sm p-3.5 rounded-2xl bg-[#05141C]/88 backdrop-blur-xl border border-emerald-400/60 shadow-[0_15px_50px_rgba(16,185,129,0.3)] space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 font-extrabold">
                        <span className="flex items-center gap-1.5">
                          <Bot className="w-4 h-4 text-emerald-400" />
                          ROBÔ WHATSAPP 01 WEB · 24/7
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-400 text-slate-950 text-[10px]">
                          AO VIVO
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>&ldquo;Novo Cliente Qualificado & Pronto p/ Fechar!&rdquo;</span>
                      </div>
                      <p className="text-[11px] text-slate-200 leading-snug">
                        O robô atendeu em 2 segundos, filtrou o interesse e já entregou o pedido
                        mastigado no seu celular.
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =================================================================
              BOTTOM ROW: FLOATING GLASS SCROLL SCRUBBER BAR OVER THE IMAGE
             ================================================================= */}
          <div className="p-3 sm:px-5 sm:py-2.5 rounded-2xl bg-[#050811]/80 backdrop-blur-xl border border-white/15 flex flex-wrap items-center justify-between gap-3 pointer-events-auto shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-slate-200 font-bold">
                TRANSFORMAÇÃO NO SCROLL: <strong className="text-cyan-300">{revealPercent}%</strong>
              </span>
              <span className="hidden md:inline text-slate-400">
                (Role o mouse para baixo ou arraste a barra/imagem)
              </span>
            </div>

            <div className="flex-1 max-w-md mx-2 hidden sm:flex items-center gap-3">
              <span className="text-[10px] font-mono text-rose-400 font-bold">CAOS</span>
              <input
                type="range"
                min="0"
                max="100"
                value={revealPercent}
                onChange={(e) => {
                  setIsManualControl(true);
                  setRevealPercent(Number(e.target.value));
                }}
                aria-label="Controlar transformação Antes e Depois"
                className="w-full h-2 rounded-lg appearance-none bg-slate-800 accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-emerald-400 font-bold">01 WEB</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-emerald-300 font-bold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />1 Ano Domínio + Hospedagem Grátis
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Hero({ onOpenFunnel }: HeroProps) {
  const isDesktop = useIsDesktop();
  return isDesktop ? (
    <HeroDesktop onOpenFunnel={onOpenFunnel} />
  ) : (
    <HeroMobile onOpenFunnel={onOpenFunnel} />
  );
}
