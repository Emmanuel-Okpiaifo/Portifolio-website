-- Run this once in the Supabase SQL editor.
-- Then turn off public sign-ups: Authentication → Sign In / Providers → disable "Allow new users to sign up".
-- Create one account for yourself under Authentication → Users.

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(first_name) between 1 and 40),
  last_name text not null check (char_length(last_name) between 1 and 40),
  message text not null check (char_length(message) between 1 and 600),
  photo_path text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create or replace function public.force_pending_testimonial()
returns trigger
language plpgsql
as $$
begin
  if auth.role() = 'anon' then
    new.status := 'pending';
  end if;
  return new;
end;
$$;

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
with check (status = 'pending');

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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'testimonial-photos',
  'testimonial-photos',
  true,
  1048576,
  array['image/jpeg']
)
on conflict (id) do update
set public = true,
    file_size_limit = 1048576,
    allowed_mime_types = array['image/jpeg'];

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
create policy "Anyone can view testimonial photos"
on storage.objects
for select
to public
using (bucket_id = 'testimonial-photos');

drop policy if exists "Signed-in owner can delete testimonial photos" on storage.objects;
create policy "Signed-in owner can delete testimonial photos"
on storage.objects
for delete
to authenticated
using (bucket_id = 'testimonial-photos');
