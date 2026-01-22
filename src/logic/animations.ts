export class AnimationSystem {
    constructor() {
        if (typeof document !== 'undefined') {
            this.initScrollReveal();
            this.initParallax();
        }
    }

    private initScrollReveal(): void {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the element is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
            observer.observe(el);
        });
    }

    private initParallax(): void {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;

                const blobPurple = document.getElementById('blob-purple');
                const blobGreen = document.getElementById('blob-green');
                const heroImg = document.getElementById('hero-img');
                const grid = document.getElementById('interactive-grid');

                if (blobPurple) {
                    blobPurple.style.transform = `translate(${x * -40}px, ${y * -40}px)`;
                }
                if (blobGreen) {
                    blobGreen.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
                }
                if (heroImg) {
                    // Move opposite to mouse for depth
                    heroImg.style.transform = `translate(${(x - 0.5) * -25}px, ${(y - 0.5) * -25}px)`;
                }
                if (grid) {
                    grid.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
                }
            });
        });
    }
}
