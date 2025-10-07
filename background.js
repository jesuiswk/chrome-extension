// Background service worker for handling authentication and API calls

// Configuration - Replace with your actual API endpoint
const API_CONFIG = {
    baseUrl: 'https://your-api-endpoint.com/api',
    endpoints: {
        login: '/auth/login',
        getUserData: '/user/profile',
        logout: '/auth/logout'
    }
};

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'login') {
        handleLogin(request.username, request.password)
            .then(response => sendResponse(response))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Will respond asynchronously
    }

    if (request.action === 'logout') {
        handleLogout()
            .then(response => sendResponse(response))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }

    if (request.action === 'refreshUserData') {
        refreshUserData()
            .then(response => sendResponse(response))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});

// Handle login authentication
async function handleLogin(username, password) {
    try {
        // TODO: Replace this with your actual API call
        // Example using fetch:
        /*
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        */

        // MOCK IMPLEMENTATION - Replace with real API call
        // This simulates a successful login for testing
        console.log('Login attempt:', username);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock successful authentication
        if (username && password) {
            const mockUserData = {
                username: username,
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main Street',
                address2: 'Apt 4B',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'USA',
                company: 'Acme Corp',
                title: 'Software Engineer',
                website: 'https://example.com'
            };

            return {
                success: true,
                token: 'mock-auth-token-' + Date.now(),
                userData: mockUserData
            };
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: error.message || 'Authentication failed'
        };
    }
}

// Handle logout
async function handleLogout() {
    try {
        // TODO: Call your API logout endpoint if needed
        /*
        const storage = await chrome.storage.local.get(['authToken']);
        if (storage.authToken) {
            await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.logout}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${storage.authToken}`
                }
            });
        }
        */

        // Clear local storage
        await chrome.storage.local.remove(['authToken', 'userData']);

        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
}

// Refresh user data from API
async function refreshUserData() {
    try {
        const storage = await chrome.storage.local.get(['authToken']);

        if (!storage.authToken) {
            throw new Error('Not authenticated');
        }

        // TODO: Replace with actual API call
        /*
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getUserData}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${storage.authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        */

        // MOCK: Return stored data for now
        const result = await chrome.storage.local.get(['userData']);
        const userData = result.userData;

        if (userData) {
            await chrome.storage.local.set({ userData });
            return { success: true, userData };
        } else {
            throw new Error('No user data available');
        }
    } catch (error) {
        console.error('Refresh user data error:', error);
        return { success: false, error: error.message };
    }
}

// Optional: Periodic token refresh or validation
chrome.alarms.create('validateAuth', { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'validateAuth') {
        validateAuthToken();
    }
});

async function validateAuthToken() {
    const storage = await chrome.storage.local.get(['authToken']);

    if (storage.authToken) {
        // TODO: Implement token validation with your API
        console.log('Validating auth token...');
        // If token is invalid, clear storage
        // await chrome.storage.local.remove(['authToken', 'userData']);
    }
}

console.log('Background service worker initialized');
