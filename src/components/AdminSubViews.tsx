import { useState } from 'react';
import {
  Copy,
  Send,
  Rocket,
  Check,
  MessageCircle,
  Download,
  X,
  Bot,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Database,
} from 'lucide-react';
import { Lead, LeadStatus, AgencySettings, ProjectChecklist } from '../types/lead';
import { leadService } from '../services/leadService';
import {
  getCloudDatabaseSource,
  getStoredLocalSupabaseConfig,
  saveLocalSupabaseConfig,
  clearLocalSupabaseConfig,
  testCloudConnection,
} from '../services/supabaseClient';
import { generateAiSolutionBlueprint } from '../services/aiLeadArchitect';
import { getSalesScripts, buildDirectWaUrl } from '../utils/adminScripts';
import { sound } from '../utils/audio';

// ================= TAB 4: SCRIPTS DE VENDAS & GERADOR DE PROPOSTAS =================
export function AdminScriptsTab({
  leads,
  selectedLeadId,
  onSelectLeadId,
}: {
  leads: Lead[];
  selectedLeadId: string;
  onSelectLeadId: (id: string) => void;
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const currentScriptLead =
    leads.find((l) => l.id === selectedLeadId) || leads[0] || null;

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    sound.playSelect();
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0A1124] to-[#081520] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            PERSONALIZAÇÃO AUTOMÁTICA DE SCRIPTS
          </span>
          <h3 className="text-base font-bold text-white">
            Selecione o Lead para Preencher os Scripts de Fechamento:
          </h3>
          <p className="text-xs text-slate-300">
            Todos os 5 scripts abaixo puxam automaticamente o nome, a empresa, a dor exata, o link real de demonstração do nicho e o preço!
          </p>
        </div>

        <select
          value={currentScriptLead?.id || ''}
          onChange={(e) => {
            sound.playSelect();
            onSelectLeadId(e.target.value);
          }}
          className="px-4 py-3 rounded-xl bg-slate-950 border border-cyan-400/50 text-white text-xs sm:text-sm font-bold focus:outline-none cursor-pointer min-w-[260px]"
        >
          {leads.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name} — {l.businessName} ({l.segment})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {getSalesScripts(currentScriptLead).map((scr) => (
          <div
            key={scr.id}
            className="p-5 rounded-2xl bg-[#080C18] border border-white/10 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <span className="inline-block text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {scr.badge}
              </span>
              <h4 className="text-base font-bold text-white">{scr.title}</h4>
              <p className="text-xs text-slate-400">{scr.desc}</p>

              <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed mt-2">
                {scr.content}
              </pre>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => copyText(scr.id, scr.content)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>{copiedKey === scr.id ? 'Copiado!' : 'Copiar Script'}</span>
              </button>

              {currentScriptLead && (
                <a
                  href={buildDirectWaUrl(currentScriptLead, scr.content)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playSuccess()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs cursor-pointer shadow-lg shadow-emerald-950/50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Disparar para {currentScriptLead.name.split(' ')[0]}</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================= TAB 5: PROJETOS FECHADOS & ENTREGAS =================
export function AdminProjectsTab({
  closedLeads,
  onToggleChecklist,
}: {
  closedLeads: Lead[];
  onToggleChecklist: (
    leadId: string,
    key: keyof ProjectChecklist,
    currentVal: boolean
  ) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="p-5 rounded-2xl bg-[#080C18] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
            ESTEIRA DE PRODUÇÃO & ENTREGA
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">
            Acompanhamento de Clientes Fechados ({closedLeads.length})
          </h3>
          <p className="text-xs text-slate-400">
            Marque as etapas concluídas de cada projeto e notifique o cliente no WhatsApp com 1 clique.
          </p>
        </div>
      </div>

      {closedLeads.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#080C18] border border-white/10 text-center space-y-3">
          <Rocket className="w-8 h-8 text-cyan-400 mx-auto" />
          <h4 className="text-base font-bold text-white">
            Nenhum projeto marcado como FECHADO ainda
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Quando fechar uma venda no WhatsApp, mude o status do lead para &ldquo;FECHADO 🎉&rdquo; no Kanban para gerenciar a entrega dele aqui.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {closedLeads.map((project) => {
            const cl = project.checklist || {
              briefing: true,
              designMobile: false,
              domainHosting: false,
              whatsappAutomation: false,
              finalDelivery: false,
            };
            const steps: { key: keyof ProjectChecklist; label: string }[] = [
              { key: 'briefing', label: '1. Briefing, Identidade & Copywriting' },
              { key: 'designMobile', label: '2. Desenvolvimento Mobile-First Rápido' },
              { key: 'domainHosting', label: '3. Domínio .com.br + Hospedagem Nuvem' },
              { key: 'whatsappAutomation', label: '4. Fluxo de Triagem WhatsApp 24/7' },
              { key: 'finalDelivery', label: '5. Entrega Oficial + 50% Final Quitado' },
            ];

            const doneCount = steps.filter((s) => cl[s.key]).length;
            const pct = Math.round((doneCount / steps.length) * 100);

            const statusUpdateMsg =
              `Olá *${project.name}*! Passando para atualizar sobre o desenvolvimento do projeto da *${project.businessName}* na *01 Web*:\n\n` +
              `📊 *Progresso Atual:* ${pct}% concluído\n` +
              steps.map((s) => `${cl[s.key] ? '✅' : '⏳'} ${s.label}`).join('\n') +
              `\n\nSeguimos avançando no cronograma!`;

            return (
              <div
                key={project.id}
                className="p-5 rounded-2xl bg-[#080C18] border border-emerald-500/30 space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">
                      CONTRATO ATIVO · {project.segment}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      {project.businessName} ({project.name})
                    </h4>
                    <p className="text-xs text-slate-400">{project.needLabel}</p>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-sm font-extrabold text-emerald-400">
                      R$ {(project.budgetEstimate || 2000).toLocaleString('pt-BR')}
                    </div>
                    <div className="text-[10px] text-slate-400">{pct}% entregue</div>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="space-y-2">
                  {steps.map((s) => {
                    const checked = cl[s.key];
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => onToggleChecklist(project.id, s.key, checked)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          checked
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200 font-semibold'
                            : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{s.label}</span>
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center ${
                            checked
                              ? 'bg-emerald-400 text-slate-950'
                              : 'bg-slate-800 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 truncate">
                    {project.notes}
                  </span>
                  <a
                    href={buildDirectWaUrl(project, statusUpdateMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shrink-0 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                    <span>Enviar Relatório no Whats</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ================= TAB 6: CONFIGURAÇÕES & BACKUP =================
export function AdminSettingsTab({ settings }: { settings: AgencySettings }) {
  const [goalInput, setGoalInput] = useState(settings.monthlyRevenueGoal);
  const [adSpendInput, setAdSpendInput] = useState(settings.monthlyAdSpend);
  const [waNumberInput, setWaNumberInput] = useState(settings.whatsappNumber);
  const [savedToast, setSavedToast] = useState(false);

  const storedSupa = getStoredLocalSupabaseConfig();
  const [supaUrlInput, setSupaUrlInput] = useState(storedSupa.url);
  const [supaKeyInput, setSupaKeyInput] = useState(storedSupa.anonKey);
  const [cloudSource, setCloudSource] = useState(() => getCloudDatabaseSource());
  const [cloudTestResult, setCloudTestResult] = useState<{ ok: boolean; message: string } | null>(
    null
  );
  const [isTestingCloud, setIsTestingCloud] = useState(false);

  const handleSaveAndTestCloud = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSelect();
    if (supaUrlInput.trim() && supaKeyInput.trim()) {
      saveLocalSupabaseConfig(supaUrlInput, supaKeyInput);
    }
    setIsTestingCloud(true);
    const res = await testCloudConnection();
    setCloudTestResult(res);
    setCloudSource(getCloudDatabaseSource());
    if (res.ok) {
      sound.playSuccess();
      await leadService.syncFromCloud();
    }
    setIsTestingCloud(false);
  };

  const handleManualSyncNow = async () => {
    sound.playSelect();
    setIsTestingCloud(true);
    const res = await testCloudConnection();
    setCloudTestResult(res);
    if (res.ok) {
      const synced = await leadService.syncFromCloud();
      sound.playSuccess();
      setCloudTestResult({
        ok: true,
        message: `Sincronização concluída! ${synced.length} leads carregados no painel.`,
      });
    }
    setIsTestingCloud(false);
  };

  const handleClearLocalCloud = () => {
    sound.playSelect();
    clearLocalSupabaseConfig();
    setSupaUrlInput('');
    setSupaKeyInput('');
    setCloudSource(getCloudDatabaseSource());
    setCloudTestResult({
      ok: false,
      message: 'Chaves locais removidas. Usando variáveis da Vercel ou modo local.',
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    leadService.updateSettings({
      monthlyRevenueGoal: Number(goalInput) || 25000,
      monthlyAdSpend: Number(adSpendInput) || 1500,
      whatsappNumber: waNumberInput.replace(/\D/g, '') || '5566999697087',
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form
        onSubmit={handleSave}
        className="p-6 rounded-2xl bg-[#080C18] border border-white/10 space-y-5"
      >
        <div>
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
            PARÂMETROS DA AGÊNCIA
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">
            Metas Financeiras & Tráfego Pago
          </h3>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
            Meta de Faturamento Mensal (R$)
          </label>
          <input
            type="number"
            value={goalInput}
            onChange={(e) => setGoalInput(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
            Investimento Mensal em Anúncios (Meta Ads / Google Ads) (R$)
          </label>
          <input
            type="number"
            value={adSpendInput}
            onChange={(e) => setAdSpendInput(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Usado para calcular o ROAS automático na Visão Executiva.
          </p>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
            WhatsApp Oficial de Recebimento (com DDI 55 + DDD)
          </label>
          <input
            type="text"
            value={waNumberInput}
            onChange={(e) => setWaNumberInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedToast ? (
            <span className="text-xs font-mono text-emerald-400 font-bold">
              ✓ Configurações salvas!
            </span>
          ) : (
            <span />
          )}
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs cursor-pointer"
          >
            Salvar Configurações
          </button>
        </div>
      </form>

      <div className="p-6 rounded-2xl bg-[#080C18] border border-white/10 space-y-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
              SEGURANÇA & EXPORTAÇÃO DE DADOS
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Backup da Base de Leads & CRM
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Exporte seus leads a qualquer momento para planilhas do Excel, Google Sheets ou público personalizado do Meta Ads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => leadService.exportCSV()}
              className="p-4 rounded-xl bg-slate-950 border border-white/10 hover:border-cyan-400 text-left space-y-1 transition-all cursor-pointer"
            >
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Exportar CSV (Excel)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Planilha pronta para importar em campanhas ou CRM externo.
              </p>
            </button>

            <button
              type="button"
              onClick={() => leadService.exportJSON()}
              className="p-4 rounded-xl bg-slate-950 border border-white/10 hover:border-emerald-400 text-left space-y-1 transition-all cursor-pointer"
            >
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Backup Completo JSON</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Cópia integral de todos os leads, notas e checklists.
              </p>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-rose-300">
              Restaurar Leads de Demonstração
            </div>
            <p className="text-[11px] text-rose-200/70">
              Recarrega os 6 leads executivos de exemplo para testar o painel.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Deseja restaurar os leads de demonstração?')) {
                leadService.resetToDefaultSeed();
              }
            }}
            className="px-3.5 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold shrink-0 cursor-pointer"
          >
            Restaurar Demo
          </button>
        </div>
      </div>

      {/* CLOUD DATABASE (SUPABASE POSTGRESQL) CONFIGURATION CARD */}
      <form
        onSubmit={handleSaveAndTestCloud}
        className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-[#071222] via-[#080C18] to-[#071619] border border-cyan-400/35 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/15 border border-cyan-400/35 flex items-center justify-center text-cyan-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                BANCO DE DADOS NA NUVEM · 100% GRÁTIS
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Conexão Supabase PostgreSQL (Leads & Radar Ao Vivo Multi-Dispositivo)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Quando conectado, qualquer empresário que preencher o site pelo celular cai direto na
                nuvem em tempo real para você acompanhar de qualquer dispositivo.
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-extrabold border shrink-0 self-start sm:self-center ${
              cloudSource === 'env'
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                : cloudSource === 'local_override'
                ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                : 'bg-amber-500/15 border-amber-400/40 text-amber-300'
            }`}
          >
            {cloudSource === 'env'
              ? '☁️ ONLINE VIA VERCEL'
              : cloudSource === 'local_override'
              ? '🧪 ONLINE (TESTE LOCAL)'
              : '💾 OFFLINE · MODO LOCAL'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
              Supabase Project URL (VITE_SUPABASE_URL)
            </label>
            <input
              type="url"
              placeholder="https://seuprojeto.supabase.co"
              value={supaUrlInput}
              onChange={(e) => setSupaUrlInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
              Supabase Anon Public Key (VITE_SUPABASE_ANON_KEY)
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supaKeyInput}
              onChange={(e) => setSupaKeyInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {cloudTestResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-mono ${
              cloudTestResult.ok
                ? 'bg-emerald-950/40 border-emerald-400/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            {cloudTestResult.ok ? '✅ ' : '⚠️ '}
            {cloudTestResult.message}
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-[#050811] border border-white/10 text-[11px] text-slate-300 leading-relaxed">
          <strong className="text-amber-300">Importante para produção:</strong> As chaves salvas
          aqui funcionam neste navegador para teste imediato. Para que os visitantes de{' '}
          <strong className="text-white">outros celulares</strong> também gravem no seu banco,
          adicione <code className="text-cyan-300">VITE_SUPABASE_URL</code> e{' '}
          <code className="text-cyan-300">VITE_SUPABASE_ANON_KEY</code> nas{' '}
          <strong className="text-white">Environment Variables da Vercel</strong> e dê Redeploy.
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="submit"
              disabled={isTestingCloud}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs cursor-pointer disabled:opacity-60"
            >
              <Database className="w-4 h-4" />
              <span>{isTestingCloud ? 'Testando...' : 'Salvar & Testar Conexão'}</span>
            </button>

            <button
              type="button"
              onClick={handleManualSyncNow}
              disabled={isTestingCloud}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-400/35 text-cyan-300 font-bold text-xs cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingCloud ? 'animate-spin' : ''}`} />
              <span>Sincronizar Leads Agora</span>
            </button>
          </div>

          {cloudSource === 'local_override' && (
            <button
              type="button"
              onClick={handleClearLocalCloud}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
            >
              Limpar Chaves Locais
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ================= SLIDE-OVER LEAD INSPECTOR DRAWER (RAIO-X DO LEAD + IA) =================
export function LeadInspectorDrawer({
  lead,
  onClose,
  onStatusChange,
  onBudgetChange,
  onNotesChange,
  onOpenScriptsForLead,
}: {
  lead: Lead | null;
  onClose: () => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onBudgetChange: (id: string, budget: number) => void;
  onNotesChange: (id: string, notes: string) => void;
  onOpenScriptsForLead: (id: string) => void;
}) {
  const [aiPromptInput, setAiPromptInput] = useState<string>('');
  const [copiedAiScript, setCopiedAiScript] = useState<boolean>(false);

  if (!lead) return null;

  const aiBlueprint = lead.aiBlueprint || generateAiSolutionBlueprint(lead);

  const handleRegenerateAi = () => {
    sound.playSuccess();
    leadService.regenerateLeadAiBlueprint(lead.id, aiPromptInput);
    setAiPromptInput('');
  };

  const handleCopyAiScript = () => {
    navigator.clipboard.writeText(aiBlueprint.whatsappScript);
    sound.playSelect();
    setCopiedAiScript(true);
    setTimeout(() => setCopiedAiScript(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-[#080C18] border-l border-cyan-500/30 h-full flex flex-col justify-between overflow-y-auto p-6 space-y-6 shadow-2xl">
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                FICHA TÉCNICA & CONSULTOR IA 01 WEB
              </span>
              <h3 className="text-lg font-extrabold text-white mt-0.5">{lead.name}</h3>
              <p className="text-xs text-slate-400">{lead.businessName}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-white/10">
              <div className="text-[10px] font-mono text-slate-400">Nicho</div>
              <div className="font-bold text-white mt-0.5">{lead.segment}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-white/10">
              <div className="text-[10px] font-mono text-slate-400">Telefone / WhatsApp</div>
              <div className="font-bold text-emerald-400 font-mono mt-0.5">
                {lead.whatsapp}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-white/10">
              <div className="text-[10px] font-mono text-slate-400">Urgência</div>
              <div className="font-bold text-amber-300 mt-0.5">{lead.urgencyLabel}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-white/10">
              <div className="text-[10px] font-mono text-slate-400">Score do Funil</div>
              <div className="font-bold text-cyan-300 font-mono mt-0.5">
                {lead.score || 95} / 100 PTS
              </div>
            </div>
          </div>

          {/* PROBLEMA DESCRITO PELO CLIENTE */}
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1.5">
            <div className="text-[10px] font-mono uppercase text-rose-300 font-bold">
              ⚠️ Problema / Dificuldade Relatada pelo Cliente:
            </div>
            <div className="text-sm font-bold text-white">{lead.bottleneckLabel}</div>
            {lead.problemDetails && (
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-rose-500/20 text-xs text-rose-200 italic">
                &ldquo;{lead.problemDetails}&rdquo;
              </div>
            )}
          </div>

          {/* =================================================================
              CÉREBRO IA 01 WEB: ANÁLISE DO PROBLEMA & SOLUÇÃO RECOMENDADA
             ================================================================= */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0A1628] via-[#091220] to-[#071A1A] border border-cyan-400/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-400 text-slate-950 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block">
                    INTELIGÊNCIA ARTIFICIAL 01 WEB
                  </span>
                  <h4 className="text-sm font-extrabold text-white">
                    Diagnóstico & Solução Indicada para Este Cliente
                  </h4>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-[10px] font-mono font-bold text-emerald-300">
                IA ATIVA
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  1. Diagnóstico da Causa Raiz (Por que ele perde dinheiro):
                </span>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  {aiBlueprint.problemAnalysis}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  2. Solução Técnica Recomendada pela IA:
                </span>
                <p className="text-white font-bold leading-relaxed">
                  {aiBlueprint.recommendedSolution}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block mb-1.5">
                  3. O Que Entregar neste Projeto (Módulos Sugeridos):
                </span>
                <div className="space-y-1.5">
                  {aiBlueprint.suggestedModules.map((mod, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-slate-200 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-white/5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{mod}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
                <span className="text-[10px] font-mono uppercase text-amber-300 font-bold block">
                  🎯 Argumento Matador de Venda (Gatilho de Fechamento):
                </span>
                <p className="text-amber-100 mt-0.5 leading-relaxed">
                  {aiBlueprint.salesAngle}
                </p>
              </div>
            </div>

            {/* Interactive Prompt to Adjust AI Solution */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <label className="block text-[10px] font-mono uppercase text-cyan-300 font-bold">
                Pedir Ajuste de Solução para a IA (Opcional):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPromptInput}
                  onChange={(e) => setAiPromptInput(e.target.value)}
                  placeholder="Ex: Criar opção mais barata de entrada / Focar em catálogo..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={handleRegenerateAi}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs shrink-0 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Gerar IA</span>
                </button>
              </div>
            </div>

            {/* Ready WhatsApp Script Generated by AI */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                  📲 Mensagem Pronta da IA para Abordar {lead.name.split(' ')[0]}:
                </span>
                <button
                  type="button"
                  onClick={handleCopyAiScript}
                  className="text-[11px] font-mono text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedAiScript ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-white/10 text-[11px] text-slate-200 font-sans whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                {aiBlueprint.whatsappScript}
              </pre>
              <a
                href={buildDirectWaUrl(lead, aiBlueprint.whatsappScript)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  sound.playSuccess();
                  if (lead.status === 'NOVO') {
                    onStatusChange(lead.id, 'EM_CONTATO');
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
                <span>Enviar Solução da IA no WhatsApp do Cliente</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                Status Atual
              </label>
              <select
                value={lead.status}
                onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-xs font-bold text-white"
              >
                <option value="NOVO">NOVO 🔥</option>
                <option value="EM_CONTATO">EM CONTATO 💬</option>
                <option value="PROPOSTA_ENVIADA">PROPOSTA ENVIADA 📄</option>
                <option value="FECHADO">FECHADO 🎉</option>
                <option value="PERDIDO">PERDIDO ❌</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                Valor da Proposta (R$)
              </label>
              <input
                type="number"
                value={lead.budgetEstimate || 2000}
                onChange={(e) => onBudgetChange(lead.id, Number(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-xs font-mono font-bold text-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
              Diário de Negociação / Notas do CEO
            </label>
            <textarea
              rows={3}
              defaultValue={lead.notes || ''}
              onBlur={(e) => onNotesChange(lead.id, e.target.value)}
              placeholder="Anote detalhes da conversa, objeções ou combinados..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-white/15 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onOpenScriptsForLead(lead.id)}
              className="py-3 px-4 rounded-xl bg-cyan-400/15 hover:bg-cyan-400/25 border border-cyan-400/30 text-cyan-300 font-bold text-xs cursor-pointer"
            >
              Ver Todos os Scripts
            </button>

            <a
              href={buildDirectWaUrl(lead, aiBlueprint.whatsappScript)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (lead.status === 'NOVO') {
                  onStatusChange(lead.id, 'EM_CONTATO');
                }
              }}
              className="py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
              <span>Abrir WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
