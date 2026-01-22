# Specification - Fix Dark Mode Toggle

## Overview
The Dark Mode toggle functionality is currently broken. Clicking the toggle button has no effect, and no errors are reported in the console. This likely occurred during the recent modular refactoring where logic was moved from `index.html` to `src/logic/theme.ts`.

## Problem Description
- **Symptom:** The toggle button does not respond to click events.
- **Console:** No errors are present in the browser console.
- **Suspected Cause:** The event listener in `ThemeManager` (src/logic/theme.ts) is either not being attached correctly, the button ID has changed, or the initialization in `main.ts` is failing silently.

## Functional Requirements
- **Toggle Functionality:** Clicking the theme toggle button must switch the application between Light and Dark modes.
- **Visual Feedback:** The toggle icon (Material Symbol) must update to reflect the current state (e.g., `dark_mode` icon in light mode, `light_mode` icon in dark mode).
- **Persistence:** The user's preference must be saved in `localStorage` and applied automatically upon page reload.
- **System Preference:** If no preference is stored, the application should default to the user's system color scheme (`prefers-color-scheme`).

## Acceptance Criteria
- [ ] Clicking the toggle button successfully toggles the `.dark` class on the `<html>` element.
- [ ] The toggle icon changes correctly when the theme is toggled.
- [ ] The selected theme persists after a page refresh.
- [ ] The automated tests in `tests/theme.test.ts` pass.
- [ ] No regression errors appear in the console.
