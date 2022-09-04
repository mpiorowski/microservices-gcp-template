CREATE TABLE files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  created timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated timestamptz,
  "targetId" uuid NOT NULL,
  "filename" text NOT NULL,
  "type" text NOT NULL
);

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON files
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp ();

