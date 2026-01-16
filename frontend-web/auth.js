// API configuration
const API_BASE_URL = 'https://civicfix-cwz8.onrender.com';
window.API_BASE_URL = API_BASE_URL; // Make available globally

// Supabase configuration - You'll need to replace these with your actual values
const SUPABASE_URL = 'https://ozaaasesvvjphzohfxoo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96YWFhc2VzdnZqcGh6b2hmeG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMzMyODUsImV4cCI6MjA3NTcwOTI4NX0._GuX8DO9nFk1nP_EQAm3kFmzi6rQVUOCIGwtd6ERNcI';

// Initialize Supabase client (using different name to avoid conflicts with library's global)
let supabaseClient = null;

// Load Supabase from CDN
function loadSupabase() {
    return new Promise((resolve, reject) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:13',message:'loadSupabase called',data:{supabaseClientExists:!!supabaseClient},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        // Check if Supabase client is already initialized
        if (supabaseClient) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:17',message:'supabaseClient already exists, resolving',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
            resolve();
            return;
        }
        
        // Check if the script is already being loaded
        const existingScript = document.querySelector('script[data-supabase-loader]');
        if (existingScript) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:22',message:'Script already loading, waiting',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
            // Wait for it to load
            const checkInterval = setInterval(() => {
                if (supabaseClient) {
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:27',message:'supabaseClient initialized from existing script',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                    // #endregion
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
            
            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                if (!supabaseClient) {
                    reject(new Error('Supabase failed to load'));
                }
            }, 10000);
            return;
        }
        
        // Load Supabase using UMD build from unpkg (more reliable)
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@supabase/supabase-js@2/dist/umd/index.min.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-supabase-loader', 'true');
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:43',message:'Creating script tag to load Supabase',data:{src:script.src},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        script.onload = () => {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:48',message:'Script onload fired',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
            try {
                // Wait a bit for the library to fully initialize
                setTimeout(() => {
                    // The UMD build from @supabase/supabase-js@2 exposes createClient
                    // Check multiple possible locations
                    let createClientFn = null;
                    
                    // #region agent log
                    const windowCheck = {
                        hasWindowSupabase: typeof window.supabase !== 'undefined',
                        windowSupabaseType: typeof window.supabase,
                        hasWindowSupabaseCreateClient: typeof window.supabase?.createClient,
                        hasWindowSupabase: typeof window.Supabase !== 'undefined',
                        hasWindowCreateClient: typeof window.createClient === 'function',
                        windowKeys: Object.keys(window).filter(k => k.toLowerCase().includes('supabase'))
                    };
                    fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:56',message:'Checking for createClient',data:windowCheck,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                    // #endregion
                    
                    if (window.supabase && typeof window.supabase.createClient === 'function') {
                        createClientFn = window.supabase.createClient;
                        // #region agent log
                        fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:57',message:'Found createClient in window.supabase',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                        // #endregion
                    } else if (window.Supabase && typeof window.Supabase.createClient === 'function') {
                        createClientFn = window.Supabase.createClient;
                        // #region agent log
                        fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:59',message:'Found createClient in window.Supabase',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                        // #endregion
                    } else if (typeof window.createClient === 'function') {
                        createClientFn = window.createClient;
                        // #region agent log
                        fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:61',message:'Found createClient in window.createClient',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                        // #endregion
                    } else {
                        // Last resort: check if the library exposed it differently
                        console.warn('Checking for Supabase exports...', {
                            hasWindowSupabase: typeof window.supabase !== 'undefined',
                            windowSupabaseType: typeof window.supabase,
                            hasWindowSupabaseCreateClient: typeof window.supabase?.createClient,
                            windowKeys: Object.keys(window).filter(k => k.toLowerCase().includes('supabase'))
                        });
                        // #region agent log
                        fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:64',message:'createClient not found in expected locations',data:windowCheck,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                        // #endregion
                    }
                    
                    if (createClientFn) {
                        // #region agent log
                        fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:73',message:'Calling createClient',data:{hasCreateClientFn:!!createClientFn},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                        // #endregion
                        try {
                            supabaseClient = createClientFn(SUPABASE_URL, SUPABASE_ANON_KEY);
                            // #region agent log
                            fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:74',message:'supabaseClient initialized successfully',data:{hasAuth:!!supabaseClient?.auth},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                            // #endregion
                            console.log('Supabase client initialized successfully');
                            resolve();
                        } catch (initError) {
                            // #region agent log
                            fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:74',message:'Error initializing supabaseClient',data:{error:initError.message,stack:initError.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                            // #endregion
                            reject(initError);
                        }
                    } else {
                        // Try one more time with a direct require-style access
                        try {
                            // Some UMD builds expose it as a global function
                            const supabaseLib = window.supabase || window.Supabase;
                            if (supabaseLib && supabaseLib.createClient) {
                                supabaseClient = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                                console.log('Supabase client initialized successfully (fallback)');
            resolve();
                            } else {
                                throw new Error('createClient not found');
                            }
                        } catch (fallbackError) {
                            console.error('Supabase library loaded but createClient is not available', {
                                error: fallbackError,
                                windowSupabase: typeof window.supabase,
                                windowSupabaseCreateClient: typeof window.supabase?.createClient,
                                windowSupabaseObj: window.Supabase,
                                windowCreateClient: typeof window.createClient
                            });
                            reject(new Error('Supabase library loaded but createClient is not available. Please refresh the page.'));
                        }
                    }
                }, 300);
            } catch (error) {
                console.error('Error initializing Supabase client:', error);
                reject(error);
            }
        };
        script.onerror = (error) => {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:105',message:'Script onerror fired - CDN load failed',data:{error:error?.message || 'Unknown error'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
            console.error('Failed to load Supabase library from CDN:', error);
            reject(new Error('Failed to load Supabase library from CDN. Please check your internet connection.'));
        };
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
            // Ensure Supabase is initialized
            if (!supabaseClient) {
                await loadSupabase();
            }
            
            if (!supabaseClient || !supabaseClient.auth) {
                console.warn('Supabase not available for auth state check');
                return;
            }
            
            const { data: { session } } = await supabaseClient.auth.getSession();
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
            // Ensure Supabase is initialized
            if (!supabaseClient) {
                console.log('Supabase not initialized, loading...');
                await loadSupabase();
            }
            
            if (!supabaseClient || !supabaseClient.auth) {
                const errorMsg = 'Authentication service is not available. Please refresh the page and try again.';
                console.error('Supabase not available:', supabaseClient);
                showNotification(errorMsg, 'error');
                return { success: false, error: errorMsg };
            }
            
            // First, register with Supabase with proper email confirmation redirect
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: `${API_BASE_URL}/login.html`, // Redirect to login after email confirmation
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
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:281',message:'signIn called',data:{hasSupabaseClient:!!supabaseClient,hasAuth:!!supabaseClient?.auth},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        try {
            // Ensure Supabase is initialized
            if (!supabaseClient) {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:284',message:'supabaseClient is null, calling loadSupabase',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                // #endregion
                console.log('Supabase not initialized, loading...');
                await loadSupabase();
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:287',message:'loadSupabase completed',data:{hasSupabaseClient:!!supabaseClient,hasAuth:!!supabaseClient?.auth},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                // #endregion
            }
            
            if (!supabaseClient || !supabaseClient.auth) {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:289',message:'supabaseClient or auth is missing after load',data:{hasSupabaseClient:!!supabaseClient,hasAuth:!!supabaseClient?.auth},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                // #endregion
                const errorMsg = 'Authentication service is not available. Please refresh the page and try again.';
                console.error('Supabase not available:', supabaseClient);
                showNotification(errorMsg, 'error');
                return { success: false, error: errorMsg };
            }

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
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:299',message:'Calling signInWithPassword',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/8aa8b071-71d5-477a-8bef-6a3f143aedad',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.js:302',message:'signInWithPassword response',data:{hasError:!!error,errorMessage:error?.message,hasData:!!data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion

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
                if (supabaseClient && supabaseClient.auth) {
                    const { error } = await supabaseClient.auth.signOut();
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
            // Ensure Supabase is initialized
            if (!supabaseClient) {
                await loadSupabase();
            }
            
            if (!supabaseClient || !supabaseClient.auth) {
                const errorMsg = 'Authentication service is not available. Please refresh the page and try again.';
                showNotification(errorMsg, 'error');
                return { success: false, error: errorMsg };
            }
            
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
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
    window.addEventListener('load', async () => {
        // Wait for Supabase to be initialized
        try {
            if (!supabaseClient) {
                await loadSupabase();
            }
            
            if (supabaseClient && supabaseClient.auth) {
                supabaseClient.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN') {
                        if (window.authManager) {
                            window.authManager.currentUser = session.user;
                            window.authManager.token = session.access_token;
                            localStorage.setItem('supabase_token', window.authManager.token);
                            window.authManager.updateUI();
                        }
                } else if (event === 'SIGNED_OUT') {
                        if (window.authManager) {
                            window.authManager.currentUser = null;
                            window.authManager.token = null;
                    localStorage.removeItem('supabase_token');
                            window.authManager.updateUI();
                        }
                }
            });
            }
        } catch (error) {
            console.error('Failed to set up auth state listener:', error);
        }
    });
}
