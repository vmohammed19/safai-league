/*
# Create wards and reports tables for Safai League

## Overview
This migration sets up the core data model for the Safai League cleanliness
competition app. It creates two tables — `wards` (the competing wards) and
`reports` (citizen-submitted garbage/dirtiness reports with photos) — plus a
trigger that automatically awards 10 points to a ward every time a new report
is filed against it. It also creates a public storage bucket for report photos.

## New Tables

### wards
- `id` (uuid, primary key)
- `name` (text, not null) — full ward name, e.g. "Ward 1 — Tallakulam"
- `short_name` (text, not null) — short label, e.g. "Ward 1"
- `points` (integer, not null, default 0) — league points accumulated from reports
- `created_at` (timestamptz, default now())

### reports
- `id` (uuid, primary key)
- `ward_id` (uuid, foreign key → wards.id, not null)
- `photo_url` (text, nullable) — URL to the uploaded photo in storage
- `note` (text, nullable) — optional user note about the issue
- `status` (text, not null, default 'open') — open | in-progress | resolved
- `created_at` (timestamptz, default now())

## Points Awarding
A trigger function `award_ward_points()` fires AFTER INSERT on `reports` and
increments the referenced ward's `points` column by 10. This guarantees points
are always awarded atomically at the database level, regardless of how the
insert happens.

## Seed Data
Inserts 10 sample Madurai wards with 0 starting points. These are the wards
shown in the ward dropdown on the Report page.

## Storage
Creates a public storage bucket `report-photos` for uploading citizen photos.

## Security
- RLS enabled on both `wards` and `reports`.
- This is a no-auth (single-tenant) app: policies use `TO anon, authenticated`
  with `USING (true)` / `WITH CHECK (true)` because the data is intentionally
  public/shared — anyone can file or view reports.
- CRUD grants on both tables to `anon` and `authenticated`.
- The trigger function is owned by the database and runs with elevated
  privileges; no EXECUTE grant is needed for it to fire on insert.

## Notes
1. The `award_ward_points` trigger is idempotent per-insert: each insert fires
   the trigger exactly once, adding 10 points.
2. `photo_url` is nullable so a report can still be submitted if the photo
   upload fails.
3. Ward points are the source of truth for the league standings.
*/

-- ── Wards table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE wards ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON wards TO anon, authenticated;

DROP POLICY IF EXISTS "wards_select_all" ON wards;
CREATE POLICY "wards_select_all" ON wards FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "wards_insert_all" ON wards;
CREATE POLICY "wards_insert_all" ON wards FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "wards_update_all" ON wards;
CREATE POLICY "wards_update_all" ON wards FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "wards_delete_all" ON wards;
CREATE POLICY "wards_delete_all" ON wards FOR DELETE
  TO anon, authenticated USING (true);

-- ── Reports table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ward_id uuid NOT NULL REFERENCES wards(id) ON DELETE CASCADE,
  photo_url text,
  note text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON reports TO anon, authenticated;

DROP POLICY IF EXISTS "reports_select_all" ON reports;
CREATE POLICY "reports_select_all" ON reports FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "reports_insert_all" ON reports;
CREATE POLICY "reports_insert_all" ON reports FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "reports_update_all" ON reports;
CREATE POLICY "reports_update_all" ON reports FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "reports_delete_all" ON reports;
CREATE POLICY "reports_delete_all" ON reports FOR DELETE
  TO anon, authenticated USING (true);

-- ── Points trigger ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION award_ward_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE wards
  SET points = points + 10
  WHERE id = NEW.ward_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_award_ward_points ON reports;
CREATE TRIGGER trg_award_ward_points
  AFTER INSERT ON reports
  FOR EACH ROW
  EXECUTE FUNCTION award_ward_points();

-- ── Index for ordering reports by recency ────────────────────
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports (created_at DESC);

-- ── Seed 10 Madurai wards ────────────────────────────────────
INSERT INTO wards (short_name, name)
VALUES
  ('Ward 1',  'Ward 1 — Tallakulam'),
  ('Ward 2',  'Ward 2 — Koodal'),
  ('Ward 3',  'Ward 3 — Arasaradi'),
  ('Ward 4',  'Ward 4 — Goripalayam'),
  ('Ward 5',  'Ward 5 — Sellur'),
  ('Ward 6',  'Ward 6 — Simmakkal'),
  ('Ward 7',  'Ward 7 — Anna Nagar'),
  ('Ward 8',  'Ward 8 — KK Nagar'),
  ('Ward 9',  'Ward 9 — Thiruparankundram'),
  ('Ward 10', 'Ward 10 — Avaniyapuram')
ON CONFLICT DO NOTHING;

-- ── Storage bucket for report photos ─────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-photos', 'report-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: allow anon + authenticated to upload and read photos
DROP POLICY IF EXISTS "photos_select_all" ON storage.objects;
CREATE POLICY "photos_select_all" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'report-photos');

DROP POLICY IF EXISTS "photos_insert_all" ON storage.objects;
CREATE POLICY "photos_insert_all" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'report-photos');

DROP POLICY IF EXISTS "photos_update_all" ON storage.objects;
CREATE POLICY "photos_update_all" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'report-photos') WITH CHECK (bucket_id = 'report-photos');

DROP POLICY IF EXISTS "photos_delete_all" ON storage.objects;
CREATE POLICY "photos_delete_all" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'report-photos');
