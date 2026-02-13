-- Create decisions table
create table decisions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- Links to Clerk user ID or mapped Supabase user
  title text not null,
  decision_type text not null,
  input_data jsonb not null, -- Stores constraints, options, etc.
  analysis_result jsonb, -- Stores the AI generated analysis
  status text default 'active', -- active, completed, killed
  conviction_score integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create checkpoints table (Kill Signals)
create table checkpoints (
  id uuid default gen_random_uuid() primary key,
  decision_id uuid references decisions(id) on delete cascade not null,
  checkpoint_date date not null,
  metric text not null, -- "Expected X"
  status text default 'pending', -- pending, passed, failed, warning
  actual_value text, -- User input for what actually happened
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table decisions enable row level security;
alter table checkpoints enable row level security;

-- Policies (Assuming user_id is the string identifier from Clerk/Auth)
-- Adjust based on your actual auth implementation. Using checking against auth.uid() if properly synced, 
-- or if you are storing the Clerk ID in a `users` table, you might need a join. 
-- For now, assuming you store the raw ID or email in user_id.
-- IF using Supabase Auth (which we are likely not fully, but using Clerk), we might need to be careful.
-- Let's make it permissible for now or assume the application handles the filtering if RLS is tricky with Clerk without custom claims.
-- BUT, best practice:
create policy "Users can view own decisions"
  on decisions for select
  using ( user_id = auth.uid()::text ); -- Verify if auth.uid() matches what you store

create policy "Users can insert own decisions"
  on decisions for insert
  with check ( user_id = auth.uid()::text );

create policy "Users can update own decisions"
  on decisions for update
  using ( user_id = auth.uid()::text );

-- Checkpoints polices (linked via decision)
create policy "Users can view own checkpoints"
  on checkpoints for select
  using ( exists (select 1 from decisions where id = checkpoints.decision_id and user_id = auth.uid()::text) );

create policy "Users can update own checkpoints"
  on checkpoints for update
  using ( exists (select 1 from decisions where id = checkpoints.decision_id and user_id = auth.uid()::text) );
