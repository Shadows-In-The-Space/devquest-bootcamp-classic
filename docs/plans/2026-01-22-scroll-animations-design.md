# Design Spec: Sequential Section Scroll Animations

## Overview
Implement a harmonious, staggered entrance animation system for all landing page sections. This enhances the "DevQuest" gamified aesthetic by revealing content dynamically as the user scrolls.

## Visual Vibe: Hybrid Cyber-Flow
- **Layout Elements (Cards, Text Blocks):** A mix of Side-Sweep (alternating left/right) and Depth Zoom (scale 0.9 -> 1.0).
- **Key Headings:** Short-lived "Cyber-Glitch" effect (0.4s) on entrance to emphasize the GPU theme.
- **Staggering:** Automated 100ms delay between children within a section.

## Architecture
### 1. CSS Utility Classes (`src/styles/main.css`)
- `.reveal-item`: Initial state (opacity 0, transform).
- `.reveal-active`: Final state (opacity 1, transform reset).
- `.motion-sweep-left`: `translateX(-50px)`.
- `.motion-sweep-right`: `translateX(50px)`.
- `.motion-zoom-in`: `scale(0.9)`.
- `.glitch-entry`: Keyframes for flickering color and clip-path jitter.

### 2. Logic (`src/logic/animations.ts`)
- Extend `AnimationSystem` to handle `[data-reveal-container]`.
- Use `IntersectionObserver` to trigger sequential reveals.
- Automatically apply staggering delays to `.reveal-item` children.

## Success Criteria
- [ ] Sections reveal smoothly with no layout thrashing.
- [ ] Staggering effect is clearly visible but fast (total section reveal < 1s).
- [ ] Headings have a brief, punchy glitch effect that settles into readability.
- [ ] Respects `prefers-reduced-motion`.
