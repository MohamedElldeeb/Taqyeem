-- trigger_generate_testimonial() runs as SECURITY DEFINER (postgres) so it
-- can call pg_net.http_post regardless of caller. PostgreSQL grants EXECUTE
-- on newly created functions to PUBLIC by default, which would let anon/
-- authenticated callers invoke it directly (bypassing the review-insert
-- trigger path). Revoke that default so it can only run as a trigger.
revoke execute on function public.trigger_generate_testimonial() from public;
