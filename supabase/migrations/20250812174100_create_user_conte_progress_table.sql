CREATE TABLE IF NOT EXISTS user_conte_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    conte_id UUID NOT NULL REFERENCES contes(id) ON DELETE CASCADE,
    derniere_page INTEGER NOT NULL DEFAULT 1,
    termine BOOLEAN NOT NULL DEFAULT FALSE,
    favori BOOLEAN NOT NULL DEFAULT FALSE,
    derniere_ecoute TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, conte_id)
);

-- RLS Policies
ALTER TABLE user_conte_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for authenticated users" ON user_conte_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow insert for authenticated users" ON user_conte_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow update for authenticated users" ON user_conte_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow delete for authenticated users" ON user_conte_progress
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Function to update `updated_at` timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update `updated_at` on row update
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON user_conte_progress
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
