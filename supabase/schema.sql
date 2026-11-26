-- ============================================================================
-- 01 WEB OS — SUPABASE POSTGRESQL SCHEMA (LEADS CRM + RADAR AO VIVO 360°)
-- Cole este arquivo inteiro no SQL Editor do seu Supabase e clique em RUN.
-- Seguro para rodar mais de uma vez (idempotente).
-- ============================================================================

-- 1. TABELA PRINCIPAL DE LEADS & ORÇAMENTOS
create table if not exists public.leads (
  id text primary key,
  created_at timestamptz not null default now(),
  name text not null,
  business_name text not null default '',
  whatsapp text not null,
  segment text not null default '',
  bottleneck text not null default 'custom_need',
  bottleneck_label text not null default '',
  problem_details text,
  need text not null default 'combo_completo',
  need_label text not null default '',
  urgency text not null default 'imediato',
  urgency_label text not null default '',
  budget_estimate numeric default 1850,
  investment_range text,
  investment_tier text,
  utm_summary text,
  is_puro_suco boolean default false,
  status text not null default 'NOVO',
  temperature text default 'WARM',
  score integer default 50,
  source text not null default 'funil_anuncio',
  diagnostic_summary text not null default '',
  notes text,
  ai_blueprint jsonb,
  checklist jsonb,
  paid_deposit boolean default false,
  paid_final boolean default false,
  last_contacted_at timestamptz
);

create index if not exists idx_leads_created_at
  on public.leads (created_at desc);

-- 2. TABELA DE SESSÕES DO RADAR AO VIVO (MULTI-DISPOSITIVO EM TEMPO REAL)
create table if not exists public.live_radar_sessions (
  session_id text primary key,
  started_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  seconds_on_site integer not null default 1,
  device text not null default '',
  source text not null default '',
  city text not null default '',
  current_section_id text not null default 'inicio',
  current_section_label text not null default '',
  scroll_depth_pct integer not null default 5,
  intent_level text not null default 'EXPLORANDO',
  last_interest text not null default '',
  interest_history jsonb not null default '[]'::jsonb,
  identified_name text,
  identified_whatsapp text,
  pixel_events_fired jsonb not null default '["PageView"]'::jsonb,
  radar_angle integer not null default 110,
  radar_distance integer not null default 55
);

create index if not exists idx_live_radar_last_active
  on public.live_radar_sessions (last_active_at desc);

-- 3. ROW LEVEL SECURITY (RLS) + POLÍTICAS DE ACESSO RÁPIDO PARA SPA
-- Nota: Após ativar o login próprio pelo Supabase Auth no futuro, você pode
-- restringir SELECT/UPDATE/DELETE apenas para authenticated users.
alter table public.leads enable row level security;
alter table public.live_radar_sessions enable row level security;

drop policy if exists "01web_leads_all_access" on public.leads;
create policy "01web_leads_all_access"
  on public.leads
  for all
  using (true)
  with check (true);

drop policy if exists "01web_radar_all_access" on public.live_radar_sessions;
create policy "01web_radar_all_access"
  on public.live_radar_sessions
  for all
  using (true)
  with check (true);

-- 4. ATIVAR REALTIME NAS DUAS TABELAS (OPCIONAL / SEGURO)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'leads'
  ) then
    alter publication supabase_realtime add table public.leads;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'live_radar_sessions'
  ) then
    alter publication supabase_realtime add table public.live_radar_sessions;
  end if;
exception
  when others then
    null;
end $$;
