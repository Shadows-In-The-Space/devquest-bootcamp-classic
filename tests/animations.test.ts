import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StaggeredRevealController } from '../src/logic/animations';

describe('StaggeredRevealController', () => {
    let container: HTMLElement;
    let items: HTMLElement[];

    beforeEach(() => {
        document.body.innerHTML = `
            <div data-reveal-container>
                <div class="reveal-item">Item 1</div>
                <div class="reveal-item">Item 2</div>
                <div class="reveal-item">Item 3</div>
            </div>
        `;
        container = document.querySelector('[data-reveal-container]') as HTMLElement;
        items = Array.from(document.querySelectorAll('.reveal-item')) as HTMLElement[];
    });

    it('should assign incremental transition delays to reveal items', () => {
        const controller = new StaggeredRevealController();
        controller.applyStagger(container);

        expect(items[0].style.transitionDelay).toBe('0s');
        expect(items[1].style.transitionDelay).toBe('0.15s');
        expect(items[2].style.transitionDelay).toBe('0.3s');
    });

    it('should add reveal-active class when revealed', () => {
        const controller = new StaggeredRevealController();
        controller.reveal(container);

        items.forEach(item => {
            expect(item.classList.contains('reveal-active')).toBe(true);
        });
    });

    it('should initialize and observe containers', () => {
        const observeSpy = vi.fn();
        
        class MockIntersectionObserver {
            observe = observeSpy;
            unobserve = vi.fn();
            disconnect = vi.fn();
        }

        // @ts-ignore
        window.IntersectionObserver = MockIntersectionObserver;

        const controller = new StaggeredRevealController();
        controller.init();

        expect(observeSpy).toHaveBeenCalledWith(container);
    });
});
