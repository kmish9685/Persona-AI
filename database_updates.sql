-- Database schema updates for new features
-- Run this on Supabase SQL editor

-- Add new columns to decisions table
ALTER TABLE decisions
ADD COLUMN IF NOT EXISTS values_profile JSONB,
ADD COLUMN IF NOT EXISTS values_defined_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS gut_reaction JSONB,
ADD COLUMN IF NOT EXISTS gut_vs_ai VARCHAR(50),
ADD COLUMN IF NOT EXISTS five_year_viz JSONB,
ADD COLUMN IF NOT EXISTS viz_clarity_achieved BOOLEAN;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_decisions_gut_vs_ai ON decisions(gut_vs_ai);
CREATE INDEX IF NOT EXISTS idx_decisions_viz_clarity ON decisions(viz_clarity_achieved);
