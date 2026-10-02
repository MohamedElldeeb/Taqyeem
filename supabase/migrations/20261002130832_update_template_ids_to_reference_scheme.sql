-- The template registry moved from hand-approximated short ids (neon,
-- luxury, ...) to the authoritative reference scheme matching the real
-- template files (01-neon-editorial, 02-luxury-editorial, ...) rendered
-- via headless Chromium. Migrate existing rows and the check constraint
-- to the new ids.
alter table public.merchants drop constraint merchants_default_template_id_check;

update public.merchants set default_template_id = case default_template_id
  when 'neon' then '01-neon-editorial'
  when 'luxury' then '02-luxury-editorial'
  when 'minimal' then '03-minimal-modern'
  when 'organic' then '04-warm-organic'
  when 'bold' then '05-bold-contemporary'
  when 'magazine' then '06-magazine-editorial'
  when 'soft' then '07-soft-premium'
  when 'brutalist' then '08-brutalist-modern'
  else default_template_id
end;

alter table public.merchants alter column default_template_id set default '01-neon-editorial';

alter table public.merchants
  add constraint merchants_default_template_id_check
  check (default_template_id in (
    '01-neon-editorial','02-luxury-editorial','03-minimal-modern','04-warm-organic',
    '05-bold-contemporary','06-magazine-editorial','07-soft-premium','08-brutalist-modern'
  ));
