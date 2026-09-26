drop policy "merchants_select_own" on public.merchants;
drop policy "merchants_insert_own" on public.merchants;
drop policy "merchants_update_own" on public.merchants;

create policy "merchants_select_own"
  on public.merchants for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "merchants_insert_own"
  on public.merchants for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "merchants_update_own"
  on public.merchants for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
