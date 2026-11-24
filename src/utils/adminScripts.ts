import { Lead } from '../types/lead';

export const NICHE_LIVE_LINKS: Record<string, string> = {
  'Advocacia / Jurídico': 'https://aldo-leao.vercel.app/',
  'Automotivo / Concessionária': 'https://grv-motors.vercel.app/',
  'Salão de Beleza / Barbearia': 'https://salaodebeleza-six.vercel.app/',
  'Loja de Roupas / Moda': 'https://projeto-de-loja-de-roupas.vercel.app/',
  'Saúde / Clínica / Estética': 'https://modelo-estetica-exemplar.vercel.app/',
  'Estúdio de Tatuagem / Body Art': 'https://modelo-tatoo-exemplar.vercel.app/',
};

export interface SalesScriptItem {
  id: string;
  badge: string;
  title: string;
  desc: string;
  content: string;
}

export function buildDirectWaUrl(lead: Lead, customText?: string): string {
  const clean = lead.whatsapp.replace(/\D/g, '');
  const phone = clean.startsWith('55') ? clean : `55${clean}`;
  const defaultMsg =
    `Olá ${lead.name}, tudo bem? Aqui é da direção da *01 Web*.\n\n` +
    `Recebi agora o diagnóstico que você preencheu para a *${lead.businessName}* (${lead.segment}).\n\n` +
    `Vi que hoje o seu principal gargalo é: *"${lead.bottleneckLabel}"* e que você busca *${lead.needLabel}*.\n\n` +
    `Já separei uma estrutura ideal para o seu caso. Podemos conversar rapidinho por aqui?`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(customText || defaultMsg)}`;
}

export function getSalesScripts(lead: Lead | null): SalesScriptItem[] {
  const clientName = lead?.name || 'Empresário(a)';
  const biz = lead?.businessName || 'sua empresa';
  const seg = lead?.segment || 'seu segmento';
  const pain = lead?.bottleneckLabel || 'perda de clientes no atendimento digital';
  const sol = lead?.needLabel || 'Ecossistema Completo de Alta Conversão';
  const price = (lead?.budgetEstimate || 2400).toLocaleString('pt-BR');
  const demoUrl =
    (lead && NICHE_LIVE_LINKS[lead.segment]) || 'https://aldo-leao.vercel.app/';

  return [
    {
      id: 'script-1',
      badge: 'ETAPA 1 · ABORDAGEM IMEDIATA (5 MINUTOS)',
      title: 'Primeiro Contato Matador Pós-Anúncio',
      desc: 'Use assim que o lead cair no painel para gerar impacto e mostrar que você analisou o caso dele.',
      content:
        `Olá *${clientName}*, tudo bem? Aqui é da direção da *01 Web Digital*.\n\n` +
        `Acabei de receber no meu painel o diagnóstico de qualificação da *${biz}* (${seg}).\n\n` +
        `Analisei pessoalmente o seu caso: vi que hoje o seu maior gargalo é *"${pain}"* e que você precisa de *${sol}*.\n\n` +
        `Nós temos uma engenharia pronta exatamente para estancar essa perda de clientes no seu nicho. Você está podendo falar rapidinho por texto ou áudio agora?`,
    },
    {
      id: 'script-2',
      badge: 'ETAPA 2 · PROVA REAL & AUTORIDADE',
      title: 'Envio de Projeto Real do Nicho Ao Vivo',
      desc: 'Mostre na prática um projeto real da 01 Web para deixar o empresário de queixo caído.',
      content:
        `*${clientName}*, para você ver na prática o nível de estrutura que entregamos para *${seg}*, dá uma olhada neste projeto real que desenvolvemos:\n\n` +
        `🔗 *Acesse no seu celular:* ${demoUrl}\n\n` +
        `Repare em 3 pontos:\n` +
        `1️⃣ Ele abre em menos de 1 segundo no 4G (zero desistência de clique de anúncio)\n` +
        `2️⃣ Visual de altíssimo padrão que transmite autoridade imediata\n` +
        `3️⃣ Fluxo pensado para levar o cliente direto ao fechamento no WhatsApp.\n\n` +
        `É exatamente esse impacto que vamos construir para a *${biz}*. Faz sentido para o momento de vocês?`,
    },
    {
      id: 'script-3',
      badge: 'ETAPA 3 · PROPOSTA & ANCORAGEM DE VALOR',
      title: 'Apresentação de Orçamento + Bônus VIP',
      desc: 'Apresente o investimento sem mensalidades e com hospedagem + domínio inclusos.',
      content:
        `Perfeito, *${clientName}*! Com base no diagnóstico da *${biz}*, montei o escopo completo para resolver de vez a questão de *"${pain}"*:\n\n` +
        `🚀 *ESCOPO DO PROJETO — 01 WEB*\n` +
        `• Estrutura: *${sol}*\n` +
        `• Design Exclusivo Mobile-First (Nota 95+ Google)\n` +
        `• Integração de Triagem & Conversão no WhatsApp\n` +
        `• Zero mensalidade de licença (o código é 100% seu)\n\n` +
        `🎁 *BÔNUS LIBERADOS PELO ANÚNCIO:*\n` +
        `✅ 1 Ano de Hospedagem Nuvem Turbo Inclusa\n` +
        `✅ Registro de Domínio Próprio (.com.br) Incluso\n\n` +
        `💰 *Investimento Único:* R$ ${price} (em até 12x ou 50% de entrada via PIX e 50% na entrega).\n` +
        `⏱️ *Prazo de Entrega:* 5 a 7 dias úteis.\n\n` +
        `Podemos reservar a vaga da *${biz}* no nosso cronograma desta semana?`,
    },
    {
      id: 'script-4',
      badge: 'ETAPA 4 · QUEBRA DE OBJEÇÃO',
      title: 'Contorno de Objeção ("Vou pensar" / "Falar com sócio")',
      desc: 'Recupere o lead mostrando o custo invisível de continuar rodando anúncio sem estrutura.',
      content:
        `*${clientName}*, compreendo perfeitamente! Inclusive já te mandei o resumo estruturado para facilitar a análise.\n\n` +
        `Só quero te deixar um ponto estratégico como parceiro de negócios: cada semana que a *${biz}* continua recebendo cliques sem corrigir *"${pain}"*, são clientes reais que clicam no seu anúncio e acabam fechando com o concorrente.\n\n` +
        `Com apenas 2 ou 3 clientes novos que essa estrutura converter para você no primeiro mês, o projeto já se paga integralmente — e fica gerando lucro o resto do ano sem mensalidade.\n\n` +
        `Se eu mantiver os bônus de *1 Ano de Hospedagem + Domínio Grátis*, conseguimos dar o start até amanhã?`,
    },
    {
      id: 'script-5',
      badge: 'ETAPA 5 · FECHAMENTO & ONBOARDING',
      title: 'Fechamento Imediato & Coleta de Briefing',
      desc: 'Finalize a venda e inicie o projeto imediatamente.',
      content:
        `Excelente decisão, *${clientName}*! Seja muito bem-vindo(a) à *01 Web Digital* 🚀\n\n` +
        `Para oficializarmos o início imediato do projeto da *${biz}* e já registrarmos o seu domínio:\n\n` +
        `1️⃣ *Sinal de 50% (Início do Desenvolvimento):* R$ ${Math.round(
          (lead?.budgetEstimate || 2400) / 2
        ).toLocaleString('pt-BR')}\n` +
        `2️⃣ *Restante (50%):* Somente após você aprovar o projeto pronto no ar.\n\n` +
        `Assim que confirmar o comprovante aqui, já libero o seu grupo exclusivo de acompanhamento e iniciamos o layout hoje mesmo!`,
    },
  ];
}
