-- LinkedIn Career Agent v2 — Schema completo
-- Execute no Supabase SQL Editor

-- Drop antigas se existirem (cuidado em produção com dados!)
drop table if exists action_plans cascade;
drop table if exists module_results cascade;
drop table if exists profiles cascade;

-- Perfis dos usuários
create table profiles (
  id uuid references auth.users primary key,
  -- Identidade
  nome text,
  email_display text,
  areas text,             -- "Marketing, Growth, Vendas"
  cargo_atual text,
  senioridade text,
  nivel_formacao text,
  formacao text,
  -- LinkedIn real
  headline_atual text,
  sobre_atual text,
  exp1_cargo text,
  exp1_empresa text,
  exp1_descricao text,
  exp2_cargo text,
  exp2_empresa text,
  exp2_descricao text,
  certificacoes text,
  -- Currículo
  curriculo_texto text,
  -- Objetivos
  objetivo text,
  tipo_empresa text,
  modalidade text,
  empresas_sonho text,
  tipo_contrato text,
  -- Localização
  cidade text,
  disponibilidade text,
  salario text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Resultados dos módulos
create table module_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  module_id text not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, module_id)
);

-- Planos de ação
create table action_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table module_results enable row level security;
alter table action_plans enable row level security;

create policy "Users own profile" on profiles for all using (auth.uid() = id);
create policy "Users own modules" on module_results for all using (auth.uid() = user_id);
create policy "Users own plans" on action_plans for all using (auth.uid() = user_id);
