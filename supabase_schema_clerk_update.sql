-- Add user_id column to users table to store Clerk ID
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_id TEXT UNIQUE;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);

-- Update constraint to allow user_id as a valid identifier
ALTER TABLE users DROP CONSTRAINT IF EXISTS user_identifier_check;
ALTER TABLE users ADD CONSTRAINT user_identifier_check 
    CHECK (ip_address IS NOT NULL OR email IS NOT NULL OR user_id IS NOT NULL);
