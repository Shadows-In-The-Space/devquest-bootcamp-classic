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

export class TextGlitcher {
    private element: HTMLElement;
    private chars: HTMLElement[] = [];

    constructor(element: HTMLElement) {
        this.element = element;
    }

    public splitText(): void {
        this.processNode(this.element);
    }

    private processNode(node: Node): void {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent || '';

            // Strictly skip purely whitespace nodes (indentation between elements)
            if (text.trim().length === 0) return;

            // Normalize whitespace:
            // 1. Collapse all internal whitespace (newlines/tabs/spaces) to single space
            // 2. Trim leading/trailing whitespace (formatting)
            text = text.replace(/\s+/g, ' ').trim();

            if (text.length === 0) return;

            const fragment = document.createDocumentFragment();
            text.split('').forEach(char => {
                // Replace normal space with non-breaking space to prevent collapse
                if (char === ' ') char = '\u00A0';

                const span = document.createElement('span');
                span.textContent = char;
                span.style.setProperty('--delay', Math.random().toString());
                span.className = 'inline-block opacity-0'; // Start hidden
                fragment.appendChild(span);
                this.chars.push(span);
            });
            node.parentNode?.replaceChild(fragment, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            if (['BR', 'IMG', 'SVG', 'SCRIPT', 'STYLE'].includes(el.tagName)) return;

            Array.from(el.childNodes).forEach(child => this.processNode(child));
        }
    }

    public reveal(): void {
        if (this.chars.length === 0) return;

        // Reveal the container
        this.element.style.opacity = '1';

        this.chars.forEach(span => {
            // Read the delay from the CSS variable (0.0 - 1.0)
            const rawDelay = parseFloat(span.style.getPropertyValue('--delay') || '0');
            const delayMs = rawDelay * 1000; // Spread over 1s

            // Initially invisible (handled by CSS reveal-visible-letter? 
            // no, wait, the spans are just spans. The container was opacity-0.
            // But if container becomes opacity 1, all spans become visible unless we hide them.
            // We should probably hide them initially in splitText?
            // "Letters reveal one-by-one". 
            // So splitText should probably set opacity 0 on spans.

            setTimeout(() => {
                span.classList.add('reveal-visible-letter');
                span.classList.add('glitching');

                // Stop glitching after some time (e.g. 200ms - 500ms)
                setTimeout(() => {
                    span.classList.remove('glitching');
                }, 200 + Math.random() * 300);

            }, delayMs);
        });
    }
}
