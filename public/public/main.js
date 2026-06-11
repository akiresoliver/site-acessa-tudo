document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('url-form');
    const input = document.getElementById('url-input');
    const iframe = document.getElementById('proxy-frame');
    const welcomeScreen = document.getElementById('welcome-screen');
    const loader = document.getElementById('loader');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let url = input.value.trim();
        if (!url) return;

        // Add https:// if missing
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        // Hide welcome screen, show loader
        welcomeScreen.classList.add('hidden');
        loader.classList.remove('hidden');
        iframe.classList.remove('active');

        // Construct the proxy URL
        const proxyUrl = `/proxy?url=${encodeURIComponent(url)}`;
        
        // Update input to show formatting if needed
        input.value = url;

        // Set iframe source
        iframe.src = proxyUrl;
    });

    iframe.addEventListener('load', () => {
        // Only hide loader if we actually navigated somewhere
        if (iframe.src && !iframe.src.endsWith('/')) {
            loader.classList.add('hidden');
            iframe.classList.add('active');
        }
    });

    // Handle shortcut buttons
    const shortcutBtns = document.querySelectorAll('.shortcut-btn');
    shortcutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.getAttribute('data-url');
            if (url) {
                input.value = url;
                // Programmatically trigger the form submit
                form.dispatchEvent(new Event('submit'));
            }
        });
    });

    // Auto-focus input
    input.focus();
});
