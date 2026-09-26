create extension if not exists pg_net;

-- Fires the n8n generation workflow automatically whenever a new review is
-- inserted (the public submission path from CustomerReviewPage). Fire-and-
-- forget via pg_net's async HTTP queue — the frontend never needs to know
-- n8n exists, and a slow/unavailable n8n instance never blocks or fails
-- the customer's review submission itself.
create or replace function public.trigger_generate_testimonial()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform net.http_post(
    url := 'https://mohamedeldeeb.nexology.cloud/webhook/taqyeem-generate-testimonial',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object('review_id', new.id)
  );
  return new;
end;
$$;

create trigger reviews_trigger_generation
  after insert on public.reviews
  for each row
  execute function public.trigger_generate_testimonial();

-- Trigger functions never need direct client invocation.
revoke all on function public.trigger_generate_testimonial() from public, anon, authenticated;
