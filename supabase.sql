-- รันทั้งไฟล์ใน Supabase > SQL Editor

create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.routes enable row level security;
create policy "routes_select_own" on public.routes for select using (auth.uid() = user_id);
create policy "routes_insert_own" on public.routes for insert with check (auth.uid() = user_id);
create policy "routes_update_own" on public.routes for update using (auth.uid() = user_id);
create policy "routes_delete_own" on public.routes for delete using (auth.uid() = user_id);

-- โทเคน Strava: เปิด RLS แต่ไม่ตั้ง policy เลย จึงมีแต่ฝั่งเซิร์ฟเวอร์ (service role) ที่อ่านเขียนได้
create table if not exists public.strava_tokens (
  user_id uuid primary key references auth.users(id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  expires_at bigint not null,
  athlete_id bigint
);
alter table public.strava_tokens enable row level security;
