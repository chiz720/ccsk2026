// EmailJS Configuration
// Sign up at https://www.emailjs.com/ (free tier)
// Replace the values below with your EmailJS credentials

const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',      // Get from EmailJS dashboard
    serviceId: 'YOUR_SERVICE_ID',       // Get from EmailJS dashboard  
    templateId: 'YOUR_TEMPLATE_ID'     // Get from EmailJS dashboard
};

// Fallback: Open email client
function sendEmailFallback(name, email, password) {
    const subject = encodeURIComponent('13th CCSK Conference - Your Login Details');
    const body = encodeURIComponent(
        `Dear ${name},

Welcome to the 13th CCSK Annual Scientific Conference!

Your login credentials for the conference platform are:

Website: https://ccsk2026.vercel.app
Email: ${email}
Password: ${password}

Please keep these credentials safe.

Conference Details:
- Dates: May 13-15, 2026
- Venue: Argyles Grand Hotel, Nairobi
- Theme: Frugal Innovation: Evidence-Based, Locally Driven Solutions for a Global Future

We look forward to seeing you there!

Best regards,
CCSK Conference Team
`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

// Send email using EmailJS
async function sendLoginEmail(name, email, password) {
    if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
        // Use fallback if not configured
        sendEmailFallback(name, email, password);
        return;
    }
    
    try {
        const { emailjs } = window;
        await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
                to_name: name,
                to_email: email,
                website_url: 'https://ccsk2026.vercel.app',
                user_email: email,
                user_password: password,
                conference_name: '13th CCSK Annual Scientific Conference',
                conference_dates: 'May 13-15, 2026',
                venue: 'Argyles Grand Hotel, Nairobi'
            },
            EMAILJS_CONFIG.publicKey
        );
        return true;
    } catch (error) {
        console.error('EmailJS failed, using fallback:', error);
        sendEmailFallback(name, email, password);
        return false;
    }
}

function copyCredentials(email, password) {
    const text = `CCSK Conference Login\nEmail: ${email}\nPassword: ${password}\nWebsite: https://ccsk2026.vercel.app`;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Credentials copied!');
    }).catch(() => {
        showToast('Copy failed - please copy manually');
    });
}
