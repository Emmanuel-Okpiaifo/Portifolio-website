-- Safe to run again in the Supabase SQL editor.
-- Then turn off public sign-ups: Authentication → Sign In / Providers → disable "Allow new users to sign up".
-- Create one account for yourself under Authentication → Users.
-- Older notes will have empty role, company, relationship, and consent until you fill or delete them. Do not mark those rows as consented from here.

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(first_name) between 1 and 40),
  last_name text not null check (char_length(last_name) between 1 and 40),
  message text not null check (char_length(message) between 1 and 600),
  photo_path text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  sort_order integer not null default 0,
  role text,
  company text,
  relationship text,
  linkedin_url text,
  email text,
  consent boolean,
  created_at timestamptz not null default now()
);

alter table public.testimonials add column if not exists sort_order integer not null default 0;
alter table public.testimonials add column if not exists role text;
alter table public.testimonials add column if not exists company text;
alter table public.testimonials add column if not exists relationship text;
alter table public.testimonials add column if not exists linkedin_url text;
alter table public.testimonials add column if not exists email text;
alter table public.testimonials add column if not exists consent boolean;
alter table public.testimonials alter column photo_path drop not null;

alter table public.testimonials drop constraint if exists testimonials_relationship_check;
alter table public.testimonials add constraint testimonials_relationship_check
  check (relationship is null or relationship in ('Colleague', 'Manager', 'Client', 'Mentee', 'Other'));

alter table public.testimonials drop constraint if exists testimonials_role_len;
alter table public.testimonials add constraint testimonials_role_len
  check (role is null or char_length(role) between 1 and 80);

alter table public.testimonials drop constraint if exists testimonials_company_len;
alter table public.testimonials add constraint testimonials_company_len
  check (company is null or char_length(company) between 1 and 80);

alter table public.testimonials enable row level security;

create or replace function public.force_pending_testimonial()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'anon' then
    new.status := 'pending';
  end if;
  if new.sort_order is null or new.sort_order = 0 then
    select coalesce(max(sort_order), 0) + 1 into new.sort_order from public.testimonials;
  end if;
  return new;
end;
$$;

with ranked as (
  select id, row_number() over (order by created_at) as position
  from public.testimonials
  where sort_order = 0
)
update public.testimonials as testimonials
set sort_order = ranked.position
from ranked
where testimonials.id = ranked.id;

drop trigger if exists testimonials_force_pending on public.testimonials;
create trigger testimonials_force_pending
before insert on public.testimonials
for each row
execute function public.force_pending_testimonial();

drop policy if exists "Anyone can submit a pending testimonial" on public.testimonials;
create policy "Anyone can submit a pending testimonial"
on public.testimonials
for insert
to anon, authenticated
with check (
  status = 'pending'
  and consent is true
  and char_length(role) between 1 and 80
  and char_length(company) between 1 and 80
  and relationship in ('Colleague', 'Manager', 'Client', 'Mentee', 'Other')
);

drop policy if exists "Anyone can read approved testimonials" on public.testimonials;
create policy "Anyone can read approved testimonials"
on public.testimonials
for select
to anon, authenticated
using (status = 'approved');

drop policy if exists "Signed-in owner can read every testimonial" on public.testimonials;
create policy "Signed-in owner can read every testimonial"
on public.testimonials
for select
to authenticated
using (true);

drop policy if exists "Signed-in owner can update testimonials" on public.testimonials;
create policy "Signed-in owner can update testimonials"
on public.testimonials
for update
to authenticated
using (true)
with check (status in ('pending', 'approved', 'hidden'));

drop policy if exists "Signed-in owner can delete testimonials" on public.testimonials;
create policy "Signed-in owner can delete testimonials"
on public.testimonials
for delete
to authenticated
using (true);

revoke all on table public.testimonials from anon;
grant insert (
  first_name, last_name, message, photo_path, status,
  role, company, relationship, linkedin_url, email, consent
) on table public.testimonials to anon;
grant select (
  id, first_name, last_name, message, photo_path, status, sort_order, created_at,
  role, company, relationship, linkedin_url, consent
) on table public.testimonials to anon;

revoke all on table public.testimonials from authenticated;
grant select, insert, update, delete on table public.testimonials to authenticated;

create or replace view public.testimonials_public
with (security_invoker = true) as
select
  id, first_name, last_name, message, photo_path, status, sort_order, created_at,
  role, company, relationship, linkedin_url
from public.testimonials
where status = 'approved';

grant select on public.testimonials_public to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'testimonial-photos',
  'testimonial-photos',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = true,
    file_size_limit = 2097152,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "Anyone can upload a testimonial photo" on storage.objects;
create policy "Anyone can upload a testimonial photo"
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'testimonial-photos'
  and (storage.foldername(name))[1] is null
);

drop policy if exists "Anyone can view testimonial photos" on storage.objects;

drop policy if exists "Signed-in owner can delete testimonial photos" on storage.objects;
create policy "Signed-in owner can delete testimonial photos"
on storage.objects
for delete
to authenticated
using (bucket_id = 'testimonial-photos');

-- After this runs, test as the anon key (not the service role):
-- 1. insert into testimonials (..., status) values (..., 'approved') must fail.
-- 2. update and delete on testimonials must fail.
-- 3. storage.from('testimonial-photos').list() must fail.
-- 4. A known public photo URL must still open in a browser.
