-- 이벤트 신청 내역 테이블
create table if not exists event_registrations (
  id              uuid primary key default gen_random_uuid(),
  event_id        text not null,                     -- 이벤트 slug
  event_title     text not null,
  event_date      text not null,
  event_location  text not null,
  user_id         uuid references auth.users(id),
  name            text not null,
  email           text not null,
  phone           text not null,
  attendees       integer not null default 1 check (attendees >= 1 and attendees <= 10),
  total_amount    integer not null default 0,        -- 결제 금액 (원), 무료=0
  payment_status  text not null default 'pending'
                    check (payment_status in ('pending', 'paid', 'free', 'cancelled')),
  payment_key     text,                              -- 토스페이먼츠 paymentKey
  order_id        text unique,                       -- 토스페이먼츠 orderId
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists event_registrations_event_id_idx on event_registrations (event_id);
create index if not exists event_registrations_user_id_idx  on event_registrations (user_id);
create index if not exists event_registrations_email_idx    on event_registrations (email);
create index if not exists event_registrations_order_id_idx on event_registrations (order_id);
