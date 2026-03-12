# 🚀 Sprinto — Modern Project Management (Express + Vanilla JS)
The platform helps development teams organize their work using sprints, task boards, and backlog management.

Backend: Node.js + Express (REST JSON APIs)
Frontend: Single Page Application (HTML/CSS/vanilla JS) served by Express from /public
Storage: JSON files under /data using Node’s fs module
Features
Authentication
Sign up / Login
Session stored server-side in data/sessions.json and referenced by an HttpOnly cookie
Sprint Management
Create sprint
Start sprint (only one active at a time)
Complete sprint (moves unfinished issues back to backlog)
View active sprint
Kanban Board
Drag & drop issues across columns
Columns: Todo, In Progress, Done
Backlog View
Issues grouped by sprint
Collapsible sections
Team Management
Add members
Assign roles
Assign issues (via issue editor)
UI
Dark modern UI, responsive, smooth animations, sidebar nav, SPA routing
Project structure
sprinto-main/
├── server.js
├── routes/
├── controllers/
├── middleware/
├── data/
│   ├── users.json
│   ├── sessions.json
│   ├── sprints.json
│   ├── issues.json
│   └── team.json
└── public/
    ├── index.html
    ├── styles.css
    └── app.js
Run locally
cd sprinto-main
npm install
npm run dev
Open http://localhost:3000.

API overview (all JSON)
POST /api/auth/signup

POST /api/auth/login

POST /api/auth/logout

GET /api/auth/me

GET /api/sprints

POST /api/sprints

GET /api/sprints/active

POST /api/sprints/:id/start

POST /api/sprints/:id/complete

GET /api/issues (optional query: ?sprintId=...)

POST /api/issues

PATCH /api/issues/:id

POST /api/issues/:id/move

DELETE /api/issues/:id

GET /api/team

POST /api/team

PATCH /api/team/:id
