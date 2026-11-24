import { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Mail,
  MessageCircle,
  Instagram,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  User,
  Phone,
  Bot,
  Cpu,
  Globe,
  Zap,
  Check,
  ArrowRight,
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    services: ['site'] as string[],
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const availableServices = [
    { id: 'site', label: 'Site ou Landing Page de Alta Conversão', icon: Globe },
    { id: 'sistema', label: 'Sistema Web & Painel do CEO Sob Medida', icon: Cpu },
    { id: 'automacao', label: 'Automação de Atendimento & WhatsApp 24/7', icon: Bot },
    { id: 'gargalo', label: 'Integração de APIs & Checkout PIX', icon: Zap },
  ];

  const toggleService = (id: string) => {
    sound.playSelect();
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id],
    }));
  };

  const serviceLabels = formData.services
    .map((s) => availableServices.find((as) => as.id === s)?.label)
    .filter(Boolean)
    .join(', ');

  const whatsappText = encodeURIComponent(
    `Olá 01 WEB! Enviei meu briefing pelo site:\n\n` +
      `Nome: ${formData.name}\n` +
      `WhatsApp: ${formData.whatsapp}\n` +
      `E-mail: ${formData.email || 'Não informado'}\n` +
      `Empresa: ${formData.company || 'Não informado'}\n` +
      `Escopo: ${serviceLabels || 'Consultoria Geral'}\n` +
      `Objetivo: ${formData.message || 'Quero escalar minhas vendas com estrutura profissional'}`
  );

  const whatsappHref = `https://wa.me/5566999697087?text=${whatsappText}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp) return;

    sound.playSuccess();
    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#22d3ee', '#38bdf8', '#ffffff'],
      });
    } catch {
      // Ignore
    }
  };

  return (
    <section id="contato" className="py-24 sm:py-32 relative overflow-hidden bg-[#06080F] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Value Proposition & Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-[0.16em] text-cyan-400 font-semibold">
                07 / CANAL DIRETO COM A ENGENHARIA
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-[1.08]">
                Pronto Para Colocar Sua Empresa em{' '}
                <span className="text-gradient-cyan">Outro Patamar Digital?</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Fale diretamente com quem projeta e constrói sua estrutura. Sem vendedores
                empurrando pacotes prontos — analisamos seu funil e desenhamos a arquitetura ideal.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3">
              <a
                href="https://wa.me/5566999697087?text=Ol%C3%A1%2001%20WEB!%20Quero%20conversar%20sobre%20um%20projeto%20de%20alta%20convers%C3%A3o%20para%20minha%20empresa."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="p-4 rounded-xl bg-[#0B0F1A] border border-emerald-500/30 hover:border-emerald-400 flex items-center gap-4 transition-all group cursor-pointer"
              >
                <div className="p-3 rounded-lg bg-emerald-500/15 text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-emerald-400 font-mono font-semibold">WHATSAPP COMERCIAL DIRETO</div>
                  <div className="text-base font-bold text-white font-mono">
                    (66) 99969-7087
                  </div>
                  <span className="text-xs text-slate-400">Atendimento rápido · Engenharia & Projetos</span>
                </div>
              </a>

              <a
                href="mailto:webvortex01@gmail.com"
                onClick={() => sound.playClick()}
                className="p-4 rounded-xl bg-[#0B0F1A] border border-white/10 hover:border-cyan-400/40 flex items-center gap-4 transition-all group cursor-pointer"
              >
                <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono">E-MAIL CORPORATIVO</div>
                  <div className="text-sm font-bold text-white group-hover:text-cyan-300">
                    webvortex01@gmail.com
                  </div>
                </div>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="p-4 rounded-xl bg-[#0B0F1A] border border-white/10 hover:border-cyan-400/40 flex items-center gap-4 transition-all group cursor-pointer"
              >
                <div className="p-3 rounded-lg bg-white/5 text-slate-300">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono">INSTAGRAM OFICIAL</div>
                  <div className="text-sm font-bold text-white">
                    @01web.digital
                  </div>
                </div>
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>TEMPO MÉDIO DE RESPOSTA: MENOS DE 15 MINUTOS</span>
            </div>
          </div>

          {/* Right Column: Briefing Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl p-6 sm:p-10 bg-[#0B0F1A] border border-white/10 shadow-2xl relative">
              <div className="mb-6 space-y-1">
                <h3 className="text-xl font-bold font-heading text-white">
                  Solicitar Diagnóstico & Proposta Técnica
                </h3>
                <p className="text-xs text-slate-400">
                  Preencha os dados abaixo para receber o escopo recomendado para o seu negócio.
                </p>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      O que sua empresa precisa agora?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {availableServices.map((srv) => {
                        const Icon = srv.icon;
                        const isSelected = formData.services.includes(srv.id);
                        return (
                          <button
                            type="button"
                            key={srv.id}
                            onClick={() => toggleService(srv.id)}
                            className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-500/10 border-cyan-400 text-white'
                                : 'bg-[#06080F] border-white/10 text-slate-400 hover:border-white/25'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-900 text-slate-400'
                              }`}
                            >
                              {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
                            </div>
                            <span className="truncate">{srv.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">Seu Nome</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          placeholder="João Silva"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#06080F] border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">Seu WhatsApp</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          required
                          placeholder="(11) 98765-4321"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#06080F] border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">E-mail Corporativo</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          placeholder="diretoria@empresa.com.br"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#06080F] border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">Empresa / Nicho</label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          placeholder="Nome da sua empresa"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#06080F] border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Resumo do Projeto ou Meta de Vendas
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ex: Vamos rodar tráfego pago no Google e Instagram e precisamos de uma página de altíssima conversão integrada ao WhatsApp..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#06080F] border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-400/20 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>Gerar Briefing & Iniciar Atendimento</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Seus dados e informações de negócio são 100% confidenciais</span>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center space-y-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-xl font-bold font-heading text-white">
                      Briefing Registrado, {formData.name}!
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                      Clique abaixo para enviar seu briefing diretamente ao nosso engenheiro responsável no WhatsApp e garantir o bônus de 1 ano de hospedagem + domínio.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Abrir Conversa no WhatsApp</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer px-3 py-2"
                    >
                      Editar dados do briefing
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

