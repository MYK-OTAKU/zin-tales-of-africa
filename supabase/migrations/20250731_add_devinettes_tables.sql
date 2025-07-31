-- Create the devinettes table
CREATE TABLE devinettes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    reponse TEXT NOT NULL,
    indice TEXT,
    categorie TEXT,
    difficulte TEXT NOT NULL,
    points INTEGER NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    explication TEXT
);

-- Create the user_devinette_progress table
CREATE TABLE user_devinette_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    score INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    badges TEXT[] DEFAULT '{}',
    completed_devinettes UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add a unique constraint to ensure one progress record per user
ALTER TABLE user_devinette_progress
ADD CONSTRAINT user_devinette_progress_user_id_key UNIQUE (user_id);
