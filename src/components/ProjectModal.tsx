import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Smartphone,
  Monitor,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Maximize2,
  Minimize2,
  Cpu,
  ZoomIn,
  ZoomOut,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { sound } from '../utils/audio';
import BurgerDemo from './demos/BurgerDemo';
import TattooDemo from './demos/TattooDemo';
import ImobDemo from './demos/ImobDemo';
import FoodPizzaDemo from './demos/FoodPizzaDemo';
import { BarberDemo, PetSpaDemo, GarageDetailDemo } from './demos/BeautyBarberPetDemos';
import {
  GlowClinicaDemo,
  SorrisoPrimeDemo,
  CirurgiaPlasticaDemo,
  IronBoxDemo,
} from './demos/HealthMedicalDemos';
import {
  LexAdvocaciaDemo,
  VillaArquiteturaDemo,
  HypeStreetwearDemo,
  NexusSaasDemo,
  NitroSuplementosDemo,
} from './demos/CorporateTechDemos';
import GenericSystemDemo from './demos/GenericSystemDemo';

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  tagline: string;
  description: string;
  imageUrl: string;
  accentColor: string;
  systemBadge?: string;
  interactiveToolLabel?: string;
  externalSiteUrl?: string;
  externalSystemUrl?: string;
  metric1: { value: string; label: string };
  metric2: { value: string; label: string };
  speedScore: number;
  features: string[];
  mockupContent: {
    heroTitle: string;
    heroSubtitle: string;
    ctaText: string;
    badgeText: string;
    items: { title: string; subtitle: string; price?: string }[];
  };
}

interface ProjectModalProps {
  project: ProjectData | null;
  allProjects?: ProjectData[];
  onSwitchProject?: (proj: ProjectData) => void;
  initialMode?: 'site' | 'system';
  initialDeviceMode?: 'desktop' | 'mobile';
  customUrls?: { siteUrl?: string; systemUrl?: string };
  onSaveCustomUrl?: (projectId: string, siteUrl: string, systemUrl: string) => void;
  onClose: () => void;
  onSelectForQuote: (projectName: string) => void;
}

export function normalizePreviewUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function ProjectModal({
  project,
  allProjects = [],
  onSwitchProject,
  initialMode = 'site',
  initialDeviceMode = 'desktop',
  customUrls,
  onClose,
  onSelectForQuote,
}: ProjectModalProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>(initialDeviceMode);
  const [modalView, setModalView] = useState<'site' | 'system' | 'photo'>(initialMode);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [useInternalFallback, setUseInternalFallback] = useState<boolean>(false);

  useEffect(() => {
    setModalView(initialMode);
    setDeviceMode(initialDeviceMode);
    setUseInternalFallback(false);
  }, [initialMode, initialDeviceMode, project?.id]);

  // Handle ESC key and disable background body scroll
  useEffect(() => {
    if (!project) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const activeExternalSiteUrl = normalizePreviewUrl(
    customUrls?.siteUrl ? customUrls.siteUrl : project.externalSiteUrl
  );
  const activeExternalSystemUrl = normalizePreviewUrl(
    customUrls?.systemUrl ? customUrls.systemUrl : project.externalSystemUrl
  );

  const currentExternalUrl =
    modalView === 'system'
      ? activeExternalSystemUrl
      : activeExternalSiteUrl;

  const isShowingLiveIframe = Boolean(currentExternalUrl) && !useInternalFallback;

  const handleDeviceChange = (mode: 'desktop' | 'mobile') => {
    sound.playSelect();
    setDeviceMode(mode);
  };

  const toggleFullscreen = () => {
    sound.playClick();
    setIsFullscreen(!isFullscreen);
  };

  const cycleZoom = (direction: 'in' | 'out') => {
    sound.playClick();
    if (direction === 'out') {
      setZoomLevel((prev) => Math.max(75, prev - 10));
    } else {
      setZoomLevel((prev) => Math.min(105, prev + 10));
    }
  };

  const activeModeForDemo: 'site' | 'system' = modalView === 'system' ? 'system' : 'site';

  const renderActiveDemo = () => {
    const syncMode = (m: 'site' | 'system') => setModalView(m);

    switch (project.id) {
      case 'grelha-nobre':
        return <BurgerDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      case 'black-ink-tattoo':
        return <TattooDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      case 'imob-imperial':
        return <ImobDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      case 'pizza-napoletana':
        return <FoodPizzaDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      case 'fade-pro-barber':
      case 'salao-beleza-six':
        return <BarberDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      case 'pet-prime':
        return <PetSpaDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      case 'garage-especializada':
        return <GarageDetailDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      case 'glow-clinica':
        return <GlowClinicaDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      case 'sorriso-prime':
        return <SorrisoPrimeDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      case 'dr-cardoso-cirurgia':
        return <CirurgiaPlasticaDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      case 'iron-box':
        return <IronBoxDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      case 'lex-advocacia':
        return <LexAdvocaciaDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      case 'villa-arquitetura':
        return <VillaArquiteturaDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      case 'hype-streetwear':
        return <HypeStreetwearDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      case 'nexus-saas':
        return <NexusSaasDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      case 'nitro-suplementos':
        return <NitroSuplementosDemo initialViewMode={activeModeForDemo} onViewModeChange={syncMode} />;
      default:
        return <GenericSystemDemo project={project} initialViewMode={activeModeForDemo} />;
    }
  };

  const modalNode = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Apresentação do projeto ${project.title}`}
      className="fixed inset-0 z-[99999] overflow-y-auto bg-black/90 backdrop-blur-xl p-2 sm:p-4 md:p-6 flex items-center justify-center animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playClick();
          onClose();
        }
      }}
    >
      {/* MODAL MAIN CONTAINER */}
      <div
        className={`relative w-full bg-[#070a14] border-2 border-cyan-500/50 rounded-2xl sm:rounded-3xl shadow-2xl shadow-cyan-950/60 overflow-hidden my-auto flex flex-col transition-all duration-200 ${
          isFullscreen
            ? 'max-w-[98vw] h-[95vh]'
            : 'max-w-6xl max-h-[92vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL STICKY HEADER */}
        <div className="px-3 sm:px-5 py-2.5 bg-[#050811] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          {/* Project Identity */}
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="text-cyan-400 font-semibold">{project.categoryLabel}</span>
              {isShowingLiveIframe && (
                <>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold">Preview Interativo Ao Vivo</span>
                </>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-extrabold font-heading text-white truncate">
              {project.title}
            </h3>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* View Switcher: Preview Ao Vivo vs Capa */}
            <div className="flex items-center gap-0.5 bg-slate-900 p-1 rounded-xl border border-slate-800 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  setModalView('site');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold whitespace-nowrap ${
                  modalView === 'site'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Preview Ao Vivo
              </button>
              {activeExternalSystemUrl && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setModalView('system');
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-1 whitespace-nowrap ${
                    modalView === 'system'
                      ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 shadow-md shadow-indigo-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Cpu className="w-3 h-3" />
                  <span>Sistema</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  setModalView('photo');
                }}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  modalView === 'photo'
                    ? 'bg-purple-500/25 text-purple-300 font-bold border border-purple-500/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Resumo
              </button>
            </div>

            {/* Device Switcher (Desktop vs Mobile) */}
            {modalView !== 'photo' && (
              <div className="flex items-center gap-0.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => handleDeviceChange('desktop')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    deviceMode === 'desktop'
                      ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Modo Monitor Desktop"
                >
                  <Monitor className="w-3 h-3" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeviceChange('mobile')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    deviceMode === 'mobile'
                      ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Modo Celular Mobile"
                >
                  <Smartphone className="w-3 h-3" />
                  <span className="hidden sm:inline">Celular</span>
                </button>
              </div>
            )}

            {/* Zoom / Scale Adjuster */}
            {modalView !== 'photo' && (
              <div className="hidden lg:flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
                <button
                  type="button"
                  onClick={() => cycleZoom('out')}
                  disabled={zoomLevel <= 75}
                  title="Reduzir Escala"
                  className="p-0.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-cyan-300 min-w-[34px] text-center tabular-nums">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={() => cycleZoom('in')}
                  disabled={zoomLevel >= 105}
                  title="Aumentar Escala"
                  className="p-0.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Fullscreen Expand Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="hidden md:flex p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isFullscreen ? 'Reduzir janela' : 'Expandir janela'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* HIGH-VISIBILITY CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              aria-label="Fechar apresentação (ESC)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-950/50 border border-rose-400/40 cursor-pointer transition-all"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
              <span>Fechar</span>
            </button>
          </div>
        </div>

        {/* INSTANT PROJECT SWITCHER BAR */}
        {allProjects.length > 1 && onSwitchProject && (
          <div className="px-3 sm:px-5 py-2 bg-[#080C17] border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto shrink-0">
            <span className="text-[11px] font-mono text-slate-400 shrink-0 mr-1">
              Alternar Modelo:
            </span>
            {allProjects.map((p) => {
              const isCurrent = p.id === project.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    onSwitchProject(p);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isCurrent
                      ? 'bg-cyan-400 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-white/5'
                  }`}
                >
                  {p.categoryLabel}
                </button>
              );
            })}
          </div>
        )}

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="overflow-y-auto p-3 sm:p-5 space-y-5 flex-1 custom-scrollbar">
          {modalView === 'photo' ? (
            <div className="w-full rounded-2xl overflow-hidden border border-white/10 p-6 sm:p-10 bg-gradient-to-br from-[#0B0F1A] via-[#06080F] to-[#0E1424] space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  {project.mockupContent.badgeText}
                </div>
                <h4 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  {project.mockupContent.heroTitle}
                </h4>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {project.mockupContent.heroSubtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {project.mockupContent.items.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#06080F] border border-white/10 space-y-1">
                    <div className="text-xs font-mono text-cyan-400">{item.price}</div>
                    <div className="text-sm font-bold text-white">{item.title}</div>
                    <div className="text-xs text-slate-400">{item.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* EMBEDDED EXTERNAL IFRAME PREVIEW */
            <div className="w-full flex flex-col items-center bg-[#04060c] rounded-2xl border border-slate-800/80 p-1.5 sm:p-2.5">
              <div
                className={`transition-all duration-300 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-[#0b0e17] ${
                  deviceMode === 'desktop' ? 'w-full' : 'w-[390px] max-w-full'
                }`}
                style={{
                  transformOrigin: 'top center',
                  transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
                  marginBottom: zoomLevel < 100 ? `-${(100 - zoomLevel) * 0.35}%` : undefined,
                }}
              >
                {/* Browser Chrome Header */}
                <div className="px-3 py-1.5 bg-[#0e121e] border-b border-slate-800 flex items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    {isShowingLiveIframe && (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setIframeKey((prev) => prev + 1);
                        }}
                        title="Recarregar Preview"
                        className="ml-2 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="px-3 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 truncate max-w-[360px] flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">
                      {`https://${project.id}.01web.app/${modalView === 'system' ? 'sistema-erp' : ''}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-emerald-400 font-bold text-[10px] hidden sm:inline">
                      {project.speedScore} PageSpeed
                    </span>
                  </div>
                </div>

                {/* Render the Embedded External Link Preview (Iframe) */}
                {isShowingLiveIframe ? (
                  <div className="relative w-full h-[500px] sm:h-[560px] bg-[#070a14]">
                    <iframe
                      key={`${project.id}-${modalView}-${iframeKey}-${currentExternalUrl}`}
                      src={currentExternalUrl}
                      title={`Preview ao vivo - ${project.title}`}
                      className="w-full h-full border-0 bg-white"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; forms; scripts"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                ) : (
                  <div className="p-1.5 sm:p-2.5 bg-[#070a14]">{renderActiveDemo()}</div>
                )}
              </div>
            </div>
          )}

          {/* Technical Specs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black font-heading text-white tabular-nums">
                  {project.metric1.value}
                </div>
                <div className="text-xs text-slate-400">{project.metric1.label}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black font-heading text-white tabular-nums">
                  {project.metric2.value}
                </div>
                <div className="text-xs text-slate-400">{project.metric2.label}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black font-heading text-white tabular-nums">
                  {project.speedScore}/100
                </div>
                <div className="text-xs text-slate-400">Score Google PageSpeed</div>
              </div>
            </div>
          </div>

          {/* Architecture Features */}
          <div className="space-y-2.5 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
            <h5 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Engenharia & Soluções Digitais Exclusivas Deste Projeto:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {project.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-4 sm:px-6 py-3 bg-[#050811] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Gostou da arquitetura deste projeto? Adaptamos 100% para a identidade da sua empresa.
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              Voltar ao Portfólio
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playSuccess();
                onSelectForQuote(project.title);
                onClose();
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 text-black font-extrabold text-xs shadow-lg shadow-cyan-400/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Quero Um Projeto Assim</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalNode, document.body);
  }
  return modalNode;
}
