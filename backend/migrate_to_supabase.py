#!/usr/bin/env python3
"""
Migration script to move data from SQLite to Supabase PostgreSQL
"""

import sqlite3
import os
import json
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def migrate_data():
    """Migrate data from SQLite to Supabase"""
    
    # SQLite database path
    sqlite_path = 'instance/civicfix.db'
    
    if not os.path.exists(sqlite_path):
        print("SQLite database not found. Nothing to migrate.")
        return
    
    # Supabase configuration
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_KEY')
    
    if not supabase_url or not supabase_key:
        print("Supabase configuration not found in environment variables.")
        print("Please set SUPABASE_URL and SUPABASE_KEY in your .env file.")
        return
    
    try:
        # Connect to SQLite
        sqlite_conn = sqlite3.connect(sqlite_path)
        sqlite_conn.row_factory = sqlite3.Row  # Enable column access by name
        
        # Connect to Supabase
        supabase: Client = create_client(supabase_url, supabase_key)
        
        print("Starting data migration from SQLite to Supabase...")
        
        # Migrate users
        print("Migrating users...")
        cursor = sqlite_conn.cursor()
        cursor.execute("SELECT * FROM users")
        users = cursor.fetchall()
        
        for user in users:
            user_data = {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'is_admin': user['is_admin'],
                'province': user['province'],
                'district': user['district'],
                'sector': user['sector'],
                'phone': user['phone'],
                'is_district_admin': user['is_district_admin'],
                'created_at': user['created_at']
            }
            
            try:
                result = supabase.table('users').upsert(user_data).execute()
                print(f"  + Migrated user: {user['username']}")
            except Exception as e:
                print(f"  - Error migrating user {user['username']}: {e}")
        
        # Migrate issues
        print("Migrating issues...")
        cursor.execute("SELECT * FROM issues")
        issues = cursor.fetchall()
        
        for issue in issues:
            issue_data = {
                'id': issue['id'],
                'title': issue['title'],
                'description': issue['description'],
                'category': issue['category'],
                'status': issue['status'],
                'street_address': issue['street_address'],
                'landmark_reference': issue['landmark_reference'],
                'detailed_description': issue['detailed_description'],
                'province': issue.get('province'),  # New field, might not exist in old data
                'district': issue.get('district'),   # New field, might not exist in old data
                'sector': issue.get('sector'),       # New field, might not exist in old data
                'image_url': issue['image_url'],
                'created_at': issue['created_at'],
                'updated_at': issue['updated_at'],
                'user_id': issue['user_id']
            }
            
            try:
                result = supabase.table('issues').upsert(issue_data).execute()
                print(f"  + Migrated issue: {issue['title'][:50]}...")
            except Exception as e:
                print(f"  - Error migrating issue {issue['id']}: {e}")
        
        # Migrate votes
        print("Migrating votes...")
        cursor.execute("SELECT * FROM votes")
        votes = cursor.fetchall()
        
        for vote in votes:
            vote_data = {
                'id': vote['id'],
                'user_id': vote['user_id'],
                'issue_id': vote['issue_id'],
                'created_at': vote['created_at']
            }
            
            try:
                result = supabase.table('votes').upsert(vote_data).execute()
                print(f"  + Migrated vote: user {vote['user_id']} -> issue {vote['issue_id']}")
            except Exception as e:
                print(f"  - Error migrating vote {vote['id']}: {e}")
        
        # Migrate notifications (if table exists)
        try:
            cursor.execute("SELECT * FROM notifications")
            notifications = cursor.fetchall()
            
            print("Migrating notifications...")
            for notification in notifications:
                notification_data = {
                    'id': notification['id'],
                    'user_id': notification['user_id'],
                    'issue_id': notification['issue_id'],
                    'title': notification['title'],
                    'message': notification['message'],
                    'type': notification['type'],
                    'read': notification['read'],
                    'created_at': notification['created_at']
                }
                
                try:
                    result = supabase.table('notifications').upsert(notification_data).execute()
                    print(f"  + Migrated notification: {notification['title'][:30]}...")
                except Exception as e:
                    print(f"  - Error migrating notification {notification['id']}: {e}")
        except sqlite3.OperationalError:
            print("  No notifications table found, skipping...")
        
        # Migrate admin auth codes (if table exists)
        try:
            cursor.execute("SELECT * FROM admin_auth_codes")
            auth_codes = cursor.fetchall()
            
            print("Migrating admin auth codes...")
            for code in auth_codes:
                code_data = {
                    'id': code['id'],
                    'personal_email': code['personal_email'],
                    'official_email': code['official_email'],
                    'auth_code': code['auth_code'],
                    'province': code['province'],
                    'district': code['district'],
                    'is_active': code['is_active'],
                    'is_used': code['is_used'],
                    'expires_at': code['expires_at'],
                    'created_at': code['created_at'],
                    'created_by': code['created_by']
                }
                
                try:
                    result = supabase.table('admin_auth_codes').upsert(code_data).execute()
                    print(f"  + Migrated auth code: {code['auth_code']}")
                except Exception as e:
                    print(f"  - Error migrating auth code {code['id']}: {e}")
        except sqlite3.OperationalError:
            print("  No admin_auth_codes table found, skipping...")
        
        sqlite_conn.close()
        
        print("\n" + "=" * 50)
        print("MIGRATION COMPLETED!")
        print("Your data has been migrated to Supabase.")
        print("You can now update your .env file to use Supabase database.")
        
    except Exception as e:
        print(f"Migration error: {e}")

if __name__ == "__main__":
    print("CivicFix Data Migration to Supabase")
    print("=" * 40)
    migrate_data()
