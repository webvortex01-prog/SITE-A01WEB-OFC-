export type LeadStatus = 'NOVO' | 'EM_CONTATO' | 'PROPOSTA_ENVIADA' | 'FECHADO' | 'PERDIDO';

export type LeadTemperature = 'HOT' | 'WARM' | 'COLD';

export type LeadUrgency = 'imediato' | '15_30_dias' | 'apenas_orcando';

export type LeadNeed = 'landing_page' | 'site_institucional' | 'sistema_gestao' | 'combo_completo';

export type LeadBottleneck =
  | 'ads_no_conversion'
  | 'no_presence'
  | 'slow_ugly_site'
  | 'manual_support_chaos'
  | 'custom_need';

export interface ProjectChecklist {
  briefing: boolean;
  designMobile: boolean;
  domainHosting: boolean;
  whatsappAutomation: boolean;
  finalDelivery: boolean;
}

export interface AiLeadBlueprint {
  generatedAt: string;
  problemAnalysis: string;
  recommendedSolution: string;
  suggestedModules: string[];
  salesAngle: string;
  estimatedDelivery: string;
  suggestedTicket: number;
  whatsappScript: string;
}

export interface Lead {
  id: string;
  createdAt: string;
  name: string;
  businessName: string;
  whatsapp: string;
  segment: string;
  bottleneck: LeadBottleneck;
  bottleneckLabel: string;
  problemDetails?: string; // Texto livre ou detalhamento do problema descrito pelo cliente
  need: LeadNeed;
  needLabel: string;
  urgency: LeadUrgency;
  urgencyLabel: string;
  budgetEstimate?: number;
  investmentRange?: string;
  investmentTier?: 'ate_500' | '1000_2500' | '2500_5000' | 'acima_5000';
  utmSummary?: string;
  isPuroSuco?: boolean;
  status: LeadStatus;
  temperature?: LeadTemperature; // HOT (Quente), WARM (Morno), COLD (Frio)
  notes?: string;
  source: 'funil_anuncio' | 'calculadora_orcamento' | 'manual';
  diagnosticSummary: string;
  aiBlueprint?: AiLeadBlueprint; // Diagnóstico e Solução gerados automaticamente pela IA
  score?: number; // 0 to 100 qualification score
  checklist?: ProjectChecklist;
  lastContactedAt?: string;
  paidDeposit?: boolean; // 50% sinal pago
  paidFinal?: boolean;   // 50% final pago
}

export interface CeoIdea {
  id: string;
  createdAt: string;
  title: string;
  category: 'saas_produto' | 'anuncio_criativo' | 'oferta_nicho' | 'automacao' | 'estrategia';
  content: string;
  priority: 'alta' | 'media' | 'baixa';
  pinned?: boolean;
}

export interface CeoTask {
  id: string;
  text: string;
  done: boolean;
  tag: 'vendas' | 'dev' | 'trafego' | 'financeiro';
}

export interface AgencyTemplate {
  id: string;
  niche: string;
  name: string;
  url: string;
  highlights: string;
  suggestedPrice: number;
}

export interface AgencySettings {
  whatsappNumber: string;
  monthlyRevenueGoal: number;
  monthlyAdSpend: number;
  agencyName: string;
  ceoName: string;
}
