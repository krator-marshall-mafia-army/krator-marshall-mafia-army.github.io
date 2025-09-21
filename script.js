// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// CTA Button click effect
document.querySelector('.cta-button').addEventListener('click', function() {
    // Create recruitment modal effect
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, #1a4d1a, #0d2818);
        border: 2px solid #00ff00;
        padding: 3rem;
        text-align: center;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        max-width: 500px;
        animation: slideIn 0.5s ease;
    `;

    content.innerHTML = `
        <h2 style="color: #32CD32; margin-bottom: 1rem; text-shadow: 0 0 10px #00ff00;">🐛 ENLISTMENT CONFIRMED 🐛</h2>
        <p style="margin-bottom: 2rem;">Welcome to the Krater Marshall Mafia Army, soldier!</p>
        <p style="margin-bottom: 2rem;">Your green transformation begins now...</p>
        <button onclick="this.closest('div').remove()" style="
            background: #228B22;
            color: black;
            border: none;
            padding: 1rem 2rem;
            cursor: pointer;
            font-weight: bold;
            text-transform: uppercase;
        ">PROCEED TO TRAINING</button>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Auto-close after 5 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 5000);
});

// Video placeholder interactions
document.querySelectorAll('.video-placeholder').forEach(video => {
    video.addEventListener('click', function() {
        const title = this.querySelector('h4').textContent;

        // Create video modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        const videoContent = document.createElement('div');
        videoContent.style.cssText = `
            background: #000;
            border: 2px solid #00ff00;
            padding: 2rem;
            text-align: center;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            max-width: 600px;
        `;

        videoContent.innerHTML = `
            <h3 style="color: #32CD32; margin-bottom: 1rem;">${title}</h3>
            <div style="
                width: 400px;
                height: 225px;
                background: linear-gradient(45deg, #1a4d1a, #0d2818);
                border: 1px solid #00ff00;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 1rem auto;
                font-size: 3rem;
            ">🎬</div>
            <p style="margin: 1rem 0;">[CLASSIFIED FOOTAGE]</p>
            <button onclick="this.closest('div').remove()" style="
                background: #228B22;
                color: black;
                border: none;
                padding: 0.5rem 1rem;
                cursor: pointer;
            ">CLOSE</button>
        `;

        modal.appendChild(videoContent);
        document.body.appendChild(modal);

        // Auto-close after 3 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 3000);
    });
});

// Image gallery interactions
document.querySelectorAll('.image-placeholder').forEach(image => {
    image.addEventListener('click', function() {
        const title = this.querySelector('p').textContent;
        const emoji = this.querySelector('span').textContent;

        // Create image modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        const imageContent = document.createElement('div');
        imageContent.style.cssText = `
            background: linear-gradient(135deg, #1a4d1a, #0d2818);
            border: 2px solid #00ff00;
            padding: 3rem;
            text-align: center;
            color: #00ff00;
            font-family: 'Courier New', monospace;
            max-width: 500px;
        `;

        imageContent.innerHTML = `
            <h3 style="color: #32CD32; margin-bottom: 1rem;">${title}</h3>
            <div style="
                font-size: 8rem;
                margin: 1rem 0;
                text-shadow: 0 0 20px #00ff00;
            ">${emoji}</div>
            <p style="margin: 1rem 0;">[CLASSIFIED IMAGE]</p>
            <button onclick="this.closest('div').remove()" style="
                background: #228B22;
                color: black;
                border: none;
                padding: 0.5rem 1rem;
                cursor: pointer;
            ">CLOSE</button>
        `;

        modal.appendChild(imageContent);
        document.body.appendChild(modal);

        // Auto-close after 4 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 4000);
    });
});

// Add typing effect to announcements
document.addEventListener('DOMContentLoaded', function() {
    const announcements = document.querySelectorAll('.announcement p');

    announcements.forEach((announcement, index) => {
        const text = announcement.textContent;
        announcement.textContent = '';

        setTimeout(() => {
            let i = 0;
            const typeWriter = setInterval(() => {
                if (i < text.length) {
                    announcement.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeWriter);
                }
            }, 50);
        }, index * 1000);
    });
});

// Propaganda item hover effects
document.querySelectorAll('.propaganda-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) rotate(1deg)';
    });

    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Add matrix-like falling characters effect
function createMatrixEffect() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        opacity: 0.1;
    `;

    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '🐛🍃💚⚡🚬';
    const charArray = chars.split('');
    const fontSize = 20;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff00';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 100);
}

// Initialize matrix effect
createMatrixEffect();

// Handle window resize
window.addEventListener('resize', function() {
    const canvas = document.querySelector('canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
