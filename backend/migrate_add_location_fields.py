#!/usr/bin/env python3
"""
Database migration script to add administrative location fields to Issue model
Run this script to update your existing database with the new location fields.
"""

import sqlite3
import os
from datetime import datetime

def migrate_database():
    """Add administrative location fields to issues table"""
    
    # Database path
    db_path = 'instance/civicfix.db'
    
    if not os.path.exists(db_path):
        print("Database file not found. Please ensure the database exists.")
        return False
    
    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("Starting database migration...")
        
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(issues)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add province column if it doesn't exist
        if 'province' not in columns:
            cursor.execute("ALTER TABLE issues ADD COLUMN province VARCHAR(50)")
            print("+ Added 'province' column to issues table")
        else:
            print("+ 'province' column already exists")
        
        # Add district column if it doesn't exist
        if 'district' not in columns:
            cursor.execute("ALTER TABLE issues ADD COLUMN district VARCHAR(50)")
            print("+ Added 'district' column to issues table")
        else:
            print("+ 'district' column already exists")
        
        # Add sector column if it doesn't exist
        if 'sector' not in columns:
            cursor.execute("ALTER TABLE issues ADD COLUMN sector VARCHAR(50)")
            print("+ Added 'sector' column to issues table")
        else:
            print("+ 'sector' column already exists")
        
        # Commit changes
        conn.commit()
        print("+ Database migration completed successfully!")
        
        # Show updated table structure
        cursor.execute("PRAGMA table_info(issues)")
        columns = cursor.fetchall()
        print("\nUpdated issues table structure:")
        for column in columns:
            print(f"  - {column[1]} ({column[2]})")
        
        return True
        
    except sqlite3.Error as e:
        print(f"- Database error: {e}")
        return False
    
    except Exception as e:
        print(f"- Migration error: {e}")
        return False
    
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("CivicFix Database Migration")
    print("=" * 30)
    print("Adding administrative location fields to issues table...")
    print()
    
    success = migrate_database()
    
    if success:
        print("\n" + "=" * 50)
        print("MIGRATION COMPLETED SUCCESSFULLY!")
        print("Your database now supports administrative location filtering.")
        print("You can now restart your Flask application.")
    else:
        print("\n" + "=" * 50)
        print("MIGRATION FAILED!")
        print("Please check the error messages above and try again.")
