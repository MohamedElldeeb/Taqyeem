-- Reference asset bucket (Phase 10): the V1 art-direction reference image.
-- Private — never a public application asset. Only service-role (Edge
-- Function) reads it; kept separate from merchant/customer-generated content.
insert into storage.buckets (id, name, public)
values ('reference-assets', 'reference-assets', false)
on conflict (id) do nothing;

-- Generated testimonial creative bucket (Phase 10): public, like `logos`,
-- so GeneratedTestimonialCard/<img> can load images directly.
-- Structure: generated-content/{merchant_id}/{review_id}.png
insert into storage.buckets (id, name, public)
values ('generated-content', 'generated-content', true)
on conflict (id) do nothing;

create policy "generated_content_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'generated-content');

-- No anon/authenticated write policy on either bucket: all writes to
-- reference-assets and generated-content happen via the service-role
-- Edge Function only.
