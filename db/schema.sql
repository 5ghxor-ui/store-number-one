-- =====================================================================
-- 스토어 넘버원 — Supabase 데이터베이스 스키마 (초안)
-- 독립 프로젝트 (스테이크피디아 / 하이퍼KR 과 완전히 별개)
-- Supabase 대시보드 → SQL Editor 에 붙여넣어 실행하세요.
-- 결제 기능 없음: 주문은 "요청(request)" 으로만 기록됩니다.
-- =====================================================================

-- ── 확장 ──────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── 사용자 프로필 (auth.users 확장) ──────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

-- 관리자 여부 헬퍼
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

-- 가입 시 프로필 자동 생성
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', new.email))
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── 카테고리 ─────────────────────────────────────────────────────
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  en text,
  slug text unique,
  sort int default 0,
  created_at timestamptz not null default now()
);

-- ── 상품 ────────────────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  en text,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  price int,                       -- 정가 (null = 가격 문의)
  sale_price int,                  -- 할인 판매가 (nullable)
  stock int not null default 0,
  status text not null default 'on_sale'
    check (status in ('on_sale','sold_out','hidden','discontinued')),
  main_image text,
  spec text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  sort int default 0
);

-- ── 장바구니 ─────────────────────────────────────────────────────
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  qty int not null default 1 check (qty > 0),
  unique (cart_id, product_id)
);

-- ── 주문 요청 (결제 없음) ────────────────────────────────────────
create table if not exists public.order_requests (
  id uuid primary key default gen_random_uuid(),
  code text unique,                          -- 표시용 요청번호 R2026-0001
  user_id uuid references auth.users(id) on delete set null,
  orderer_name text not null,
  contact text not null,
  email text,
  delivery text not null,                    -- 배송지 또는 수령 방법
  request_note text,                         -- 사용자 요청사항
  status text not null default 'received'
    check (status in ('received','confirmed','contacted','preparing','delivered','cancelled')),
  estimated_total int default 0,
  has_ask_price boolean default false,
  admin_memo text,                           -- 내부 메모 (사용자 비공개)
  stock_deducted boolean not null default false,  -- 재고 중복 차감 방지
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 주문 상품 (요청 당시 값 스냅샷 — 이후 상품 수정과 무관)
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.order_requests(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name_snapshot text not null,
  en_snapshot text,
  price_snapshot int,                        -- null = 가격 문의
  qty int not null check (qty > 0)
);

-- 상태 변경 이력
create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.order_requests(id) on delete cascade,
  status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now()
);

-- 운영 설정 (예: 재고 차감 시점)
create table if not exists public.app_settings (
  key text primary key,
  value text
);
insert into public.app_settings (key, value)
values ('stock_deduct_on', 'confirmed')     -- 'request' | 'confirmed'
on conflict (key) do nothing;

-- =====================================================================
-- 보안 (Row Level Security) — 반드시 서버에서 권한 검증
-- =====================================================================
alter table public.profiles            enable row level security;
alter table public.categories          enable row level security;
alter table public.products            enable row level security;
alter table public.product_images      enable row level security;
alter table public.carts               enable row level security;
alter table public.cart_items          enable row level security;
alter table public.order_requests      enable row level security;
alter table public.order_items         enable row level security;
alter table public.order_status_history enable row level security;
alter table public.app_settings        enable row level security;

-- 프로필: 본인만 조회/수정, 관리자는 전체 조회
create policy profiles_self_read on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profiles_self_update on public.profiles for update using (id = auth.uid());

-- 상품/카테고리/이미지: 누구나 읽기, 쓰기는 관리자만
create policy cat_read on public.categories for select using (true);
create policy cat_admin on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy prod_read on public.products for select using (true);
create policy prod_admin on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy img_read on public.product_images for select using (true);
create policy img_admin on public.product_images for all using (public.is_admin()) with check (public.is_admin());

-- 장바구니: 본인 것만
create policy cart_own on public.carts for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy cartitem_own on public.cart_items for all
  using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));

-- 주문 요청: 본인 것만 조회/생성, 관리자는 전체 조회/수정
create policy order_read on public.order_requests for select
  using (user_id = auth.uid() or public.is_admin());
create policy order_insert on public.order_requests for insert
  with check (user_id = auth.uid());
create policy order_admin_update on public.order_requests for update
  using (public.is_admin()) with check (public.is_admin());

create policy oitem_read on public.order_items for select
  using (exists (select 1 from public.order_requests o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
create policy oitem_insert on public.order_items for insert
  with check (exists (select 1 from public.order_requests o where o.id = order_id and o.user_id = auth.uid()));

create policy hist_read on public.order_status_history for select
  using (exists (select 1 from public.order_requests o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
create policy hist_admin on public.order_status_history for insert with check (public.is_admin());

-- 설정: 읽기 전체, 쓰기 관리자
create policy settings_read on public.app_settings for select using (true);
create policy settings_admin on public.app_settings for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- 관리자 지정 (프로젝트 생성 후, 본인 Google 로그인 1회 뒤 실행)
--   update public.profiles set role = 'admin' where email = '관리자@gmail.com';
-- =====================================================================
