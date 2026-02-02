-- Create emails table for email gate captures
CREATE TABLE IF NOT EXISTS emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL DEFAULT 'chat_gate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_emails_email ON emails(email);

-- Create index on created_at for analytics
CREATE INDEX IF NOT EXISTS idx_emails_created_at ON emails(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Policy: Allow insert for authenticated and anon users
CREATE POLICY "Allow insert for all users" ON emails
    FOR INSERT
    WITH CHECK (true);

-- Policy: Only service role can read
CREATE POLICY "Only service role can read" ON emails
    FOR SELECT
    USING (auth.role() = 'service_role');
