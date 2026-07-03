
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
create policy "media admin insert" on storage.objects for insert
  with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "media admin update" on storage.objects for update
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "media admin delete" on storage.objects for delete
  using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
