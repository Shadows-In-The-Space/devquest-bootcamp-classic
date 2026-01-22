# Implementation Plan - Interactive Hero Reveal

### Phase 1: Foundations & Styles
- [x] Task: Define glitch and flicker keyframes in `src/styles/main.css`
- [x] Task: Prepare H1 markup in `index.html` (add ID/ref and hidden state)
- [x] Task: Conductor - User Manual Verification 'Foundations & Styles' (Protocol in workflow.md)

### Phase 2: Core Logic (TDD)
- [x] Task: Write failing tests for `TextGlitcher` utility (splitting text into character spans)
- [x] Task: Implement `TextGlitcher` in `src/logic/animations.ts`
- [x] Task: Write failing tests for the sequencing logic (randomized timing)
- [x] Task: Implement reveal sequence controller
- [x] Task: Conductor - User Manual Verification 'Core Logic (TDD)' (Protocol in workflow.md)

### Phase 3: Integration & Refinement
- [x] Task: Initialize animation on `window.load` in `src/main.ts`
- [x] Task: Fine-tune jitter offsets and flicker colors to match brand spec
- [x] Task: Conductor - User Manual Verification 'Integration & Styling' (Protocol in workflow.md)

### Phase 4: Accessibility & Final Polish
- [x] Task: Implement `prefers-reduced-motion` media query check
- [x] Task: Verify readable state and selection post-animation
- [x] Task: Conductor - User Manual Verification 'Quality & Accessibility' (Protocol in workflow.md)
