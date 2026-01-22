/**
 * Controller for staggered reveal animations on scroll.
 */
export class StaggeredRevealController {
    private observer: IntersectionObserver | null = null;

    /**
     * Initializes the intersection observer for all elements matching the container selector.
     */
    init(containerSelector: string = '[data-reveal-container]'): void {
        const containers = document.querySelectorAll(containerSelector);

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.applyStagger(entry.target as HTMLElement);
                    this.reveal(entry.target as HTMLElement);
                    // Stop observing after reveal to keep performance high
                    this.observer?.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        containers.forEach(container => {
            this.observer?.observe(container);
        });
    }

    /**
     * Applies incremental transition delays to all child reveal items.
     */
    applyStagger(container: HTMLElement): void {
        const items = container.querySelectorAll('.reveal-item');
        items.forEach((item, index) => {
            (item as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
        });
    }

    /**
     * Adds the active class to all reveal items in the container.
     */
    reveal(container: HTMLElement): void {
        const items = container.querySelectorAll('.reveal-item');
        items.forEach((item) => {
            item.classList.add('reveal-active');
        });
    }
}
