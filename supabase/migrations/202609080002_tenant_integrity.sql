-- Harden the initial schema without rewriting the applied migration.
drop policy if exists dealership_insert on dealerships;
revoke insert on dealerships from authenticated;
alter table vehicles add constraint vehicles_tenant_id_unique unique(dealership_id,id);
alter table leads add constraint leads_tenant_id_unique unique(dealership_id,id);
alter table conversations add constraint conversations_tenant_id_unique unique(dealership_id,id);
alter table generated_contents add constraint contents_tenant_id_unique unique(dealership_id,id);
alter table campaigns add constraint campaigns_tenant_id_unique unique(dealership_id,id);
alter table vehicle_media drop constraint vehicle_media_vehicle_id_fkey, add constraint vehicle_media_tenant_vehicle_fkey foreign key(dealership_id,vehicle_id) references vehicles(dealership_id,id) on delete cascade;
alter table lead_vehicle_interests drop constraint lead_vehicle_interests_lead_id_fkey, drop constraint lead_vehicle_interests_vehicle_id_fkey, add constraint interests_tenant_lead_fkey foreign key(dealership_id,lead_id) references leads(dealership_id,id) on delete cascade, add constraint interests_tenant_vehicle_fkey foreign key(dealership_id,vehicle_id) references vehicles(dealership_id,id) on delete cascade;
alter table messages drop constraint messages_conversation_id_fkey, add constraint messages_tenant_conversation_fkey foreign key(dealership_id,conversation_id) references conversations(dealership_id,id) on delete cascade;
alter table lead_scores drop constraint lead_scores_lead_id_fkey, add constraint scores_tenant_lead_fkey foreign key(dealership_id,lead_id) references leads(dealership_id,id) on delete cascade;
create unique index vehicle_single_cover_idx on vehicle_media(vehicle_id) where is_cover;
create or replace function set_updated_at() returns trigger language plpgsql set search_path=public as $$ begin new.updated_at=now(); return new; end $$;
create trigger video_jobs_updated before update on video_jobs for each row execute function set_updated_at();
revoke all on function is_dealership_member(uuid) from public;
grant execute on function is_dealership_member(uuid) to authenticated;
