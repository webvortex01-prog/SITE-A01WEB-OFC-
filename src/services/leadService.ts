import {
  Lead,
  LeadStatus,
  LeadTemperature,
  AgencySettings,
  ProjectChecklist,
  CeoIdea,
  CeoTask,
  AgencyTemplate,
} from '../types/lead';
import { generateAiSolutionBlueprint } from './aiLeadArchitect';
import { liveRadarService } from './liveRadarService';
import { pixelService } from './pixelService';

const STORAGE_KEY = '01web_leads_v3';
const SETTINGS_KEY = '01web_agency_settings_v3';
const IDEAS_KEY = '01web_ceo_ideas_v1';
const TASKS_KEY = '01web_ceo_tasks_v1';
const TEMPLATES_KEY = '01web_agency_templates_v1';
const EVENT_NAME = '01web_leads_updated';

const DEFAULT_SETTINGS: AgencySettings = {
  whatsappNumber: '5566999697087',
  monthlyRevenueGoal: 30000,
  monthlyAdSpend: 1800,
  agencyName: '01 WEB Digital',
  ceoName: 'RD (CEO 01 Web)',
};

export function calculateLeadScore(lead: Partial<Lead>): number {
  let score = 40;
  if (lead.urgency === 'imediato') score += 30;
  else if (lead.urgency === '15_30_dias') score += 16;
  else score += 4;

  if (lead.need === 'combo_completo') score += 16;
  else if (lead.need === 'sistema_gestao') score += 12;
  else if (lead.need === 'site_institucional') score += 8;
  else score += 4;

  if (lead.investmentTier === 'acima_5000') score += 20;
  else if (lead.investmentTier === '2500_5000') score += 15;
  else if (lead.investmentTier === '1000_2500') score += 8;

  // Hard cap curious / low-budget leads to COLD so they NEVER train the Meta Pixel as HOT!
  if (lead.investmentTier === 'ate_500' || lead.urgency === 'apenas_orcando') {
    return Math.min(45, score);
  }

  return Math.min(100, score);
}

export function deriveTemperature(score: number): LeadTemperature {
  if (score >= 80) return 'HOT';
  if (score >= 55) return 'WARM';
  return 'COLD';
}

const DEFAULT_CHECKLIST: ProjectChecklist = {
  briefing: true,
  designMobile: false,
  domainHosting: false,
  whatsappAutomation: false,
  finalDelivery: false,
};

const SEED_LEADS: Lead[] = [
  {
    id: 'lead-1719001',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    name: 'Dr. Leonardo Castilho',
    businessName: 'Castilho Advocacia & Consultoria',
    whatsapp: '11984210984',
    segment: 'Advocacia / Jurídico',
    bottleneck: 'ads_no_conversion',
    bottleneckLabel: 'Gasto em anúncio mas ninguém fecha pelo WhatsApp',
    need: 'combo_completo',
    needLabel: 'Ecossistema Completo (Site de Autoridade + Triagem WhatsApp)',
    urgency: 'imediato',
    urgencyLabel: 'Imediato (esta semana)',
    budgetEstimate: 2800,
    status: 'NOVO',
    temperature: 'HOT',
    score: 100,
    notes: 'Investe R$ 1.500/mês no Google Ads. Quer fechar hoje para não perder mais cliques.',
    source: 'funil_anuncio',
    diagnosticSummary:
      'Gargalo: Anúncios sem conversão por falta de autoridade visual e triagem rápida. Solução: Landing Page de Alta Conversão + Triagem 24/7 no WhatsApp.',
    checklist: { ...DEFAULT_CHECKLIST, briefing: false },
    paidDeposit: false,
    paidFinal: false,
  },
  {
    id: 'lead-1719002',
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    name: 'Henrique Vasconcelos',
    businessName: 'Prime Motors Importados',
    whatsapp: '11993124455',
    segment: 'Automotivo / Concessionária',
    bottleneck: 'slow_ugly_site',
    bottleneckLabel: 'Meu site atual é lento, feio ou desatualizado',
    need: 'combo_completo',
    needLabel: 'Ecossistema Completo (Vitrine + Painel de Estoque)',
    urgency: 'imediato',
    urgencyLabel: 'Imediato (esta semana)',
    budgetEstimate: 3400,
    status: 'NOVO',
    temperature: 'HOT',
    score: 98,
    notes: 'Ficou em choque com o preview da GRV Motors! Quer fechar pacote completo com estoque.',
    source: 'funil_anuncio',
    diagnosticSummary:
      'Gargalo: Perda de leads de tráfego pago por lentidão no mobile. Solução: Catálogo automotivo ultra-rápido com botão de proposta e simulador.',
    checklist: { ...DEFAULT_CHECKLIST, briefing: false },
    paidDeposit: false,
    paidFinal: false,
  },
  {
    id: 'lead-1718942',
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    name: 'Dra. Camila Nogueira',
    businessName: 'Clínica Nogueira Harmonização',
    whatsapp: '13991234567',
    segment: 'Saúde / Clínica / Estética',
    bottleneck: 'manual_support_chaos',
    bottleneckLabel: 'Atendimento manual consome o dia todo e perco agendamentos',
    need: 'sistema_gestao',
    needLabel: 'Sistema Web de Agendamento + Painel',
    urgency: 'imediato',
    urgencyLabel: 'Imediato (esta semana)',
    budgetEstimate: 2400,
    status: 'EM_CONTATO',
    temperature: 'HOT',
    score: 92,
    notes: 'Quer organizar a agenda das 3 esteticistas sem pagar mensalidades de app.',
    source: 'funil_anuncio',
    diagnosticSummary:
      'Gargalo: Perda de pacientes por demora na resposta de horários. Solução: Sistema web de reserva rápida integrado ao WhatsApp.',
    checklist: { ...DEFAULT_CHECKLIST },
    paidDeposit: false,
    paidFinal: false,
  },
  {
    id: 'lead-1718810',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    name: 'Thiago Mendes',
    businessName: 'Mendes Garage Multimarcas',
    whatsapp: '11977654321',
    segment: 'Automotivo / Concessionária',
    bottleneck: 'no_presence',
    bottleneckLabel: 'Não tenho catálogo online próprio, dependo só do Instagram',
    need: 'landing_page',
    needLabel: 'Landing Page de Alta Conversão com Estoque',
    urgency: '15_30_dias',
    urgencyLabel: 'Próximos 15 a 30 dias',
    budgetEstimate: 1650,
    status: 'PROPOSTA_ENVIADA',
    temperature: 'WARM',
    score: 72,
    notes: 'Proposta enviada no WhatsApp no valor de R$ 1.650. Vai confirmar com o sócio amanhã.',
    source: 'calculadora_orcamento',
    diagnosticSummary:
      'Gargalo: Falta de catálogo rápido para envio direto no tráfego pago. Solução: Vitrine digital rápida com botão PIX.',
    checklist: { ...DEFAULT_CHECKLIST },
    paidDeposit: false,
    paidFinal: false,
  },
  {
    id: 'lead-1718750',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    name: 'Larissa Prado',
    businessName: 'Boutique Larissa Fashion',
    whatsapp: '11988112233',
    segment: 'Loja de Roupas / Moda',
    bottleneck: 'no_presence',
    bottleneckLabel: 'Não tenho site nem catálogo próprio',
    need: 'site_institucional',
    needLabel: 'Catálogo Digital de Moda + Pedido no WhatsApp',
    urgency: '15_30_dias',
    urgencyLabel: 'Próximos 15 a 30 dias',
    budgetEstimate: 1850,
    status: 'EM_CONTATO',
    temperature: 'WARM',
    score: 68,
    notes: 'Gostou muito do modelo de Loja de Roupas. Esperando virar o cartão dia 05.',
    source: 'funil_anuncio',
    diagnosticSummary: 'Catálogo com carrinho integrado ao WhatsApp para coleção nova.',
    checklist: { ...DEFAULT_CHECKLIST },
    paidDeposit: false,
    paidFinal: false,
  },
  {
    id: 'lead-1718700',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 38).toISOString(),
    name: 'Marcos Vinícius',
    businessName: 'MV Consultoria Contábil',
    whatsapp: '19991122334',
    segment: 'Serviços / Consultoria / B2B',
    bottleneck: 'slow_ugly_site',
    bottleneckLabel: 'Meu site atual é lento, feio ou desatualizado',
    need: 'landing_page',
    needLabel: 'Apenas Landing Page de Alta Conversão',
    urgency: 'apenas_orcando',
    urgencyLabel: 'Apenas orçando / Planejamento',
    budgetEstimate: 1200,
    status: 'EM_CONTATO',
    temperature: 'COLD',
    score: 42,
    notes: 'Está apenas pesquisando preços para o próximo trimestre. Colocar na lista de remarketing.',
    source: 'funil_anuncio',
    diagnosticSummary: 'Reformulação de página de captura contábil.',
    checklist: { ...DEFAULT_CHECKLIST },
    paidDeposit: false,
    paidFinal: false,
  },
  {
    id: 'lead-1718600',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    name: 'Beatriz Alencar',
    businessName: 'Studio Lumina Beauty & Spa',
    whatsapp: '21998761234',
    segment: 'Salão de Beleza / Barbearia',
    bottleneck: 'manual_support_chaos',
    bottleneckLabel: 'Atendimento manual consome meu dia todo',
    need: 'combo_completo',
    needLabel: 'Ecossistema Completo (Site + Agendamento + WhatsApp)',
    urgency: 'imediato',
    urgencyLabel: 'Imediato (esta semana)',
    budgetEstimate: 2600,
    status: 'FECHADO',
    temperature: 'HOT',
    score: 100,
    notes: 'Sinal de 50% (R$ 1.300) pago via PIX. Domínio studiolumina.com.br registrado.',
    source: 'funil_anuncio',
    diagnosticSummary:
      'Projeto fechado! Desenvolvimento de página estilo Studio Salão + agenda inteligente.',
    checklist: {
      briefing: true,
      designMobile: true,
      domainHosting: true,
      whatsappAutomation: false,
      finalDelivery: false,
    },
    paidDeposit: true,
    paidFinal: false,
  },
  {
    id: 'lead-1718400',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    name: 'Rafael K. Ink',
    businessName: 'Black Crown Tattoo Collective',
    whatsapp: '11965439876',
    segment: 'Estúdio de Tatuagem / Body Art',
    bottleneck: 'ads_no_conversion',
    bottleneckLabel: 'Gasto em anúncios mas ninguém compra',
    need: 'site_institucional',
    needLabel: 'Site Institucional Multi-páginas + Orçador de Tattoo',
    urgency: 'imediato',
    urgencyLabel: 'Imediato (esta semana)',
    budgetEstimate: 1950,
    status: 'FECHADO',
    temperature: 'HOT',
    score: 95,
    notes: '100% Quitado! Cliente super satisfeito, indicou mais 2 estúdios.',
    source: 'funil_anuncio',
    diagnosticSummary: 'Portfólio dark mode + calculadora de orçamento por tamanho de tatuagem.',
    checklist: {
      briefing: true,
      designMobile: true,
      domainHosting: true,
      whatsappAutomation: true,
      finalDelivery: true,
    },
    paidDeposit: true,
    paidFinal: true,
  },
];

const SEED_IDEAS: CeoIdea[] = [
  {
    id: 'idea-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    title: 'Criar Criativo em Vídeo Mostrando os 6 Nichos Ao Vivo',
    category: 'anuncio_criativo',
    content:
      'Gravar a tela do celular abrindo o site de Advocacia e o de Loja de Carros em menos de 1 segundo e falar: "Seu anúncio manda o cliente pra um WhatsApp vazio ou pra uma máquina de vendas dessas?"',
    priority: 'alta',
    pinned: true,
  },
  {
    id: 'idea-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    title: 'Pacote Recorrente de Manutenção + Alterações (R$ 149/mês)',
    category: 'oferta_nicho',
    content:
      'Oferecer no pós-venda (após o 1º ano grátis) um plano opcional de suporte VIP para atualização de banners, fotos novas e acompanhamento de velocidade.',
    priority: 'media',
    pinned: true,
  },
  {
    id: 'idea-3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    title: 'Desenvolver Template Pronto para Clínicas de Odontologia & Implantes',
    category: 'saas_produto',
    content:
      'Nicho odontológico tem ticket altíssimo (implante e lentes de resina). Criar um modelo exemplar na Vercel para rodar anúncio focado em dentistas.',
    priority: 'alta',
    pinned: false,
  },
];

const SEED_TASKS: CeoTask[] = [
  {
    id: 'task-1',
    text: 'Atacar os 2 leads QUENTES 🔥 que acabaram de cair do anúncio (Dr. Leonardo e Henrique)',
    done: false,
    tag: 'vendas',
  },
  {
    id: 'task-2',
    text: 'Finalizar configuração do fluxo WhatsApp da Studio Lumina Beauty e cobrar 50% final (R$ 1.300)',
    done: false,
    tag: 'dev',
  },
  {
    id: 'task-3',
    text: 'Fazer follow-up com Thiago Mendes (Mendes Garage) sobre a proposta de R$ 1.650',
    done: false,
    tag: 'vendas',
  },
  {
    id: 'task-4',
    text: 'Revisar métricas de CTR da campanha de Meta Ads e escalar conjunto vencedor',
    done: true,
    tag: 'trafego',
  },
];

const SEED_TEMPLATES: AgencyTemplate[] = [
  {
    id: 'tpl-1',
    niche: 'Advocacia / Jurídico',
    name: 'Aldo Leão Advocacia High-Ticket',
    url: 'https://aldo-leao.vercel.app/',
    highlights: 'Design sóbrio de autoridade, áreas de atuação e filtro rápido para WhatsApp.',
    suggestedPrice: 2400,
  },
  {
    id: 'tpl-2',
    niche: 'Automotivo / Concessionária',
    name: 'GRV Motors Multimarcas & Importados',
    url: 'https://grv-motors.vercel.app/',
    highlights: 'Catálogo de estoque rápido, ficha técnica de veículos e botão de proposta.',
    suggestedPrice: 2900,
  },
  {
    id: 'tpl-3',
    niche: 'Salão de Beleza / Barbearia',
    name: 'Studio Salão de Beleza & Visagismo',
    url: 'https://salaodebeleza-six.vercel.app/',
    highlights: 'Menu de serviços, vitrine de resultados e agendamento integrado.',
    suggestedPrice: 2200,
  },
  {
    id: 'tpl-4',
    niche: 'Loja de Roupas / Moda',
    name: 'Flagship Store Moda & Streetwear',
    url: 'https://projeto-de-loja-de-roupas.vercel.app/',
    highlights: 'Lookbook interativo, seleção de tamanhos e fechamento de pedido rápido.',
    suggestedPrice: 2500,
  },
  {
    id: 'tpl-5',
    niche: 'Saúde / Clínica / Estética',
    name: 'Clínica Estética Exemplar',
    url: 'https://modelo-estetica-exemplar.vercel.app/',
    highlights: 'Apresentação de protocolos, antes/depois e avaliação no WhatsApp.',
    suggestedPrice: 2400,
  },
  {
    id: 'tpl-6',
    niche: 'Estúdio de Tatuagem / Body Art',
    name: 'Private Tattoo Studio Exemplar',
    url: 'https://modelo-tatoo-exemplar.vercel.app/',
    highlights: 'Galeria dark mode de artistas, estilos e orçador de sessão.',
    suggestedPrice: 1950,
  },
];

export const leadService = {
  getLeads(): Lead[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const rawLeads: Lead[] = data ? JSON.parse(data) : SEED_LEADS;
      const enriched = rawLeads.map((l) =>
        l.aiBlueprint ? l : { ...l, aiBlueprint: generateAiSolutionBlueprint(l) }
      );
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));
      }
      return enriched;
    } catch {
      return SEED_LEADS.map((l) => ({ ...l, aiBlueprint: generateAiSolutionBlueprint(l) }));
    }
  },

  addLead(
    leadInput: Omit<Lead, 'id' | 'createdAt' | 'status'>,
    options?: { isAbandoned?: boolean }
  ): Lead {
    const leads = this.getLeads();
    const score = leadInput.score ?? calculateLeadScore(leadInput);
    const temperature = leadInput.temperature ?? deriveTemperature(score);
    const aiBlueprint = leadInput.aiBlueprint ?? generateAiSolutionBlueprint(leadInput);
    const utmSummary = leadInput.utmSummary || pixelService.getUtmSummary() || undefined;

    const pixelResult = pixelService.trackQualifiedLead({
      name: leadInput.name,
      whatsapp: leadInput.whatsapp,
      segment: leadInput.segment,
      needLabel: leadInput.needLabel,
      urgency: leadInput.urgency,
      investmentTier: leadInput.investmentTier,
      budgetEstimate: leadInput.budgetEstimate,
      score,
      temperature,
      source: leadInput.source,
      isAbandoned: options?.isAbandoned,
    });

    const newLead: Lead = {
      ...leadInput,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'NOVO',
      score,
      temperature,
      aiBlueprint,
      utmSummary,
      isPuroSuco: pixelResult.isPuroSuco,
      checklist: { ...DEFAULT_CHECKLIST, briefing: false },
      paidDeposit: false,
      paidFinal: false,
    };

    const updated = [newLead, ...leads];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: newLead }));
      liveRadarService.identifyVisitor(newLead.name, newLead.whatsapp, pixelResult.eventsFired);
    } catch (e) {
      console.error('Failed to save lead in localStorage', e);
    }

    return newLead;
  },

  /**
   * Captura silenciosa ou por Intenção de Saída (Exit-Intent / Abandono):
   * Salva o WhatsApp do visitante assim que ele digita um número válido (10 ou 11 dígitos),
   * mesmo que ele feche a aba antes de concluir o orçamento!
   */
  captureAbandonedLead(params: {
    name?: string;
    whatsapp: string;
    segment?: string;
    contextNote?: string;
    budgetEstimate?: number;
  }): Lead | null {
    const cleanPhone = params.whatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 10) return null;

    const leads = this.getLeads();
    const existing = leads.find((l) => l.whatsapp.replace(/\D/g, '') === cleanPhone);
    if (existing) {
      return existing;
    }

    return this.addLead(
      {
        name: (params.name || 'Visitante do Site').trim(),
        businessName: params.segment || 'Capturado pelo Robô de Saída',
        whatsapp: cleanPhone,
        segment: params.segment || 'Interessado no Site 01 WEB',
        bottleneck: 'ads_no_conversion',
        bottleneckLabel: '🚨 Visualizou o Site e Não Finalizou (Recuperação)',
        problemDetails:
          params.contextNote ||
          'Visitante visualizou o site / simulou valores e deixou o WhatsApp no gatilho de recuperação.',
        need: 'combo_completo',
        needLabel: 'Estrutura 01 WEB + Voucher Bônus R$ 1.030',
        urgency: 'imediato',
        urgencyLabel: 'Recuperação Imediata (Abandono)',
        budgetEstimate: params.budgetEstimate || 1850,
        temperature: 'HOT',
        score: 97,
        source: 'funil_anuncio',
        diagnosticSummary:
          'Lead capturado pelo Gatilho de Intenção de Saída / Abandono. Chamar com o script do Robô de Recuperação!',
        notes: `🚨 LEAD DE RECUPERAÇÃO: ${params.contextNote || 'Visualizou o site e deixou o contato.'}`,
      },
      { isAbandoned: true }
    );
  },

  regenerateLeadAiBlueprint(id: string, customInstruction?: string): Lead | null {
    const leads = this.getLeads();
    let updatedLead: Lead | null = null;
    const updated = leads.map((l) => {
      if (l.id !== id) return l;
      const nextBlueprint = generateAiSolutionBlueprint(l, customInstruction);
      updatedLead = {
        ...l,
        aiBlueprint: nextBlueprint,
        budgetEstimate: nextBlueprint.suggestedTicket,
      };
      return updatedLead;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
    return updatedLead;
  },

  updateLeadStatus(id: string, status: LeadStatus): void {
    const leads = this.getLeads();
    const updated = leads.map((l) =>
      l.id === id ? { ...l, status, lastContactedAt: new Date().toISOString() } : l
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  },

  updateLeadTemperature(id: string, temperature: LeadTemperature): void {
    const leads = this.getLeads();
    const newScore = temperature === 'HOT' ? 95 : temperature === 'WARM' ? 70 : 35;
    const updated = leads.map((l) =>
      l.id === id ? { ...l, temperature, score: newScore } : l
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  },

  updateLeadPayment(id: string, field: 'paidDeposit' | 'paidFinal', val: boolean): void {
    const leads = this.getLeads();
    const updated = leads.map((l) => (l.id === id ? { ...l, [field]: val } : l));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  },

  updateLeadNotes(id: string, notes: string): void {
    const leads = this.getLeads();
    const updated = leads.map((l) => (l.id === id ? { ...l, notes } : l));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  },

  updateLeadBudget(id: string, budgetEstimate: number): void {
    const leads = this.getLeads();
    const updated = leads.map((l) => (l.id === id ? { ...l, budgetEstimate } : l));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  },

  updateLeadChecklist(id: string, key: keyof ProjectChecklist, val: boolean): void {
    const leads = this.getLeads();
    const updated = leads.map((l) => {
      if (l.id !== id) return l;
      const current = l.checklist || { ...DEFAULT_CHECKLIST };
      return {
        ...l,
        checklist: {
          ...current,
          [key]: val,
        },
      };
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  },

  deleteLead(id: string): void {
    const leads = this.getLeads();
    const updated = leads.filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  },

  // ================= CEO IDEAS & BRAINSTORM =================
  getIdeas(): CeoIdea[] {
    try {
      const raw = localStorage.getItem(IDEAS_KEY);
      if (!raw) {
        localStorage.setItem(IDEAS_KEY, JSON.stringify(SEED_IDEAS));
        return SEED_IDEAS;
      }
      return JSON.parse(raw);
    } catch {
      return SEED_IDEAS;
    }
  },

  addIdea(idea: Omit<CeoIdea, 'id' | 'createdAt'>): CeoIdea {
    const current = this.getIdeas();
    const nextIdea: CeoIdea = {
      ...idea,
      id: `idea-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [nextIdea, ...current];
    localStorage.setItem(IDEAS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
    return nextIdea;
  },

  togglePinIdea(id: string): void {
    const current = this.getIdeas();
    const updated = current.map((i) => (i.id === id ? { ...i, pinned: !i.pinned } : i));
    localStorage.setItem(IDEAS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  },

  deleteIdea(id: string): void {
    const current = this.getIdeas();
    const updated = current.filter((i) => i.id !== id);
    localStorage.setItem(IDEAS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  },

  // ================= CEO DAILY TASKS =================
  getTasks(): CeoTask[] {
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      if (!raw) {
        localStorage.setItem(TASKS_KEY, JSON.stringify(SEED_TASKS));
        return SEED_TASKS;
      }
      return JSON.parse(raw);
    } catch {
      return SEED_TASKS;
    }
  },

  addTask(text: string, tag: CeoTask['tag']): CeoTask {
    const current = this.getTasks();
    const nextTask: CeoTask = {
      id: `task-${Date.now()}`,
      text,
      done: false,
      tag,
    };
    localStorage.setItem(TASKS_KEY, JSON.stringify([nextTask, ...current]));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
    return nextTask;
  },

  toggleTask(id: string): void {
    const current = this.getTasks();
    const updated = current.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  },

  deleteTask(id: string): void {
    const current = this.getTasks();
    const updated = current.filter((t) => t.id !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  },

  // ================= AGENCY VERCEL TEMPLATES VAULT =================
  getTemplates(): AgencyTemplate[] {
    try {
      const raw = localStorage.getItem(TEMPLATES_KEY);
      if (!raw) {
        localStorage.setItem(TEMPLATES_KEY, JSON.stringify(SEED_TEMPLATES));
        return SEED_TEMPLATES;
      }
      return JSON.parse(raw);
    } catch {
      return SEED_TEMPLATES;
    }
  },

  addTemplate(tpl: Omit<AgencyTemplate, 'id'>): AgencyTemplate {
    const current = this.getTemplates();
    const nextTpl: AgencyTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
    };
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify([nextTpl, ...current]));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
    return nextTpl;
  },

  deleteTemplate(id: string): void {
    const current = this.getTemplates();
    const updated = current.filter((t) => t.id !== id);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  },

  resetToDefaultSeed(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LEADS));
    localStorage.setItem(IDEAS_KEY, JSON.stringify(SEED_IDEAS));
    localStorage.setItem(TASKS_KEY, JSON.stringify(SEED_TASKS));
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(SEED_TEMPLATES));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  },

  getSettings(): AgencySettings {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings(partial: Partial<AgencySettings>): AgencySettings {
    const current = this.getSettings();
    const next = { ...current, ...partial };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
    return next;
  },

  subscribe(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  },

  exportCSV(): void {
    const leads = this.getLeads();
    const headers = [
      'ID',
      'Data/Hora',
      'Temperatura',
      'Score',
      'Nome',
      'Empresa',
      'WhatsApp',
      'Segmento',
      'Gargalo/Dificuldade',
      'Necessidade',
      'Urgência',
      'Status',
      'Valor Estimado (R$)',
      'Notas',
      'Origem',
    ];

    const rows = leads.map((l) => [
      l.id,
      new Date(l.createdAt).toLocaleString('pt-BR'),
      l.temperature || 'HOT',
      l.score || 85,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.businessName.replace(/"/g, '""')}"`,
      l.whatsapp,
      `"${l.segment}"`,
      `"${l.bottleneckLabel.replace(/"/g, '""')}"`,
      `"${l.needLabel.replace(/"/g, '""')}"`,
      `"${l.urgencyLabel}"`,
      l.status,
      l.budgetEstimate || 0,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      l.source,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_01web_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportJSON(): void {
    const leads = this.getLeads();
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(leads, null, 2)
    )}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute(
      'download',
      `leads_01web_backup_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
