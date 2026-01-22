# Specification - Modular Refactoring

## Overview
This track aims to move the current monolithic `index.html` structure into a more maintainable, modular architecture. We will separate the CSS, JavaScript logic (XP systems, dark mode), and HTML components. We will also ensure the TypeScript setup is fully utilized.

## Goals
- **Separation of Concerns:** Separate markup, styles, and logic.
- **Maintainability:** Make it easier to update specific sections (e.g., Curriculum, FAQ).
- **TypeScript Integration:** Move embedded scripts to `.ts` files to leverage type safety.
- **Performance:** Ensure Vite's bundling is used effectively for production builds.

## Components to Extract
- **Styles:** Custom CSS from `<style>` block.
- **Logic:**
    - Dark Mode Toggle logic.
    - XP/Gamification System logic.
    - Scroll Reveal & Parallax logic.
- **Markup (Optional/Partial):** Consider using templates or just cleaning up the `index.html` structure.

## Acceptance Criteria
- [ ] `index.html` contains no embedded `<script>` or `<style>` blocks.
- [ ] All custom styles are in a separate CSS file.
- [ ] All interactivity is powered by external TypeScript files.
- [ ] Development server runs correctly with `npm run dev`.
- [ ] Production build passes with `npm run build`.
