// ============================================================================
// 01 WEB — MOTOR DE INTELIGÊNCIA META PIXEL ("LEADS PURO SUCO") & UTM
// Filtra curiosos antes de treinar o algoritmo da Meta Ads, evita duplicação
// com eventID único, envia Advanced Matching (telefone/nome) e anexa a
// origem exata do anúncio (UTM) direto no WhatsApp do RD!
// ============================================================================

export type InvestmentTier = 'ate_500' | '1000_2500' | '2500_5000' | 'acima_5000';

export interface UtmAttribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  referrer?: string;
  capturedAt: string;
}

const PIXEL_ID = '1021802663562956';
const UTM_STORAGE_KEY = '01web_utm_attribution_v1';
const FIRED_EVENTS_KEY = '01web_pixel_fired_v1';

function safeFbq(...args: unknown[]): void {
  if (typeof window === 'undefined') return;
  const fbq = (window as unknown as { fbq?: (...fbqArgs: unknown[]) => void }).fbq;
  if (typeof fbq === 'function') {
    try {
      fbq(...args);
    } catch {
      // ignore adblocker / network errors
    }
  }
}

function generateEventId(prefix: string): string {
  return `01web_${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function getFiredMap(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(FIRED_EVENTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function hasFiredOnce(key: string): boolean {
  return Boolean(getFiredMap()[key]);
}

function markFiredOnce(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    const map = getFiredMap();
    map[key] = true;
    sessionStorage.setItem(FIRED_EVENTS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

function getUtmPayload(utm: UtmAttribution | null): Record<string, string> {
  if (!utm) return {};
  const payload: Record<string, string> = {};
  if (utm.utm_source) payload.utm_source = utm.utm_source;
  if (utm.utm_medium) payload.utm_medium = utm.utm_medium;
  if (utm.utm_campaign) payload.utm_campaign = utm.utm_campaign;
  if (utm.utm_content) payload.utm_content = utm.utm_content;
  if (utm.utm_term) payload.utm_term = utm.utm_term;
  return payload;
}

export const pixelService = {
  captureUtmAttribution(): UtmAttribution {
    const empty: UtmAttribution = { capturedAt: new Date().toISOString() };
    if (typeof window === 'undefined') return empty;

    const params = new URLSearchParams(window.location.search);
    const utm_source = params.get('utm_source') || undefined;
    const utm_medium = params.get('utm_medium') || undefined;
    const utm_campaign = params.get('utm_campaign') || undefined;
    const utm_content = params.get('utm_content') || undefined;
    const utm_term = params.get('utm_term') || undefined;
    const fbclid = params.get('fbclid') || undefined;
    const gclid = params.get('gclid') || undefined;
    const rawReferrer = document.referrer?.trim() || '';
    const referrer =
      rawReferrer && !rawReferrer.includes(window.location.hostname) ? rawReferrer : undefined;

    const hasIncomingParams = Boolean(
      utm_source || utm_medium || utm_campaign || utm_content || utm_term || fbclid || gclid
    );

    try {
      const existingRaw = sessionStorage.getItem(UTM_STORAGE_KEY);
      if (existingRaw && !hasIncomingParams) {
        return JSON.parse(existingRaw) as UtmAttribution;
      }

      const fresh: UtmAttribution = {
        utm_source: utm_source || (fbclid ? 'meta_ads' : gclid ? 'google_ads' : undefined),
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        fbclid,
        gclid,
        referrer,
        capturedAt: new Date().toISOString(),
      };

      if (hasIncomingParams || referrer || !existingRaw) {
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fresh));
      }
      return fresh;
    } catch {
      return empty;
    }
  },

  getUtmAttribution(): UtmAttribution | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as UtmAttribution;
    } catch {
      // ignore
    }
    return this.captureUtmAttribution();
  },

  formatUtmForWhatsApp(): string {
    const utm = this.getUtmAttribution();
    if (!utm) return '';

    const parts: string[] = [];
    if (utm.utm_source) parts.push(`Fonte: ${utm.utm_source}`);
    if (utm.utm_campaign) parts.push(`Campanha: ${utm.utm_campaign}`);
    if (utm.utm_content) parts.push(`Criativo: ${utm.utm_content}`);
    if (utm.utm_term) parts.push(`Público: ${utm.utm_term}`);
    if (!parts.length && utm.fbclid) parts.push('Anúncio Meta Ads (IG/FB)');
    if (!parts.length && utm.gclid) parts.push('Anúncio Google Ads');
    if (!parts.length && utm.referrer) parts.push(`Ref: ${utm.referrer}`);

    if (parts.length === 0) return '';
    return `\n📢 *Origem/Anúncio:* ${parts.join(' | ')}`;
  },

  getUtmSummary(): string {
    const utm = this.getUtmAttribution();
    if (!utm) return '';
    const parts: string[] = [];
    if (utm.utm_source) parts.push(utm.utm_source);
    if (utm.utm_campaign) parts.push(utm.utm_campaign);
    if (utm.utm_content) parts.push(utm.utm_content);
    if (!parts.length && utm.fbclid) parts.push('Meta Ads (fbclid)');
    if (!parts.length && utm.gclid) parts.push('Google Ads (gclid)');
    if (!parts.length && utm.referrer) parts.push(utm.referrer);
    return parts.join(' · ');
  },

  applyAdvancedMatching(params: { name?: string; whatsapp?: string }): void {
    const digits = (params.whatsapp || '').replace(/\D/g, '');
    if (digits.length < 10) return;

    const ph = digits.length <= 11 ? `55${digits}` : digits;
    const rawFirst = (params.name || '').trim().split(/\s+/)[0]?.toLowerCase() || '';
    const fn = rawFirst.replace(/[^a-zà-ÿ]/gi, '');

    const matchKey = `am_${ph}`;
    if (hasFiredOnce(matchKey)) return;
    markFiredOnce(matchKey);

    const userData: Record<string, string> = { ph, country: 'br' };
    if (fn && fn !== 'visitante' && fn !== 'cliente') {
      userData.fn = fn;
    }

    safeFbq('init', PIXEL_ID, userData);
  },

  trackViewContent(contentName: string, contentCategory = 'Portfolio / Conteúdo'): void {
    const key = `vc_${contentName}`;
    if (hasFiredOnce(key)) return;
    markFiredOnce(key);

    const utm = this.getUtmAttribution();
    const eventID = generateEventId('vc');
    safeFbq(
      'track',
      'ViewContent',
      {
        content_name: contentName,
        content_category: contentCategory,
        ...getUtmPayload(utm),
      },
      { eventID }
    );
  },

  trackInitiateCheckout(sourceLabel: string, estimatedValue = 1850): void {
    if (hasFiredOnce('ic_main')) return;
    markFiredOnce('ic_main');

    const utm = this.getUtmAttribution();
    const eventID = generateEventId('ic');
    safeFbq(
      'track',
      'InitiateCheckout',
      {
        content_name: sourceLabel,
        value: estimatedValue,
        currency: 'BRL',
        ...getUtmPayload(utm),
      },
      { eventID }
    );
  },

  trackWhatsAppContact(originLabel: string, estimatedValue?: number): void {
    const utm = this.getUtmAttribution();
    const utmPayload = getUtmPayload(utm);
    const eventID = generateEventId('wa');

    safeFbq(
      'track',
      'Contact',
      {
        content_name: originLabel,
        value: estimatedValue || 0,
        currency: 'BRL',
        ...utmPayload,
      },
      { eventID }
    );

    safeFbq('trackCustom', 'CliqueWhatsApp', {
      origin: originLabel,
      ...utmPayload,
    });
  },

  trackEngagementMilestone(milestone: 'Engaged50' | 'Engaged75' | 'TimeOnSite30s'): void {
    const key = `ms_${milestone}`;
    if (hasFiredOnce(key)) return;
    markFiredOnce(key);

    const utm = this.getUtmAttribution();
    safeFbq('trackCustom', milestone, {
      ...getUtmPayload(utm),
    });
  },

  trackQualifiedLead(params: {
    name?: string;
    whatsapp?: string;
    segment: string;
    needLabel: string;
    urgency: string;
    investmentTier?: InvestmentTier;
    budgetEstimate?: number;
    score: number;
    temperature: 'HOT' | 'WARM' | 'COLD';
    source: string;
    isAbandoned?: boolean;
  }): { isPuroSuco: boolean; eventsFired: string[] } {
    const utm = this.getUtmAttribution();
    const utmPayload = getUtmPayload(utm);

    // CASE A: Silent Abandonment -> NEVER fire Lead or LeadPuroSuco! Remarketing only.
    if (params.isAbandoned) {
      if (!hasFiredOnce('abandoned_wa')) {
        markFiredOnce('abandoned_wa');
        safeFbq('trackCustom', 'AbandonoWhatsApp', {
          content_category: params.segment,
          source: params.source,
          ...utmPayload,
        });
      }
      return { isPuroSuco: false, eventsFired: ['AbandonoWhatsApp'] };
    }

    // Apply Meta Advanced Matching with phone & first name
    this.applyAdvancedMatching({ name: params.name, whatsapp: params.whatsapp });

    const isCurioso =
      params.urgency === 'apenas_orcando' ||
      params.investmentTier === 'ate_500' ||
      params.temperature === 'COLD' ||
      params.score < 65;

    // CASE B: Curioso / Frio -> NEVER fire Lead or LeadPuroSuco! Keep algorithm clean.
    if (isCurioso) {
      if (!hasFiredOnce('contact_curioso')) {
        markFiredOnce('contact_curioso');
        const eventID = generateEventId('curioso');
        safeFbq(
          'track',
          'Contact',
          {
            content_name: params.needLabel,
            content_category: params.segment,
            ...utmPayload,
          },
          { eventID }
        );
        safeFbq('trackCustom', 'LeadCurioso', {
          content_category: params.segment,
          urgency: params.urgency,
          investment_tier: params.investmentTier || 'nao_informado',
          ...utmPayload,
        });
      }
      return { isPuroSuco: false, eventsFired: ['Contact', 'LeadCurioso'] };
    }

    // CASE C: LEAD PURO SUCO! Qualified Business Owner with budget/urgency
    if (!hasFiredOnce('lead_puro_suco_main')) {
      markFiredOnce('lead_puro_suco_main');
      const eventID = generateEventId('lead');
      const value = params.budgetEstimate || 1850;
      const tier = params.investmentTier || '1000_2500';

      safeFbq(
        'track',
        'Lead',
        {
          content_name: params.needLabel,
          content_category: params.segment,
          value,
          currency: 'BRL',
          predicted_ltv: value,
          status: params.temperature,
          investment_tier: tier,
          lead_tier: 'PURO_SUCO',
          score: params.score,
          ...utmPayload,
        },
        { eventID }
      );

      safeFbq(
        'trackCustom',
        'LeadPuroSuco',
        {
          content_name: params.needLabel,
          content_category: params.segment,
          value,
          currency: 'BRL',
          urgency: params.urgency,
          investment_tier: tier,
          score: params.score,
          ...utmPayload,
        },
        { eventID: `${eventID}_ps` }
      );

      safeFbq(
        'track',
        'Contact',
        {
          content_name: params.needLabel,
          content_category: params.segment,
          value,
          currency: 'BRL',
          ...utmPayload,
        },
        { eventID: `${eventID}_ct` }
      );
    }

    return { isPuroSuco: true, eventsFired: ['Lead', 'LeadPuroSuco', 'Contact'] };
  },
};
