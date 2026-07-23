# AI Project Copilot

AI Project Copilot transforms project documents into actionable team knowledge.

## Stack

- JavaScript and JSX
- React
- Next.js App Router
- Tailwind CSS

## Project structure

- `app/` contains the landing, workspace, project, dashboard, and settings routes.
- `components/` contains focused layout, dashboard, and shared UI components.
- `data/mockData.js` contains realistic prototype data.
- `lib/helpers.js` contains small shared helpers.

## Commands

```bash
npm install
npm run dev
npm run build
npm start
```

Prototype interactions use local React state, `localStorage`, and
`sessionStorage`, so the product can be presented without a backend or external
account. The standard Next.js project can be deployed directly to Vercel.
