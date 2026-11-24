import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Smartphone,
  Bot,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Film,
  Zap,
  MessageSquare,
  Globe,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { Scroll3DStage } from '../utils/scrollytelling';

/**
 * Se você quiser usar um vídeo MP4 gravado por você no futuro,
 * basta colocar o caminho aqui (ex: '/meu-video-bastidores.mp4').
 * Enquanto estiver vazio (''), o Showreel Animado Interativo 01 WEB roda automaticamente!
 */
const CUSTOM_VIDEO_MP4_URL = '';

interface BastidoresShowreelProps {
  onOpenFunnel: () => void;
}

interface ShowreelScene {
  id: number;
  timeRange: string;
  startSec: number;
  endSec: number;
  tag: string;
  title: string;
  subtitle: string;
  caption: string;
  accent: string;
  metricBadge: string;
}

const SCENES: ShowreelScene[] = [
  {
    id: 0,
    timeRange: '00:00 - 00:10',
    startSec: 0,
    endSec: 10,
    tag: 'CENA 01 · OS PRIMEIROS 3 SEGUNDOS',
    title: 'Por que Clientes Fecham a Aba em Sites Comuns',
    subtitle: 'Impacto visual imediato assim que o cliente clica no seu link',
    caption:
      '"Quando o cliente clica no seu link pelo celular, ele decide em 3 segundos se a sua empresa é amadora ou referência no mercado..."',
    accent: 'from-cyan-400 to-sky-500',
    metricBadge: '+300% RETENÇÃO VISUAL',
  },
  {
    id: 1,
    timeRange: '00:10 - 00:20',
    startSec: 10,
    endSec: 20,
    tag: 'CENA 02 · ENGENHARIA SCROLLYTELLING',
    title: 'Animações Fluidas que Guiam o Olhar Até a Compra',
    subtitle: 'Experiência mobile-first pensada para o polegar do seu cliente',
    caption:
      '"Cada rolagem de tela revela provas sociais, comparativos e diferenciais que eliminam a objeção de preço antes do orçamento..."',
    accent: 'from-emerald-400 to-teal-500',
    metricBadge: 'CARREGAMENTO INSTANTÂNEO',
  },
  {
    id: 2,
    timeRange: '00:20 - 00:30',
    startSec: 20,
    endSec: 30,
    tag: 'CENA 03 · TRIAGEM & AUTOMAÇÃO WHATSAPP 24/7',
    title: 'O Cliente Já Chega Pronto Para Fechar no Seu Zap',
    subtitle: 'Simulador e funil inteligente filtram curiosos automaticamente',
    caption:
      '"Chega de perder horas respondendo curioso. O cliente seleciona o que precisa na página e a mensagem já chega mastigada no seu WhatsApp..."',
    accent: 'from-sky-400 to-indigo-500',
    metricBadge: 'ATENDIMENTO 24/7 AUTOMÁTICO',
  },
  {
    id: 3,
    timeRange: '00:30 - 00:40',
    startSec: 30,
    endSec: 40,
    tag: 'CENA 04 · ENTREGA COMPLETA EM 3 A 7 DIAS',
    title: 'Domínio Próprio, 1 Ano de Hospedagem & Código 100% Seu',
    subtitle: 'Zero aluguel mensal — estrutura definitiva em nome da sua empresa',
    caption:
      '"Em 3 a 7 dias entregamos seu projeto no ar com domínio .com.br, 1 ano de hospedagem VIP grátis e código-fonte 100% seu!"',
    accent: 'from-amber-400 to-orange-500',
    metricBadge: 'R$ 0 MENSALIDADE · 100% SEU',
  },
];

const TOTAL_DURATION = 40; // seconds

export default function BastidoresShowreel({ onOpenFunnel }: BastidoresShowreelProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [elapsed, setElapsed] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const lastSceneRef = useRef<number>(0);

  const currentSceneIndex = Math.min(
    SCENES.length - 1,
    Math.floor((elapsed / TOTAL_DURATION) * SCENES.length)
  );
  const currentScene = SCENES[currentSceneIndex];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = window.setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 0.2;
        if (next >= TOTAL_DURATION) {
          return 0; // loop smoothly
        }
        return next;
      });
    }, 200);

    return () => window.clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (lastSceneRef.current !== currentSceneIndex) {
      lastSceneRef.current = currentSceneIndex;
      if (soundEnabled) {
        sound.playSelect();
      }
    }
  }, [currentSceneIndex, soundEnabled]);

  const handleSelectScene = (sceneIdx: number) => {
    sound.playSelect();
    setElapsed(SCENES[sceneIdx].startSec + 0.1);
  };

  const formatTime = (sec: number) => {
    const s = Math.floor(sec);
    return `00:${s < 10 ? `0${s}` : s}`;
  };

  const progressPct = Math.min(100, (elapsed / TOTAL_DURATION) * 100);

  return (
    <section
      id="bastidores"
      className="py-16 md:py-24 relative overflow-x-clip bg-[#06080F] border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Scroll3DStage>
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400">
                <Film className="w-3.5 h-3.5" />
                <span>TOUR DE BASTIDORES · VSL INTERATIVO (40 SEGUNDOS)</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-emerald-400 font-bold">VEJA O SISTEMA RODANDO NA PRÁTICA</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
                Entenda em 40 Segundos Como Transformamos{' '}
                <span className="text-gradient-animated">Visitas em Vendas no WhatsApp.</span>
              </h2>
            </div>

            {/* Chapter Quick Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {SCENES.map((scene, idx) => {
                const active = idx === currentSceneIndex;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => handleSelectScene(idx)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-[#0B0F1A] text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    <span>0{idx + 1}</span>
                    <span className="hidden sm:inline">
                      · {idx === 0 ? 'Retenção' : idx === 1 ? 'Mobile' : idx === 2 ? 'Automação Zap' : 'Entrega'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Cinema Player Frame */}
          <div className="rounded-3xl bg-[#090E1A] border border-cyan-400/30 shadow-2xl overflow-hidden scrolly-stack-shadow">
            {/* Top Cinema Browser/Player Bar */}
            <div className="px-4 sm:px-6 py-3.5 bg-[#060911] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isPlaying ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      isPlaying ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                </span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-200">
                  {isPlaying ? 'REPRODUZINDO DEMONSTRAÇÃO 01 WEB' : 'DEMONSTRAÇÃO PAUSADA'}
                </span>
                <span className="hidden md:inline text-xs font-mono text-slate-500">
                  | {currentScene.tag}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-[10px] font-mono font-bold text-cyan-300">
                  {currentScene.metricBadge}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const nextSound = !soundEnabled;
                    setSoundEnabled(nextSound);
                    if (nextSound) sound.playSelect();
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-slate-300 cursor-pointer"
                  title="Ativar efeitos sonoros da interface"
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">Áudio UI Ativo</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden sm:inline">Som UI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Center Viewport: Custom Video OR Interactive 4-Scene Animated Engine */}
            {CUSTOM_VIDEO_MP4_URL ? (
              <div className="relative aspect-video bg-black">
                <video
                  src={CUSTOM_VIDEO_MP4_URL}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="p-5 sm:p-8 lg:p-10 relative min-h-[390px] sm:min-h-[420px] flex flex-col justify-between bg-gradient-to-b from-[#090E1A] via-[#0B1222] to-[#070B14]">
                {/* Ambient Scene Glow */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-25"
                  style={{
                    background:
                      currentSceneIndex === 0
                        ? 'radial-gradient(circle at 75% 35%, rgba(34,211,238,0.28), transparent 65%)'
                        : currentSceneIndex === 1
                        ? 'radial-gradient(circle at 75% 35%, rgba(16,185,129,0.28), transparent 65%)'
                        : currentSceneIndex === 2
                        ? 'radial-gradient(circle at 75% 35%, rgba(56,189,248,0.28), transparent 65%)'
                        : 'radial-gradient(circle at 75% 35%, rgba(251,191,36,0.25), transparent 65%)',
                  }}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentScene.id}
                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -14, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto"
                  >
                    {/* Left Column: Narrative Context */}
                    <div className="lg:col-span-6 space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-cyan-300">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{currentScene.tag}</span>
                      </div>

                      <h3 className="text-xl sm:text-3xl font-extrabold font-heading text-white leading-tight">
                        {currentScene.title}
                      </h3>

                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                        {currentScene.subtitle}
                      </p>

                      {/* Subtitle / Voiceover Box */}
                      <div className="p-4 rounded-2xl bg-[#060912]/90 border border-cyan-400/25">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-1">
                          Narração / Explicação na Prática:
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                          {currentScene.caption}
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Live Animated Visual Simulation per Scene */}
                    <div className="lg:col-span-6">
                      {currentSceneIndex === 0 && (
                        <div className="p-5 rounded-2xl bg-[#060911] border border-white/10 space-y-4">
                          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                            <span>COMPARATIVO NOS PRIMEIROS 3 SEGUNDOS</span>
                            <span className="text-emerald-400 font-bold">AO VIVO</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                              <div className="text-[11px] font-mono text-rose-400 font-bold">
                                ❌ SITE COMUM / LENTO
                              </div>
                              <div className="text-2xl font-extrabold font-mono text-rose-300">
                                84% Saem
                              </div>
                              <p className="text-xs text-slate-400">
                                Demora 5s+ no 4G, visual genérico e cliente volta pro Google.
                              </p>
                            </div>
                            <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-400/40 space-y-2 shadow-lg shadow-emerald-950/30">
                              <div className="text-[11px] font-mono text-emerald-400 font-bold">
                                ✓ ESTRUTURA 01 WEB
                              </div>
                              <div className="text-2xl font-extrabold font-mono text-emerald-300">
                                &lt; 0.8s No Ar
                              </div>
                              <p className="text-xs text-slate-200">
                                Abre na hora no celular com visual de autoridade máxima.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentSceneIndex === 1 && (
                        <div className="p-5 rounded-2xl bg-[#060911] border border-emerald-400/30 space-y-3">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                              <Smartphone className="w-4 h-4" /> EXPERIÊNCIA MOBILE-FIRST
                            </span>
                            <span className="text-slate-400">iPhone & Android</span>
                          </div>
                          <div className="space-y-2.5">
                            {[
                              'Botões posicionados na zona natural do polegar',
                              'Transições Scrollytelling que prendem a atenção até o final',
                              'Provas reais e calculadora de retorno financeiro interativa',
                            ].map((item, i) => (
                              <motion.div
                                key={item}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-[#0B1222] border border-white/10"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span className="text-xs sm:text-sm text-slate-200 font-medium">
                                  {item}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentSceneIndex === 2 && (
                        <div className="p-5 rounded-2xl bg-[#060911] border border-sky-400/30 space-y-3">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-sky-400 font-bold flex items-center gap-1.5">
                              <Bot className="w-4 h-4" /> SIMULAÇÃO DE LEAD CHEGANDO NO SEU ZAP
                            </span>
                            <span className="text-emerald-400">24h/7d</span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 font-mono text-xs">
                            <div className="flex items-center justify-between text-[11px] text-emerald-400">
                              <span className="font-bold flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5" /> Novo Lead Qualificado
                              </span>
                              <span>Agora mesmo</span>
                            </div>
                            <p className="text-slate-200 leading-relaxed font-sans text-xs sm:text-sm">
                              "Olá! Vi o site de vocês, já simulei meu projeto de{' '}
                              <strong className="text-emerald-300">Site + Automação WhatsApp</strong>{' '}
                              e quero agendar o início hoje!"
                            </p>
                          </div>
                        </div>
                      )}

                      {currentSceneIndex === 3 && (
                        <div className="p-5 rounded-2xl bg-[#060911] border border-amber-400/35 space-y-4">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-amber-300 font-bold flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4" /> PACOTE DE ENTREGA OFICIAL 01 WEB
                            </span>
                            <span className="text-emerald-400 font-bold">3 A 7 DIAS</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2.5 text-xs">
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                              <div className="text-cyan-400 font-mono font-bold">✓ DOMÍNIO .COM.BR</div>
                              <div className="text-slate-300 mt-0.5">1 Ano Grátis Incluso</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                              <div className="text-emerald-400 font-mono font-bold">✓ HOSPEDAGEM VIP</div>
                              <div className="text-slate-300 mt-0.5">12 Meses Sem Custo</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                              <div className="text-amber-300 font-mono font-bold">✓ ZERO ALUGUEL</div>
                              <div className="text-slate-300 mt-0.5">Código 100% Seu</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                              <div className="text-sky-400 font-mono font-bold">✓ SUPORTE DIRETO</div>
                              <div className="text-slate-300 mt-0.5">Acompanhamento no Zap</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* Bottom Interactive Player Controls & Scrubber Timeline */}
            <div className="px-4 sm:px-6 py-4 bg-[#060911] border-t border-white/10 space-y-3">
              {/* Clickable Scrubber Bar */}
              <div className="grid grid-cols-4 gap-1.5">
                {SCENES.map((scene, idx) => {
                  const isCurrent = idx === currentSceneIndex;
                  const isDone = idx < currentSceneIndex;
                  const localPct = isCurrent
                    ? Math.min(100, Math.max(0, ((elapsed - scene.startSec) / 10) * 100))
                    : isDone
                    ? 100
                    : 0;

                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => handleSelectScene(idx)}
                      className="group text-left space-y-1.5 cursor-pointer"
                    >
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-200"
                          style={{ width: `${localPct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span
                          className={
                            isCurrent
                              ? 'text-cyan-300 font-bold'
                              : isDone
                              ? 'text-emerald-400'
                              : 'text-slate-500 group-hover:text-slate-300'
                          }
                        >
                          0{idx + 1}. {scene.timeRange}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Controls Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick(880);
                      setIsPlaying((prev) => !prev);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs font-mono cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-slate-950" />
                        <span>PAUSAR TOUR</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        <span>CONTINUAR TOUR</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playSelect();
                      setElapsed(0);
                      setIsPlaying(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reiniciar</span>
                  </button>

                  <span className="text-xs font-mono text-slate-400">
                    {formatTime(elapsed)} / 00:40 ({Math.round(progressPct)}%)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    onOpenFunnel();
                  }}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs sm:text-sm cursor-pointer shadow-lg shadow-cyan-950/50"
                >
                  <Zap className="w-4 h-4 text-slate-950" />
                  <span>Quero Essa Estrutura no Meu Negócio</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          </div>
        </Scroll3DStage>
      </div>
    </section>
  );
}

