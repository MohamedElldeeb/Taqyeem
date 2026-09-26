-- The public review submission policy was scoped to `anon` only. A visitor
-- who happens to have an active authenticated session (most plausibly: a
-- merchant previewing their own /r/{slug} link while logged into their own
-- dashboard) is evaluated as `authenticated`, not `anon`, and had no insert
-- policy at all — so review submission silently 403'd for any logged-in
-- visitor. The fix widens the WHO (any visitor, matching actual product
-- intent: no account required, not "anon-only required") while keeping the
-- exact same restrictive WHAT (status must be 'submitted') unchanged.
drop policy "reviews_public_insert" on public.reviews;

create policy "reviews_public_insert"
  on public.reviews for insert
  to anon, authenticated
  with check (status = 'submitted');
