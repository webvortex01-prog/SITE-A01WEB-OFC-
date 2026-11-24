import { useState } from 'react';
import {
  Cpu,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plus,
  Send,
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { sound } from '../utils/audio';
import { Scroll3DStage } from '../utils/scrollytelling';

type IndustryKey = 'barber_tattoo' | 'gastro_burger' | 'clinic_beauty';

interface ScheduleItem {
  id: string;
  client: string;
  service: string;
  time: string;
  price: number;
  status: 'confirmado' | 'pendente' | 'concluido';
}

export default function CeoSystems() {
  const [activeIndustry, setActiveIndustry] = useState<IndustryKey>('barber_tattoo');
  const [notification, setNotification] = useState<string | null>(null);

  const [schedules, setSchedules] = useState<Record<IndustryKey, ScheduleItem[]>>({
    barber_tattoo: [
      { id: '1', client: 'Lucas Andrade', service: 'Tattoo Fechamento Braço', time: '14:00', price: 650, status: 'confirmado' },
      { id: '2', client: 'Rafael Silveira', service: 'Corte Degradê + Barba Terapia', time: '15:30', price: 95, status: 'confirmado' },
      { id: '3', client: 'Matheus Costa', service: 'Flash Tattoo Minimalista', time: '17:00', price: 280, status: 'pendente' },
      { id: '4', client: 'Gabriel Santana', service: 'Platinado + Corte Navalhado', time: '18:15', price: 160, status: 'confirmado' },
    ],
    gastro_burger: [
      { id: '10', client: 'Mesa 04 (Salão)', service: '2x Double Bacon Smash + Batata Rústica', time: '19:12', price: 88, status: 'confirmado' },
      { id: '11', client: 'Mariana Lima (Delivery Próprio)', service: 'Combo Família 4 Smash + Milkshake', time: '19:24', price: 145, status: 'confirmado' },
      { id: '12', client: 'Thiago Martins (Delivery Próprio)', service: 'Trufado Burger + Refri', time: '19:35', price: 62, status: 'pendente' },
    ],
    clinic_beauty: [
      { id: '20', client: 'Dra. Beatriz Santos', service: 'Harmonização Facial & Botox', time: '10:00', price: 1800, status: 'concluido' },
      { id: '21', client: 'Juliana Ferreira', service: 'Limpeza de Pele Profunda + Peeling', time: '13:30', price: 280, status: 'confirmado' },
      { id: '22', client: 'Camila Rodrigues', service: 'Bioestimulador de Colágeno', time: '15:00', price: 1400, status: 'pendente' },
    ],
  });

  const industries = [
    {
      id: 'barber_tattoo' as IndustryKey,
      label: 'Barbearia & Tattoo VIP',
      icon: Users,
      revenueWeek: 'R$ 8.940',
      revenueGrowth: '+28%',
      ordersCount: '64 clientes atendidos',
      ticketMedio: 'R$ 139',
      highlight: 'Lembretes automáticos no WhatsApp reduzem faltas em 92%',
    },
    {
      id: 'gastro_burger' as IndustryKey,
      label: 'Gastronomia & Smash Burger',
      icon: DollarSign,
      revenueWeek: 'R$ 19.420',
      revenueGrowth: '+35%',
      ordersCount: '198 pedidos diretos',
      ticketMedio: 'R$ 98',
      highlight: 'Economia de R$ 4.250 em taxas abusivas de aplicativos este mês',
    },
    {
      id: 'clinic_beauty' as IndustryKey,
      label: 'Clínica & Estética Avançada',
      icon: Building2,
      revenueWeek: 'R$ 38.600',
      revenueGrowth: '+42%',
      ordersCount: '42 procedimentos VIP',
      ticketMedio: 'R$ 919',
      highlight: 'Prontuários digitais e controle rigoroso de retorno de pacientes',
    },
  ];

  const currentInfo = industries.find((i) => i.id === activeIndustry)!;
  const currentItems = schedules[activeIndustry];

  const handleConfirmItem = (id: string, clientName: string) => {
    sound.playSuccess();
    setSchedules((prev) => ({
      ...prev,
      [activeIndustry]: prev[activeIndustry].map((item) =>
        item.id === id ? { ...item, status: 'confirmado' } : item
      ),
    }));
    setNotification(`⚡ Lembrete e confirmação enviados com sucesso para ${clientName} no WhatsApp!`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddSampleItem = () => {
    sound.playSelect();
    const newItem: ScheduleItem = {
      id: String(Date.now()),
      client: 'Novo Cliente VIP (Online)',
      service: activeIndustry === 'gastro_burger' ? 'Combo Especial 01 Web' : 'Procedimento / Agendamento Novo',
      time: '19:45',
      price: activeIndustry === 'clinic_beauty' ? 850 : activeIndustry === 'gastro_burger' ? 79 : 150,
      status: 'confirmado',
    };
    setSchedules((prev) => ({
      ...prev,
      [activeIndustry]: [newItem, ...prev[activeIndustry]],
    }));
    setNotification('✅ Novo agendamento em tempo real sincronizado no painel!');
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <section id="sistemas-ceo" className="py-24 relative overflow-x-clip bg-[#05060b] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <Scroll3DStage intensity="medium">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Exclusividade 01 WEB Digital</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Sistemas de Gestão &{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Painel do CEO
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Muito além de um site institucional bonito: entregamos a{' '}
            <strong className="text-white">inteligência operacional</strong> do seu negócio. Um painel
            100% sob medida para você gerenciar agendamentos, clientes, pedidos e faturamento do celular
            ou notebook, sem pagar mensalidades infinitas.
          </p>
        </div>
        </Scroll3DStage>

        {/* Industry Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {industries.map((ind) => {
            const Icon = ind.icon;
            const isSelected = activeIndustry === ind.id;
            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => {
                  sound.playSelect();
                  setActiveIndustry(ind.id);
                }}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-purple-400'}`} />
                <span>{ind.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Simulated Dashboard Window */}
        <Scroll3DStage intensity="dramatic">
        <div className="relative rounded-3xl bg-[#0b0f1a] border border-purple-500/30 shadow-2xl overflow-hidden">
          {/* Top Window Bar */}
          <div className="px-6 py-4 bg-[#080b14] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                <span className="text-purple-400 font-bold">01_CEO_CORE_OS</span>
                <span className="text-slate-600">/</span>
                <span>{currentInfo.label}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Sincronizado em Tempo Real
              </span>
              <button
                type="button"
                onClick={handleAddSampleItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simular Entrada</span>
              </button>
            </div>
          </div>

          {/* Interactive Notification Toast */}
          {notification && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{notification}</span>
              </div>
            </div>
          )}

          {/* Dashboard Body */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Faturamento Semanal</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-heading text-white">{currentInfo.revenueWeek}</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{currentInfo.revenueGrowth} vs semana anterior</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Volume Operacional</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold font-heading text-white">{currentInfo.ordersCount}</div>
                <div className="text-xs text-cyan-400">100% integrado ao sistema</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Ticket Médio</span>
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold font-heading text-white">{currentInfo.ticketMedio}</div>
                <div className="text-xs text-slate-400">Otimizado por upsell inteligente</div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-1">
                <div className="flex items-center justify-between text-xs text-purple-300 font-mono">
                  <span>Diferencial de Lucro</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs text-slate-200 font-medium leading-relaxed pt-1">
                  {currentInfo.highlight}
                </div>
              </div>
            </div>

            {/* Live Operational Feed / Schedule List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>Fila de Atendimento & Pedidos de Hoje</span>
                </h3>
                <span className="text-xs text-slate-400">Clique em confirmar para testar o envio de Zap</span>
              </div>

              <div className="space-y-2.5">
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 text-slate-300 shrink-0 font-mono text-xs flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{item.time}</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{item.client}</div>
                        <div className="text-xs text-slate-400">{item.service}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <span className="text-sm font-bold font-mono text-emerald-400">
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </span>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">
                          {item.status === 'confirmado' ? (
                            <span className="text-emerald-400 font-bold">✓ Confirmado</span>
                          ) : item.status === 'concluido' ? (
                            <span className="text-purple-400 font-bold">★ Finalizado</span>
                          ) : (
                            <span className="text-amber-400 font-bold">⏳ Aguardando Zap</span>
                          )}
                        </div>
                      </div>

                      {item.status === 'pendente' && (
                        <button
                          type="button"
                          onClick={() => handleConfirmItem(item.id, item.client)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <Send className="w-3 h-3 text-emerald-400" />
                          <span>Disparar Zap</span>
                        </button>
                      )}

                      {item.status === 'confirmado' && (
                        <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Call to Action inside Dashboard */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl">
              <div className="text-xs text-slate-300 text-center sm:text-left">
                💡 <strong className="text-white">Quer automatizar a sua rotina?</strong> Criamos o Painel
                do CEO integrado ao seu novo website por um valor que cabe no seu bolso.
              </div>
              <a
                href="#orcamento"
                onClick={() => sound.playClick()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 shrink-0 transition-all hover:scale-105"
              >
                <span>Incluir Painel do CEO no Orçamento</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </a>
            </div>
          </div>
        </div>
        </Scroll3DStage>
      </div>
    </section>
  );
}
