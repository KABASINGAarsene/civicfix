"""
Seed script to populate the database with sample data for testing
"""
import os
from datetime import datetime, timedelta
from app import create_app
from models import db, User, Issue, Vote, Notification

def create_sample_data():
    """Create sample users and issues for testing"""
    
    # Sample users (these would normally be created through Supabase Auth)
    users_data = [
        {
            'id': 'user1-uuid-here',
            'username': 'john_citizen',
            'email': 'john@example.com',
            'is_admin': False
        },
        {
            'id': 'user2-uuid-here', 
            'username': 'jane_reporter',
            'email': 'jane@example.com',
            'is_admin': False
        },
        {
            'id': 'admin1-uuid-here',
            'username': 'admin_user',
            'email': 'admin@cityworks.gov',
            'is_admin': True
        }
    ]
    
    # Create users
    for user_data in users_data:
        existing_user = User.query.filter_by(id=user_data['id']).first()
        if not existing_user:
            user = User(**user_data)
            db.session.add(user)
            print(f"Created user: {user.username}")
    
    db.session.commit()
    
    # Sample issues
    issues_data = [
        {
            'title': 'Large pothole on Main Street',
            'description': 'There is a significant pothole near the intersection that is causing damage to vehicles. It has been growing larger over the past few weeks and needs immediate attention.',
            'category': 'Roads',
            'status': 'Open',
            'street_address': '123 Main Street',
            'landmark_reference': 'Near City Hall',
            'detailed_description': 'About 20 meters north of the traffic light, right in front of the blue building with white trim',
            'user_id': 'user1-uuid-here'
        },
        {
            'title': 'Broken streetlight on Oak Avenue',
            'description': 'The streetlight has been out for over a week, making the area unsafe for pedestrians at night.',
            'category': 'Lighting',
            'status': 'In Progress',
            'street_address': '456 Oak Avenue',
            'landmark_reference': 'Near Elementary School',
            'detailed_description': 'The third streetlight from the school entrance, next to the bus stop',
            'user_id': 'user2-uuid-here'
        },
        {
            'title': 'Clogged storm drain causing flooding',
            'description': 'The storm drain is completely blocked and water pools here during any rain, making the street impassable.',
            'category': 'Water',
            'status': 'Open',
            'street_address': '789 Elm Street',
            'landmark_reference': 'Near Shopping Center',
            'detailed_description': 'In front of the grocery store parking lot entrance, about 50 meters from the main road',
            'user_id': 'user1-uuid-here'
        },
        {
            'title': 'Broken playground equipment',
            'description': 'The swing set has a broken chain and the slide has a crack. Children safety is at risk.',
            'category': 'Parks',
            'status': 'Resolved',
            'street_address': 'Central Park',
            'landmark_reference': 'Near Park',
            'detailed_description': 'In the main playground area, near the basketball courts',
            'user_id': 'user2-uuid-here'
        },
        {
            'title': 'Overflowing garbage bins',
            'description': 'The public garbage bins have been overflowing for several days, attracting pests and creating unsanitary conditions.',
            'category': 'Waste',
            'status': 'Open',
            'street_address': 'Downtown Plaza',
            'landmark_reference': 'Near Bus Stop',
            'detailed_description': 'The three bins located near the main bus terminal entrance',
            'user_id': 'user1-uuid-here'
        }
    ]
    
    # Create issues
    for i, issue_data in enumerate(issues_data):
        existing_issue = Issue.query.filter_by(title=issue_data['title']).first()
        if not existing_issue:
            # Vary the creation dates
            created_at = datetime.utcnow() - timedelta(days=i*2, hours=i*3)
            issue = Issue(**issue_data, created_at=created_at)
            db.session.add(issue)
            print(f"Created issue: {issue.title}")
    
    db.session.commit()
    
    # Create some sample votes
    issues = Issue.query.all()
    users = User.query.filter_by(is_admin=False).all()
    
    for issue in issues[:3]:  # Add votes to first 3 issues
        for user in users:
            existing_vote = Vote.query.filter_by(user_id=user.id, issue_id=issue.id).first()
            if not existing_vote:
                vote = Vote(user_id=user.id, issue_id=issue.id)
                db.session.add(vote)
                print(f"Added vote: {user.username} -> Issue #{issue.id}")
    
    db.session.commit()
    
    # Create sample notifications
    resolved_issue = Issue.query.filter_by(status='Resolved').first()
    if resolved_issue:
        existing_notification = Notification.query.filter_by(
            user_id=resolved_issue.user_id, 
            issue_id=resolved_issue.id
        ).first()
        
        if not existing_notification:
            notification = Notification(
                user_id=resolved_issue.user_id,
                message=f"Your issue '{resolved_issue.title}' has been resolved!",
                issue_id=resolved_issue.id
            )
            db.session.add(notification)
            print(f"Created notification for resolved issue")
    
    db.session.commit()
    print("\nSample data created successfully!")
    print("\nSample users:")
    print("- john_citizen (regular user)")
    print("- jane_reporter (regular user)")  
    print("- admin_user (administrator)")
    print("\nNote: You'll need to create these users in Supabase Auth with the same email addresses to test authentication.")

def clear_data():
    """Clear all data from the database"""
    print("Clearing existing data...")
    Notification.query.delete()
    Vote.query.delete()
    Issue.query.delete()
    User.query.delete()
    db.session.commit()
    print("Data cleared!")

if __name__ == '__main__':
    app = create_app()
    
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
        
        # Ask user what they want to do
        print("CivicFix Database Seeding Script")
        print("1. Create sample data")
        print("2. Clear all data")
        print("3. Clear and recreate sample data")
        
        choice = input("Enter your choice (1-3): ").strip()
        
        if choice == '1':
            create_sample_data()
        elif choice == '2':
            clear_data()
        elif choice == '3':
            clear_data()
            create_sample_data()
        else:
            print("Invalid choice. Exiting...")
