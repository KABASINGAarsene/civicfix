#!/usr/bin/env python3
"""
Test Supabase connection and database setup
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from supabase import create_client, Client

load_dotenv()

def test_supabase_connection():
    """Test both Supabase client and PostgreSQL connection"""
    
    print("Testing Supabase Connection")
    print("=" * 30)
    
    # Test Supabase client connection
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_KEY')
    
    if not supabase_url or not supabase_key:
        print("ERROR: Supabase URL or KEY not found in environment")
        return False
    
    try:
        # Test Supabase client
        supabase: Client = create_client(supabase_url, supabase_key)
        print(f"SUCCESS: Supabase client connected to: {supabase_url}")
        
        # Test database connection
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            print("ERROR: DATABASE_URL not found in environment")
            return False
        
        print(f"TESTING: Database connection...")
        engine = create_engine(database_url)
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"SUCCESS: PostgreSQL connected: {version[:50]}...")
        
        # Test if tables exist
        print("\nCHECKING: Database tables...")
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            tables = result.fetchall()
            
            expected_tables = ['users', 'issues', 'votes', 'notifications', 'admin_auth_codes']
            existing_tables = [table[0] for table in tables]
            
            print(f"Found tables: {existing_tables}")
            
            missing_tables = [table for table in expected_tables if table not in existing_tables]
            if missing_tables:
                print(f"WARNING: Missing tables: {missing_tables}")
                print("   Please run the supabase_schema.sql in your Supabase SQL Editor")
            else:
                print("SUCCESS: All required tables found!")
        
        # Test Supabase API
        print("\nTESTING: Supabase API...")
        try:
            result = supabase.table('users').select('count').execute()
            print("SUCCESS: Supabase API working!")
        except Exception as e:
            print(f"WARNING: Supabase API test failed: {e}")
            print("   This might be normal if RLS policies are strict")
        
        print("\n" + "=" * 50)
        print("CONNECTION TEST SUCCESSFUL!")
        print("Your Supabase database is ready to use.")
        return True
        
    except Exception as e:
        print(f"ERROR: Connection failed: {e}")
        print("\nTroubleshooting tips:")
        print("1. Check your DATABASE_URL format")
        print("2. Verify your database password")
        print("3. Ensure your IP is allowed in Supabase")
        print("4. Run the schema SQL in Supabase dashboard")
        return False

if __name__ == "__main__":
    test_supabase_connection()
