CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  created timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated timestamptz,
  active boolean DEFAULT TRUE,
  email text UNIQUE NOT NULL,
  role text NOT NULL,
  "lastLogin" timestamptz
);

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp ();

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  created timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated timestamptz,
  expires timestamptz NOT NULL,
  "userId" uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  role text NOT NULL
);

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp ();

