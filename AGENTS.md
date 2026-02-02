# DevQuest Bootcamp - Agent Guide

## Project Overview

**DevQuest Bootcamp** is an interactive game development learning platform featuring a Space Invaders-style arcade game. It combines a custom WebGL-based game engine with modern web technologies and gamification elements.

- **Live App**: https://ai.studio/apps/drive/1KGr_5NmqjHQwoyvhyJmoAQjhETA1KzJt
- **Local Dev**: `npm run dev` (runs on port 3000)

## Tech Stack

| Category | Technology |
|----------|------------|
| Build Tool | Vite 6.2+ |
| Language | TypeScript 5.8+ (ES2022) |
| Styling | Tailwind CSS v4.1+ |
| 3D Graphics | Three.js 0.182 |
| Backend | Supabase |
| Testing | Vitest + jsdom |
| Fonts | Space Grotesk, Space Mono, Material Symbols |

## Project Structure

```
/home/sonny/Development/game_Dev_boot/
├── src/
│   ├── main.ts                 # Entry point - initializes all systems
│   ├── styles/main.css         # Global styles + Tailwind imports
│   ├── types/supabase.ts       # Supabase generated types
│   ├── lib/supabase.ts         # Supabase client configuration
│   ├── logic/                  # UI/UX logic modules
│   │   ├── theme.ts            # Dark/light theme manager
│   │   ├── gamification.ts     # XP/Level system
│   │   ├── animations.ts       # Text glitch, staggered reveal
│   │   └── mobile-menu.ts      # Mobile navigation
│   ├── engine/                 # WebGL Game Engine
│   │   ├── WebGLContext.ts     # WebGL context management
│   │   ├── Shader.ts           # Shader utilities
│   │   ├── Texture.ts          # Texture loading
│   │   ├── SpriteRenderer.ts   # 2D sprite rendering
│   │   ├── PostProcessor.ts    # Post-processing effects
│   │   └── AudioSystem.ts      # Web Audio API wrapper
│   └── game/                   # Game Logic
│       ├── Launcher.ts         # Game initialization
│       ├── Game.ts             # Main game loop
│       ├── Entity.ts           # Base entity class
│       ├── InputHandler.ts     # Keyboard input
│       ├── ScoreManager.ts     # Leaderboard via Supabase
│       ├── entities/           # Game entities
│       │   ├── Player.ts
│       │   ├── Invader.ts
│       │   └── Projectile.ts
│       ├── states/             # Game states (State pattern)
│       │   ├── AttractState.ts
│       │   ├── InsertCoinState.ts
│       │   ├── PlayState.ts
│       │   └── GameState.ts    # Base state interface
│       └── systems/            # ECS-like systems
│           ├── ArcadeSystems.ts
│           └── MovementSystem.ts
├── tests/                      # Vitest test suite
├── index.html                  # Main HTML (landing page + game)
├── trainer.html                # Training/educational content
├── tailwind.config.js          # Tailwind v4 configuration
├── vite.config.ts              # Vite build configuration
└── tsconfig.json               # TypeScript configuration
```

## Key Architecture Patterns

### 1. Game Engine Architecture
- **WebGL-based rendering** with custom sprite renderer
- **State Pattern** for game states (Attract, InsertCoin, Play, GameOver)
- **Entity-Component-System (ECS)** inspired architecture
- **Post-processing pipeline** for visual effects

### 2. Module Pattern
Each logic module is a self-contained class:
```typescript
// Example: ThemeManager, GamificationSystem, etc.
export class ThemeManager {
    constructor() { /* auto-initializes */ }
}
```

### 3. Gamification System
- XP bar at top of page
- Level progression (01-99+)
- Ranks: Novice → higher ranks
- Persistent via localStorage

### 4. Leaderboard (Supabase)
- Hall of Fame displayed on landing page
- Arcade-style ASCII art UI
- Score submission after gameplay

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## Environment Variables

Create `.env.local` in project root:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

## Styling Guidelines

### Tailwind v4 Conventions
- Uses CSS-first configuration in `tailwind.config.js`
- Custom brand colors: `brand-primary`, `brand-green`, `brand-dark`, `brand-light`
- Dark mode: `dark:` prefix classes
- Glass morphism: `glass-card` utility class

### Common UI Patterns
```html
<!-- Glass card -->
<div class="glass-card border border-gray-200 dark:border-brand-primary/30">

<!-- Glow effects -->
<div class="shadow-[0_0_10px_rgba(124,58,237,0.8)]">

<!-- Glitch text -->
<span class="glitch-text">

<!-- Arcade colors -->
<!-- 1st place: yellow-400, 2nd: cyan-400, 3rd: fuchsia-400 -->
```

## Testing

- **Framework**: Vitest with jsdom environment
- **Test files**: `tests/**/*.test.ts`
- **Setup**: `tests/setup.ts`
- **Coverage**: `@vitest/coverage-v8`

Run tests: `npm test`

## Important Implementation Notes

1. **Game State Management**: Uses a state machine pattern - new states extend `GameState` base class
2. **Input Handling**: `InputHandler` singleton for keyboard state tracking
3. **Score Persistence**: Supabase integration for global leaderboard
4. **Accessibility**: Respects `prefers-reduced-motion` for animations
5. **Performance**: Uses `will-change-transform` for animated elements

## File Naming Conventions

- **Classes**: PascalCase (e.g., `Game.ts`, `Entity.ts`)
- **Instances**: camelCase (e.g., `scoreManager.ts`)
- **Systems**: Suffix with `System` (e.g., `AudioSystem.ts`)
- **States**: Suffix with `State` (e.g., `PlayState.ts`)
- **Tests**: Suffix with `.test.ts`

## Working with the Game

### Adding a New Game Entity
1. Create class in `src/game/entities/`
2. Extend `Entity` base class
3. Add to game loop in `Game.ts`
4. Add collision logic if needed

### Adding a New Game State
1. Create class in `src/game/states/`
2. Implement `GameState` interface
3. Add state transition logic in `Game.ts`

### Modifying the Leaderboard
- Schema managed in Supabase
- Types generated in `src/types/supabase.ts`
- UI logic in `src/main.ts` (search for "Hall of Fame")
