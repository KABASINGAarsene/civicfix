// API configuration
const API_BASE_URL = 'http://localhost:5000';

// Supabase configuration - You'll need to replace these with your actual values
const SUPABASE_URL = 'https://ozaaasesvvjphzohfxoo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96YWFhc2VzdnZqcGh6b2hmeG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMzMyODUsImV4cCI6MjA3NTcwOTI4NX0._GuX8DO9nFk1nP_EQAm3kFmzi6rQVUOCIGwtd6ERNcI';

// Initialize Supabase client
let supabase;

// Load Supabase from CDN
function loadSupabase() {
    return new Promise((resolve, reject) => {
        if (window.supabase) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Authentication manager
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.initialized = false;
        this.tabId = Date.now() + Math.random(); // Unique tab identifier
        this.init();
    }

    async init() {
        try {
            await loadSupabase();
            await this.checkAuthState();
            this.updateUI();
            this.setupStorageListener();
        } catch (error) {
            console.error('Auth initialization error:', error);
        } finally {
            this.initialized = true;
        }
    }

    async checkAuthState() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                this.currentUser = session.user;
                this.token = session.access_token;
                localStorage.setItem('supabase_token', this.token);
                
                // If user is confirmed in Supabase, mark as verified in our backend
                if (session.user.email_confirmed_at) {
                    console.log('[checkAuthState] User email confirmed in Supabase, marking as verified in backend');
                    try {
                        const response = await fetch(`${API_BASE_URL}/api/auth/mark-verified`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                email: session.user.email
                            })
                        });
                        
                        if (response.ok) {
                            console.log('[checkAuthState] Email marked as verified in backend');
                        } else {
                            console.warn('[checkAuthState] Failed to mark email as verified:', response.status);
                        }
                    } catch (error) {
                        console.error('[checkAuthState] Error marking email as verified:', error);
                    }
                }
            } else {
                this.currentUser = null;
                this.token = null;
                localStorage.removeItem('supabase_token');
            }
        } catch (error) {
            console.error('Error checking auth state:', error);
        }
    }

    setupStorageListener() {
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'supabase_token') {
                console.log('Auth state changed in another tab');
                this.checkAuthState().then(() => {
                    this.updateUI();
                });
            }
        });
    }

    async signUp(email, password, username, userData = {}) {
        try {
            // First, register with Supabase but disable email confirmation
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: null, // Disable email confirmation
                    data: {
                        username: username,
                        phone: userData.phone || '',
                        province: userData.province || '',
                        district: userData.district || '',
                        sector: userData.sector || ''
                    }
                }
            });

            if (error) throw error;

            // Now send custom verification code via our backend
            const response = await fetch(`${API_BASE_URL}/api/auth/send-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    user_id: data.user.id,
                    phone: userData.phone || '',
                    province: userData.province || '',
                    district: userData.district || '',
                    sector: userData.sector || ''
                })
            });

            const result = await response.json();

            if (response.ok) {
                // Don't show notification here - let the caller handle it
                return { success: true, data, needsVerification: true };
            } else {
                showNotification(result.error || 'Error creating account.', 'error');
                return { success: false, error: result.error };
            }

        } catch (error) {
            console.error('Sign up error:', error);
            showNotification(error.message, 'error');
            return { success: false, error };
        }
    }

    async signIn(email, password) {
        try {
            // First check if user is verified in our backend
            const verifyResponse = await fetch(`${API_BASE_URL}/api/auth/check-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (verifyResponse.ok) {
                const verifyData = await verifyResponse.json();
                if (!verifyData.is_verified) {
                    showNotification('Please verify your email before logging in.', 'error');
                    return { success: false, error: 'Email not verified' };
                }
            }

            // Try Supabase login
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                // If Supabase says email not confirmed, but our backend says it is, 
                // we can proceed with a backend-only login
                if (error.message.includes('Email not confirmed') && verifyResponse.ok) {
                    const backendLogin = await fetch(`${API_BASE_URL}/api/auth/backend-login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });

                    if (backendLogin.ok) {
                        const loginData = await backendLogin.json();
                        this.currentUser = loginData.user;
                        this.token = loginData.token;
                        localStorage.setItem('supabase_token', this.token);
                        
                        showNotification('Login successful!', 'success');
                        this.updateUI();
                        return { success: true, user: loginData.user };
                    }
                }
                throw error;
            }

            this.currentUser = data.user;
            this.token = data.session.access_token;
            localStorage.setItem('supabase_token', this.token);
            
            showNotification('Login successful!', 'success');
            this.updateUI();
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Sign in error:', error);
            showNotification(error.message, 'error');
            return { success: false, error };
        }
    }

    async signOut() {
        try {
            // Always clear local auth data first
            this.currentUser = null;
            this.token = null;
            localStorage.removeItem('supabase_token');
            
            // Try to sign out from Supabase, but don't fail if it errors
            try {
                const { error } = await supabase.auth.signOut();
                if (error && !error.message.includes('session_not_found')) {
                    console.warn('Supabase signout warning:', error);
                }
            } catch (supabaseError) {
                console.log('Supabase signout error (continuing anyway):', supabaseError);
            }
            
            showNotification('Logged out successfully!', 'success');
            this.updateUI();
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);

        } catch (error) {
            console.error('Sign out error:', error);
            
            // Even if there's an error, still clear local data and redirect
            this.currentUser = null;
            this.token = null;
            localStorage.removeItem('supabase_token');
            
            showNotification('Logged out (with errors)', 'warning');
            this.updateUI();
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    // Force logout without any Supabase calls - for broken auth states
    forceLogout() {
        console.log('Force logout initiated');
        
        // Immediately clear all auth data
        this.currentUser = null;
        this.token = null;
        localStorage.removeItem('supabase_token');
        localStorage.clear(); // Clear all localStorage to be safe
        
        // Clear any session storage
        sessionStorage.clear();
        
        // Show notification
        showNotification('Logged out successfully!', 'success');
        
        // Update UI immediately
        this.updateUI();
        
        // Force redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }

    async resetPassword(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password.html'
            });

            if (error) throw error;

            showNotification('Password reset email sent! Check your inbox.', 'success');
            return { success: true };
        } catch (error) {
            console.error('Password reset error:', error);
            showNotification(error.message, 'error');
            return { success: false, error };
        }
    }

    updateUI() {
        const loginLink = document.getElementById('login-link');
        const registerLink = document.getElementById('register-link');
        const userInfo = document.getElementById('user-info');
        const username = document.getElementById('username');
        const logoutBtn = document.getElementById('logout-btn');
        const adminLink = document.getElementById('admin-link');

        if (this.currentUser) {
            // User is logged in
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            if (userInfo) userInfo.style.display = 'flex';
            if (username) {
                // Use the username from user metadata, fallback to email prefix if not available
                const displayName = this.currentUser.user_metadata?.username || this.currentUser.email.split('@')[0];
                username.textContent = displayName;
            }
            
            // Hide admin link for regular citizens
            if (adminLink) {
                adminLink.style.display = 'none';
            }
            
            if (logoutBtn) {
                logoutBtn.onclick = () => this.forceLogout();
            }
        } else {
            // User is not logged in - hide admin link since role selection handles this
            if (loginLink) loginLink.style.display = 'inline';
            if (registerLink) registerLink.style.display = 'inline';
            if (userInfo) userInfo.style.display = 'none';
            if (adminLink) {
                adminLink.style.display = 'none';
            }
        }
    }

    getAuthHeaders() {
        if (this.token) {
            return {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            };
        }
        return {
            'Content-Type': 'application/json'
        };
    }

    getAuthHeadersForFormData() {
        if (this.token) {
            return {
                'Authorization': `Bearer ${this.token}`
                // Don't set Content-Type for FormData - browser will set it automatically
            };
        }
        return {};
    }

    isAuthenticated() {
        // Check if we have both user and token
        return !!(this.currentUser && this.token);
    }
}

// Initialize auth manager when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.authManager = new AuthManager();
    
    // Add global emergency logout function
    window.emergencyLogout = function() {
        console.log('Emergency logout called');
        if (window.authManager) {
            window.authManager.forceLogout();
        } else {
            // Fallback if authManager is not available
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = 'index.html';
        }
    };
});

// Utility function to show notifications
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 5000);
}

// Quick notification for instant feedback (shorter duration)
function showQuickNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 50);

    // Hide after 1.5 seconds (much faster)
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.style.display = 'none';
        }, 200);
    }, 1500);
}

// Listen for auth state changes
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        if (supabase) {
            supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN') {
                    authManager.currentUser = session.user;
                    authManager.token = session.access_token;
                    localStorage.setItem('supabase_token', authManager.token);
                    authManager.updateUI();
                } else if (event === 'SIGNED_OUT') {
                    authManager.currentUser = null;
                    authManager.token = null;
                    localStorage.removeItem('supabase_token');
                    authManager.updateUI();
                }
            });
        }
    });
}
