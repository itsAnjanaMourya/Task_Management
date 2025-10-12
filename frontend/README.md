# Task Management Frontend

This README explains how the frontend for the Task Management app is organized, how the in-browser mocking works, how to run the project locally, and which libraries are used.

---

## Quick start

Prerequisites:
- Node.js 16+ (recommended) and npm

Install dependencies and start the dev server:

```powershell
cd frontend
npm install
npm start
```

The app will open at http://localhost:3000 by default.

Build for production:

```powershell
cd frontend
npm run build
```

---

## How mocking works

The frontend uses a small, file-local mock API located at `src/api/mockApi.js`.
Key points:
- Storage: mockApi stores data in `localStorage` using these keys:
  - `mock_users` for registered users
  - `mock_notes` for saved notes
  - plus `token`, `user`, `isAuthenticated` are used to represent session state in `localStorage`
- Auth flow:
  - `register(username, email, password)` simulates registration, persists a new user to `mock_users` and returns the created user.
  - `login({ email, password })` authenticates against an in-memory users array (and persisted users), sets a fake token and user in `localStorage`, and returns user + token.
  - `logout()` clears the token and user from `localStorage`.
  - `getCurrentUser()` reads `localStorage` and returns the currently-logged-in user (or `null`).
- Notes API:
  - `getNotes()` returns notes for the current user (reads `mock_notes`).
  - `addNote()`, `updateNote()`, and `deleteNote()` operate on `mock_notes` in `localStorage` and are scoped to the current user.
- Network simulation: each function uses a small `delay()` to simulate latency.

This mocking approach allows the UI to behave like a real client talking to a server while keeping everything client-side and persistent across reloads (until you clear localStorage).

---

## Project structure (key files/folders)

```
frontend/
├─ public/
│  └─ index.html          # HTML template
├─ src/
│  ├─ api/
│  │  └─ mockApi.js       # In-browser mock API (localStorage-backed)
│  ├─ components/         # React components (Navbar, Home, Login, Register,...)
│  ├─ context/            # React contexts (AuthContext)
│  ├─ App.js              # App root + routes
│  ├─ index.js            # App entry: renders App and imports global CSS + bootstrap JS
│  └─ index.css           # global styles (Tailwind directives are here if enabled)
├─ package.json           # frontend dependencies & scripts
└─ README.md              # (this file)
```

---

## Libraries used

From `frontend/package.json`:

Dependencies (runtime):
- react, react-dom — UI library
- react-router-dom — client-side routing
- react-scripts — Create React App tooling
- axios — HTTP client (if used elsewhere)
- bootstrap — UI toolkit (we import CSS & JS bundle in `src/index.js`)
- @fortawesome/react-fontawesome etc. — icon set
- web-vitals — optional perf reporting

DevDependencies (build-time):
- tailwindcss — utility-first CSS framework (project may require additional config to enable)
- postcss, autoprefixer — PostCSS tooling used by Tailwind

Note: versions may be found in `frontend/package.json`.

---

## Tailwind setup notes

If Tailwind classes are not being applied, check the following:

1. `src/index.css` must include the Tailwind directives at the top:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

2. PostCSS needs to be configured. Add `postcss.config.js` in the `frontend/` folder with:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

3. `tailwind.config.js` must exist (CommonJS) and the `content` paths should include `./public/index.html` and `./src/**/*.{js,jsx,ts,tsx}`.

4. After creating/updating these files restart the dev server (`npm start`).

---

## Common development commands

Start development server

```powershell
cd frontend
npm start
```

Run tests (if present)

```powershell
cd frontend
npm test
```

Build production bundle

```powershell
cd frontend
npm run build
```





