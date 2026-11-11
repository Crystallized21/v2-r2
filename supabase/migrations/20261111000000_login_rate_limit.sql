alter table public.login_attempts enable row level security;

create unique index if not exists login_attempts_album_ip_key
  on public.login_attempts (album_id, ip_hash);

-- one statement so parallel requests can't sneak past the limit
create or replace function public.register_login_attempt(
  p_album_id uuid,
  p_ip_hash text,
  p_window_minutes int
)
returns int
language sql
set search_path = ''
as $$
  insert into public.login_attempts (album_id, ip_hash, attempt_count, window_start)
  values (p_album_id, p_ip_hash, 1, now())
  on conflict (album_id, ip_hash) do update set
    attempt_count = case
      when public.login_attempts.window_start < now() - make_interval(mins => p_window_minutes) then 1
      else public.login_attempts.attempt_count + 1
    end,
    window_start = case
      when public.login_attempts.window_start < now() - make_interval(mins => p_window_minutes) then now()
      else public.login_attempts.window_start
    end
  returning attempt_count;
$$;

-- supabase lets anon call new functions by default
revoke execute on function public.register_login_attempt(uuid, text, int) from public, anon, authenticated;
grant execute on function public.register_login_attempt(uuid, text, int) to service_role;
