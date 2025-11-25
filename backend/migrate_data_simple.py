#!/usr/bin/env python3
"""
Simple data migration script from SQLite to Supabase
This script temporarily disables RLS for migration
"""

import sqlite3
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

def migrate_data_simple():
    """Migrate data using direct PostgreSQL connection"""
    
    # SQLite database path
    sqlite_path = 'instance/civicfix.db'
    
    if not os.path.exists(sqlite_path):
        print("SQLite database not found. Nothing to migrate.")
        return
    
    # PostgreSQL connection
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("DATABASE_URL not found in environment variables.")
        return
    
    try:
        # Connect to SQLite
        sqlite_conn = sqlite3.connect(sqlite_path)
        sqlite_conn.row_factory = sqlite3.Row
        
        # Connect to PostgreSQL
        pg_engine = create_engine(database_url)
        
        print("Starting data migration from SQLite to Supabase...")
        
        with pg_engine.connect() as pg_conn:
            # Temporarily disable RLS
            print("Temporarily disabling RLS...")
            pg_conn.execute(text("SET row_security = off;"))
            pg_conn.commit()
            
            # Migrate users
            print("Migrating users...")
            cursor = sqlite_conn.cursor()
            cursor.execute("SELECT * FROM users")
            users = cursor.fetchall()
            
            for user in users:
                try:
                    pg_conn.execute(text("""
                        INSERT INTO users (id, username, email, is_admin, province, district, sector, phone, is_district_admin, created_at)
                        VALUES (:id, :username, :email, :is_admin, :province, :district, :sector, :phone, :is_district_admin, :created_at)
                        ON CONFLICT (id) DO UPDATE SET
                            username = EXCLUDED.username,
                            email = EXCLUDED.email,
                            is_admin = EXCLUDED.is_admin,
                            province = EXCLUDED.province,
                            district = EXCLUDED.district,
                            sector = EXCLUDED.sector,
                            phone = EXCLUDED.phone,
                            is_district_admin = EXCLUDED.is_district_admin
                    """), {
                        'id': user['id'],
                        'username': user['username'],
                        'email': user['email'],
                        'is_admin': bool(user['is_admin']),
                        'province': user['province'],
                        'district': user['district'],
                        'sector': user['sector'],
                        'phone': user['phone'],
                        'is_district_admin': bool(user['is_district_admin']),
                        'created_at': user['created_at']
                    })
                    print(f"  + Migrated user: {user['username']}")
                except Exception as e:
                    print(f"  - Error migrating user {user['username']}: {e}")
            
            # Migrate issues
            print("Migrating issues...")
            cursor.execute("SELECT * FROM issues")
            issues = cursor.fetchall()
            
            for issue in issues:
                try:
                    # Handle new columns that might not exist in old SQLite
                    province = issue['province'] if 'province' in issue.keys() else None
                    district = issue['district'] if 'district' in issue.keys() else None
                    sector = issue['sector'] if 'sector' in issue.keys() else None
                    
                    pg_conn.execute(text("""
                        INSERT INTO issues (id, title, description, category, status, street_address, 
                                          landmark_reference, detailed_description, province, district, sector,
                                          image_url, created_at, updated_at, user_id)
                        VALUES (:id, :title, :description, :category, :status, :street_address,
                               :landmark_reference, :detailed_description, :province, :district, :sector,
                               :image_url, :created_at, :updated_at, :user_id)
                        ON CONFLICT (id) DO UPDATE SET
                            title = EXCLUDED.title,
                            description = EXCLUDED.description,
                            category = EXCLUDED.category,
                            status = EXCLUDED.status,
                            street_address = EXCLUDED.street_address,
                            landmark_reference = EXCLUDED.landmark_reference,
                            detailed_description = EXCLUDED.detailed_description,
                            province = EXCLUDED.province,
                            district = EXCLUDED.district,
                            sector = EXCLUDED.sector,
                            image_url = EXCLUDED.image_url,
                            updated_at = EXCLUDED.updated_at
                    """), {
                        'id': issue['id'],
                        'title': issue['title'],
                        'description': issue['description'],
                        'category': issue['category'],
                        'status': issue['status'],
                        'street_address': issue['street_address'],
                        'landmark_reference': issue['landmark_reference'],
                        'detailed_description': issue['detailed_description'],
                        'province': province,
                        'district': district,
                        'sector': sector,
                        'image_url': issue['image_url'],
                        'created_at': issue['created_at'],
                        'updated_at': issue['updated_at'],
                        'user_id': issue['user_id']
                    })
                    print(f"  + Migrated issue: {issue['title'][:50]}...")
                except Exception as e:
                    print(f"  - Error migrating issue {issue['id']}: {e}")
            
            # Migrate votes
            print("Migrating votes...")
            cursor.execute("SELECT * FROM votes")
            votes = cursor.fetchall()
            
            for vote in votes:
                try:
                    pg_conn.execute(text("""
                        INSERT INTO votes (id, user_id, issue_id, created_at)
                        VALUES (:id, :user_id, :issue_id, :created_at)
                        ON CONFLICT (id) DO NOTHING
                    """), {
                        'id': vote['id'],
                        'user_id': vote['user_id'],
                        'issue_id': vote['issue_id'],
                        'created_at': vote['created_at']
                    })
                    print(f"  + Migrated vote: user {vote['user_id']} -> issue {vote['issue_id']}")
                except Exception as e:
                    print(f"  - Error migrating vote {vote['id']}: {e}")
            
            # Re-enable RLS
            print("Re-enabling RLS...")
            pg_conn.execute(text("SET row_security = on;"))
            pg_conn.commit()
        
        sqlite_conn.close()
        
        print("\n" + "=" * 50)
        print("MIGRATION COMPLETED!")
        print("Your data has been migrated to Supabase.")
        
    except Exception as e:
        print(f"Migration error: {e}")

if __name__ == "__main__":
    print("CivicFix Data Migration to Supabase")
    print("=" * 40)
    migrate_data_simple()
