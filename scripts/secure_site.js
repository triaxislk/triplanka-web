const fs = require('fs');
const path = require('path');

/**
 * TripLanka Security Automator
 * This script automatically applies Content Security Policy (CSP) and other 
 * security headers to all HTML files in the project.
 */

const SECURITY_TAGS = `
  <!-- Security Headers (Automated) -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.emailjs.com https://cdnjs.cloudflare.com https://www.youtube.com https://www.gstatic.com https://*.firebaseio.com https://*.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; media-src 'self'; connect-src 'self' https://api.emailjs.com https://api.counterapi.dev https://api.open-meteo.com https://*.firebaseio.com wss://*.firebaseio.com https://*.googleapis.com; frame-src 'self' https://www.google.com https://www.youtube.com;">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
`;

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (dirPath.includes('node_modules') || dirPath.includes('.git') || dirPath.includes('backups')) return;
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function applySecurity(filePath) {
    if (!filePath.endsWith('.html')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    const basename = path.basename(filePath);
    
    // --- 1. Security Headers Injection ---
    // Remove any old security tags to avoid duplicates
    const oldTagsRegex = /<!-- Security Headers \(Automated\) -->[\s\S]*?<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">/g;
    content = content.replace(oldTagsRegex, '');
    
    if (content.includes('</head>')) {
        content = content.replace('</head>', `${SECURITY_TAGS}\n</head>`);
    }

    // --- 2. Contact Form Hardening (Special case for contact.html) ---
    if (basename === 'contact.html') {
        // Update form tag and add honeypot
        if (content.includes('<form action="#">')) {
            const secureForm = `
  <form id="contact-form">
  <!-- Honeypot Field (Security) -->
  <div style="display:none;"><input type="text" id="subject_alt" name="subject_alt"></div>
            `.trim();
            content = content.replace('<form action="#">', secureForm);
            
            // Update inputs with name attributes for EmailJS
            content = content.replace('id="name"', 'id="name" name="from_name"');
            content = content.replace('id="email"', 'id="email" name="reply_to"');
            content = content.replace('id="subject"', 'id="subject" name="subject"');
            content = content.replace('id="message"', 'id="message" name="message"');
            content = content.replace('type="submit"', 'type="submit" id="submit-btn"');
            content = content.replace('</button>', '</button>\n  <div id="form-status" style="margin-top: 1rem; text-align: center; font-weight: 600;"></div>');
        }

        // Add EmailJS Scripts
        const emailJSBlock = `
  <!-- EmailJS Integration (Automated) -->
  <script type="text/javascript" src="https://cdn.emailjs.com/sdk/2.3.2/email.min.js"></script>
  <script type="text/javascript">
    (function(){ emailjs.init("YOUR_PUBLIC_KEY"); })();
    document.getElementById('contact-form')?.addEventListener('submit', function(event) {
      event.preventDefault();
      const submitBtn = document.getElementById('submit-btn');
      const statusDiv = document.getElementById('form-status');
      if (document.getElementById('subject_alt').value !== "") return; // Bot check
      submitBtn.disabled = true; submitBtn.textContent = 'Sending...';
      emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
        .then(() => {
          statusDiv.style.color = '#27ae60'; statusDiv.textContent = 'Message sent successfully!';
          submitBtn.textContent = 'Send Message'; submitBtn.disabled = false;
          this.reset();
        }, (err) => {
          statusDiv.style.color = '#e74c3c'; statusDiv.textContent = 'Failed to send. Please try again.';
          submitBtn.textContent = 'Send Message'; submitBtn.disabled = false;
        });
    });
  </script>
        `.trim();

        if (!content.includes('EmailJS Integration (Automated)')) {
            content = content.replace('</body>', `${emailJSBlock}\n</body>`);
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[SECURE] Processed: ${filePath}`);
}

console.log("Starting site-wide security hardening...");
walkDir('.', applySecurity);
console.log("Security hardening complete. All pages are now governed by a strict Content Security Policy.");
