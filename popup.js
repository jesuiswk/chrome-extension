// UI Elements
const loginView = document.getElementById('loginView');
const loggedInView = document.getElementById('loggedInView');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const userName = document.getElementById('userName');
const fillFormBtn = document.getElementById('fillFormBtn');
const logoutBtn = document.getElementById('logoutBtn');
const status = document.getElementById('status');

// Check login status on popup load
document.addEventListener('DOMContentLoaded', async function() {
    await checkLoginStatus();
});

// Check if user is logged in
async function checkLoginStatus() {
    try {
        const result = await chrome.storage.local.get(['authToken', 'userData']);

        if (result.authToken && result.userData) {
            showLoggedInView(result.userData);
        } else {
            showLoginView();
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        showLoginView();
    }
}

// Handle login form submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    loginError.textContent = '';

    try {
        // Call background script to handle authentication
        const response = await chrome.runtime.sendMessage({
            action: 'login',
            username: username,
            password: password
        });

        if (response.success) {
            await chrome.storage.local.set({
                authToken: response.token,
                userData: response.userData
            });

            showLoggedInView(response.userData);
        } else {
            loginError.textContent = response.error || 'Login failed. Please try again.';
        }
    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = 'An error occurred. Please try again.';
    }
});

// Handle fill form button click
fillFormBtn.addEventListener('click', async function() {
    try {
        const result = await chrome.storage.local.get(['userData']);

        if (!result.userData) {
            status.textContent = 'No user data available';
            return;
        }

        // Get active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Send message to content script to fill form
        await chrome.tabs.sendMessage(tab.id, {
            action: 'fillForm',
            userData: result.userData
        });

        status.textContent = 'Form filled successfully!';
        setTimeout(() => {
            status.textContent = '';
        }, 3000);
    } catch (error) {
        console.error('Error filling form:', error);
        status.textContent = 'Error: Could not fill form on this page';
    }
});

// Handle logout button click
logoutBtn.addEventListener('click', async function() {
    try {
        await chrome.storage.local.remove(['authToken', 'userData']);
        showLoginView();

        // Optionally notify background script
        chrome.runtime.sendMessage({ action: 'logout' });
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// Show login view
function showLoginView() {
    loginView.style.display = 'block';
    loggedInView.style.display = 'none';
    loginForm.reset();
    loginError.textContent = '';
}

// Show logged in view
function showLoggedInView(userData) {
    loginView.style.display = 'none';
    loggedInView.style.display = 'block';
    userName.textContent = userData.name || userData.username || 'User';
    status.textContent = '';
}
