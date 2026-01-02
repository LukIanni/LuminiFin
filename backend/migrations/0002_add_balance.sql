CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT,
  balance NUMERIC(10, 2) NOT NULL DEFAULT '0',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE expenses 
  ALTER COLUMN amount TYPE NUMERIC(10, 2) USING amount::NUMERIC(10, 2),
  ALTER COLUMN category TYPE VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);
