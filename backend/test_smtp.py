#!/usr/bin/env python3
"""
Test SMTP connection and authentication
"""

import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

def test_smtp():
    """Test SMTP connection with current credentials"""
    
    smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_username = os.environ.get('SMTP_USERNAME')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    from_email = os.environ.get('FROM_EMAIL', smtp_username)
    
    # Strip spaces from password
    if smtp_password:
        smtp_password = smtp_password.replace(' ', '')
    
    print("="*60)
    print("SMTP CONNECTION TEST")
    print("="*60)
    print(f"Server: {smtp_server}")
    print(f"Port: {smtp_port}")
    print(f"Username: {smtp_username}")
    print(f"Password length: {len(smtp_password) if smtp_password else 0} characters")
    print(f"From Email: {from_email}")
    print("="*60)
    
    if not smtp_username or not smtp_password:
        print("ERROR: SMTP_USERNAME or SMTP_PASSWORD not set in .env file")
        return False
    
    try:
        print("\n1. Connecting to SMTP server...")
        server = smtplib.SMTP(smtp_server, smtp_port)
        print("   ✓ Connected")
        
        print("\n2. Starting TLS...")
        server.starttls()
        print("   ✓ TLS started")
        
        print("\n3. Attempting to login...")
        server.login(smtp_username, smtp_password)
        print("   ✓ LOGIN SUCCESSFUL!")
        
        print("\n4. Sending test email...")
        test_email = smtp_username  # Send to yourself
        msg = MIMEText("This is a test email from CivicFix SMTP test.")
        msg['Subject'] = "CivicFix SMTP Test"
        msg['From'] = from_email
        msg['To'] = test_email
        
        server.sendmail(from_email, test_email, msg.as_string())
        print(f"   ✓ Test email sent to {test_email}")
        
        server.quit()
        
        print("\n" + "="*60)
        print("SUCCESS! SMTP is working correctly.")
        print("="*60)
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"\n   ✗ AUTHENTICATION FAILED")
        print(f"\n   Error: {e}")
        print("\n" + "="*60)
        print("TROUBLESHOOTING:")
        print("="*60)
        print("1. Verify 2-Factor Authentication is enabled:")
        print("   https://myaccount.google.com/security")
        print("\n2. Generate a NEW App Password:")
        print("   https://myaccount.google.com/apppasswords")
        print("   - Select 'Mail' as the app")
        print("   - Select 'Other (Custom name)' as device")
        print("   - Name it 'CivicFix'")
        print("   - Copy the 16-character password")
        print("\n3. Update your .env file:")
        print("   SMTP_PASSWORD=your_new_16_char_password")
        print("\n4. Make sure you're using the App Password, NOT your regular password")
        print("="*60)
        return False
        
    except Exception as e:
        print(f"\n   ✗ ERROR: {e}")
        print("\n" + "="*60)
        print("CONNECTION ERROR")
        print("="*60)
        print("Check your internet connection and SMTP settings.")
        print("="*60)
        return False

if __name__ == "__main__":
    test_smtp()

