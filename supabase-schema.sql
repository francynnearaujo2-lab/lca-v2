-- Run this in your Supabase SQL Editor

create table if not exists profiles (
  id uuid references auth.users primary key,
  nome text, email_display text, area text, cargo text,
  experiencia text, setor text, especializacoes text,
  certificacoes text, objetivo text, tipo_empresa text,
  modalidade text, cidade text, disponibilidade text, salario text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists module_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  module_id text not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, module_id)
);

create table if not exists action_plans (
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
