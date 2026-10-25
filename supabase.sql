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

-- ประวัติการวิเคราะห์การซ้อม
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.workouts enable row level security;
drop policy if exists "workouts_select_own" on public.workouts;
drop policy if exists "workouts_insert_own" on public.workouts;
drop policy if exists "workouts_update_own" on public.workouts;
drop policy if exists "workouts_delete_own" on public.workouts;
create policy "workouts_select_own" on public.workouts for select using (auth.uid() = user_id);
create policy "workouts_insert_own" on public.workouts for insert with check (auth.uid() = user_id);
create policy "workouts_update_own" on public.workouts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workouts_delete_own" on public.workouts for delete using (auth.uid() = user_id);

-- ไฟล์ GPX/TCX ต้นฉบับสำหรับเปิดเซสชันที่บันทึกไว้จากอุปกรณ์อื่น
create table if not exists public.workout_files (
  workout_id uuid primary key references public.workouts(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  file_name text not null,
  source_text text not null,
  created_at timestamptz not null default now()
);
alter table public.workout_files enable row level security;
drop policy if exists "workout_files_select_own" on public.workout_files;
drop policy if exists "workout_files_insert_own" on public.workout_files;
drop policy if exists "workout_files_update_own" on public.workout_files;
drop policy if exists "workout_files_delete_own" on public.workout_files;
create policy "workout_files_select_own" on public.workout_files for select using (auth.uid() = user_id);
create policy "workout_files_insert_own" on public.workout_files for insert with check (
  auth.uid() = user_id and exists (
    select 1 from public.workouts where workouts.id = workout_files.workout_id and workouts.user_id = auth.uid()
  )
);
create policy "workout_files_update_own" on public.workout_files for update using (auth.uid() = user_id) with check (
  auth.uid() = user_id and exists (
    select 1 from public.workouts where workouts.id = workout_files.workout_id and workouts.user_id = auth.uid()
  )
);
create policy "workout_files_delete_own" on public.workout_files for delete using (auth.uid() = user_id);
