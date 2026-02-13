-- Add subscription_end_date column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;

-- Optional: Index for performance if querying by date often
CREATE INDEX IF NOT EXISTS idx_users_subscription_end_date ON users(subscription_end_date);
