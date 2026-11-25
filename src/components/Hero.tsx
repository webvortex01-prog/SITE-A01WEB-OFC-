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

interface HeroProps {
  onOpenFunnel?: () => void;
}

export default function Hero({ onOpenFunnel }: HeroProps) {
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
  const beforeBgScale = useTransform(smoothScroll, [0, 0.6, 1], [1.02, 1.14, 1.18]);
  const afterBgScale = useTransform(smoothScroll, [0, 0.4, 1], [1.16, 1.05, 1.0]);
  const textParallaxY = useTransform(smoothScroll, [0, 0.5, 1], [0, -14, -24]);
  const hudFloatY = useTransform(smoothScroll, [0, 0.5, 1], [18, 0, -16]);

  useMotionValueEvent(smoothScroll, 'change', (v) => {
    if (v <= 0.02 && isManualControl && !isDragging) {
      setIsManualControl(false);
    }
    if (!isManualControl) {
      // Smoothly scrub from 0% to 100% as user scrolls down the Hero track
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
          The photo is 100% edge-to-edge full-screen background, with 3D glass
          typography, neon shockwave laser & floating holograms on top!
         ===================================================================== */}
      <div
        ref={stageRef}
        onPointerDown={(e) => {
          // Only start drag if user didn't click an interactive button or link
          if ((e.target as HTMLElement).closest('button, a')) return;
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
           =================================================================== */}
        <div className="absolute inset-0 z-10 overflow-hidden bg-[#080508]">
          <motion.img
            src="/images/hero-antes-caos.jpg"
            alt="Antes: Site Feio, Atendimento Lento e Sem Organização"
            style={{ scale: beforeBgScale }}
            className="w-full h-full object-cover object-center pointer-events-none will-change-transform"
          />

          {/* Cinematic Moody Dark & Crimson Atmospheric Overlays for Text Contrast */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, rgba(6,5,10,0.84) 0%, rgba(10,6,12,0.45) 45%, rgba(15,6,10,0.72) 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(6,8,15,0.75) 0%, transparent 28%, rgba(6,8,15,0.45) 65%, rgba(6,8,15,0.96) 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 75% 30%, rgba(244, 63, 94, 0.22), transparent 55%)',
            }}
          />
        </div>

        {/* ===================================================================
            BACKGROUND LAYER 2 (z-20): FULL-SCREEN "DEPOIS" (A01 WEB PATRÃO FELIZ)
            Sweeps across the entire 100vw x 100vh screen via scroll or drag!
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

          {/* Cinematic Luxury Dark-Neon Edge Vignette so White/Neon Typography Pops Over the Bright Office! */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, rgba(4,9,18,0.82) 0%, rgba(6,14,26,0.32) 48%, rgba(4,12,20,0.68) 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(6,8,15,0.72) 0%, transparent 26%, rgba(6,10,20,0.38) 65%, rgba(6,8,15,0.96) 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 25% 40%, rgba(34, 211, 238, 0.22), transparent 55%)',
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
          {/* Wide Neon Aura Glow */}
          <div className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent blur-md" />
          {/* Core Laser Line */}
          <div className="absolute inset-y-0 w-[3px] bg-gradient-to-b from-cyan-300 via-emerald-400 to-cyan-300 shadow-[0_0_30px_6px_rgba(34,211,238,0.95)]" />
          {/* Center Interactive Orb */}
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(34,211,238,1)] border-2 border-white">
            <ArrowLeftRight className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        {/* ===================================================================
            FOREGROUND LAYER (z-40): GIANT 3D TYPOGRAPHY & HOLOGRAPHIC CARDS
            FLOATING DIRECTLY OVER THE FULL-SCREEN IMAGE!
           =================================================================== */}
        <div className="relative z-40 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6 flex flex-col justify-between pointer-events-none">
          {/* TOP ROW: Floating Phase Switcher & Scroll Progress Pill Over the Image */}
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

            {/* Interactive Quick-Jump Pills Floating Over Top-Right of Image */}
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
              MIDDLE ROW: GIANT CINEMATIC TYPOGRAPHY + FLOATING 3D HOLOGRAMS
              Positioned so the monitor & businessman in the background remain
              visibly framed while the text floats with 3D glass & neon glow!
             ================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end my-auto">
            {/* Left Floating Glassmorphic Headline Block */}
            <motion.div
              style={{ y: textParallaxY }}
              className="lg:col-span-7 space-y-4 p-5 sm:p-7 rounded-3xl bg-[#050811]/65 backdrop-blur-md border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.75)] pointer-events-auto"
            >
              <AnimatePresence mode="wait">
                {!isAfterPhase ? (
                  <motion.div
                    key="hero-copy-before"
                    initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                    transition={{ duration: 0.28 }}
                    className="space-y-3"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono font-extrabold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>ROLE O MOUSE PARA TRANSFORMAR ESSE CENÁRIO ↓</span>
                    </div>

                    <h1
                      className="font-extrabold font-heading tracking-tight text-white leading-[1.04] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
                      style={{ fontSize: 'clamp(1.85rem, 3.6vw, 3.25rem)' }}
                    >
                      Site Feio e Atendimento Lento Estão{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-rose-500 drop-shadow-[0_0_25px_rgba(244,63,94,0.55)]">
                        Entregando Seus Clientes Para o Concorrente.
                      </span>
                    </h1>

                    <p className="text-slate-200 text-xs sm:text-base leading-relaxed drop-shadow">
                      Quando o cliente clica no seu anúncio e encontra uma página amadora ou demora
                      para ser atendido no WhatsApp, você perde a venda em segundos.{' '}
                      <strong className="text-cyan-300 underline decoration-cyan-400/60">
                        Role a página ou arraste o laser na foto
                      </strong>{' '}
                      e veja o que a <strong className="text-white">01 WEB</strong> faz pela sua
                      empresa:
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="hero-copy-after"
                    initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                    transition={{ duration: 0.28 }}
                    className="space-y-3"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-extrabold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>TRANSFORMAÇÃO 01 WEB CONCLUÍDA ({revealPercent}%)</span>
                    </div>

                    <h1
                      className="font-extrabold font-heading tracking-tight text-white leading-[1.04] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
                      style={{ fontSize: 'clamp(1.85rem, 3.6vw, 3.25rem)' }}
                    >
                      Empresa Organizada,{' '}
                      <span className="text-gradient-animated drop-shadow-[0_0_25px_rgba(34,211,238,0.5)]">
                        Site de Elite & Robô Vendendo 24/7 no Seu WhatsApp.
                      </span>
                    </h1>

                    <p className="text-slate-100 text-xs sm:text-base leading-relaxed drop-shadow">
                      Na <strong className="text-cyan-300">01 WEB</strong>, substituímos o caos por
                      uma estrutura completa pronta em{' '}
                      <strong className="text-emerald-300">3 a 7 dias</strong>: design
                      Scrollytelling que impõe autoridade, triagem automática 24h no WhatsApp e
                      painel próprio sem mensalidade.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA Buttons Floating Directly Inside the Glass Overlay */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                {onOpenFunnel && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick(950);
                      onOpenFunnel();
                    }}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm whitespace-nowrap cursor-pointer shadow-[0_0_30px_rgba(34,211,238,0.45)] transition-transform hover:scale-[1.02]"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
                    <span>Quero Organizar Minha Empresa Agora</span>
                    <ArrowRight className="w-4 h-4 text-slate-950 shrink-0" />
                  </button>
                )}

                <a
                  href="#portfolio"
                  onClick={() => sound.playClick(900)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/25 font-bold text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-all"
                >
                  <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Ver 6 Projetos Ao Vivo</span>
                </a>

                <a
                  href="#orcamento"
                  onClick={() => sound.playSelect()}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-[#060913]/85 hover:bg-[#0B1224] text-cyan-300 border border-cyan-400/40 font-bold text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-all"
                >
                  <Calculator className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Simular Orçamento</span>
                </a>
              </div>
            </motion.div>

            {/* Right Column: Floating 3D Holographic Notifications Over the Photo */}
            <motion.div
              style={{ y: hudFloatY }}
              className="lg:col-span-5 flex flex-col items-end space-y-3 pointer-events-auto"
            >
              <AnimatePresence mode="wait">
                {!isAfterPhase ? (
                  <motion.div
                    key="hud-before-cards"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-sm space-y-2.5"
                  >
                    <div className="p-4 rounded-2xl bg-rose-950/80 backdrop-blur-xl border border-rose-500/50 shadow-2xl space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-rose-300 font-extrabold">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          DIAGNÓSTICO SEM A 01 WEB
                        </span>
                        <span>CRÍTICO</span>
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-white">
                        ❌ 84% fecham o site antes de carregar
                      </div>
                      <p className="text-[11px] text-rose-200/90">
                        Você paga pelo clique no anúncio, mas o cliente desiste ou fica esperando
                        resposta manual no WhatsApp.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="hud-after-cards"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-sm space-y-2.5"
                  >
                    {/* Floating Live WhatsApp Bot Notification Card */}
                    <div className="p-4 rounded-2xl bg-[#05141C]/85 backdrop-blur-xl border border-emerald-400/60 shadow-[0_15px_50px_rgba(16,185,129,0.3)] space-y-1.5">
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
                      <p className="text-[11px] text-slate-200">
                        O robô atendeu em 2 segundos, filtrou o interesse e já entregou o pedido
                        mastigado no seu celular.
                      </p>
                    </div>

                    {/* Floating Performance Telemetry Card */}
                    <div className="p-3.5 rounded-2xl bg-[#060B18]/85 backdrop-blur-xl border border-cyan-400/50 shadow-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-400 text-slate-950 flex items-center justify-center font-extrabold">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-white">
                            100/100 Google PageSpeed
                          </div>
                          <div className="text-[11px] font-mono text-cyan-300">
                            Código 100% Seu · Zero Mensalidade
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-extrabold text-emerald-400">
                        &lt; 0.8s
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* =================================================================
              BOTTOM ROW: FLOATING GLASS SCROLL SCRUBBER BAR OVER THE IMAGE
             ================================================================= */}
          <div className="p-3 sm:px-5 sm:py-3 rounded-2xl bg-[#050811]/80 backdrop-blur-xl border border-white/15 flex flex-wrap items-center justify-between gap-3 pointer-events-auto shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-slate-200 font-bold">
                TRANSFORMAÇÃO NO SCROLL: <strong className="text-cyan-300">{revealPercent}%</strong>
              </span>
              <span className="hidden md:inline text-slate-400">
                (Role o mouse para baixo ou arraste a barra/imagem)
              </span>
            </div>

            {/* Interactive Range Scrubber */}
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
