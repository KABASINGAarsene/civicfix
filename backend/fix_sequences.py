#!/usr/bin/env python3
"""
Fix PostgreSQL sequences after migration from SQLite
This ensures auto-increment IDs work properly
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

def fix_sequences():
    """Fix PostgreSQL sequences to match current data"""
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("DATABASE_URL not found in environment variables.")
        return
    
    try:
        engine = create_engine(database_url)
        
        print("Fixing PostgreSQL sequences...")
        
        with engine.connect() as conn:
            # Fix issues sequence
            print("Fixing issues sequence...")
            result = conn.execute(text("SELECT MAX(id) FROM issues"))
            max_issue_id = result.fetchone()[0] or 0
            conn.execute(text(f"SELECT setval('issues_id_seq', {max_issue_id + 1})"))
            print(f"  Set issues_id_seq to {max_issue_id + 1}")
            
            # Fix votes sequence
            print("Fixing votes sequence...")
            result = conn.execute(text("SELECT MAX(id) FROM votes"))
            max_vote_id = result.fetchone()[0] or 0
            conn.execute(text(f"SELECT setval('votes_id_seq', {max_vote_id + 1})"))
            print(f"  Set votes_id_seq to {max_vote_id + 1}")
            
            # Fix notifications sequence
            print("Fixing notifications sequence...")
            result = conn.execute(text("SELECT MAX(id) FROM notifications"))
            max_notification_id = result.fetchone()[0] or 0
            conn.execute(text(f"SELECT setval('notifications_id_seq', {max_notification_id + 1})"))
            print(f"  Set notifications_id_seq to {max_notification_id + 1}")
            
            # Fix admin_auth_codes sequence
            print("Fixing admin_auth_codes sequence...")
            result = conn.execute(text("SELECT MAX(id) FROM admin_auth_codes"))
            max_auth_code_id = result.fetchone()[0] or 0
            conn.execute(text(f"SELECT setval('admin_auth_codes_id_seq', {max_auth_code_id + 1})"))
            print(f"  Set admin_auth_codes_id_seq to {max_auth_code_id + 1}")
            
            conn.commit()
            
            print("\n" + "=" * 50)
            print("SEQUENCES FIXED SUCCESSFULLY!")
            print("Auto-increment IDs should now work properly.")
            
    except Exception as e:
        print(f"Error fixing sequences: {e}")

if __name__ == "__main__":
    print("PostgreSQL Sequence Fix")
    print("=" * 25)
    fix_sequences()
