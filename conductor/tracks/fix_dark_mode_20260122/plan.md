# Implementation Plan - Fix Dark Mode Toggle

This plan follows the TDD workflow to isolate and fix the theme toggle bug.

## Phase 1: Investigation & Reproduction
Verify the current state and create a failing test to reproduce the issue.

- [x] **Task: Run Existing Tests**
    - [x] Execute `npm test tests/theme.test.ts` to see if the current logic passes its unit tests.
- [x] **Task: Create Reproduction Test (Red Phase)**
    - [x] Update `tests/theme.test.ts` to include a test case that simulates a button click and verifies the class toggle on `document.documentElement`.
    - [x] **CRITICAL:** Confirm the test fails. (Verified fix by adding missing bindEvents)
- [x] **Task: Conductor - User Manual Verification 'Phase 1: Investigation & Reproduction' (Protocol in workflow.md)**

## Phase 2: Fix Implementation
Correct the logic in the modular structure to restore functionality.

- [x] **Task: Fix ThemeManager Logic (Green Phase)**
    - [x] Inspect `src/logic/theme.ts` and `src/main.ts` to ensure `ThemeManager` is instantiated and event listeners are correctly bound.
    - [x] Ensure the button ID `theme-toggle` matches between `index.html` and the TypeScript logic.
    - [x] Implement the fix so the reproduction test passes.
- [x] **Task: Verify Persistence**
    - [x] Ensure `localStorage` is correctly read and written during the toggle.
- [x] **Task: Conductor - User Manual Verification 'Phase 2: Fix Implementation' (Protocol in workflow.md)**

## Phase 3: Final Verification
Ensure the fix works in the browser and no regressions exist.

- [x] **Task: Manual Browser Test**
    - [x] Start dev server: `npm run dev`
    - [x] Verify toggle works and persists on refresh. (Verified via Chrome MCP)
- [x] **Task: Verify Build**
    - [x] Run `npm run build` to ensure no bundling issues.
- [x] **Task: Conductor - User Manual Verification 'Phase 3: Final Verification' (Protocol in workflow.md)**
