export class MobileMenu {
    private toggleBtn: HTMLElement | null;
    private menuOverlay: HTMLElement | null;
    private menuLinks: NodeListOf<HTMLAnchorElement> | null;
    private isOpen: boolean = false;

    constructor() {
        this.toggleBtn = document.getElementById('mobile-menu-toggle');
        this.menuOverlay = document.getElementById('mobile-menu-overlay');
        this.menuLinks = document.querySelectorAll('#mobile-menu-overlay a');

        if (!this.toggleBtn || !this.menuOverlay) {
            console.warn('Mobile Menu elements not found');
            return;
        }

        this.init();
    }

    private init() {
        this.toggleBtn?.addEventListener('click', () => this.toggleMenu());

        // Close menu when a link is clicked
        this.menuLinks?.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    private toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    private openMenu() {
        this.isOpen = true;
        this.menuOverlay?.classList.remove('hidden');
        this.menuOverlay?.classList.add('flex');

        // Small delay to allow display:block/flex to apply before transition
        setTimeout(() => {
            this.menuOverlay?.classList.remove('opacity-0', 'translate-x-full');
            this.menuOverlay?.classList.add('opacity-100', 'translate-x-0');
        }, 10);

        this.toggleBtn?.setAttribute('aria-expanded', 'true');
        document.body.classList.add('overflow-hidden'); // Prevent background scrolling
    }

    private closeMenu() {
        this.isOpen = false;
        this.menuOverlay?.classList.remove('opacity-100', 'translate-x-0');
        this.menuOverlay?.classList.add('opacity-0', 'translate-x-full');

        this.toggleBtn?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('overflow-hidden');

        // Wait for transition to finish before hiding
        setTimeout(() => {
            this.menuOverlay?.classList.remove('flex');
            this.menuOverlay?.classList.add('hidden');
        }, 300); // Matches duration-300
    }
}
