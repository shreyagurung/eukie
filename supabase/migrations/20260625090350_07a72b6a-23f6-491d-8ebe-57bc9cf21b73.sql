
alter function public.handle_new_user() set search_path = public;
alter function public.touch_updated_at() set search_path = public;
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.has_role(uuid, public.app_role) from anon, public;
-- has_role is needed by RLS policies (run as the querying role) AND by app code (authenticated)
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;
