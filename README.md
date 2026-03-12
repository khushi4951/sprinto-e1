# 🚀 Sprinto — Modern Project Management System

Sprinto is a lightweight **project and sprint management application** inspired by tools like Jira.  
It helps development teams organize their work using **sprints, task boards, and backlog management**.

---

# 🧩 Tech Stack

## Backend
- **Node.js**
- **Express.js**
- RESTful JSON APIs

## Frontend
- **Single Page Application (SPA)**
- HTML
- CSS
- Vanilla JavaScript

Frontend is served by Express from the `/public` directory.

## Storage
- JSON files stored inside `/data`
- Managed using Node.js `fs` module

---

# ✨ Features

## 🔐 Authentication
- User **Sign Up** and **Login**
- Server-side session management
- Sessions stored in `data/sessions.json`
- Session referenced via **HttpOnly cookies**

---

## 🏃 Sprint Management
- Create sprint
- Start sprint *(only one sprint can be active at a time)*
- Complete sprint *(unfinished issues move back to backlog)*
- View active sprint

---

## 📋 Kanban Board
- Drag and drop issues between columns

Workflow columns:
- **Todo**
- **In Progress**
- **Done**

---

## 📦 Backlog View
- Issues grouped by sprint
- Collapsible sections
- Easy backlog prioritization

---

## 👥 Team Management
- Add team members
- Assign roles
- Assign issues to members

---

## 🎨 User Interface
- Modern **dark themed UI**
- Responsive layout
- Smooth animations
- Sidebar navigation
- SPA-style page routing

---

# 📁 Project Structure
sprinto-main/
│
├── server.js
│
├── routes/
│
├── controllers/
│
├── middleware/
│
├── data/
│ ├── users.json
│ ├── sessions.json
│ ├── sprints.json
│ ├── issues.json
│ └── team.json
│
└── public/
├── index.html
├── styles.css
└── app.js

---

# ▶️ Running the Project Locally

### 1. Navigate to the project folder

```bash
cd sprinto-main

---

# ▶️ Running the Project Locally

### 1. Navigate to the project folder

```bash
cd sprinto-main
