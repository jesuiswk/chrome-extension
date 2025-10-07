// Content script for form autofill functionality

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fillForm') {
        fillFormWithUserData(request.userData);
        sendResponse({ success: true });
    }
    return true;
});

// Function to fill form fields with user data
function fillFormWithUserData(userData) {
    // Common field mappings
    const fieldMappings = {
        // Name fields
        name: ['name', 'fullname', 'full_name', 'full-name', 'username', 'user_name', 'user-name'],
        firstName: ['firstname', 'first_name', 'first-name', 'fname', 'givenname', 'given_name'],
        lastName: ['lastname', 'last_name', 'last-name', 'lname', 'surname', 'familyname', 'family_name'],

        // Contact fields
        email: ['email', 'e-mail', 'emailaddress', 'email_address', 'email-address', 'mail'],
        phone: ['phone', 'phonenumber', 'phone_number', 'phone-number', 'tel', 'telephone', 'mobile', 'cellphone'],

        // Address fields
        address: ['address', 'street', 'streetaddress', 'street_address', 'street-address', 'address1', 'address_1'],
        address2: ['address2', 'address_2', 'address-2', 'apt', 'apartment', 'suite'],
        city: ['city', 'town', 'locality'],
        state: ['state', 'province', 'region'],
        zip: ['zip', 'zipcode', 'zip_code', 'zip-code', 'postal', 'postalcode', 'postal_code', 'postal-code'],
        country: ['country', 'nation'],

        // Additional fields
        company: ['company', 'organization', 'org', 'business', 'companyname', 'company_name'],
        website: ['website', 'web', 'url', 'homepage', 'site'],
        title: ['title', 'jobtitle', 'job_title', 'job-title', 'position']
    };

    // Get all input, select, and textarea elements
    const formFields = document.querySelectorAll('input, select, textarea');

    formFields.forEach(field => {
        // Skip password fields, hidden fields, submit buttons
        if (field.type === 'password' ||
            field.type === 'hidden' ||
            field.type === 'submit' ||
            field.type === 'button' ||
            field.type === 'reset') {
            return;
        }

        const fieldIdentifier = getFieldIdentifier(field);

        // Try to match and fill the field
        for (const [dataKey, patterns] of Object.entries(fieldMappings)) {
            if (userData[dataKey] && matchesPattern(fieldIdentifier, patterns)) {
                fillField(field, userData[dataKey]);
                break;
            }
        }
    });

    // Show visual feedback
    showFillNotification();
}

// Get field identifier from various attributes
function getFieldIdentifier(field) {
    const identifiers = [
        field.name,
        field.id,
        field.getAttribute('placeholder'),
        field.getAttribute('aria-label'),
        field.getAttribute('data-test-id'),
        field.className
    ];

    return identifiers
        .filter(id => id)
        .join(' ')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '');
}

// Check if field identifier matches any pattern
function matchesPattern(identifier, patterns) {
    return patterns.some(pattern => {
        const normalizedPattern = pattern.toLowerCase().replace(/[^a-z0-9]/g, '');
        return identifier.includes(normalizedPattern);
    });
}

// Fill individual field based on type
function fillField(field, value) {
    if (field.tagName === 'SELECT') {
        // For select elements, try to find matching option
        const options = Array.from(field.options);
        const matchingOption = options.find(opt =>
            opt.value.toLowerCase() === value.toLowerCase() ||
            opt.text.toLowerCase() === value.toLowerCase()
        );
        if (matchingOption) {
            field.value = matchingOption.value;
        }
    } else if (field.type === 'checkbox') {
        field.checked = Boolean(value);
    } else if (field.type === 'radio') {
        if (field.value.toLowerCase() === value.toLowerCase()) {
            field.checked = true;
        }
    } else {
        // For text inputs and textareas
        field.value = value;

        // Trigger input events for frameworks like React
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Add visual feedback
    field.style.transition = 'background-color 0.3s';
    field.style.backgroundColor = '#e8f5e9';
    setTimeout(() => {
        field.style.backgroundColor = '';
    }, 1000);
}

// Show notification that form was filled
function showFillNotification() {
    const notification = document.createElement('div');
    notification.textContent = 'Form filled by Chrome Extension';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4285f4;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 999999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
