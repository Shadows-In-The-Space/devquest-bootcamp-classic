# Project Context: DevQuest Bootcamp

## Project Overview
**DevQuest Bootcamp** is a high-fidelity, responsive landing page for a specialized Game Development Bootcamp (Graphics Programming with OpenGL/Vulkan). 

The project currently functions as a **static web application** powered by **Vite**. While TypeScript is configured, the primary logic and structure reside within a monolithic `index.html` file, utilizing Tailwind CSS via CDN for styling and embedded JavaScript for interactivity.

## Technology Stack
- **Core:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** 
  - **Tailwind CSS** (via CDN script)
  - Custom CSS (animations, glowing effects, scrollbars) in `<style>` block
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Configuration:** TypeScript (`vite.config.ts`, `tsconfig.json`)
- **Fonts:** Google Fonts (Space Grotesk)
- **Icons:** Material Symbols Outlined

## Key Features
- **Theming:** Toggleable Light/Dark mode with local storage persistence.
- **Gamification:** interactive XP bar, player rank system, and "Level Up" toasts based on scroll progress.
- **Animations:** Custom CSS animations for "breathing" hero images, pulse effects, and scroll-reveal transitions.
- **Responsive Design:** Mobile-first approach using Tailwind's utility classes.

## Project Structure
- **`index.html`**: The main entry point containing all markup, embedded scripts (XP logic, dark mode), and styles.
- **`Content.md`**: The source copy/text used for the website content. Refer to this when updating text.
- **`vite.config.ts`**: Vite configuration file (sets up port 3000, environment variables).
- **`package.json`**: Defines scripts and dependencies (minimal setup, no framework dependencies like React currently installed).
- **`index.tsx`**: Currently empty/unused.

## Development Workflow

### Prerequisites
- Node.js installed.

### Commands
| Command | Description |
| :--- | :--- |
| `npm install` | Install development dependencies (Vite, Typescript). |
| `npm run dev` | Starts the local development server at `http://localhost:3000`. |
| `npm run build` | Builds the project for production. |
| `npm run preview` | Previews the production build locally. |

### Development Conventions
- **Styling:** Primary styling should be done via Tailwind utility classes. Custom CSS in the `<head>` should be reserved for complex animations or pseudo-elements not easily handled by Tailwind.
- **Scripting:** Currently, logic is embedded at the bottom of `index.html`. For larger features, consider migrating to separate `.ts` files and importing them.
- **Content:** The text in `index.html` should reflect the structure defined in `Content.md`.

## Future Considerations
- The project is set up with TypeScript and Vite, allowing for an easy migration to a framework like React or Vue if interactivity requirements grow. Currently, `index.tsx` is present but empty.
