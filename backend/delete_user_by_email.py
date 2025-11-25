#!/usr/bin/env python3
"""
Delete user by email
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

def delete_user_by_email(email):
    """Delete user and all related data by email"""
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("DATABASE_URL not found in environment variables.")
        return
    
    try:
        engine = create_engine(database_url)
        
        print(f"Deleting user with email: {email}")
        
        with engine.connect() as conn:
            # Delete in correct order (foreign key constraints)
            print("Deleting votes...")
            conn.execute(text("DELETE FROM votes WHERE user_id IN (SELECT id FROM users WHERE email = :email)"), {"email": email})
            
            print("Deleting notifications...")
            conn.execute(text("DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE email = :email)"), {"email": email})
            
            print("Deleting issues...")
            conn.execute(text("DELETE FROM issues WHERE user_id IN (SELECT id FROM users WHERE email = :email)"), {"email": email})
            
            print("Deleting user...")
            result = conn.execute(text("DELETE FROM users WHERE email = :email"), {"email": email})
            
            conn.commit()
            
            if result.rowcount > 0:
                print(f"Successfully deleted user with email: {email}")
                print(f"   Deleted {result.rowcount} user record(s)")
            else:
                print(f"No user found with email: {email}")
            
    except Exception as e:
        print(f"Error deleting user: {e}")

if __name__ == "__main__":
    # Delete the problematic email
    delete_user_by_email("kabasingajimmy@gmail.com")
