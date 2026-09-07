-- Extensions
create extension if not exists pgcrypto;

-- Enum-like check constraints are used instead of native enums for easier evolution.

create table if not exists public.pricing_rules (
  id uuid primary key default gen_random_uuid(),
  service_type text not null unique check (service_type in (
    'transfert_aeroport', 'transfert_gare', 'professionnel', 'prive', 'mise_a_disposition', 'evenement'
  )),
  label text not null,
  base_price numeric(10,2) not null default 0,
  price_per_hour numeric(10,2),
  price_per_km numeric(10,2),
  description text,
  updated_at timestamptz not null default now()
);

create table if not exists public.blocked_slots (
  id uuid primary key default gen_random_uuid(),
  start_at timestamptz not null,
  end_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  constraint blocked_slots_range check (end_at > start_at)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'refused', 'completed', 'cancelled')),
  service_type text not null check (service_type in (
    'transfert_aeroport', 'transfert_gare', 'professionnel', 'prive', 'mise_a_disposition', 'evenement'
  )),
  trip_type text not null check (trip_type in ('aller_simple', 'aller_retour', 'mise_a_disposition')),
  pickup_address text not null,
  dropoff_address text not null,
  stops jsonb not null default '[]'::jsonb,
  date date not null,
  time time not null,
  return_date date,
  return_time time,
  duration_hours numeric(6,2),
  passengers int not null default 1 check (passengers between 1 and 50),
  luggage int not null default 0 check (luggage >= 0),
  child_seat boolean not null default false,
  special_request text,
  comment text,
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  estimated_price numeric(10,2),
  final_price numeric(10,2),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid', 'deposit_paid', 'paid')),
  admin_notes text
);

create index if not exists bookings_date_idx on public.bookings (date);
create index if not exists bookings_status_idx on public.bookings (status);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'refused', 'completed', 'cancelled')),
  service_type text check (service_type in (
    'transfert_aeroport', 'transfert_gare', 'professionnel', 'prive', 'mise_a_disposition', 'evenement'
  )),
  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,
  preferred_date date,
  preferred_time time,
  request_details text not null,
  admin_notes text
);

create index if not exists quote_requests_status_idx on public.quote_requests (status);

-- Row level security
alter table public.pricing_rules enable row level security;
alter table public.blocked_slots enable row level security;
alter table public.bookings enable row level security;
alter table public.quote_requests enable row level security;

-- pricing_rules: readable by everyone (needed for public price estimates), writable by authenticated admin only
create policy "pricing_rules_select_public" on public.pricing_rules
  for select using (true);
create policy "pricing_rules_write_admin" on public.pricing_rules
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- blocked_slots: readable by everyone (needed to disable unavailable dates), writable by authenticated admin only
create policy "blocked_slots_select_public" on public.blocked_slots
  for select using (true);
create policy "blocked_slots_write_admin" on public.blocked_slots
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- bookings: anyone can create a request, only authenticated admin can read/update/delete
create policy "bookings_insert_public" on public.bookings
  for insert with check (true);
create policy "bookings_select_admin" on public.bookings
  for select using (auth.role() = 'authenticated');
create policy "bookings_update_admin" on public.bookings
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "bookings_delete_admin" on public.bookings
  for delete using (auth.role() = 'authenticated');

-- quote_requests: anyone can create a request, only authenticated admin can read/update/delete
create policy "quote_requests_insert_public" on public.quote_requests
  for insert with check (true);
create policy "quote_requests_select_admin" on public.quote_requests
  for select using (auth.role() = 'authenticated');
create policy "quote_requests_update_admin" on public.quote_requests
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "quote_requests_delete_admin" on public.quote_requests
  for delete using (auth.role() = 'authenticated');

-- Default pricing (editable afterwards from the admin dashboard)
insert into public.pricing_rules (service_type, label, base_price, price_per_hour, price_per_km, description)
values
  ('transfert_aeroport', 'Transfert aéroport', 65, null, 1.9, 'Prise en charge à l''aéroport ou dépose, bagages inclus.'),
  ('transfert_gare', 'Transfert gare', 45, null, 1.9, 'Prise en charge à la gare ou dépose.'),
  ('professionnel', 'Déplacement professionnel', 55, null, 1.9, 'Trajet ponctuel pour un rendez-vous professionnel.'),
  ('prive', 'Trajet privé', 50, null, 1.9, 'Trajet privé pour un déplacement personnel.'),
  ('mise_a_disposition', 'Mise à disposition', 90, 45, null, 'Chauffeur réservé à l''heure, minimum 2 heures.'),
  ('evenement', 'Événement & occasion spéciale', 120, 55, null, 'Mariages, soirées, événements professionnels.')
on conflict (service_type) do nothing;
