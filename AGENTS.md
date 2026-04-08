# Repository Guidelines

## Project Structure & Module Organization
This is a Vite + React frontend. Keep application code in `src/` and treat `dist/` as generated output.

- `src/pages/`: route-level screens such as `Home.jsx`, `Game.jsx`, and `Result.jsx`
- `src/components/`: reusable UI pieces such as `NoteCard.jsx` and `NoteSubmitForm.jsx`
- `src/lib/`: non-UI logic and API helpers, for example `game.js`, `scoring.js`, and `api.js`
- `src/data/xhs_collection/`: static note data, including `final_notes.json` and local note images
- `public/`: static assets and fonts served as-is

Co-locate tests with the code they cover using `*.test.js` or `*.test.jsx`.

## Build, Test, and Development Commands
- `npm install`: install dependencies from `package-lock.json`
- `npm run dev`: start the Vite dev server with `/api` proxied to `http://localhost:8000`
- `npm run build`: create a production bundle in `dist/`
- `npm run preview`: serve the production build locally
- `npm test`: run Vitest in watch mode
- `npm test -- --run`: run the full test suite once for CI-style checks

## Coding Style & Naming Conventions
Follow the existing style in `src/`: ES modules, React function components, and minimal abstractions.

- Use 2-space indentation in JavaScript and JSX
- Prefer `PascalCase` for components and page files, `camelCase` for functions and helpers
- Keep route screens in `src/pages/` and shared logic in `src/lib/`
- Use Tailwind utilities and `src/index.css` theme tokens before adding custom CSS
- Match the current no-semicolon JavaScript style

## Testing Guidelines
Tests use Vitest with `jsdom`, React Testing Library, and `@testing-library/jest-dom` via `src/test-setup.js`.

- Name tests `*.test.js` or `*.test.jsx`
- Prefer behavior-focused tests over implementation details
- Mock network boundaries in `src/lib/api.js` tests rather than hitting a live backend
- Add or update tests when changing scoring, note sampling, API flows, or interactive UI states

## Commit & Pull Request Guidelines
Recent history follows Conventional Commits: `feat:`, `fix:`, `refactor:`, and `chore:`. Keep subjects short and imperative, for example: `fix: proxy api requests in dev`.

PRs should include a concise summary, linked issue or task when available, test notes, and screenshots or recordings for UI changes. Call out backend contract changes explicitly when touching `/api` requests.

## Configuration Tips
Keep API calls relative to `/api` in `src/lib/api.js`; do not hardcode environment-specific hosts. Do not commit generated files from `dist/`, local coverage output, or `node_modules/`.
