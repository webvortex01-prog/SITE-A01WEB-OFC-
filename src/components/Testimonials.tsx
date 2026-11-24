import { Star, CheckCircle, Quote, TrendingUp } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Matheus Fagundes',
      role: 'Fundador da Grelha Nobre Smash Burger',
      company: 'Gastronomia',
      metric: 'Economia de R$ 4.200/mês em taxas',
      quote:
        'Antes a gente dependia 100% de aplicativo de entrega pagando 27% de comissão por lanche. O site da 01 Web com pedido no WhatsApp mudou nosso jogo. O cliente pede direto com a gente e o dinheiro cai limpo no PIX.',
      stars: 5,
    },
    {
      name: 'Dr. Leonardo Castilho',
      role: 'Sócio-Diretor da Castilho & Associados',
      company: 'Advocacia Empresarial',
      metric: '+R$ 1.8M em causas corporativas',
      quote:
        'A presença digital que a 01 Web construiu nos colocou no radar de grandes indústrias da nossa região. O design transmite sobriedade e autoridade imediata. O retorno sobre o investimento foi absurdo.',
      stars: 5,
    },
    {
      name: 'Diego Barber Pro',
      role: 'Proprietário da Fade Pro Barber',
      company: 'Barbearia & Estética',
      metric: '+190% em agendamentos pelo celular',
      quote:
        'Eliminei a secretária respondendo cliente no WhatsApp o dia todo. Agora o cliente entra no link da bio, escolhe o barbeiro e o horário sozinho. Sem falar no Painel do CEO que me dá o faturamento do dia com um clique.',
      stars: 5,
    },
    {
      name: 'Dra. Camila Nogueira',
      role: 'Clínica Glow Dermatologia',
      company: 'Estética & Saúde',
      metric: 'Agenda cheia com 3 semanas de antecedência',
      quote:
        'Eu tinha vergonha do meu site antigo feito no WordPress que demorava 6 segundos para carregar. A 01 Web entregou uma obra de arte que valoriza nossos procedimentos de alto padrão.',
      stars: 5,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#070913]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Resultados Reais & Comprovados</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Quem Confiou na{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              01 Web
            </span>{' '}
            Dominou Seu Nicho
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Não prometemos mágica. Entregamos engenharia refinada e design focado exclusivamente em
            aumentar seu lucro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="relative rounded-3xl p-7 bg-[#0b0f1d]/90 border border-slate-800 hover:border-cyan-500/40 shadow-xl space-y-5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                  <TrendingUp className="w-3 h-3" />
                  <span>{rev.metric}</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed italic">
                "{rev.quote}"
              </p>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                  <p className="text-xs text-slate-400">{rev.role}</p>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20">
                  {rev.company}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
