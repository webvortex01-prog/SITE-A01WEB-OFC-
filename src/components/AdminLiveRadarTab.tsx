import { useState, useEffect } from 'react';
import {
  Radio,
  Eye,
  Flame,
  Clock,
  Activity,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  MousePointerClick,
  ArrowUpRight,
  Compass,
} from 'lucide-react';
import { liveRadarService, LiveVisitorSession } from '../services/liveRadarService';
import { sound } from '../utils/audio';

export default function AdminLiveRadarTab() {
  const [includeSimulated, setIncludeSimulated] = useState<boolean>(true);
  const [sessions, setSessions] = useState<LiveVisitorSession[]>(() =>
    liveRadarService.getAllSessions(true)
  );
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');

  useEffect(() => {
    const refresh = () => {
      const current = liveRadarService.getAllSessions(includeSimulated);
      setSessions(current);
      if (current.length > 0 && !selectedSessionId) {
        setSelectedSessionId(current[0].sessionId);
      }
    };
    refresh();
    const unsub = liveRadarService.subscribe(refresh);
    const interval = window.setInterval(refresh, 2500);
    return () => {
      unsub();
      window.clearInterval(interval);
    };
  }, [includeSimulated, selectedSessionId]);

  const hotZoneVisitors = sessions.filter(
    (s) => s.intentLevel === 'QUENTE_ORCAMENTO' || s.intentLevel === 'CONVERTIDO'
  );

  const avgSeconds =
    sessions.length > 0
      ? Math.round(sessions.reduce((acc, s) => acc + s.secondsOnSite, 0) / sessions.length)
      : 0;

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m}m ${s < 10 ? `0${s}` : s}s` : `${s}s`;
  };

  const selectedSession =
    sessions.find((s) => s.sessionId === selectedSessionId) || sessions[0] || null;

  return (
    <div className="space-y-6">
      {/* Top Radar Control Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#071422] via-[#081A24] to-[#06181A] border border-cyan-400/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-400/15 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold">
                ● SONAR 360° EM TEMPO REAL ATIVO
              </span>
              <span className="text-xs font-mono text-cyan-300 font-bold">
                + META PIXEL 1021802663562956 INTEGRADO
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white font-heading mt-1">
              Radar Ao Vivo: Quem Está no Seu Site Agora & Pelo Que Está Se Interessando
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Acompanhe em qual seção o visitante está parado, quanto já rolou a página, em quais
              projetos clicou e aborde no WhatsApp na hora!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              setIncludeSimulated((prev) => !prev);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border cursor-pointer transition-all ${
              includeSimulated
                ? 'bg-cyan-400/15 border-cyan-400/40 text-cyan-300'
                : 'bg-slate-900 border-white/10 text-slate-400'
            }`}
          >
            {includeSimulated
              ? 'Exibindo: Sua Sessão Real + Visitantes Demo'
              : 'Exibindo: Apenas Sessões Reais Deste Navegador'}
          </button>

          <a
            href="https://eventsmanager.facebook.com/events_manager2/list/pixel/1021802663562956"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs font-mono cursor-pointer shadow-lg"
          >
            <span>Eventos Meta Ao Vivo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 4 Telemetry Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#090D1A] border border-emerald-500/30">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-300">
            <span>ONLINE NO SITE AGORA</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mt-1.5">
            {sessions.length} {sessions.length === 1 ? 'pessoa' : 'pessoas'}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            Navegando ativamente na página
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090D1A] border border-rose-500/35">
          <div className="flex items-center justify-between text-xs font-mono text-rose-300">
            <span>NA ZONA DE ORÇAMENTO 🔥</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono mt-1.5">
            {hotZoneVisitors.length} {hotZoneVisitors.length === 1 ? 'quente' : 'quentes'}
          </div>
          <div className="text-[11px] text-rose-200/80 mt-1">
            No Simulador de Preço ou Calculadora
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090D1A] border border-cyan-500/30">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
            <span>TEMPO MÉDIO DE RETENÇÃO</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono mt-1.5">
            {formatDuration(avgSeconds)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Engajamento com Scrollytelling 3D
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090D1A] border border-amber-500/30">
          <div className="flex items-center justify-between text-xs font-mono text-amber-300">
            <span>EVENTOS META PIXEL</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300 font-mono mt-1.5">
            PageView · ViewContent
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Pixel 1021802663562956 qualificando
          </div>
        </div>
      </div>

      {/* Main 2-Column Radar Workspace: Left = 360° Sonar + Section Heatmap | Right = Live Visitor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (col-span-5): 360° SONAR RADAR + LIVE SECTION HEATMAP */}
        <div className="lg:col-span-5 space-y-6">
          {/* 360° Cyber Sonar Display */}
          <div className="p-6 rounded-3xl bg-[#070B14] border border-cyan-500/30 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                  SONAR DE INTENÇÃO DE COMPRA
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Mais perto do centro = Mais perto de fechar
                </h3>
              </div>
              <Compass className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
            </div>

            {/* Radar Circle */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto rounded-full bg-[#040810] border-2 border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.18)] overflow-hidden flex items-center justify-center">
              {/* Concentric Radar Rings */}
              <div className="absolute w-[75%] h-[75%] rounded-full border border-emerald-500/25" />
              <div className="absolute w-[50%] h-[50%] rounded-full border border-cyan-400/30" />
              <div className="absolute w-[25%] h-[25%] rounded-full border border-rose-500/40 bg-rose-500/5" />

              {/* Crosshairs */}
              <div className="absolute inset-x-0 h-[1px] bg-emerald-500/20" />
              <div className="absolute inset-y-0 w-[1px] bg-emerald-500/20" />

              {/* Rotating Sonar Sweep Cone */}
              <div
                className="absolute inset-0 rounded-full animate-spin pointer-events-none"
                style={{
                  animationDuration: '4s',
                  background:
                    'conic-gradient(from 0deg, rgba(16, 185, 129, 0.28) 0deg, rgba(34, 211, 238, 0.08) 55deg, transparent 90deg, transparent 360deg)',
                }}
              />

              {/* Center Core ("Zona de Fechamento") */}
              <div className="relative z-10 w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />

              {/* Visitor Blips on the Sonar */}
              {sessions.map((s) => {
                const rad = (s.radarAngle * Math.PI) / 180;
                const xPct = 50 + Math.cos(rad) * (s.radarDistance * 0.45);
                const yPct = 50 + Math.sin(rad) * (s.radarDistance * 0.45);
                const isHot =
                  s.intentLevel === 'QUENTE_ORCAMENTO' || s.intentLevel === 'CONVERTIDO';
                const isSelected = selectedSession?.sessionId === s.sessionId;

                return (
                  <button
                    key={s.sessionId}
                    type="button"
                    onClick={() => {
                      sound.playSelect();
                      setSelectedSessionId(s.sessionId);
                    }}
                    style={{ left: `${xPct}%`, top: `${yPct}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                    title={`${s.identifiedName || s.sessionId}: ${s.currentSectionLabel}`}
                  >
                    <span className="relative flex h-4 w-4">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isHot ? 'bg-rose-400' : 'bg-emerald-400'
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white ${
                          isHot
                            ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'
                            : 'bg-emerald-400 shadow-[0_0_10px_#10b981]'
                        } ${isSelected ? 'scale-125 ring-2 ring-cyan-300' : ''}`}
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                Quente (Orçamento / Prejuízo)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                Explorando Projetos
              </span>
            </div>
          </div>

          {/* Selected Visitor Live Step-by-Step Trail */}
          {selectedSession && (
            <div className="p-5 rounded-3xl bg-[#090D1A] border border-cyan-400/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                    RASTRO DE INTERESSE DO VISITANTE SELECIONADO
                  </span>
                  <h4 className="text-sm font-extrabold text-white mt-0.5">
                    {selectedSession.identifiedName ||
                      (selectedSession.isCurrentDevice
                        ? '🟢 Sua Sessão Ao Vivo (Aba do Site)'
                        : `Visitante #${selectedSession.sessionId.slice(-4)}`)}{' '}
                    · {selectedSession.city}
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-cyan-400/15 text-cyan-300 font-mono text-xs font-bold">
                  Scroll: {selectedSession.scrollDepthPct}%
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase text-slate-400">
                  Últimos cliques e ações capturadas na página:
                </div>
                {selectedSession.interestHistory.map((item, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      i === 0
                        ? 'bg-cyan-500/15 border-cyan-400/40 text-white font-bold'
                        : 'bg-slate-950/80 border-white/5 text-slate-300'
                    }`}
                  >
                    <MousePointerClick
                      className={`w-3.5 h-3.5 shrink-0 ${
                        i === 0 ? 'text-cyan-400' : 'text-slate-500'
                      }`}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (col-span-7): LIVE FEED OF ACTIVE VISITORS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-300 font-extrabold">
              📡 Pessoas Navegando no Site Agora ({sessions.length})
            </h3>
            <span className="text-xs font-mono text-emerald-400">
              Atualização automática a cada 2s
            </span>
          </div>

          {sessions.map((s) => {
            const isHot =
              s.intentLevel === 'QUENTE_ORCAMENTO' || s.intentLevel === 'CONVERTIDO';
            const isSelected = selectedSession?.sessionId === s.sessionId;

            return (
              <div
                key={s.sessionId}
                onClick={() => {
                  sound.playSelect();
                  setSelectedSessionId(s.sessionId);
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                  isSelected
                    ? 'bg-[#0C1428] border-cyan-400 shadow-xl shadow-cyan-950/30'
                    : isHot
                    ? 'bg-[#090D1A] border-rose-500/40 hover:border-rose-400'
                    : 'bg-[#090D1A] border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isHot ? 'bg-rose-400' : 'bg-emerald-400'
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-3 w-3 ${
                          isHot ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                      />
                    </span>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm sm:text-base font-extrabold text-white">
                          {s.identifiedName
                            ? `👤 ${s.identifiedName}`
                            : s.isCurrentDevice
                            ? '🟢 Visitante Ao Vivo (Você / Aba do Site)'
                            : `Visitante Ao Vivo #${s.sessionId.slice(-4)}`}
                        </h4>
                        <span className="text-xs text-slate-400">· {s.city}</span>
                        {s.identifiedWhatsapp && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                            📱 {s.identifiedWhatsapp}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {s.device} · {s.source} · Tempo online:{' '}
                        <strong className="text-cyan-300">{formatDuration(s.secondsOnSite)}</strong>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-mono font-extrabold ${
                      isHot
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-950'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {isHot ? '🔥 ALTA INTENÇÃO DE COMPRA' : '👀 EXPLORANDO O SITE'}
                  </span>
                </div>

                {/* Where they are looking right now + What they clicked */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/90 border border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      📍 Seção na Tela Agora:
                    </span>
                    <div className="text-cyan-300 font-bold mt-0.5">
                      {s.currentSectionLabel}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      🎯 Pelo Que Se Interessou por Último:
                    </span>
                    <div className="text-white font-bold mt-0.5 truncate">
                      {s.lastInterest}
                    </div>
                  </div>
                </div>

                {/* Scroll Depth Progress Bar & Pixel Events */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex-1 min-w-[180px] space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>LEITURA / SCROLL DA PÁGINA</span>
                      <span className="text-cyan-300 font-bold">{s.scrollDepthPct}% visto</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                        style={{ width: `${s.scrollDepthPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {s.pixelEventsFired.map((ev) => (
                      <span
                        key={ev}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-amber-300"
                      >
                        Pixel: {ev}
                      </span>
                    ))}

                    {s.identifiedWhatsapp && (
                      <a
                        href={`https://wa.me/55${s.identifiedWhatsapp.replace(
                          /\D/g,
                          ''
                        )}?text=${encodeURIComponent(
                          `Fala ${
                            s.identifiedName || 'meu parceiro'
                          }! Vi aqui no nosso sistema que você está online agora olhando nossa estrutura (${
                            s.lastInterest
                          }). Posso te ajudar com alguma dúvida?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                        <span>Abordar Ao Vivo no Zap</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
