// ============================================================================
// 01 WEB — LIVE VISITOR RADAR & INTENT TELEMETRY ENGINE
// Rastreia em tempo real quem está navegando no site, qual seção está olhando,
// profundidade de scroll, cliques em projetos/nichos e eventos do Meta Pixel.
// ============================================================================
import { pixelService } from './pixelService';
import { getSupabaseClient } from './supabaseClient';

let cloudSessionsCache: LiveVisitorSession[] = [];
let lastCloudRadarPush = 0;

function sessionToDbRow(session: LiveVisitorSession): Record<string, unknown> {
  return {
    session_id: session.sessionId,
    started_at: session.startedAt,
    last_active_at: session.lastActiveAt,
    seconds_on_site: session.secondsOnSite,
    device: session.device,
    source: session.source,
    city: session.city,
    current_section_id: session.currentSectionId,
    current_section_label: session.currentSectionLabel,
    scroll_depth_pct: session.scrollDepthPct,
    intent_level: session.intentLevel,
    last_interest: session.lastInterest,
    interest_history: session.interestHistory || [],
    identified_name: session.identifiedName || null,
    identified_whatsapp: session.identifiedWhatsapp || null,
    pixel_events_fired: session.pixelEventsFired || ['PageView'],
    radar_angle: session.radarAngle,
    radar_distance: session.radarDistance,
  };
}

function dbRowToSession(row: Record<string, any>): LiveVisitorSession {
  return {
    sessionId: String(row.session_id),
    startedAt: row.started_at || new Date().toISOString(),
    lastActiveAt: row.last_active_at || new Date().toISOString(),
    secondsOnSite: typeof row.seconds_on_site === 'number' ? row.seconds_on_site : 1,
    device: row.device || 'Dispositivo Desconhecido',
    source: row.source || '🌐 Acesso Direto',
    city: row.city || 'Visitante Online',
    currentSectionId: row.current_section_id || 'inicio',
    current_section_label: row.current_section_label || SECTION_LABELS.inicio,
    scrollDepthPct: typeof row.scroll_depth_pct === 'number' ? row.scroll_depth_pct : 5,
    intentLevel: row.intent_level || 'EXPLORANDO',
    lastInterest: row.last_interest || '',
    interestHistory: Array.isArray(row.interest_history) ? row.interest_history : [],
    identifiedName: row.identified_name || undefined,
    identifiedWhatsapp: row.identified_whatsapp || undefined,
    pixelEventsFired: Array.isArray(row.pixel_events_fired)
      ? row.pixel_events_fired
      : ['PageView'],
    radarAngle: typeof row.radar_angle === 'number' ? row.radar_angle : 110,
    radarDistance: typeof row.radar_distance === 'number' ? row.radar_distance : 55,
  };
}

function pushSessionToCloud(session: LiveVisitorSession, forceImmediate = false): void {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const now = Date.now();
  if (!forceImmediate && now - lastCloudRadarPush < 3500) {
    return;
  }
  lastCloudRadarPush = now;

  void supabase
    .from('live_radar_sessions')
    .upsert(sessionToDbRow(session), { onConflict: 'session_id' })
    .then(({ error }) => {
      if (error) console.warn('[Supabase Radar] Erro ao enviar sessão:', error.message);
    });
}

export interface LiveVisitorSession {
  sessionId: string;
  isCurrentDevice?: boolean;
  startedAt: string;
  lastActiveAt: string;
  secondsOnSite: number;
  device: string;
  source: string;
  city: string;
  currentSectionId: string;
  currentSectionLabel: string;
  scrollDepthPct: number;
  intentLevel: 'EXPLORANDO' | 'INTERESSADO' | 'QUENTE_ORCAMENTO' | 'CONVERTIDO';
  lastInterest: string;
  interestHistory: string[];
  identifiedName?: string;
  identifiedWhatsapp?: string;
  pixelEventsFired: string[];
  radarAngle: number; // 0-360 degrees for Sonar display
  radarDistance: number; // 15-85% from center (closer = hotter)
}

const RADAR_STORAGE_KEY = '01web_live_radar_sessions_v1';
const RADAR_EVENT_NAME = '01web_radar_updated';
const CHANNEL_NAME = '01web_live_radar_channel';

const SECTION_LABELS: Record<string, string> = {
  inicio: '🏠 Topo / Laboratório Hero',
  bastidores: '🎬 Assistindo Tour de 40s (VSL)',
  portfolio: '💼 Analisando Projetos do Portfólio',
  engenharia: '⚙️ 4 Camadas & Jornada Vertical',
  ecossistema: '🤖 Testando Simulador de WhatsApp',
  comparativo: '🔬 Usando Scanner Laser Antes/Depois',
  prejuizo: '💸 Calculando Prejuízo Financeiro',
  avaliacoes: '⭐ Vendo Carrossel 3D de Feedbacks',
  'bonus-exclusivo': '🎁 Lendo Bônus de R$ 1.030',
  orcamento: '💰 Montando Orçamento no Simulador!',
  faq: '❓ Lendo Dúvidas Frequentes (FAQ)',
};

let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch {
  // ignore
}

function detectDeviceLabel(): string {
  if (typeof navigator === 'undefined') return 'Desktop PC';
  const ua = navigator.userAgent;
  if (/iPhone/i.test(ua)) return '📱 iPhone (iOS)';
  if (/iPad/i.test(ua)) return '📱 iPad';
  if (/Android/i.test(ua)) return '📱 Smartphone Android';
  if (/Mac/i.test(ua)) return '💻 MacBook / macOS';
  return '💻 Computador Windows';
}

function detectTrafficSource(): string {
  if (typeof window === 'undefined') return 'Acesso Direto';
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source') || params.get('fbclid');
  if (utmSource || document.referrer.includes('facebook') || document.referrer.includes('instagram')) {
    return '📢 Anúncio Meta Ads (IG/FB)';
  }
  if (document.referrer.includes('google')) {
    return '🔍 Pesquisa Google';
  }
  if (document.referrer.includes('whatsapp')) {
    return '💬 Link do WhatsApp';
  }
  return '🌐 Acesso Direto / Link Enviado';
}

// Simulated realistic concurrent visitors so the Radar is rich and demonstrative,
// while the real visitor session(s) update at the very top in real time!
const SIMULATED_ACTIVE_VISITORS: LiveVisitorSession[] = [
  {
    sessionId: 'vis-sim-1',
    startedAt: new Date(Date.now() - 145000).toISOString(),
    lastActiveAt: new Date(Date.now() - 3000).toISOString(),
    secondsOnSite: 145,
    device: '📱 iPhone 15 Pro (4G/5G)',
    source: '📢 Anúncio Meta Ads (IG/FB)',
    city: 'Cuiabá / MT',
    currentSectionId: 'orcamento',
    currentSectionLabel: '💰 Montando Orçamento no Simulador!',
    scrollDepthPct: 84,
    intentLevel: 'QUENTE_ORCAMENTO',
    lastInterest: 'Selecionou: Pacote Completo Site + Painel (R$ 1.850)',
    interestHistory: [
      'Entrou pelo Anúncio de Instagram',
      'Abriu Preview: Aldo Leão Advocacia',
      'Testou Cor: Ouro Executivo',
      'Selecionou: Pacote Completo Site + Painel (R$ 1.850)',
    ],
    pixelEventsFired: ['PageView', 'ViewContent', 'InitiateCheckout'],
    radarAngle: 42,
    radarDistance: 24,
  },
  {
    sessionId: 'vis-sim-2',
    startedAt: new Date(Date.now() - 92000).toISOString(),
    lastActiveAt: new Date(Date.now() - 5000).toISOString(),
    secondsOnSite: 92,
    device: '📱 Samsung Galaxy S23',
    source: '💬 Link do WhatsApp',
    city: 'Rondonópolis / MT',
    currentSectionId: 'portfolio',
    currentSectionLabel: '💼 Analisando Projetos do Portfólio',
    scrollDepthPct: 38,
    intentLevel: 'INTERESSADO',
    lastInterest: 'Clicou no Projeto #02: GRV Motors Showroom',
    interestHistory: [
      'Abriu link enviado no WhatsApp',
      'Assistiu 30s do Tour de Bastidores',
      'Clicou no Projeto #02: GRV Motors Showroom',
    ],
    pixelEventsFired: ['PageView', 'ViewContent'],
    radarAngle: 155,
    radarDistance: 48,
  },
  {
    sessionId: 'vis-sim-3',
    startedAt: new Date(Date.now() - 64000).toISOString(),
    lastActiveAt: new Date(Date.now() - 2000).toISOString(),
    secondsOnSite: 64,
    device: '💻 Computador Windows',
    source: '📢 Anúncio Meta Ads (IG/FB)',
    city: 'Sinop / MT',
    currentSectionId: 'prejuizo',
    currentSectionLabel: '💸 Calculando Prejuízo Financeiro',
    scrollDepthPct: 68,
    intentLevel: 'QUENTE_ORCAMENTO',
    lastInterest: 'Calculou vazamento: 2.500 visitas · Ticket R$ 320',
    interestHistory: [
      'Entrou pelo Anúncio Meta Ads',
      'Usou Scanner Laser Antes/Depois (Clínica & Estética)',
      'Calculou vazamento: 2.500 visitas · Ticket R$ 320',
    ],
    pixelEventsFired: ['PageView', 'ViewContent'],
    radarAngle: 268,
    radarDistance: 32,
  },
];

export const liveRadarService = {
  getCurrentSessionId(): string {
    let sid = sessionStorage.getItem('01web_my_radar_sid');
    if (!sid) {
      sid = `vis-real-${Math.floor(1000 + Math.random() * 9000)}`;
      sessionStorage.setItem('01web_my_radar_sid', sid);
    }
    return sid;
  },

  getRealSessions(): LiveVisitorSession[] {
    try {
      const raw = localStorage.getItem(RADAR_STORAGE_KEY);
      if (!raw) return [];
      const list: LiveVisitorSession[] = JSON.parse(raw);
      // Keep sessions active in the last 25 minutes
      const cutoff = Date.now() - 1000 * 60 * 25;
      return list.filter((s) => new Date(s.lastActiveAt).getTime() >= cutoff);
    } catch {
      return [];
    }
  },

  getAllSessions(includeSimulated = true): LiveVisitorSession[] {
    const real = this.getRealSessions();
    const mySid = typeof window !== 'undefined' ? sessionStorage.getItem('01web_my_radar_sid') : null;

    const mergedById = new Map<string, LiveVisitorSession>();
    for (const s of [...cloudSessionsCache, ...real]) {
      const prev = mergedById.get(s.sessionId);
      if (
        !prev ||
        new Date(s.lastActiveAt).getTime() >= new Date(prev.lastActiveAt).getTime()
      ) {
        mergedById.set(s.sessionId, {
          ...s,
          isCurrentDevice: s.sessionId === mySid,
        });
      }
    }

    const combinedReal = Array.from(mergedById.values()).sort(
      (a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime()
    );

    if (!includeSimulated) return combinedReal;
    return [...combinedReal, ...SIMULATED_ACTIVE_VISITORS];
  },

  upsertMySession(partial: Partial<LiveVisitorSession>): void {
    const sid = this.getCurrentSessionId();
    const sessions = this.getRealSessions();
    const existing = sessions.find((s) => s.sessionId === sid);

    const nowIso = new Date().toISOString();
    const base: LiveVisitorSession = existing || {
      sessionId: sid,
      isCurrentDevice: true,
      startedAt: nowIso,
      lastActiveAt: nowIso,
      secondsOnSite: 1,
      device: detectDeviceLabel(),
      source: detectTrafficSource(),
      city: 'Sessão Ao Vivo (Navegador Atual)',
      currentSectionId: 'inicio',
      currentSectionLabel: SECTION_LABELS.inicio,
      scrollDepthPct: 5,
      intentLevel: 'EXPLORANDO',
      lastInterest: 'Acabou de entrar na página inicial',
      interestHistory: ['Abriu a Landing Page 01 WEB'],
      pixelEventsFired: ['PageView'],
      radarAngle: 110,
      radarDistance: 55,
    };

    const nextHistory = partial.lastInterest
      ? [
          partial.lastInterest,
          ...base.interestHistory.filter((h) => h !== partial.lastInterest),
        ].slice(0, 6)
      : base.interestHistory;

    const nextPixels = partial.pixelEventsFired
      ? Array.from(new Set([...base.pixelEventsFired, ...partial.pixelEventsFired]))
      : base.pixelEventsFired;

    const updatedSession: LiveVisitorSession = {
      ...base,
      ...partial,
      lastActiveAt: nowIso,
      interestHistory: nextHistory,
      pixelEventsFired: nextPixels,
    };

    const otherSessions = sessions.filter((s) => s.sessionId !== sid);
    const allUpdated = [updatedSession, ...otherSessions].slice(0, 20);

    try {
      localStorage.setItem(RADAR_STORAGE_KEY, JSON.stringify(allUpdated));
      window.dispatchEvent(new CustomEvent(RADAR_EVENT_NAME));
      broadcastChannel?.postMessage({ type: 'RADAR_UPDATE' });
    } catch {
      // ignore
    }

    const shouldPushNow = Boolean(
      partial.currentSectionId || partial.identifiedWhatsapp || partial.lastInterest
    );
    pushSessionToCloud(updatedSession, shouldPushNow);
  },

  recordInteraction(actionText: string, pixelEvent?: string): void {
    const pixels = pixelEvent ? [pixelEvent] : undefined;
    // Also fire ViewContent to Meta Pixel so Facebook knows what the visitor clicked!
    if (
      pixelEvent &&
      typeof window !== 'undefined' &&
      typeof (window as any).fbq === 'function'
    ) {
      try {
        (window as any).fbq('track', pixelEvent, { content_name: actionText });
      } catch {
        // ignore
      }
    }

    this.upsertMySession({
      lastInterest: actionText,
      pixelEventsFired: pixels,
    });
  },

  identifyVisitor(name?: string, whatsapp?: string, pixelEvents?: string[]): void {
    this.upsertMySession({
      identifiedName: name || undefined,
      identifiedWhatsapp: whatsapp || undefined,
      intentLevel: 'CONVERTIDO',
      radarDistance: 14,
      lastInterest: `Identificado: ${name || 'Cliente'} (${whatsapp || ''})`,
      pixelEventsFired: pixelEvents && pixelEvents.length > 0 ? pixelEvents : ['Contact'],
    });
  },

  async syncRadarFromCloud(): Promise<LiveVisitorSession[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return this.getAllSessions();

    try {
      const cutoffIso = new Date(Date.now() - 1000 * 60 * 20).toISOString();
      const { data, error } = await supabase
        .from('live_radar_sessions')
        .select('*')
        .gte('last_active_at', cutoffIso)
        .order('last_active_at', { ascending: false })
        .limit(30);

      if (!error && Array.isArray(data)) {
        cloudSessionsCache = data.map((row) => dbRowToSession(row));
        window.dispatchEvent(new CustomEvent(RADAR_EVENT_NAME));
      }
    } catch {
      // ignore
    }
    return this.getAllSessions();
  },

  startRadarCloudSubscription(): () => void {
    const supabase = getSupabaseClient();
    if (!supabase) return () => {};

    const channel = supabase
      .channel('01web-radar-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'live_radar_sessions' },
        () => {
          void this.syncRadarFromCloud();
        }
      )
      .subscribe();

    const intervalId = window.setInterval(() => {
      void this.syncRadarFromCloud();
    }, 6000);

    return () => {
      window.clearInterval(intervalId);
      void supabase.removeChannel(channel);
    };
  },

  subscribe(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener(RADAR_EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    const bcHandler = () => callback();
    broadcastChannel?.addEventListener('message', bcHandler);
    return () => {
      window.removeEventListener(RADAR_EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
      broadcastChannel?.removeEventListener('message', bcHandler);
    };
  },

  /**
   * Inicia o rastreador automático na Landing Page (Scroll, Seção Visível, Cliques e Tempo Online)
   */
  startPageTelemetry(): () => void {
    if (typeof window === 'undefined') return () => {};

    // Capture UTM campaign parameters from Meta Ads / Google Ads immediately
    pixelService.captureUtmAttribution();

    // Initial ping
    this.upsertMySession({});

    // 1. Timer every 3 seconds to update time on site + 30s Engagement micro-conversion
    const startTs = Date.now();
    const timer = window.setInterval(() => {
      const realSessions = this.getRealSessions();
      const mySid = this.getCurrentSessionId();
      const me = realSessions.find((s) => s.sessionId === mySid);
      const elapsedSec = (me?.secondsOnSite || 0) + 3;
      const finalSec = elapsedSec || Math.round((Date.now() - startTs) / 1000);
      let extraPixels: string[] | undefined;

      if (finalSec >= 30) {
        pixelService.trackEngagementMilestone('TimeOnSite30s');
        extraPixels = ['TimeOnSite30s'];
      }

      this.upsertMySession({
        secondsOnSite: finalSec,
        pixelEventsFired: extraPixels,
      });
    }, 3000);

    // 2. Scroll listener for scroll depth, active section detection & real Intent micro-conversions
    let lastScrollUpdate = 0;
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollUpdate < 450) return;
      lastScrollUpdate = now;

      const scrollTop = window.scrollY;
      const docHeight = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const depth = Math.min(100, Math.max(5, Math.round((scrollTop / docHeight) * 100)));

      // Find which section is currently in the middle of the viewport
      const sectionIds = Object.keys(SECTION_LABELS);
      let activeSecId = 'inicio';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.55 && rect.bottom >= 120) {
            activeSecId = id;
          }
        }
      }

      const firedOnScroll: string[] = [];
      if (depth >= 50) {
        pixelService.trackEngagementMilestone('Engaged50');
        pixelService.trackViewContent('Engajamento 50% da Página 01 WEB', 'Landing Page');
        firedOnScroll.push('Engaged50', 'ViewContent');
      }
      if (depth >= 75) {
        pixelService.trackEngagementMilestone('Engaged75');
        firedOnScroll.push('Engaged75');
      }
      if (activeSecId === 'orcamento') {
        pixelService.trackInitiateCheckout('Scroll até Simulador de Orçamento', 1850);
        firedOnScroll.push('InitiateCheckout');
      }

      const isHotSection =
        activeSecId === 'orcamento' ||
        activeSecId === 'prejuizo' ||
        activeSecId === 'bonus-exclusivo';
      const isWarmSection =
        activeSecId === 'portfolio' ||
        activeSecId === 'comparativo' ||
        activeSecId === 'avaliacoes';

      this.upsertMySession({
        scrollDepthPct: depth,
        currentSectionId: activeSecId,
        currentSectionLabel: SECTION_LABELS[activeSecId] || activeSecId,
        intentLevel: isHotSection
          ? 'QUENTE_ORCAMENTO'
          : isWarmSection
          ? 'INTERESSADO'
          : 'EXPLORANDO',
        radarDistance: isHotSection ? 22 : isWarmSection ? 45 : 68,
        pixelEventsFired: firedOnScroll.length > 0 ? firedOnScroll : undefined,
      });
    };

    // 3. Delegated click listener to log local Radar clicks WITHOUT spamming Meta Pixel ViewContent!
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('button, a');
      if (!target) return;
      const text = (target.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 65);
      if (!text || text.length < 2) return;
      this.recordInteraction(`Clicou em: "${text}"`);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
    };
  },
};
