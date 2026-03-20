create policy "internal users can read festivals"
on public.festivals
for select
using (public.is_internal_user());

create policy "internal users can read editions"
on public.editions
for select
using (public.is_internal_user());
