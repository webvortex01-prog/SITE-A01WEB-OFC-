import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'motion/react';
import {
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sparkles,
  Smartphone,
  Bot,
  XCircle,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface NicheComparison {
  id: 'advocacia' | 'carros' | 'estetica';
  label: string;
  imageUrl: string;
  afterBadge: string;
  afterTitle: string;
  afterSubtitle: string;
  afterMetrics: string[];
  beforeTitle: string;
  beforeSubtitle: string;
  beforeProblems: string[];
}

const NICHE_COMPARISONS: NicheComparison[] = [
  {
    id: 'advocacia',
    label: 'Advocacia & Consultoria',
    imageUrl:
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=85',
    afterBadge: 'PADRÃO 01 WEB · ADVOCACIA HIGH-TICKET',
    afterTitle: 'Autoridade Jurídica Imediata & Triagem por Área no WhatsApp',
    afterSubtitle:
      'Visual executivo que transmite confiança nos primeiros 3 segundos e já filtra a causa do cliente direto para o seu WhatsApp.',
    afterMetrics: [
      'Abertura em 0.6s no 4G/5G (100 PageSpeed)',
      'Triagem automática: Trabalhista, Empresarial, Civil ou Família',
      'Domínio .com.br + 1 Ano de Hospedagem VIP Inclusos',
    ],
    beforeTitle: 'Site Jurássico, Lento e Sem Filtro de Clientes',
    beforeSubtitle:
      'O cliente clica no seu anúncio do Google, espera vários segundos diante de uma tela pesada e fecha a aba antes de chamar no WhatsApp.',
    beforeProblems: [
      'Demora 6 segundos para abrir e faz o cliente voltar pro Google',
      'Layout genérico que passa imagem de escritório pequeno/amador',
      'Botão de WhatsApp solto que só traz curioso perguntando preço',
    ],
  },
  {
    id: 'carros',
    label: 'Loja de Carros & Showroom',
    imageUrl:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
    afterBadge: 'PADRÃO 01 WEB · SHOWROOM AUTOMOTIVO',
    afterTitle: 'Vitrine de Estoque Ultra-Rápida + Simulador de Financiamento e Troca',
    afterSubtitle:
      'O cliente vê o carro no anúncio, abre o estoque na hora pelo celular e já envia a proposta de financiamento ou avaliação de troca.',
    afterMetrics: [
      'Galeria HD com filtro rápido por marca, ano e valor',
      'Botão de Proposta e Avaliação de Troca integrado ao Zap',
      'Painel próprio para atualizar veículos sem pagar mensalidade',
    ],
    beforeTitle: 'Fotos Soltas no WhatsApp ou Site Pesado que Trava',
    beforeSubtitle:
      'Sem um catálogo rápido no celular, sua equipe perde horas mandando fotos manualmente e perde vendas para lojas mais organizadas.',
    beforeProblems: [
      'Fotos pesadas que travam o navegador do celular do comprador',
      'Vendedor perde horas mandando ficha técnica manualmente no Zap',
      'Zero filtro de intenção: curiosos tomam o tempo da equipe',
    ],
  },
  {
    id: 'estetica',
    label: 'Clínica, Salão & Estética',
    imageUrl:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85',
    afterBadge: 'PADRÃO 01 WEB · CLÍNICAS & BELEZA',
    afterTitle: 'Apresentação de Alto Padrão + Pré-Agendamento 24/7 no WhatsApp',
    afterSubtitle:
      'Design sofisticado que valoriza seus protocolos e permite que a paciente escolha o procedimento e horário mesmo de madrugada.',
    afterMetrics: [
      'Menu interativo de procedimentos com prova social e resultados',
      'Agendamento 24h direto no WhatsApp da recepção ou profissional',
      'Visual premium que justifica cobrar o valor real do seu procedimento',
    ],
    beforeTitle: 'Link na Bio Amador e Agenda Desorganizada',
    beforeSubtitle:
      'Uma árvore de links sem identidade visual não desperta desejo e força sua clínica ou salão a brigar apenas por preço baixo.',
    beforeProblems: [
      'Lista de links sem identidade visual que não convence a paciente',
      'Recepção demora para responder e a cliente agenda no concorrente',
      'Briga por preço baixo por falta de percepção de valor premium',
    ],
  },
];

export default function BeforeAfterSlider() {
  // sliderPosition: 0% = 100% 01 WEB visible; 100% = 100% Site Comum visible; 50% = 50/50 split
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isManualControl, setIsManualControl] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeNicheIdx, setActiveNicheIdx] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentNiche = NICHE_COMPARISONS[activeNicheIdx];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 30%'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.4,
  });

  const stageScale = useTransform(smoothScroll, [0, 0.2, 0.8, 1], [0.94, 1, 1, 0.96]);
  const stageRotateX = useTransform(smoothScroll, [0, 0.22, 0.82, 1], [6, 0, 0, -3]);

  // Automatic scroll sweep from 100% (Site Comum) -> 0% (100% Padrão 01 WEB) unless user is manually dragging
  useMotionValueEvent(smoothScroll, 'change', (latest) => {
    if (latest < 0.04 || latest > 0.96) {
      if (isManualControl && !isDragging) setIsManualControl(false);
      return;
    }
    if (!isManualControl && latest >= 0.12 && latest <= 0.88) {
      const normalized = (latest - 0.12) / 0.76;
      const autoPercent = Math.round(100 - normalized * 100);
      setSliderPosition(Math.max(0, Math.min(100, autoPercent)));
    }
  });

  const updateSliderFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    setIsManualControl(true);
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    // Allow full 0% to 100% edge-to-edge drag!
    const rawPercent = (x / rect.width) * 100;
    const clamped = rawPercent <= 1.5 ? 0 : rawPercent >= 98.5 ? 100 : rawPercent;
    setSliderPosition(Math.max(0, Math.min(100, clamped)));
  };

  return (
    <section
      ref={sectionRef}
      id="comparativo"
      className="py-8 lg:py-14 min-h-[170vh] lg:min-h-[145vh] relative overflow-x-clip bg-[#06080F] border-b border-white/10"
    >
      <div className="sticky top-16 lg:top-15 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 scrolly-perspective">
        <motion.div
          style={{
            scale: stageScale,
            rotateX: stageRotateX,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-4">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>03. SCANNER RAIO-X NO SCROLL</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 font-bold">
                ARRASTE DE PONTA A PONTA (0% A 100%) OU USE OS BOTÕES
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Site Comum Amador vs.{' '}
              <span className="text-gradient-animated">Máquina de Vendas 01 WEB</span>
            </h2>

            {/* Niche Selector + View Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {NICHE_COMPARISONS.map((niche, idx) => (
                <button
                  key={niche.id}
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveNicheIdx(idx);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeNicheIdx === idx
                      ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'bg-[#0B0F1A] text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  {niche.label}
                </button>
              ))}

              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#0B0F1A] border border-white/10 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setIsManualControl(true);
                    setSliderPosition(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    sliderPosition <= 15
                      ? 'bg-emerald-400 text-slate-950 font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  100% 01 WEB
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setIsManualControl(true);
                    setSliderPosition(50);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    sliderPosition > 15 && sliderPosition < 85
                      ? 'bg-cyan-400 text-slate-950 font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  50/50
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setIsManualControl(true);
                    setSliderPosition(100);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    sliderPosition >= 85
                      ? 'bg-rose-500 text-white font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  100% Site Comum
                </button>
              </div>
            </div>
          </div>

          {/* ===================================================================
              INTERACTIVE X-RAY VISUAL SCANNER CONTAINER (CLIP-PATH ENGINE - ALL VIEWPORTS)
              Uses CSS clip-path on a 100% solid opaque top layer so texts NEVER
              overlap or bleed through, and drags smoothly from 0% to 100%!
             =================================================================== */}
          <div className="max-w-5xl mx-auto">
            <div
              ref={containerRef}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setIsDragging(true);
                updateSliderFromClientX(e.clientX);
              }}
              onPointerMove={(e) => {
                if (isDragging || e.buttons === 1) {
                  updateSliderFromClientX(e.clientX);
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
              className="relative h-[430px] sm:h-[420px] md:h-[400px] rounded-3xl overflow-hidden border-2 border-cyan-400/40 select-none cursor-ew-resize shadow-[0_25px_80px_-15px_rgba(34,211,238,0.28)] touch-pan-y"
            >
              {/* ===============================================================
                  LAYER 1 (BASE LAYER - z-10): 100% PADRÃO 01 WEB
                 =============================================================== */}
              <div className="absolute inset-0 z-10 bg-[#050811] flex flex-col justify-between p-4 sm:p-6 md:p-10 text-left overflow-hidden">
                {/* Full-Bleed High-Def Background Photo */}
                <img
                  src={currentNiche.imageUrl}
                  alt={currentNiche.afterTitle}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105 pointer-events-none"
                />
                {/* Solid gradient mask so base layer is rich & crisp */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#050811] via-[#060A17]/88 to-[#041518]/80 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-[#050811]/80 pointer-events-none" />

                {/* Top Status Bar */}
                <div className="relative z-10 flex items-center justify-between gap-2 text-[10px] sm:text-xs font-mono">
                  <span className="px-2.5 md:px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-400/50 text-emerald-300 font-extrabold flex items-center gap-1.5 min-w-0">
                    <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{currentNiche.afterBadge}</span>
                  </span>
                  <span className="px-2.5 md:px-3 py-1 rounded-full bg-cyan-400 text-slate-950 font-extrabold flex items-center gap-1 shrink-0">
                    <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 fill-slate-950" />
                    <span>100/100</span>
                    <span className="hidden sm:inline">PAGESPEED</span>
                  </span>
                </div>

                {/* Center Content + Telemetry HUD */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-center my-auto">
                  <div className="md:col-span-7 space-y-1.5 md:space-y-3">
                    <div className="text-[10px] md:text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider truncate">
                      ✓ Design Scrollytelling · ✓ Triagem 24/7 · ✓ Código 100% Seu
                    </div>
                    <h3 className="text-lg sm:text-2xl md:text-4xl font-extrabold font-heading text-white leading-tight">
                      {currentNiche.afterTitle}
                    </h3>
                    <p className="text-[11px] sm:text-sm text-slate-200 leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-none">
                      {currentNiche.afterSubtitle}
                    </p>
                  </div>

                  {/* Right Floating Glass HUD */}
                  <div className="md:col-span-5 p-3 sm:p-4 md:p-5 rounded-2xl bg-[#060913]/95 border border-cyan-400/40 space-y-1.5 md:space-y-2.5 shadow-2xl">
                    <div className="flex items-center justify-between text-[10px] md:text-xs font-mono pb-1.5 md:pb-2 border-b border-white/10">
                      <span className="text-cyan-300 font-bold">TELEMETRIA 01 WEB</span>
                      <span className="text-emerald-400 font-extrabold">ALTA CONVERSÃO</span>
                    </div>
                    {currentNiche.afterMetrics.map((m) => (
                      <div key={m} className="flex items-start gap-2 text-[11px] md:text-xs text-slate-100 leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-[10px] md:text-xs font-mono text-slate-200 pt-2 md:pt-3 border-t border-white/15">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" /> Abre em &lt; 0.8s no Celular
                  </span>
                  <span className="hidden sm:flex text-cyan-300 font-bold items-center gap-1.5">
                    <Bot className="w-4 h-4 shrink-0" /> Cliente já chega qualificado no seu WhatsApp
                  </span>
                </div>
              </div>

              {/* ===============================================================
                  LAYER 2 (TOP CLIPPED LAYER - z-20): 100% SOLID OPAQUE SITE COMUM
                  Clipped cleanly via clipPath: inset(0 ${100 - sliderPosition}% 0 0)
                  so there is ZERO bleed-through and ZERO text overlapping!
                 =============================================================== */}
              <div
                className="absolute inset-0 z-20 bg-[#0E090C] flex flex-col justify-between p-4 sm:p-6 md:p-10 text-left overflow-hidden"
                style={{
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                  WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                }}
              >
                {/* Solid Opaque Background + Desaturated Grayscale Photo */}
                <div className="absolute inset-0 bg-[#0E090C]" />
                <img
                  src={currentNiche.imageUrl}
                  alt="Site comum lento"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover grayscale contrast-75 blur-[2px] opacity-15 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#130A0E] via-[#110D13]/95 to-[#160D12]/95 pointer-events-none" />

                {/* Top Warning Bar */}
                <div className="relative z-10 flex items-center justify-between gap-2 text-[10px] sm:text-xs font-mono">
                  <span className="px-2.5 md:px-3 py-1 rounded-full bg-rose-950 border border-rose-500/50 text-rose-300 font-extrabold flex items-center gap-1.5 min-w-0">
                    <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-400 shrink-0" />
                    <span className="truncate">SITE COMUM / TEMPLATE GENÉRICO</span>
                  </span>
                  <span className="px-2.5 md:px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold shrink-0">
                    ❌ LENTO (6.4s+)
                  </span>
                </div>

                {/* Center Warning Details (Full 12-Col Grid matching Layer 1) */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-center my-auto">
                  <div className="md:col-span-7 space-y-1.5 md:space-y-3">
                    <div className="text-[10px] md:text-xs font-mono text-rose-400 font-bold uppercase tracking-wider truncate">
                      ❌ Excesso de Plugins · ❌ Sem Triagem · ❌ Visual Amador
                    </div>
                    <h3 className="text-lg sm:text-2xl md:text-4xl font-extrabold font-heading text-slate-200 leading-tight">
                      {currentNiche.beforeTitle}
                    </h3>
                    <p className="text-[11px] sm:text-sm text-slate-400 leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-none">
                      {currentNiche.beforeSubtitle}
                    </p>
                  </div>

                  {/* Right Warning Box */}
                  <div className="md:col-span-5 p-3 sm:p-4 md:p-5 rounded-2xl bg-[#160B10] border border-rose-500/40 space-y-1.5 md:space-y-2.5 shadow-2xl">
                    <div className="flex items-center justify-between text-[10px] md:text-xs font-mono pb-1.5 md:pb-2 border-b border-rose-500/20">
                      <span className="text-rose-400 font-bold">DIAGNÓSTICO DE FALHAS</span>
                      <span className="text-rose-300 font-extrabold">BAIXA CONVERSÃO</span>
                    </div>
                    {currentNiche.beforeProblems.map((prob) => (
                      <div key={prob} className="flex items-start gap-2 text-[11px] md:text-xs text-rose-100/90 leading-snug">
                        <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{prob}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Warning Bar */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-[10px] md:text-xs font-mono text-rose-300 pt-2 md:pt-3 border-t border-rose-500/20">
                  <span className="font-bold">❌ 84% dos clientes desistem antes de carregar</span>
                  <span className="hidden sm:inline">Perda diária de orçamentos para o concorrente</span>
                </div>
              </div>

              {/* ===============================================================
                  VERTICAL LASER BEAM SCANNER DIVIDER (z-30)
                 =============================================================== */}
              <div
                className="absolute inset-y-0 -ml-6 w-12 flex items-center justify-center pointer-events-none z-30"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Glowing Laser Line */}
                <div className="absolute inset-y-0 w-[3px] bg-gradient-to-b from-cyan-300 via-emerald-400 to-cyan-300 shadow-[0_0_20px_4px_rgba(34,211,238,0.85)]" />
                {/* Handle Orb */}
                <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.9)] border-2 border-white">
                  <ArrowLeftRight className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs font-mono text-slate-400 pt-3 px-1">
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  setIsManualControl(true);
                  setSliderPosition(0);
                }}
                className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
              >
                ◄ Puxar tudo p/ esquerda (100% Padrão 01 WEB)
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  setIsManualControl(true);
                  setSliderPosition(100);
                }}
                className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
              >
                Puxar tudo p/ direita (100% Site Comum) ►
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
