// ============================================================================
// 01 WEB — LIVE VISITOR RADAR & INTENT TELEMETRY ENGINE
// Rastreia em tempo real quem está navegando no site, qual seção está olhando,
// profundidade de scroll, cliques em projetos/nichos e eventos do Meta Pixel.
// ============================================================================

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
    const markedReal = real.map((s) => ({
      ...s,
      isCurrentDevice: s.sessionId === mySid,
    }));

    if (!includeSimulated) return markedReal;
    return [...markedReal, ...SIMULATED_ACTIVE_VISITORS];
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

  identifyVisitor(name?: string, whatsapp?: string): void {
    this.upsertMySession({
      identifiedName: name || undefined,
      identifiedWhatsapp: whatsapp || undefined,
      intentLevel: 'CONVERTIDO',
      radarDistance: 14,
      lastInterest: `Identificado: ${name || 'Cliente'} (${whatsapp || ''})`,
      pixelEventsFired: ['Lead', 'Contact'],
    });
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

    // Initial ping
    this.upsertMySession({});

    // 1. Timer every 3 seconds to update time on site
    const startTs = Date.now();
    const timer = window.setInterval(() => {
      const realSessions = this.getRealSessions();
      const mySid = this.getCurrentSessionId();
      const me = realSessions.find((s) => s.sessionId === mySid);
      const elapsedSec = (me?.secondsOnSite || 0) + 3;
      this.upsertMySession({
        secondsOnSite: elapsedSec || Math.round((Date.now() - startTs) / 1000),
      });
    }, 3000);

    // 2. Scroll listener for scroll depth & active section detection
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
      });
    };

    // 3. Delegated click listener to capture what buttons/projects the visitor clicks!
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('button, a');
      if (!target) return;
      const text = (target.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 65);
      if (!text || text.length < 2) return;
      this.recordInteraction(`Clicou em: "${text}"`, 'ViewContent');
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
