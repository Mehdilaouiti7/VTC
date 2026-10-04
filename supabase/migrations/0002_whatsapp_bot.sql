create table if not exists public.whatsapp_sessions (
  phone text primary key,
  step text not null default 'start',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.whatsapp_sessions enable row level security;

-- Only ever touched server-side by the webhook route (Meta calls it directly,
-- never exposed to browser JS), so a permissive policy is fine — same
-- reasoning as bookings_insert_public for the public booking form.
create policy "whatsapp_sessions_all_server" on public.whatsapp_sessions
  for all using (true) with check (true);
