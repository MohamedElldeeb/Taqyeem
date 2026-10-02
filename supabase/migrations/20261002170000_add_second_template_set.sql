-- Adds a second set of 12 reference templates (glass-orbs, soft-clay, ...),
-- which now list first in the merchant-facing picker, ahead of the original
-- 8. Existing merchants keep whichever template they already picked -- this
-- only widens the allowed set and changes the default for merchants who
-- never explicitly chose one.
alter table public.merchants drop constraint merchants_default_template_id_check;

alter table public.merchants alter column default_template_id set default '01-glass-orbs';

alter table public.merchants
  add constraint merchants_default_template_id_check
  check (default_template_id in (
    '01-glass-orbs','02-soft-clay','03-tilted-stack','04-extruded-type',
    '05-floating-note','06-neumorphic','07-liquid-chrome','08-ticket-stub',
    '09-inflated-bubble','10-paper-depth','11-spotlight-podium','12-horizon-grid',
    '01-neon-editorial','02-luxury-editorial','03-minimal-modern','04-warm-organic',
    '05-bold-contemporary','06-magazine-editorial','07-soft-premium','08-brutalist-modern'
  ));
