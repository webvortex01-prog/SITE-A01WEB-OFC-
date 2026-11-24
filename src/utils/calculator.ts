/**
 * Logic for 01 WEB Budget & Architecture Configurator
 */

export interface ProjectConfig {
  projectType: 'page' | 'portal' | 'panel' | 'both';
  pagesCount: number;
  features: string[];
}

export interface FeatureItem {
  id: string;
  name: string;
  price: number;
  tag?: string;
  description: string;
}

export const BASE_PRICES: Record<ProjectConfig['projectType'], number> = {
  page: 180,    // Landing Page profissional
  portal: 320,  // Site institucional multipáginas
  panel: 400,   // Painel administrativo / Sistema gerencial sob medida
  both: 550,    // Pacote Completo: Site + Sistema Gerencial (com desconto no pacote)
};

export const PRICE_PER_ADDITIONAL_PAGE = 50;

export const AVAILABLE_FEATURES: FeatureItem[] = [
  {
    id: 'pix_checkout',
    name: 'Catálogo com Pedido & Pagamento PIX',
    price: 90,
    tag: 'Mais Pedido',
    description: 'Cliente escolhe os itens e recebe a chave ou QR Code PIX direto na tela',
  },
  {
    id: 'smart_booking',
    name: 'Agendamento Online Integrado ao WhatsApp',
    price: 110,
    tag: 'Automação',
    description: 'Cliente seleciona serviço, dia e horário disponível antes de chamar no WhatsApp',
  },
  {
    id: 'ceo_dashboard',
    name: 'Painel de Controle de Pedidos e Clientes',
    price: 130,
    tag: 'Gestão',
    description: 'Área administrativa simples para organizar cadastros, serviços e status',
  },
  {
    id: 'client_portal',
    name: 'Área do Cliente com Acesso Individual',
    price: 140,
    description: 'Login para seus clientes consultarem histórico, arquivos ou andamento',
  },
  {
    id: 'whatsapp_automation',
    name: 'Triagem Rápida de Orçamentos para WhatsApp',
    price: 100,
    tag: 'Atendimento',
    description: 'Formulário inteligente que já envia a mensagem formatada com o que o cliente precisa',
  },
  {
    id: 'full_automation',
    name: 'Fluxo de Atendimento Automático 24/7',
    price: 150,
    tag: 'Automação 24h',
    description: 'Respostas imediatas para dúvidas frequentes, envio de catálogo e direcionamento',
  },
  {
    id: 'custom_integration',
    name: 'Integração com Sistemas ou Planilhas',
    price: 160,
    tag: 'Sob Medida',
    description: 'Conexão personalizada com ferramentas que sua empresa já utiliza no dia a dia',
  },
  {
    id: 'seo_max',
    name: 'Estruturação para Busca no Google (SEO Local)',
    price: 70,
    description: 'Configuração técnica para facilitar que sua empresa seja encontrada no Google',
  },
  {
    id: 'pwa_mobile',
    name: 'Versão App Instalável no Celular (PWA)',
    price: 80,
    description: 'Permite salvar um atalho direto na tela inicial do celular como aplicativo',
  },
  {
    id: 'multi_language',
    name: 'Site em Mais de um Idioma (PT / EN / ES)',
    price: 90,
    description: 'Tradução estruturada para empresas que atendem público de outros países',
  },
];

export function calculateProjectTotal(config: ProjectConfig): number {
  const base = BASE_PRICES[config.projectType] || 180;
  const additionalPages = Math.max(0, config.pagesCount - 1);
  const pagesCost = additionalPages * PRICE_PER_ADDITIONAL_PAGE;

  const featuresCost = config.features.reduce((sum, featureId) => {
    const feat = AVAILABLE_FEATURES.find((f) => f.id === featureId);
    return sum + (feat ? feat.price : 0);
  }, 0);

  return base + pagesCost + featuresCost;
}

export interface ProjectDeliverySpecs {
  estimatedDeliveryDays: string;
  monthlyFee: number;
  includedInfraCount: number;
}

export function calculateProjectDeliverySpecs(
  projectType: ProjectConfig['projectType'],
  pagesCount: number
): ProjectDeliverySpecs {
  let estimatedDeliveryDays = '3 a 5 dias úteis';

  if (projectType === 'both') {
    estimatedDeliveryDays = '7 a 10 dias úteis';
  } else if (projectType === 'panel') {
    estimatedDeliveryDays = '6 a 9 dias úteis';
  } else if (projectType === 'portal' || pagesCount > 4) {
    estimatedDeliveryDays = '5 a 7 dias úteis';
  }

  return {
    estimatedDeliveryDays,
    monthlyFee: 0,
    includedInfraCount: EXCLUSIVE_BONUS_ITEMS.length,
  };
}

export interface BonusItem {
  id: string;
  title: string;
  realValue: number;
  description: string;
  badge: string;
}

export const EXCLUSIVE_BONUS_ITEMS: BonusItem[] = [
  {
    id: 'hosting',
    title: '1 Ano de Hospedagem Rápida Inclusa',
    realValue: 480,
    description: 'Servidor configurado e pronto para receber visitantes sem cobrança mensal no 1º ano.',
    badge: 'Incluso',
  },
  {
    id: 'domain',
    title: '1 Ano de Registro de Domínio Próprio (.com.br ou .com)',
    realValue: 80,
    description: 'Seu endereço oficial na internet registrado e configurado para sua marca.',
    badge: 'Incluso',
  },
  {
    id: 'email',
    title: 'Configuração de E-mail Profissional',
    realValue: 120,
    description: 'Endereço corporativo com o nome da sua empresa para passar mais seriedade.',
    badge: 'Incluso',
  },
  {
    id: 'ssl',
    title: 'Certificado de Segurança SSL (Cadeado HTTPS)',
    realValue: 150,
    description: 'Proteção essencial para que o navegador mostre seu site como 100% seguro.',
    badge: 'Incluso',
  },
  {
    id: 'training',
    title: 'Suporte de Publicação & Orientação de Uso',
    realValue: 200,
    description: 'Acompanhamento direto pelo WhatsApp para você usar sua estrutura com tranquilidade.',
    badge: 'Incluso',
  },
];

export function getTotalBonusValue(): number {
  return EXCLUSIVE_BONUS_ITEMS.reduce((sum, item) => sum + item.realValue, 0);
}

export interface RevenueLeakageResult {
  lostLeadsMonthly: number;
  lostRevenueMonthly: number;
  potentialRecoveredYearly: number;
}

export function calculateRevenueLeakage(
  monthlyVisitors: number,
  averageTicket: number
): RevenueLeakageResult {
  // Conservative conversion loss (~2.2% of visitors who leave slow/outdated pages)
  const lostLeadsMonthly = Math.max(1, Math.round(monthlyVisitors * 0.022));
  const lostRevenueMonthly = lostLeadsMonthly * averageTicket;
  const potentialRecoveredYearly = lostRevenueMonthly * 12;

  return {
    lostLeadsMonthly,
    lostRevenueMonthly,
    potentialRecoveredYearly,
  };
}

export type BottleneckType = 'no_site' | 'slow_site' | 'whatsapp_delay' | 'manual_management';

export interface DiagnosticRecommendation {
  title: string;
  recommendedScope: string;
  summary: string;
  deliverables: string[];
  estimatedDelivery: string;
  startingPrice: number;
}

export function diagnoseBusinessNeed(bottleneck: BottleneckType): DiagnosticRecommendation {
  switch (bottleneck) {
    case 'no_site':
      return {
        title: 'Landing Page Profissional + Contato Direto no WhatsApp',
        recommendedScope: 'Presença Digital & Captação',
        summary:
          'Ideal para quem anuncia ou divulga no Instagram e precisa de uma página própria para apresentar seus serviços com clareza, passar confiança imediata e receber contatos já filtrados no WhatsApp.',
        deliverables: [
          'Página exclusiva adaptada para celular e computador',
          'Apresentação clara dos seus serviços, diferenciais e localização',
          'Botões de ação que levam o cliente direto para o seu WhatsApp',
          'Domínio próprio (.com.br) + 1 ano de hospedagem inclusos',
        ],
        estimatedDelivery: '3 a 5 dias úteis',
        startingPrice: BASE_PRICES.page,
      };
    case 'slow_site':
      return {
        title: 'Reformulação Completa em Código Leve (Mobile-First)',
        recommendedScope: 'Modernização & Velocidade',
        summary:
          'Substituímos páginas antigas, lentas ou genéricas por uma estrutura moderna que abre rápido no 4G e destaca o padrão real da sua empresa.',
        deliverables: [
          'Visual moderno alinhado com a identidade da sua empresa',
          'Carregamento leve e rápido no celular (sem travamentos)',
          'Reorganização dos textos e chamadas para facilitar o orçamento',
          'Migração completa com certificado de segurança SSL incluso',
        ],
        estimatedDelivery: '4 a 6 dias úteis',
        startingPrice: BASE_PRICES.page,
      };
    case 'whatsapp_delay':
      return {
        title: 'Site com Triagem Inteligente & Automação de Atendimento',
        recommendedScope: 'Agilidade no Atendimento',
        summary:
          'Para empresários que perdem muito tempo respondendo as mesmas perguntas básicas. O cliente escolhe o que precisa no site ou recebe atendimento imediato 24h no WhatsApp.',
        deliverables: [
          'Formulário ou catálogo interativo que já monta o pedido/orçamento',
          'Respostas automáticas para dúvidas comuns fora do horário comercial',
          'Cliente já chega no seu WhatsApp dizendo exatamente o que quer',
          'Economia de tempo para você focar apenas em fechar o negócio',
        ],
        estimatedDelivery: '5 a 7 dias úteis',
        startingPrice: BASE_PRICES.page + 100,
      };
    case 'manual_management':
      return {
        title: 'Ecossistema Completo: Site Profissional + Painel de Gestão',
        recommendedScope: 'Organização & Controle Interno',
        summary:
          'Para empresas que querem unir uma vitrine profissional na internet com um sistema simples para controlar agendamentos, pedidos, clientes ou estoque sem depender de planilhas soltas.',
        deliverables: [
          'Site completo de apresentação e captação de clientes',
          'Painel administrativo feito sob medida para a sua rotina',
          'Acesso fácil pelo celular ou computador, sem mensalidades de licença',
          'Suporte próximo para implantação e uso no dia a dia',
        ],
        estimatedDelivery: '7 a 10 dias úteis',
        startingPrice: BASE_PRICES.both,
      };
  }
}
