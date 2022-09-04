CREATE TABLE tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  created timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated timestamptz,
  code text NOT NULL,
  email text NOT NULL,
  type text NOT NULL,
  expires timestamptz NOT NULL
);

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON tokens
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp ();

