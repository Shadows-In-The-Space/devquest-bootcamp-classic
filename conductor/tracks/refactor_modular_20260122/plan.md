# Implementation Plan - Modular Refactoring

This plan follows the TDD workflow and modularity principles.

## Phase 1: Infrastructure & Style Extraction [checkpoint: d5c64a8]
Extract custom CSS into dedicated files and verify the build.

- [x] **Task: Extract Custom CSS**
    - [ ] Create `src/styles/main.css`
    - [ ] Move CSS from `index.html` to `src/styles/main.css`
    - [ ] Link `src/styles/main.css` in `index.html`
- [x] **Task: Configure Tailwind & CSS in Vite**
    - [ ] Ensure `src/styles/main.css` is correctly bundled by Vite.
- [ ] **Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Style Extraction' (Protocol in workflow.md)**

## Phase 2: Logic Extraction (TypeScript) [checkpoint: recent_sha]
Move embedded JavaScript logic to modular TypeScript files.

- [x] **Task: Extract Dark Mode Logic**
    - [ ] **Write Tests:** Create `tests/theme.test.ts` to verify dark mode state management.
    - [ ] **Implement:** Move dark mode logic to `src/logic/theme.ts`.
- [x] **Task: Extract XP & Gamification System**
    - [ ] **Write Tests:** Create `tests/gamification.test.ts` to verify rank and level calculations.
    - [ ] **Implement:** Move XP logic to `src/logic/gamification.ts`.
- [x] **Task: Extract Animations (Scroll Reveal & Parallax)**
    - [ ] **Implement:** Move scroll and mouse tracking logic to `src/logic/animations.ts`.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Logic Extraction (TypeScript)' (Protocol in workflow.md)**

## Phase 3: Final Cleanup & Integration
Finalize the modular structure and ensure zero regressions.

- [ ] **Task: Clean index.html**
    - [ ] Remove all remaining embedded script tags.
    - [ ] Initialize logic from a main entry point (e.g., `src/main.ts`).
- [ ] **Task: Verify Build and Deployability**
    - [ ] Run `npm run build` and verify output.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Final Cleanup & Integration' (Protocol in workflow.md)**
