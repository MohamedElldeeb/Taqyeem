-- Merchant's persistent testimonial template preference (Phase: reusable
-- static template system, replacing per-review AI visual generation).
-- Every new testimonial for this merchant uses this template until they
-- explicitly change it; existing generated_content rows are unaffected.
-- No RLS change needed — merchants_update_own already covers any column
-- on the merchant's own row, and this column is never exposed through
-- the public merchant lookup/testimonials RPCs.
alter table public.merchants
  add column default_template_id text not null default 'neon'
  check (default_template_id in ('neon','luxury','minimal','organic','bold','magazine','soft','brutalist'));
