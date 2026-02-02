# Space Invaders: Operation WebGL - Design Spec

**Date:** 2026-01-27
**Status:** DRAFT
**Goal:** Create a high-fidelity "90s meets 2026" arcade shooter using a custom WebGL engine to demonstrate core graphics programming concepts.

## 1. Vision & Aesthetics
*   **Vibe:** 1990s Arcade Cabinet / Amiga Demo Scene.
*   **Modern Twist:** "Juiciness" via GPU shaders.
    *   **CRT Shader:** Scanlines,chromatic aberration, subtle screen curvature.
    *   **Bloom:** Neon glowing bullets and enemies.
    *   **Particles:** GPU-accelerated particle explosions (thousands of particles).
    *   **Physics:** Smooth, floaty movement with "weight" (unlike stiff 8-bit movement).

## 2. Technical Architecture (Custom Engine)
Instead of a heavy framework, we build a *Micro-Engine* to show off the "Kai Niklas" curriculum topics.

### A. Core Modules
1.  **`WebGLContext`**: Manages the generic GL context, extensions, and resizing.
2.  **`ShaderManager`**: Compiles and links Vertex/Fragment shaders. Handles hot-swapping (optional).
3.  **`BatchRenderer`**: Optimized sprite renderer. Uses a single big Vertex Buffer Object (VBO) to draw all sprites in one draw call (Instanced Rendering or Dynamic Batching).
4.  **`PostProcessor`**: Handles Ping-Pong framebuffers for effects (Bloom pass, CRT pass).

### B. Game Architecture (ECS-Lite)
To keep it testable (TDD), we separate Data and Logic.
*   **Entities**: Simple objects with properties (`position`, `velocity`, `sprite`, `collider`).
*   **Systems**: Pure functions or classes that operate on entities.
    *   `MovementSystem`: Updates positions based on velocity and delta time.
    *   `InputSystem`: Maps keys to player velocity.
    *   `CollisionSystem`: AABB (Axis-Aligned Bounding Box) checks.
    *   `RenderSystem`: Pushes entities to the `BatchRenderer`.

## 3. Test Driven Development (TDD) Strategy
We will use **Vitest** for fast unit testing.

### Testable Units
1.  **Logic Logic Logic**: We test the *Game Loop* logic without the browser/canvas.
    *   *Test:* "When Player is hit by Bullet, Health decreases."
    *   *Test:* "When Enemy moves right and hits edge, direction flips."
2.  **Mocking WebGL**: For renderer tests, we mock the `WebGLRenderingContext` to ensure methods are called (e.g., `drawArrays`).

## 4. Subagent delegation Plan
We will simulate a team structure using specific Agent Skills:

| Role             | Skill                          | Responsibility                                                         |
| :--------------- | :----------------------------- | :--------------------------------------------------------------------- |
| **Architect**    | `system-architect`             | Defines the `Entity` interfaces and the `GameLoop` structure.          |
| **Engine Dev**   | `backend-pro` (Graphics Focus) | Implements the `BatchRenderer` and `Shader` classes. Writing the GLSL. |
| **Gameplay Dev** | `clean-coder`                  | Implements the game logic (Invaders, Scoring) using TDD.               |
| **QA Engineer**  | `test-strategist`              | Sets up Vitest, writes the test cases *before* the code is written.    |
| **UX/UI**        | `frontend-master`              | Handles the overlay HTML (Score, Game Over screen) and CSS.            |

## 5. Implementation Roadmap
1.  **Setup**: Install Vitest, configure "Subagent" personas.
2.  **Phase 1: The Engine (Skeleton)**
    *   Setup WebGL context.
    *   Basic Shader (Texture only).
    *   Draw a single Green Square (Player).
3.  **Phase 2: Game Logic (TDD First)**
    *   Tests for Movement.
    *   Tests for Invader Grid generation.
    *   Tests for Collision.
4.  **Phase 3: The Juice (Shaders)**
    *   Implement Post-Processing (CRT, Bloom).
    *   Add Particle System.

## 6. Verification
*   **Automated**: `npm run test` passes all logic cases.
*   **Manual**: 60 FPS on typical hardware. Visual inspection of CRT effects.
