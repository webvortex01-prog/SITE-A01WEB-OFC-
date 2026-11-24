import { useState, useEffect } from 'react';
import {
  X,
  Download,
  Flame,
  CheckCircle2,
  MessageCircle,
  Plus,
  TrendingUp,
  Lock,
  DollarSign,
  LayoutDashboard,
  Kanban,
  Zap,
  Settings,
  ArrowUpRight,
  ChevronRight,
  Award,
  LogOut,
  BarChart3,
  Lightbulb,
  Thermometer,
  Code2,
  Radio,
} from 'lucide-react';
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
import { leadService } from '../services/leadService';
import { buildDirectWaUrl } from '../utils/adminScripts';
import {
  AdminScriptsTab,
  AdminSettingsTab,
  LeadInspectorDrawer,
} from './AdminSubViews';
import {
  AdminThermometerTab,
  AdminIdeasVaultTab,
  AdminDevFactoryTab,
} from './AdminCeoModules';
import AdminLiveRadarTab from './AdminLiveRadarTab';
import { sound } from '../utils/audio';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab =
  | 'dashboard'
  | 'live_radar'
  | 'thermometer'
  | 'ideas'
  | 'kanban'
  | 'scripts'
  | 'dev_factory'
  | 'settings';

const PIN_STORAGE_KEY = '01web_admin_authenticated';
const CORRECT_PIN = '01web';

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(PIN_STORAGE_KEY) !== 'locked';
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [ideas, setIdeas] = useState<CeoIdea[]>([]);
  const [tasks, setTasks] = useState<CeoTask[]>([]);
  const [templates, setTemplates] = useState<AgencyTemplate[]>([]);
  const [settings, setSettings] = useState<AgencySettings>(() => leadService.getSettings());

  const [inspectedLead, setInspectedLead] = useState<Lead | null>(null);
  const [scriptLeadId, setScriptLeadId] = useState<string>('');

  const [isAddingLead, setIsAddingLead] = useState<boolean>(false);
  const [manualName, setManualName] = useState('');
  const [manualBusiness, setManualBusiness] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualSegment, setManualSegment] = useState('Advocacia / Jurídico');
  const [manualTemp, setManualTemp] = useState<LeadTemperature>('HOT');
  const [manualBottleneck, setManualBottleneck] = useState(
    'Gasto em anúncio mas ninguém fecha pelo WhatsApp'
  );
  const [manualBudget, setManualBudget] = useState(2500);

  useEffect(() => {
    const refresh = () => {
      const currentLeads = leadService.getLeads();
      setLeads(currentLeads);
      setIdeas(leadService.getIdeas());
      setTasks(leadService.getTasks());
      setTemplates(leadService.getTemplates());
      setSettings(leadService.getSettings());
      if (currentLeads.length > 0 && !scriptLeadId) {
        setScriptLeadId(currentLeads[0].id);
      }
      if (inspectedLead) {
        const updated = currentLeads.find((l) => l.id === inspectedLead.id);
        setInspectedLead(updated || null);
      }
    };
    refresh();
    const unsubscribe = leadService.subscribe(refresh);
    return () => unsubscribe();
  }, [scriptLeadId, inspectedLead?.id]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim().toLowerCase() === CORRECT_PIN) {
      sound.playSuccess();
      setIsAuthenticated(true);
      sessionStorage.setItem(PIN_STORAGE_KEY, 'true');
      setPinError('');
    } else {
      sound.playClick(240);
      setPinError('Senha incorreta. Digite a chave do CEO: 01web');
    }
  };

  const handleLogout = () => {
    sound.playClick(350);
    setIsAuthenticated(false);
    sessionStorage.setItem(PIN_STORAGE_KEY, 'locked');
    setPinInput('');
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    sound.playSelect();
    leadService.updateLeadStatus(leadId, newStatus);
  };

  const handleTemperatureChange = (leadId: string, temp: LeadTemperature) => {
    sound.playSelect();
    leadService.updateLeadTemperature(leadId, temp);
  };

  const handleNotesChange = (leadId: string, notes: string) => {
    leadService.updateLeadNotes(leadId, notes);
  };

  const handleBudgetChange = (leadId: string, budget: number) => {
    leadService.updateLeadBudget(leadId, budget);
  };

  const handleChecklistToggle = (
    leadId: string,
    key: keyof ProjectChecklist,
    currentVal: boolean
  ) => {
    sound.playSelect();
    leadService.updateLeadChecklist(leadId, key, !currentVal);
  };

  const handlePaymentToggle = (
    leadId: string,
    field: 'paidDeposit' | 'paidFinal',
    val: boolean
  ) => {
    sound.playSelect();
    leadService.updateLeadPayment(leadId, field, val);
  };

  const handleSaveManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim()) return;

    sound.playSuccess();
    leadService.addLead({
      name: manualName.trim(),
      businessName: manualBusiness.trim() || 'Empresa não informada',
      whatsapp: manualPhone.replace(/\D/g, ''),
      segment: manualSegment,
      bottleneck: 'ads_no_conversion',
      bottleneckLabel: manualBottleneck,
      problemDetails: manualBottleneck,
      need: 'combo_completo',
      needLabel: 'Ecossistema Completo (Site + Sistema + WhatsApp)',
      urgency: manualTemp === 'HOT' ? 'imediato' : manualTemp === 'WARM' ? '15_30_dias' : 'apenas_orcando',
      urgencyLabel:
        manualTemp === 'HOT'
          ? 'Imediato (esta semana)'
          : manualTemp === 'WARM'
          ? 'Próximos 15 a 30 dias'
          : 'Apenas orçando',
      temperature: manualTemp,
      score: manualTemp === 'HOT' ? 98 : manualTemp === 'WARM' ? 72 : 40,
      budgetEstimate: Number(manualBudget) || 2200,
      source: 'manual',
      diagnosticSummary: `Cadastrado pelo CEO. Gargalo: ${manualBottleneck}`,
      notes: 'Lead inserido manualmente via Sistema CEO.',
    });

    setIsAddingLead(false);
    setManualName('');
    setManualBusiness('');
    setManualPhone('');
  };

  const totalLeads = leads.length;
  const closedLeads = leads.filter((l) => l.status === 'FECHADO');
  const hotLeads = leads.filter((l) => (l.temperature || 'HOT') === 'HOT');

  const closedRevenue = closedLeads.reduce((acc, l) => acc + (l.budgetEstimate || 2000), 0);
  const openPipeline = leads
    .filter((l) => l.status !== 'FECHADO' && l.status !== 'PERDIDO')
    .reduce((acc, l) => acc + (l.budgetEstimate || 2000), 0);

  const avgTicket =
    closedLeads.length > 0
      ? Math.round(closedRevenue / closedLeads.length)
      : leads.length > 0
      ? Math.round(
          leads.reduce((acc, l) => acc + (l.budgetEstimate || 2000), 0) / leads.length
        )
      : 2200;

  const conversionRate =
    totalLeads > 0 ? Math.round((closedLeads.length / totalLeads) * 100) : 0;

  const roasMultiplier =
    settings.monthlyAdSpend > 0
      ? ((closedRevenue + openPipeline * 0.35) / settings.monthlyAdSpend).toFixed(1)
      : '8.5';

  const goalProgress = Math.min(
    100,
    Math.round((closedRevenue / (settings.monthlyRevenueGoal || 30000)) * 100)
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#04060D] flex items-center justify-center p-4 text-slate-100">
        <div className="w-full max-w-md bg-[#080C18] border border-cyan-500/30 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 border border-cyan-400/40 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase tracking-widest">
              SISTEMA INTERNO · 01 WEB OS
            </div>
            <h2 className="text-2xl font-extrabold text-white font-heading">
              Sistema Administrativo do CEO
            </h2>
            <p className="text-xs text-slate-400">
              Acesso exclusivo ao Termômetro de Leads, Cofre de Ideias, Fábrica de Software e CRM.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                autoFocus
                placeholder="Digite a senha do CEO..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-[#04060C] border border-white/15 text-white text-center font-mono tracking-widest text-lg focus:outline-none focus:border-cyan-400"
              />
              {pinError && <p className="text-xs text-rose-400 mt-2">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-sm cursor-pointer shadow-lg"
            >
              Acessar Sistema Administrativo
            </button>
          </form>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Senha padrão: <strong className="text-cyan-400">01web</strong></span>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white underline cursor-pointer"
            >
              ← Voltar para a Landing Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pendingTasksCount = tasks.filter((t) => !t.done).length;

  const navItems: { id: AdminTab; label: string; icon: any; badge?: number | string; hot?: boolean }[] = [
    { id: 'dashboard', label: '1. Visão Geral do CEO', icon: LayoutDashboard },
    {
      id: 'live_radar',
      label: '2. Radar Ao Vivo (Site)',
      icon: Radio,
      badge: 'AO VIVO',
      hot: true,
    },
    {
      id: 'thermometer',
      label: '3. Leads: Quentes → Frios',
      icon: Thermometer,
      badge: `${hotLeads.length} 🔥`,
      hot: true,
    },
    {
      id: 'ideas',
      label: '4. Ideias & Rotina CEO',
      icon: Lightbulb,
      badge: ideas.length + pendingTasksCount,
    },
    {
      id: 'kanban',
      label: '5. Quadro Kanban CRM',
      icon: Kanban,
      badge: totalLeads,
    },
    {
      id: 'scripts',
      label: '6. Scripts de Fechamento',
      icon: Zap,
      badge: 'WHATS',
    },
    {
      id: 'dev_factory',
      label: '7. Fábrica Dev & Links',
      icon: Code2,
      badge: templates.length,
    },
    { id: 'settings', label: '8. Metas & Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen w-full bg-[#04060D] text-slate-100 flex flex-col lg:flex-row">
      {/* DEDICATED SYSTEM SIDEBAR */}
      <aside className="w-full lg:w-72 bg-[#070B16] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between shrink-0 lg:min-h-screen">
        <div>
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950 font-extrabold font-heading text-base shadow-lg shadow-cyan-950/50">
                01
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white font-heading text-base tracking-tight">
                    01 WEB ERP
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                    CEO OS
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Sistema de Gestão Ativo</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="lg:hidden px-3 py-1.5 rounded-lg bg-white/10 text-xs font-bold text-white cursor-pointer"
            >
              Ver Site Público
            </button>
          </div>

          <div className="px-4 pt-4 hidden lg:block">
            <button
              type="button"
              onClick={() => {
                sound.playClick(850);
                setIsAddingLead(true);
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Cadastrar Lead Manual</span>
            </button>
          </div>

          <nav className="p-3 flex lg:flex-col gap-1.5 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-950/50'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active ? 'text-slate-950' : item.hot ? 'text-rose-400' : 'text-cyan-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-extrabold ${
                        active
                          ? 'bg-slate-950/20 text-slate-950'
                          : item.hot
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:flex flex-col gap-3 p-4 border-t border-white/10 bg-[#050811]">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
              <span>Meta do Mês</span>
              <span className="text-cyan-300 font-bold">{goalProgress}%</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-emerald-400">
                R$ {closedRevenue.toLocaleString('pt-BR')}
              </span>
              <span className="text-slate-500">
                / R$ {settings.monthlyRevenueGoal.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/15 text-slate-400 hover:text-rose-300 text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer"
            >
              <span>Abrir Landing Page</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN SYSTEM WORKSPACE */}
      <div className="flex-1 flex flex-col min-h-screen bg-[#04060D]">
        <header className="h-16 px-4 sm:px-8 border-b border-white/10 bg-[#070B16] flex items-center justify-between gap-4 shrink-0">
          <h1 className="text-base sm:text-xl font-extrabold text-white font-heading">
            {activeTab === 'dashboard' && '📊 Central de Comando do CEO (Visão 360°)'}
            {activeTab === 'live_radar' && '📡 Radar Ao Vivo: Pessoas no Site & Intenção de Compra'}
            {activeTab === 'thermometer' && '🔥 Termômetro de Leads: Dos Mais Quentes aos Mais Frios'}
            {activeTab === 'ideas' && '💡 Laboratório de Ideias, Brainstorm & Rotina do CEO'}
            {activeTab === 'kanban' && '🎯 Pipeline Kanban Comercial'}
            {activeTab === 'scripts' && '⚡ Scripts de Fechamento & Propostas para WhatsApp'}
            {activeTab === 'dev_factory' && '💻 Fábrica de Software, Links Vercel & Financeiro 50/50'}
            {activeTab === 'settings' && '⚙️ Configurações da Agência, Tráfego & Backup'}
          </h1>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddingLead(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ Novo Lead</span>
            </button>

            <button
              type="button"
              onClick={() => leadService.exportCSV()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0C1222] hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Baixar Excel/CSV</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Meta Pixel 1021802663562956 Live Status & Direct Events Manager Link */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#081326] via-[#091824] to-[#07191A] border border-cyan-400/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="text-cyan-300 font-extrabold">
                        META PIXEL ATIVO · ID: 1021802663562956
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        PageView + Lead + Contact (BRL)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Os dados pessoais (Nome, WhatsApp, Problema e Solução IA) caem aqui no seu{' '}
                      <strong className="text-white">Painel CEO</strong>, e a inteligência de anúncios vai para o{' '}
                      <strong className="text-cyan-300">Gerenciador de Eventos da Meta</strong>.
                    </p>
                  </div>
                </div>

                <a
                  href="https://eventsmanager.facebook.com/events_manager2/list/pixel/1021802663562956"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs font-mono shrink-0 cursor-pointer shadow-lg"
                >
                  <span>Abrir Painel da Meta</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-950" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-5 rounded-2xl bg-[#090D1A] border border-emerald-500/30">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-300">
                    <span>FATURAMENTO FECHADO</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-2">
                    R$ {closedRevenue.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1">
                    ✓ {closedLeads.length} projetos vendidos
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#090D1A] border border-cyan-500/30">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span>NEGOCIAÇÕES ABERTAS</span>
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-2">
                    R$ {openPipeline.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Potencial na mesa agora
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('thermometer')}
                  className="p-5 rounded-2xl bg-[#090D1A] border border-rose-500/40 cursor-pointer hover:bg-rose-500/5 transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-rose-300">
                    <span>LEADS QUENTES 🔥</span>
                    <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono mt-2">
                    {hotLeads.length} Quentes
                  </div>
                  <div className="text-[11px] text-rose-300 mt-1 underline">
                    Ver termômetro de ataque →
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#090D1A] border border-white/10">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>TICKET MÉDIO</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-2">
                    R$ {avgTicket.toLocaleString('pt-BR')}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Taxa de fechamento: <strong className="text-white">{conversionRate}%</strong>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#090D1A] border border-white/10">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>ROAS DO TRÁFEGO</span>
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono mt-2">
                    {roasMultiplier}x
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Investido: R$ {settings.monthlyAdSpend.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 p-6 rounded-2xl bg-[#090D1A] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-rose-400 font-bold">
                        PRIORIDADE #1 DO CEO
                      </span>
                      <h3 className="text-base font-extrabold text-white">
                        Leads Mais Quentes para Fechar Hoje ({hotLeads.length})
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('thermometer')}
                      className="text-xs font-mono text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Abrir Termômetro Completo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {hotLeads.slice(0, 4).map((lead) => (
                      <div
                        key={lead.id}
                        className="p-4 rounded-xl bg-[#0C1222] border border-rose-500/30 space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-mono text-[10px] font-extrabold">
                                🔥 {lead.score || 95}° QUENTE
                              </span>
                              <h4 className="text-sm font-bold text-white">{lead.name}</h4>
                              <span className="text-xs text-slate-400">· {lead.businessName}</span>
                              <span className="text-xs font-mono text-emerald-400 font-bold">
                                📱 {lead.whatsapp}
                              </span>
                            </div>
                            <p className="text-xs text-rose-300 font-semibold">
                              ⚠️ Problema: {lead.problemDetails || lead.bottleneckLabel}
                            </p>
                            <p className="text-[11px] text-cyan-300">
                              Deseja: {lead.needLabel} · Valor:{' '}
                              <strong className="text-emerald-400">
                                R$ {(lead.budgetEstimate || 2200).toLocaleString('pt-BR')}
                              </strong>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setInspectedLead(lead)}
                              className="px-3 py-2 rounded-lg bg-cyan-400/15 hover:bg-cyan-400/25 border border-cyan-400/30 text-xs font-extrabold text-cyan-300 cursor-pointer"
                            >
                              🤖 Solução IA
                            </button>
                            <a
                              href={buildDirectWaUrl(lead, lead.aiBlueprint?.whatsappScript)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                if (lead.status === 'NOVO') {
                                  handleStatusChange(lead.id, 'EM_CONTATO');
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                              <span>Mandar Solução no Zap</span>
                            </a>
                          </div>
                        </div>

                        {lead.aiBlueprint && (
                          <div className="p-2.5 rounded-lg bg-slate-950/90 border border-cyan-500/25 text-[11px] text-slate-200">
                            <strong className="text-cyan-300 font-mono">🤖 IA Indica: </strong>
                            {lead.aiBlueprint.recommendedSolution}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 rounded-2xl bg-[#090D1A] border border-white/10 space-y-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                          SEGUNDO CÉREBRO DO CEO
                        </span>
                        <h3 className="text-base font-extrabold text-white">
                          Tarefas Pendentes & Ideias Fixadas
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('ideas')}
                        className="text-xs font-mono text-cyan-300 hover:underline cursor-pointer"
                      >
                        Abrir Mural →
                      </button>
                    </div>

                    <div className="space-y-2">
                      {tasks.slice(0, 3).map((t) => (
                        <div
                          key={t.id}
                          onClick={() => leadService.toggleTask(t.id)}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer ${
                            t.done
                              ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-500 line-through'
                              : 'bg-slate-950 border-white/10 text-slate-200'
                          }`}
                        >
                          <span className="truncate">{t.text}</span>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-cyan-300 ml-2 shrink-0">
                            {t.tag}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="text-xs font-mono text-amber-300 font-bold">
                        💡 Última Ideia Fixada:
                      </div>
                      {ideas[0] && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                          <div className="font-bold text-white">{ideas[0].title}</div>
                          <p className="text-slate-300 text-[11px] mt-1 line-clamp-2">
                            {ideas[0].content}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('ideas')}
                      className="py-2.5 px-3 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 font-bold text-xs cursor-pointer"
                    >
                      + Anotar Nova Ideia
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('dev_factory')}
                      className="py-2.5 px-3 rounded-xl bg-cyan-400/15 hover:bg-cyan-400/25 border border-cyan-400/30 text-cyan-300 font-bold text-xs cursor-pointer"
                    >
                      Cofre de Links Vercel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'live_radar' && <AdminLiveRadarTab />}

          {activeTab === 'thermometer' && (
            <AdminThermometerTab
              leads={leads}
              onStatusChange={handleStatusChange}
              onTemperatureChange={handleTemperatureChange}
              onBudgetChange={handleBudgetChange}
              onNotesChange={handleNotesChange}
              onInspectLead={(l) => setInspectedLead(l)}
              onOpenScripts={(id) => {
                setScriptLeadId(id);
                setActiveTab('scripts');
              }}
            />
          )}

          {activeTab === 'ideas' && (
            <AdminIdeasVaultTab ideas={ideas} tasks={tasks} />
          )}

          {activeTab === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-start">
              {(
                [
                  {
                    status: 'NOVO',
                    title: '1. Novos do Anúncio 🔥',
                    border: 'border-rose-500/30',
                    badgeBg: 'bg-rose-500/20 text-rose-300',
                  },
                  {
                    status: 'EM_CONTATO',
                    title: '2. Em Atendimento 💬',
                    border: 'border-amber-500/30',
                    badgeBg: 'bg-amber-500/20 text-amber-300',
                  },
                  {
                    status: 'PROPOSTA_ENVIADA',
                    title: '3. Proposta Enviada 📄',
                    border: 'border-cyan-500/30',
                    badgeBg: 'bg-cyan-500/20 text-cyan-300',
                  },
                  {
                    status: 'FECHADO',
                    title: '4. Fechados (Ganho) 🎉',
                    border: 'border-emerald-500/30',
                    badgeBg: 'bg-emerald-500/20 text-emerald-300',
                  },
                  {
                    status: 'PERDIDO',
                    title: '5. Perdidos / Arquivo',
                    border: 'border-white/10',
                    badgeBg: 'bg-slate-800 text-slate-400',
                  },
                ] as {
                  status: LeadStatus;
                  title: string;
                  border: string;
                  badgeBg: string;
                }[]
              ).map((col) => {
                const colLeads = leads.filter((l) => l.status === col.status);
                const colTotal = colLeads.reduce(
                  (sum, l) => sum + (l.budgetEstimate || 2000),
                  0
                );

                return (
                  <div
                    key={col.status}
                    className={`rounded-2xl bg-[#090D1A] border ${col.border} p-3.5 space-y-3`}
                  >
                    <div className="pb-2.5 border-b border-white/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-white">
                          {col.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}
                        >
                          {colLeads.length}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Total: <strong className="text-white">R$ {colTotal.toLocaleString('pt-BR')}</strong>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {colLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className="p-3.5 rounded-xl bg-[#0C1222] border border-white/10 hover:border-cyan-400/50 space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-300 truncate">
                              {lead.segment}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-rose-400">
                              {lead.temperature === 'COLD'
                                ? '❄️ Frio'
                                : lead.temperature === 'WARM'
                                ? '🌡️ Morno'
                                : '🔥 Quente'}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-white">{lead.name}</h4>
                            <p className="text-[11px] text-slate-400 truncate">
                              {lead.businessName}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs font-mono font-extrabold text-emerald-400">
                              R$ {(lead.budgetEstimate || 2000).toLocaleString('pt-BR')}
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setInspectedLead(lead)}
                                className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-[10px] font-semibold text-slate-200 cursor-pointer"
                              >
                                Raio-X
                              </button>
                              <a
                                href={buildDirectWaUrl(lead)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded bg-emerald-400 text-slate-950 cursor-pointer"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                              </a>
                            </div>
                          </div>

                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value as LeadStatus)
                            }
                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-mono text-slate-300 cursor-pointer"
                          >
                            <option value="NOVO">Mover: NOVO 🔥</option>
                            <option value="EM_CONTATO">Mover: EM CONTATO 💬</option>
                            <option value="PROPOSTA_ENVIADA">Mover: PROPOSTA 📄</option>
                            <option value="FECHADO">Mover: FECHADO 🎉</option>
                            <option value="PERDIDO">Mover: PERDIDO ❌</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'scripts' && (
            <AdminScriptsTab
              leads={leads}
              selectedLeadId={scriptLeadId}
              onSelectLeadId={(id) => setScriptLeadId(id)}
            />
          )}

          {activeTab === 'dev_factory' && (
            <AdminDevFactoryTab
              templates={templates}
              closedLeads={closedLeads}
              onToggleChecklist={handleChecklistToggle}
              onTogglePayment={handlePaymentToggle}
            />
          )}

          {activeTab === 'settings' && <AdminSettingsTab settings={settings} />}
        </main>
      </div>

      <LeadInspectorDrawer
        lead={inspectedLead}
        onClose={() => setInspectedLead(null)}
        onStatusChange={handleStatusChange}
        onBudgetChange={handleBudgetChange}
        onNotesChange={handleNotesChange}
        onOpenScriptsForLead={(id) => {
          setScriptLeadId(id);
          setInspectedLead(null);
          setActiveTab('scripts');
        }}
      />

      {isAddingLead && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleSaveManualLead}
            className="w-full max-w-md bg-[#0A0E1F] border border-cyan-500/30 rounded-2xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">Cadastrar Lead no Sistema</h3>
              <button
                type="button"
                onClick={() => setIsAddingLead(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Nome do Cliente *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Dr. Roberto Martins"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Empresa / Negócio
                </label>
                <input
                  type="text"
                  placeholder="Ex: Martins Advocacia"
                  value={manualBusiness}
                  onChange={(e) => setManualBusiness(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 11999998888"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Temperatura do Lead
                </label>
                <select
                  value={manualTemp}
                  onChange={(e) => setManualTemp(e.target.value as LeadTemperature)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                >
                  <option value="HOT">🔥 Quente (Pelando)</option>
                  <option value="WARM">🌡️ Morno (15-30 dias)</option>
                  <option value="COLD">❄️ Frio (Orçando)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Valor Proposta (R$)
                </label>
                <input
                  type="number"
                  value={manualBudget}
                  onChange={(e) => setManualBudget(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-emerald-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Gargalo / Dificuldade Principal
              </label>
              <input
                type="text"
                value={manualBottleneck}
                onChange={(e) => setManualBottleneck(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAddingLead(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs cursor-pointer"
              >
                Salvar no Sistema
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
