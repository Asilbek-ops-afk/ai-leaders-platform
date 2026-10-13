-- ============================================================================
--  AI LEADERS — Startup Club platformasi
--  Supabase (PostgreSQL) sxemasi — demadan real bazaga o'tish uchun
--  Ishlatish: Supabase -> SQL Editor -> shu faylni to'liq ishga tushiring
-- ============================================================================

-- 1) KENGAYTMALAR ------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- 2) ENUM tiplar -------------------------------------------------------------
do $$ begin
  create type user_role     as enum ('admin','mentor','student');
  create type lesson_type   as enum ('video','text','practice');
  create type sub_status    as enum ('wait','in_review','accepted','revise','late');
  create type group_role    as enum ('founder','builder','designer','growth','member');
exception when duplicate_object then null; end $$;

-- 3) JADVALLAR ---------------------------------------------------------------
-- 3.1 Profillar (auth.users bilan bog'lanadi)
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  telegram    text,
  phone       text,
  role        user_role not null default 'student',
  goal        text,
  bio         text,
  avatar_seed text,
  created_at  timestamptz not null default now()
);

-- 3.2 O'quv dasturi
create table if not exists modules (
  id          uuid primary key default uuid_generate_v4(),
  position    int  not null unique,
  title       text not null,
  description text,
  icon        text default 'spark',
  created_at  timestamptz not null default now()
);

create table if not exists lessons (
  id          uuid primary key default uuid_generate_v4(),
  module_id   uuid not null references modules(id) on delete cascade,
  title       text not null,
  type        lesson_type not null default 'video',
  duration    int  not null default 12 check (duration between 3 and 180),
  brief       text,
  link        text,
  lesson_date date not null default current_date,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists lessons_module_idx on lessons(module_id, position);

-- 3.3 Jamoalar va a'zolik
create table if not exists groups (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  project    text,
  mentor_id  uuid references profiles(id) on delete set null,
  xp         int  not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists group_members (
  group_id  uuid not null references groups(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  role      group_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (group_id, student_id)
);

-- 3.4 Vazifalar va topshiriqlar
create table if not exists tasks (
  id        uuid primary key default uuid_generate_v4(),
  module_id uuid not null references modules(id) on delete cascade,
  title     text not null,
  brief     text,
  deadline  date not null,
  max_score int  not null default 100,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- jamoaga xos deadline (umumiydan farqli bo'lsa)
create table if not exists task_deadline_overrides (
  task_id  uuid not null references tasks(id) on delete cascade,
  group_id uuid not null references groups(id) on delete cascade,
  deadline date not null,
  primary key (task_id, group_id)
);

create table if not exists submissions (
  id         uuid primary key default uuid_generate_v4(),
  task_id    uuid not null references tasks(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  link       text not null,
  note       text,
  file_name  text,                       -- Supabase Storage'dagi fayl nomi
  status     sub_status not null default 'in_review',
  score      int check (score between 0 and 100),
  feedback   text,
  reviewed_by uuid references profiles(id) on delete set null,
  submitted_at timestamptz not null default now(),
  reviewed_at  timestamptz,
  unique (task_id, student_id)
);
create index if not exists submissions_status_idx on submissions(status);

-- 3.5 Dars tugatish (progress)
create table if not exists lesson_progress (
  student_id uuid not null references profiles(id) on delete cascade,
  lesson_id  uuid not null references lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (student_id, lesson_id)
);

-- 3.6 Gamification
create table if not exists daily_quests (
  id         uuid primary key default uuid_generate_v4(),
  code       text not null unique,
  title      text not null,
  subtitle   text,
  xp         int not null default 20
);

create table if not exists quest_completion (
  student_id uuid not null references profiles(id) on delete cascade,
  quest_id   uuid not null references daily_quests(id) on delete cascade,
  done_on    date not null default current_date,
  primary key (student_id, quest_id, done_on)
);

create table if not exists badges (
  id    uuid primary key default uuid_generate_v4(),
  code  text not null unique,
  title text not null,
  description text,
  icon  text
);

create table if not exists student_badges (
  student_id uuid not null references profiles(id) on delete cascade,
  badge_id   uuid not null references badges(id) on delete cascade,
  earned_at  timestamptz not null default now(),
  primary key (student_id, badge_id)
);

create table if not exists xp_events (
  id         uuid primary key default uuid_generate_v4(),
  student_id uuid not null references profiles(id) on delete cascade,
  amount     int not null,
  reason     text,
  created_at timestamptz not null default now()
);

-- 3.7 Ijtimoiy qism
create table if not exists friendships (
  requester uuid not null references profiles(id) on delete cascade,
  addressee uuid not null references profiles(id) on delete cascade,
  status    text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz not null default now(),
  primary key (requester, addressee)
);

create table if not exists group_wall (
  id         uuid primary key default uuid_generate_v4(),
  group_id   uuid not null references groups(id) on delete cascade,
  author_id  uuid not null references profiles(id) on delete cascade,
  text       text not null,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references profiles(id) on delete cascade,
  title      text not null,
  body       text,
  icon       text default 'bell',
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notif_user_idx on notifications(user_id, is_read);

create table if not exists gallery (
  id         uuid primary key default uuid_generate_v4(),
  title      text not null,
  description text,
  link       text,
  owner_id   uuid references profiles(id) on delete set null,
  group_id   uuid references groups(id) on delete set null,
  color      text default 'g1',
  is_featured boolean default true,
  created_at timestamptz not null default now()
);

-- 3.8 Sozlamalar
create table if not exists user_settings (
  user_id       uuid primary key references profiles(id) on delete cascade,
  notifications boolean not null default true,
  weekly_report boolean not null default true,
  public_profile boolean not null default true,
  friend_board  boolean not null default false
);

-- 4) KO'RINISHLAR (statistika) ----------------------------------------------
create or replace view v_student_stats as
select p.id, p.full_name,
       coalesce(sum(x.amount), 0)                                   as total_xp,
       count(distinct lp.lesson_id)                                 as lessons_done,
       count(distinct case when s.status in ('accepted','late') then s.id end) as tasks_done,
       round(avg(s.score) filter (where s.score is not null), 1)    as avg_score,
       max(lp.completed_at)::date                                   as last_lesson
from profiles p
left join xp_events       x  on x.student_id = p.id
left join lesson_progress lp on lp.student_id = p.id
left join submissions     s  on s.student_id = p.id
where p.role = 'student'
group by p.id, p.full_name;

create or replace view v_group_leaderboard as
select g.id, g.name, g.project, g.xp,
       count(gm.student_id) as members,
       rank() over (order by g.xp desc) as place
from groups g left join group_members gm on gm.group_id = g.id
group by g.id;

create or replace view v_late_submissions as
select s.id, p.full_name, t.title, t.deadline, s.status,
       greatest(0, current_date - t.deadline) as days_late
from submissions s
join profiles p on p.id = s.student_id
join tasks    t on t.id = s.task_id
where s.status in ('late','in_review') and t.deadline < current_date;

-- 5) XAVFSIZLIK (RLS) --------------------------------------------------------
alter table profiles        enable row level security;
alter table submissions     enable row level security;
alter table lesson_progress enable row level security;
alter table notifications   enable row level security;
alter table user_settings   enable row level security;
alter table group_wall      enable row level security;
alter table friendships     enable row level security;

-- Yordamchi: rol tekshirish
create or replace function is_staff() returns boolean language sql stable as $$
  select exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','mentor'));
$$;

-- Profil: o'zini va (reyting uchun) boshqalarning ochiq qismini ko'rish
drop policy if exists p_profiles_read on profiles;
create policy p_profiles_read on profiles for select using (true);
drop policy if exists p_profiles_write on profiles;
create policy p_profiles_write on profiles for update using (id = auth.uid() or is_staff());

-- Topshiriqlar: talaba faqat o'zinikini ko'radi, mentor/admin hammasini
drop policy if exists p_sub_read on submissions;
create policy p_sub_read on submissions for select using (student_id = auth.uid() or is_staff());
drop policy if exists p_sub_insert on submissions;
create policy p_sub_insert on submissions for insert with check (student_id = auth.uid());
drop policy if exists p_sub_update on submissions;
create policy p_sub_update on submissions for update using (is_staff());

-- Progress: faqat o'zi (yoki staff ko'radi)
drop policy if exists p_lp_read on lesson_progress;
create policy p_lp_read on lesson_progress for select using (student_id = auth.uid() or is_staff());
drop policy if exists p_lp_write on lesson_progress;
create policy p_lp_write on lesson_progress for all using (student_id = auth.uid());

-- Bildirishnomalar: faqat o'ziniki
drop policy if exists p_notif on notifications;
create policy p_notif on notifications for all using (user_id = auth.uid() or is_staff());

-- Sozlamalar: faqat o'ziniki
drop policy if exists p_set on user_settings;
create policy p_set on user_settings for all using (user_id = auth.uid());

-- Jamoa devori: jamoa a'zolari yozadi va o'qiydi
drop policy if exists p_wall_read on group_wall;
create policy p_wall_read on group_wall for select using (
  is_staff() or author_id = auth.uid()
  or exists (select 1 from group_members gm where gm.group_id = group_wall.group_id and gm.student_id = auth.uid())
);
drop policy if exists p_wall_write on group_wall;
create policy p_wall_write on group_wall for insert with check (
  author_id = auth.uid() and exists (select 1 from group_members gm where gm.group_id = group_wall.group_id and gm.student_id = auth.uid())
);

-- Do'stlik: faqat ishtirokchilar
drop policy if exists p_fr on friendships;
create policy p_fr on friendships for all using (requester = auth.uid() or addressee = auth.uid());

-- 6) FUNKSIYALAR -------------------------------------------------------------
-- Dars tugatilganda XP yozish
create or replace function fn_complete_lesson(p_lesson uuid) returns void
language plpgsql security definer as $$
declare v_module uuid;
begin
  insert into lesson_progress(student_id, lesson_id) values (auth.uid(), p_lesson)
  on conflict do nothing;

  insert into xp_events(student_id, amount, reason)
  values (auth.uid(), 20, 'Dars tugatildi: ' || p_lesson);

  -- modul to'liq tugatildimi? -> sertifikat bildirishnomasi
  select l.module_id into v_module from lessons l where l.id = p_lesson;
  if not exists (
    select 1 from lessons l
    where l.module_id = v_module
      and not exists (select 1 from lesson_progress lp where lp.lesson_id = l.id and lp.student_id = auth.uid())
  ) then
    insert into notifications(user_id, title, body, icon)
    values (auth.uid(), 'Modul tugatildi 🎓', 'Sertifikat ochildi — Ma’lumot bo‘limida ko‘ring.', 'cert');
  end if;
end $$;

-- Modul ochilganmi? (oldingi modul vazifasi qabul qilinishi shart)
create or replace function fn_module_unlocked(p_module uuid) returns boolean
language sql stable as $$
  select coalesce((
    select bool_and(exists (
      select 1 from submissions s join tasks t on t.id = s.task_id
      where t.module_id = m.id and s.student_id = auth.uid() and s.status in ('accepted','late')
    ))
    from modules m where m.position < (select position from modules where id = p_module)
  ), true);
$$;

-- 7) STORAGE ---------------------------------------------------------------
-- Supabase -> Storage -> "submissions" bucket (public yoki private) yarating,
-- keyin quyidagi siyosatlarni qo'llang:
-- insert into storage.buckets (id, name, public) values ('submissions','submissions', false)
--   on conflict do nothing;
-- create policy "talaba o'z faylini yuklaydi" on storage.objects for insert
--   with check (bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text);
-- create policy "mentor hammasini ko'radi" on storage.objects for select
--   using (bucket_id = 'submissions' and is_staff());

-- 8) DEMO MA'LUMOT (ixtiyoriy) ---------------------------------------------
insert into modules(position, title, description, icon) values
 (1,'AI asoslari va ChatGPT/Claude','Neyron tarmoq nima, AI bilan birinchi suhbat.','ai'),
 (2,'Prompt yozish san’ati','Rol, kontekst, format. Few-shot va zanjirli fikrlash.','chat'),
 (3,'Vibe coding: g''oya → sayt','Next.js + Supabase + Vercel.','bolt'),
 (4,'Claude Code, GitHub, deploy','Terminal, Claude Code, GitHub, Vercel.','terminal'),
 (5,'Birinchi mini-loyiha','Muammo → yechim, MVP, demo video.','rocket'),
 (6,'Jamoaviy startap va Demo Day','Jamoa rollari, pitch, Demo Day.','flag')
on conflict (position) do nothing;

insert into badges(code, title, description, icon) values
 ('first_step','Birinchi qadam','Birinchi darsni tugatdingiz','flag'),
 ('prompt_master','Prompt ustasi','2-modulni to‘liq tugatdingiz','chat'),
 ('builder','Builder','3 ta vazifa qabul qilindi','cube'),
 ('streak7','7 kun streak','Bir hafta uzluksiz o‘qish','flame'),
 ('team_player','Jamoa a’zosi','Jamoa loyihasiga hissa qo‘shdingiz','users'),
 ('deployer','Deploy qilgan','Loyihani internetga chiqardingiz','rocket'),
 ('mentor_friend','Mentor do‘sti','3 kishiga yordam berdingiz','heart'),
 ('demo_star','Demo Day yulduzi','Demo Day’da qatnashdingiz','trophy')
on conflict (code) do nothing;

insert into daily_quests(code, title, subtitle, xp) values
 ('lesson','Bugungi darsni tugatish','10–15 daqiqalik bitta dars',30),
 ('help','Jamoa yoki do‘stga yordam','Devorga yozing yoki savolga javob bering',20),
 ('build','Vazifa ustida 20 daqiqa','Loyihangizni bir qadam oldinga suring',25)
on conflict (code) do nothing;
