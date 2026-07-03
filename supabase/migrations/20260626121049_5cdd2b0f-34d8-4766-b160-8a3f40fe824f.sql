
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

-- public tables
DROP POLICY IF EXISTS "posts admin read all" ON public.posts;
DROP POLICY IF EXISTS "posts admin write" ON public.posts;
CREATE POLICY "posts admin read all" ON public.posts FOR SELECT USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "posts admin write" ON public.posts FOR ALL USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "topics admin write" ON public.topics;
CREATE POLICY "topics admin write" ON public.topics FOR ALL USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "tags admin write" ON public.tags;
CREATE POLICY "tags admin write" ON public.tags FOR ALL USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "places admin write" ON public.places;
CREATE POLICY "places admin write" ON public.places FOR ALL USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins read all roles" ON public.user_roles;
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT USING (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admins read all profiles" ON public.profiles;
CREATE POLICY "admins read all profiles" ON public.profiles FOR SELECT USING (private.has_role(auth.uid(), 'admin'));

-- storage policies
DROP POLICY IF EXISTS "media admin insert" ON storage.objects;
DROP POLICY IF EXISTS "media admin update" ON storage.objects;
DROP POLICY IF EXISTS "media admin delete" ON storage.objects;
CREATE POLICY "media admin insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "media admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND private.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'media' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "media admin delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND private.has_role(auth.uid(), 'admin'));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
