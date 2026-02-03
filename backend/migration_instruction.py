
import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Needs service role to alter table

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing Supabase URL or Service Role Key")
    exit(1)

def run_sql(sql_query):
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # Using the SQL endpoint if available, otherwise we rely on the user running it manually in dashboard
    # Supabase REST API does not support raw SQL execution directly on the public URL without an extension
    # But often python clients use the 'rpc' function if there's a stored procedure.
    # Since we can't be sure, I will print the instructions for the user.
    print("\n--- ACTION REQUIRED ---")
    print("Please run this SQL in your Supabase SQL Editor:")
    print(sql_query)
    print("-----------------------\n")

print("Generating SQL for migration...")
sql = """
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_provider TEXT; -- 'razorpay' or 'polar'
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT; -- 'active', 'cancelled', 'expired'
"""
run_sql(sql)
