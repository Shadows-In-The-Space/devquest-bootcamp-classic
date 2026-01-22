# Implementation Plan - Sequential Section Scroll Animations

### Phase 1: CSS Architecture [checkpoint: fe110ea]
- [x] Task: Implement `.reveal-item`, `.reveal-active` and motion utilities in `src/styles/main.css` [0d7e844]
- [x] Task: Define the `@keyframes glitch-entry` animation [0d7e844]
- [x] Task: Conductor - User Manual Verification 'CSS Architecture' (Protocol in workflow.md) [fe110ea]

### Phase 2: Core Logic (TDD)
- [ ] Task: Write failing tests for `StaggeredRevealController` (delay calculations)
- [ ] Task: Implement `StaggeredRevealController` in `src/logic/animations.ts`
- [ ] Task: Integrate `IntersectionObserver` for `[data-reveal-container]`
- [ ] Task: Conductor - User Manual Verification 'Animation Logic' (Protocol in workflow.md)

### Phase 3: HTML Integration
- [ ] Task: Add `data-reveal-container` and `.reveal-item` classes to all relevant sections in `index.html`
- [ ] Task: Apply alternating sweep classes to grid items
- [ ] Task: Conductor - User Manual Verification 'HTML Integration' (Protocol in workflow.md)

### Phase 4: Polish & Accessibility
- [ ] Task: Add `prefers-reduced-motion` overrides
- [ ] Task: Fine-tune staggering duration and easing curves
- [ ] Task: Conductor - User Manual Verification 'Quality & Accessibility' (Protocol in workflow.md)
