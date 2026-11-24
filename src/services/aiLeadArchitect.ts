import { Lead, AiLeadBlueprint } from '../types/lead';

/**
 * Motor de Inteligência Artificial 01 WEB (AI Lead Solution Architect)
 * Analisa o problema descrito pelo cliente, o segmento, o gargalo e a necessidade,
 * gerando automaticamente um diagnóstico técnico + recomendação de solução + script de abordagem.
 */
export function generateAiSolutionBlueprint(
  lead: Partial<Lead>,
  customCeoInstruction?: string
): AiLeadBlueprint {
  const firstName = (lead.name || 'Cliente').trim().split(' ')[0];
  const business =
    lead.businessName && lead.businessName !== 'Não informado' && lead.businessName !== 'Não informada'
      ? lead.businessName
      : 'sua empresa';
  const segment = lead.segment || 'Negócio Local / Digital';
  const rawProblem = (lead.problemDetails || '').trim();
  const bottleneckLabel = lead.bottleneckLabel || 'Perda de clientes no digital';
  const problemTextLower = `${rawProblem} ${bottleneckLabel} ${segment}`.toLowerCase();

  // 1. Detect specific pain patterns from the text the client wrote
  const mentionsAds =
    problemTextLower.includes('anúncio') ||
    problemTextLower.includes('anuncio') ||
    problemTextLower.includes('tráfego') ||
    problemTextLower.includes('trafego') ||
    problemTextLower.includes('clique') ||
    problemTextLower.includes('meta') ||
    problemTextLower.includes('google') ||
    lead.bottleneck === 'ads_no_conversion';

  const mentionsScheduleOrSupport =
    problemTextLower.includes('agenda') ||
    problemTextLower.includes('horário') ||
    problemTextLower.includes('horario') ||
    problemTextLower.includes('atendimento') ||
    problemTextLower.includes('demora') ||
    problemTextLower.includes('responder') ||
    problemTextLower.includes('curioso') ||
    problemTextLower.includes('whatsapp') ||
    lead.bottleneck === 'manual_support_chaos';

  const mentionsCatalogOrSales =
    problemTextLower.includes('catálogo') ||
    problemTextLower.includes('catalogo') ||
    problemTextLower.includes('estoque') ||
    problemTextLower.includes('produto') ||
    problemTextLower.includes('roupa') ||
    problemTextLower.includes('carro') ||
    problemTextLower.includes('pedido') ||
    problemTextLower.includes('venda') ||
    lead.bottleneck === 'no_presence';

  const mentionsSystemOrPanel =
    problemTextLower.includes('sistema') ||
    problemTextLower.includes('painel') ||
    problemTextLower.includes('controle') ||
    problemTextLower.includes('gestão') ||
    problemTextLower.includes('gestao') ||
    problemTextLower.includes('planilha') ||
    problemTextLower.includes('financeiro') ||
    lead.need === 'sistema_gestao' ||
    lead.need === 'combo_completo';

  // 2. Build Root Cause Problem Analysis
  let problemAnalysis = '';
  if (rawProblem.length > 5) {
    problemAnalysis = `O cliente relatou especificamente: "${rawProblem}". Cruzando esse relato com o nicho (${segment}), o diagnóstico da IA aponta que ${business} está sofrendo vazamento direto de caixa por falta de uma estrutura que filtre, convença e organize o atendimento antes do contato humano.`;
  } else if (mentionsAds) {
    problemAnalysis = `O cliente investe ou pretende atrair público em (${segment}), mas sofre com baixa conversão. Os visitantes clicam e saem sem chamar no WhatsApp porque não encontram uma página rápida (<1s) com prova social e chamada clara para ação.`;
  } else if (mentionsScheduleOrSupport) {
    problemAnalysis = `Gargalo operacional grave no WhatsApp: o cliente perde tempo respondendo curiosos manualmente e perde vendas fora do horário comercial por não ter triagem automática 24/7 nem pré-agendamento online.`;
  } else if (mentionsCatalogOrSales) {
    problemAnalysis = `Dependência excessiva de Instagram ou envio manual de fotos/PDFs no WhatsApp. O cliente perde autoridade frente aos concorrentes e dificulta a escolha rápida do comprador pelo celular.`;
  } else {
    problemAnalysis = `Estrutura digital atual defasada ou inexistente para o segmento de ${segment}. Isso reduz a percepção de valor do serviço e força o cliente a disputar apenas por preço baixo.`;
  }

  // 3. Build Recommended Technical Solution
  let recommendedSolution = '';
  let suggestedModules: string[] = [];
  let estimatedDelivery = '3 a 5 dias úteis';
  let suggestedTicket = lead.budgetEstimate || 1800;

  if (mentionsSystemOrPanel && mentionsScheduleOrSupport) {
    recommendedSolution =
      'Implantar Ecossistema Completo 01 WEB: Landing Page Scrollytelling Mobile-First + Sistema Web de Agendamento/Triagem com Painel Administrativo Próprio + Automação WhatsApp 24/7.';
    suggestedModules = [
      'Landing Page Scrollytelling ultra-rápida adaptada para ' + segment,
      'Fluxo de Triagem Inteligente no WhatsApp (filtra serviço, horário e urgência)',
      'Painel Gerencial Web (sem mensalidade) para controle de clientes e agenda',
      'Domínio .com.br + 1 Ano de Hospedagem VIP + SSL inclusos',
    ];
    estimatedDelivery = '5 a 7 dias úteis';
    if (!lead.budgetEstimate) suggestedTicket = 2400;
  } else if (mentionsCatalogOrSales) {
    recommendedSolution =
      'Desenvolver Vitrine/Catálogo Digital Interativo de Alta Velocidade integrado ao WhatsApp + Painel para atualizar itens/serviços em tempo real pelo celular.';
    suggestedModules = [
      'Catálogo Digital Interativo com filtro por categoria e busca rápida',
      'Botão "Pedir / Orçar no WhatsApp" que já envia o item exato selecionado',
      'Painel Admin simples para cadastrar fotos, preços e destaques',
      'Otimização extrema para abrir em menos de 1s no 4G/5G',
    ];
    estimatedDelivery = '4 a 6 dias úteis';
    if (!lead.budgetEstimate) suggestedTicket = 1950;
  } else if (mentionsAds) {
    recommendedSolution =
      'Construir Máquina de Conversão para Tráfego Pago: Página Scrollytelling focada em retenção visual nos primeiros 3 segundos + Gatilhos de Autoridade + Funil de Qualificação direto pro WhatsApp.';
    suggestedModules = [
      'Dobra principal de alto impacto com proposta de valor matadora',
      'Seção de Provas Sociais + Diferenciais competitivos do nicho ' + segment,
      'Botão flutuante e formulário rápido que já qualifica o lead pro WhatsApp',
      'Configuração de Pixel Meta Ads / Tag Google Ads + Velocidade 95+',
    ];
    estimatedDelivery = '3 a 5 dias úteis';
    if (!lead.budgetEstimate) suggestedTicket = 1450;
  } else {
    recommendedSolution =
      'Desenvolver Estrutura Digital Sob Medida 01 WEB com Design Imersivo, Apresentação Premium de Serviços e Triagem Automatizada no WhatsApp 24/7.';
    suggestedModules = [
      'Website/Landing Page com identidade visual exclusiva e animações fluidas',
      'Simulador ou filtro rápido de atendimento integrado ao WhatsApp',
      '1 Ano de Domínio Próprio + Hospedagem Cloud sem aluguel mensal',
      'Painel de controle fácil de usar pelo celular ou computador',
    ];
    estimatedDelivery = '3 a 6 dias úteis';
    if (!lead.budgetEstimate) suggestedTicket = 1650;
  }

  // Apply CEO Custom Instruction override if provided
  if (customCeoInstruction && customCeoInstruction.trim().length > 0) {
    const instr = customCeoInstruction.trim();
    recommendedSolution = `[Ajustado pela IA conforme diretriz do CEO: "${instr}"] → ${recommendedSolution}`;
    if (instr.toLowerCase().includes('barato') || instr.toLowerCase().includes('enxut') || instr.toLowerCase().includes('entrada')) {
      suggestedTicket = Math.max(450, Math.round(suggestedTicket * 0.65));
      estimatedDelivery = '2 a 4 dias úteis';
    } else if (instr.toLowerCase().includes('premium') || instr.toLowerCase().includes('completo') || instr.toLowerCase().includes('alto')) {
      suggestedTicket = Math.round(suggestedTicket * 1.35);
    }
  }

  // 4. Build Killer Sales Angle
  const salesAngle = `Mostre para ${firstName} que cada semana sem essa estrutura custa muito mais caro em clientes perdidos do que o investimento único de R$ ${suggestedTicket.toLocaleString('pt-BR')} (sem mensalidade e com 1 ano de domínio + hospedagem grátis).`;

  // 5. Build Ready-to-Send WhatsApp Pitch Script (Standard OR Abandoned Recovery Bot Script!)
  const isAbandonedOrExitLead =
    problemTextLower.includes('visualizou') ||
    problemTextLower.includes('abandonou') ||
    problemTextLower.includes('não fechou') ||
    problemTextLower.includes('intenção de saída') ||
    problemTextLower.includes('voucher');

  const problemReference = rawProblem
    ? `vi aqui o que você descreveu sobre *"${rawProblem}"*`
    : `vi aqui que seu principal foco hoje é resolver *"${bottleneckLabel}"*`;

  const whatsappScript = isAbandonedOrExitLead
    ? `Fala *${firstName}*, tudo certo meu patrão? Aqui é o *RD*, fundador da *01 WEB*! 🚀\n\n` +
      `Vi aqui no nosso sistema que você acabou de acessar nosso site, visualizou as estruturas para *${segment}*, mas saiu antes da gente fechar o seu projeto!\n\n` +
      `Pra você não deixar dinheiro na mesa este mês, separei *3 motivos diretos* pra gente colocar sua estrutura no ar ainda essa semana:\n` +
      `1️⃣ *Fim dos Curiosos e Demora no Zap:* Sua estrutura nova abre em menos de 1s no celular e já faz a triagem automática 24/7 no seu WhatsApp.\n` +
      `2️⃣ *Zero Aluguel Mensal:* Você paga uma única vez, recebe em ${estimatedDelivery} e o código é 100% da sua empresa.\n` +
      `3️⃣ *Voucher de R$ 1.030 Garantido no Seu Número:* Segurei pra você *1 Ano de Domínio .com.br + 1 Ano de Hospedagem VIP Grátis*!\n\n` +
      `Me conta aqui: o que faltou pra gente dar o start hoje? Se for condição de pagamento, consigo montar algo sob medida pra você agora! 🤝`
    : `Fala *${firstName}*, tudo certo? Aqui é o *RD*, fundador da *01 WEB*! 🚀\n\n` +
      `Acabei de receber seu cadastro aqui no nosso sistema para a *${business}* (${segment}) e ${problemReference}.\n\n` +
      `🧠 *Já rodei o diagnóstico do seu caso aqui e a solução ideal para você é:*\n` +
      `✅ ${recommendedSolution}\n\n` +
      `📦 *O que já entrego pronto pra você em ${estimatedDelivery}:*\n` +
      suggestedModules.map((m) => `• ${m}`).join('\n') +
      `\n\n💰 *Investimento Único Estimado:* R$ ${suggestedTicket.toLocaleString('pt-BR')} (Código 100% seu, zero mensalidade e já com 1 Ano de Domínio + Hospedagem Grátis).\n\n` +
      `Quer que eu te mande um exemplo prático na tela pra gente já dar o start hoje?`;

  return {
    generatedAt: new Date().toISOString(),
    problemAnalysis,
    recommendedSolution,
    suggestedModules,
    salesAngle,
    estimatedDelivery,
    suggestedTicket,
    whatsappScript,
  };
}

