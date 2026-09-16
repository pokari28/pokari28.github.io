-- Supabase SQL Editor で一度実行してください。

create table if not exists public.nokori_state (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.nokori_state enable row level security;

drop policy if exists "allow_anon_read_write" on public.nokori_state;
create policy "allow_anon_read_write"
on public.nokori_state
for all
to anon
using (true)
with check (true);

do $$
begin
  begin
    alter publication supabase_realtime add table public.nokori_state;
  exception
    when duplicate_object then null;
  end;
end $$;
