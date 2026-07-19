begin;

create table if not exists public.tamagon_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  save_data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.tamagon_saves enable row level security;

revoke all on table public.tamagon_saves from anon;
grant select, insert, update, delete on table public.tamagon_saves to authenticated;

drop policy if exists "Jogador lê o próprio save" on public.tamagon_saves;
drop policy if exists "Jogador cria o próprio save" on public.tamagon_saves;
drop policy if exists "Jogador atualiza o próprio save" on public.tamagon_saves;
drop policy if exists "Jogador apaga o próprio save" on public.tamagon_saves;

create policy "Jogador lê o próprio save"
on public.tamagon_saves
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Jogador cria o próprio save"
on public.tamagon_saves
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Jogador atualiza o próprio save"
on public.tamagon_saves
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Jogador apaga o próprio save"
on public.tamagon_saves
for delete
to authenticated
using ((select auth.uid()) = user_id);

commit;
