-- Execute este SQL no Supabase SQL Editor para adicionar o campo situação
-- (sem apagar dados existentes)

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS situacao text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url text;

-- Verificar se funcionou
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'profiles' ORDER BY ordinal_position;
