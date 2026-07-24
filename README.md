# AI Project Copilot

A public, frontend-only collaborative project-management prototype built with JavaScript, React, Next.js App Router, JSX, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run build
npm start
```

## Demo workflow

1. Open the Workspace and select the demo project.
2. Enter the permanent seven-character access code shown to the project leader.
3. Review the shared Project Overview.
4. Select a project member to open their personal Dashboard.
5. Complete tasks, ask Project Copilot questions, review uploaded-document changes, open a calendar event, or prepare a Gmail reminder draft.

## Prototype persistence

- Project access and selected member: `sessionStorage`
- Copilot conversation history: project/member-scoped `sessionStorage`
- Tasks, timestamps, document decisions, conflict choices, and activity: project-scoped `localStorage`
- Access codes: project-scoped `localStorage`

Project Copilot is a deterministic, project-grounded demo engine. It builds responses from the current tasks, members, progress, meeting, deadlines, recent activity, and document-review state. It does not call an external AI service or require API credentials.

## External links

Google Calendar and Gmail buttons only open prefilled user-reviewable pages. No email is sent and no calendar event is created automatically.
