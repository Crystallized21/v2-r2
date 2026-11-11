-- Rows only matter for the 15 minute lockout window, a day old is long past it.
-- Without this, every visitor who never got the password right leaves a row forever.
create extension if not exists pg_cron with schema pg_catalog;

-- scheduling the same name again just updates it, so this is safe to re-run
select cron.schedule(
  'clean-login-attempts',
  '0 4 * * *',
  $$delete from public.login_attempts where window_start < now() - interval '1 day'$$
);
