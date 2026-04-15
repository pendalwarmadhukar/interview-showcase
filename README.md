<p align="center">
  <h1 align="center">🚀 Interview Showcase</h1>
</p>

<h3 align="center"><font color="#3b82f6">Modern React UI · RESTful API · MongoDB Persistence · Recruiter Ready</font></h3>

<p align="center">
  <img src="https://img.shields.io/badge/REACT-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/NODE.JS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/EXPRESS.JS-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MONGODB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Stars-0-gray?style=flat-square" />
  <img src="https://img.shields.io/badge/Forks-0-gray?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Production_Ready-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Type-Portfolio_Showcase-blueviolet?style=flat-square" />
</p>

<p align="center">
  <b><a href="#-getting-started">Quick Start</a> &nbsp;·&nbsp;
  <a href="https://github.com/pendalwarmadhukar/interview-showcase">Repository</a> &nbsp;·&nbsp;
  <a href="https://github.com/pendalwarmadhukar/interview-showcase/issues">Report Bug</a> &nbsp;·&nbsp;
  <a href="https://github.com/pendalwarmadhukar/interview-showcase/issues">Request Feature</a></b>
</p>

<br/>

<p align="center">
  <b>Table of Contents</b><br/>
  <a href="#-overview">01 Overview</a> · <a href="#-problem-statement">02 Problem Statement</a> · <a href="#-solution-architecture">03 Solution Architecture</a> · <a href="#-system-architecture">04 System Architecture</a><br/>
  <a href="#-tech-stack">05 Tech Stack</a> · <a href="#-core-features">06 Core Features</a> · <a href="#-project-structure">07 Project Structure</a> · <a href="#-getting-started">08 Getting Started</a><br/>
  <a href="#-environment-variables">09 Environment Variables</a> · <a href="#-api-reference">10 API Reference</a> · <a href="#-how-it-works">11 How It Works</a> · <a href="#-future-enhancements">12 Future Enhancements</a><br/>
  <a href="#-contributing">13 Contributing</a> · <a href="#-author">14 Author</a>
</p>

<br/>

---

## ◈ Overview

**Interview Showcase** is a production-ready, full-stack MERN application built to present my skills, projects, and professional experience to recruiters and hiring teams in a live, interactive format.

This is not just a portfolio — it is an engineering statement. Every component, API route, and database schema was designed to reflect the real-world development standards expected in a senior engineering role. From RESTful API design and JWT authentication to React component architecture and MongoDB data modeling — this project demonstrates the complete lifecycle of building a modern web application.

---

## ◈ Problem Statement

A traditional PDF resume fails to communicate real engineering capability:

- **Static Content** → Recruiters cannot interact with or verify your actual skills from a PDF.
- **No Live Proof** → Listing "React" or "Node.js" on a resume does not demonstrate production-level understanding.
- **Poor Presentation** → Generic resume templates do not differentiate skilled developers from average ones.

Developers need a **live, dynamic platform** that proves technical depth, design taste, and full-stack capability — all in a single URL.

---

## ◈ Solution Architecture

Interview Showcase implements a clean Full-Stack Request Pipeline across five layers:

| Stage | Component | What Happens |
|:---:|:---|:---|
| 01 | **React Frontend** | User lands on the dashboard and browses projects, skills, and contact info. |
| 02 | **Axios HTTP Client** | React fires authenticated API requests to the Express backend. |
| 03 | **Express REST API** | Routes validate JWT tokens and process each incoming request. |
| 04 | **Mongoose ORM** | Business logic queries MongoDB Atlas for structured data. |
| 05 | **MongoDB Atlas** | Persistent cloud database returns data back up the pipeline to the UI. |

---

## ◈ System Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                      User / Browser                             │
│   Views Portfolio  ·  Browses Projects  ·  Submits Contact Form │
└──────────────────────────────┬──────────────────────────────────┘
                               │  HTTP Request (Axios)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Express.js REST API                           │
│                                                                 │
│  ┌────────────────────┐      ┌──────────────────────────────┐   │
│  │ JWT Auth Validator │      │  Route Handlers & Controllers │   │
│  │ (Bearer Header)    │ ──►  │  (Projects, Skills, Contact) │   │
│  └────────────────────┘      └──────────────┬───────────────┘   │
└─────────────────────────────────────────────┼───────────────────┘
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MongoDB Atlas                               │
│                                                                 │
│  Stores projects, skills, user data & contact form submissions. │
│  Mongoose schemas enforce data integrity and ownership rules.   │
└──────────────────────────────┬──────────────────────────────────┘
                               │  JSON Response
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                React.js Frontend Dashboard                      │
│   Component Rendering · State Management · Responsive Design    │
└─────────────────────────────────────────────────────────────────┘
```

---

## ◈ Tech Stack

| Layer | Technology | Role |
|---|---|---|
| **Frontend** | React 18, React Router DOM, Axios | Component-based UI, routing, API communication |
| **Styling** | CSS3 / Tailwind CSS | Responsive layouts, animations, modern aesthetics |
| **Backend** | Node.js, Express.js | RESTful API server, middleware, route handling |
| **Database** | MongoDB Atlas (Mongoose) | Persistent data storage, schema modeling |
| **Auth** | JWT, bcryptjs | Secure session handling, hashed credentials |
| **Dev Tools** | Nodemon, Vite / CRA | Hot reload, fast development builds |

---

## ◈ Core Features

🎯 **Interactive Portfolio Dashboard**
A fully dynamic React dashboard showcasing projects, skills, and experience — fetched live from the MongoDB backend.

🔐 **JWT Authentication System**
Secure login and session management built with JSON Web Tokens and bcrypt-hashed passwords stored in MongoDB.

📡 **RESTful API Backend**
A clean, well-structured Express.js API with separated route handlers and controllers for scalable architecture.

🗄️ **MongoDB Data Persistence**
All project data, skills, and contact submissions are persisted in MongoDB Atlas using Mongoose schema models.

📬 **Functional Contact Form**
A working contact form that submits data directly to the Express API and stores it in the database — no third-party services.

📱 **Fully Responsive UI**
Pixel-perfect layout that works seamlessly across desktop, tablet, and mobile viewports.

🔍 **Real-Time Search & Filter**
Projects and skills are instantly filterable on the frontend with zero-latency client-side search logic.

---

## ◈ Project Structure

```text
interview-showcase/
│
├── backend/
│   ├── config/
│   │   └── db.js                   # MongoDB Atlas connection logic
│   ├── controllers/
│   │   ├── authController.js       # Register, login, JWT generation
│   │   ├── projectController.js    # CRUD for project data
│   │   └── contactController.js    # Contact form submission handler
│   ├── models/
│   │   ├── User.js                 # User schema with bcrypt pre-save
│   │   ├── Project.js              # Project metadata schema
│   │   └── Contact.js              # Contact form submission schema
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth/*
│   │   ├── projectRoutes.js        # /api/projects/*
│   │   └── contactRoutes.js        # /api/contact/*
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification middleware
│   ├── .env                        # Environment variables (Git ignored)
│   └── server.js                   # Express entry point & CORS config
│
├── frontend/
│   └── src/
│       ├── components/             # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── ProjectCard.jsx
│       │   └── SkillBadge.jsx
│       ├── pages/                  # Page-level route components
│       │   ├── Home.jsx
│       │   ├── Projects.jsx
│       │   ├── Skills.jsx
│       │   └── Contact.jsx
│       ├── assets/                 # Images, icons, static files
│       ├── App.jsx                 # Root component & React Router setup
│       └── main.jsx                # React DOM entry point
│
├── .gitignore
└── README.md
```

---

## ◈ Getting Started

**1. Clone the Repository**

```bash
git clone https://github.com/pendalwarmadhukar/interview-showcase.git
cd interview-showcase
```

**2. Backend Setup**

```bash
cd backend
npm install
```

Create `backend/.env` (see [Environment Variables](#-environment-variables)), then:

```bash
npm start
# Server boots on http://localhost:5000
```

**3. Frontend Setup**

```bash
cd frontend
npm install
npm start
# Dashboard available on http://localhost:3000
```

**4. Run Both Simultaneously (if configured)**

```bash
# From the root directory
npm run dev
```

---

## ◈ Environment Variables

Create a `backend/.env` file with the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

🔒 **Never commit `.env` to version control. The root `.gitignore` handles protection.**

---

## ◈ API Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Authenticate user and return JWT | Public |
| `GET` | `/api/projects` | Fetch all showcase projects | Public |
| `POST` | `/api/projects` | Add a new project entry | Authenticated |
| `PUT` | `/api/projects/:id` | Update an existing project | Authenticated |
| `DELETE` | `/api/projects/:id` | Delete a project from the database | Authenticated |
| `POST` | `/api/contact` | Submit a contact form message | Public |

---

## ◈ How It Works

```text
📤  Recruiter visits the live portfolio URL
          │
          ▼
⚛️   React renders the dashboard with smooth animations
          │
          ▼
📡  Axios fires GET requests to Express API endpoints
          │
          ▼
🔐  JWT middleware validates session tokens on protected routes
          │
          ▼
🗄️   Mongoose queries MongoDB Atlas for projects and skills data
          │
          ▼
📊  JSON response flows back to React and renders dynamically
          │
          ▼
📬  Recruiter submits contact form → stored directly in MongoDB
```

---

## ◈ Future Enhancements

- 📊 **Admin Dashboard** — A private panel to add, update, and delete projects without touching the codebase.
- 🌐 **Blog Section** — Write and publish technical articles directly from the platform.
- 🌙 **Dark / Light Mode Toggle** — User preference-based theme switching stored in localStorage.
- 🔗 **Live Project Previews** — Embed live iframe previews of deployed projects within cards.
- 📱 **React Native Mobile App** — An iOS/Android companion client for the portfolio.
- 📈 **Visitor Analytics** — Track and visualize portfolio visits and recruiter engagement metrics.

---

## ◈ Contributing

Contributions are welcome!

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/new-section

# 3. Commit your changes
git commit -m "Add: new skills section component"

# 4. Push to your fork
git push origin feature/new-section

# 5. Open a Pull Request on GitHub
```

---

## ◈ Author

**Madhukar Pendalwar**
Full Stack Developer · React Engineer · MERN Stack Specialist

- 🐙 GitHub: [@pendalwarmadhukar](https://github.com/pendalwarmadhukar)
- 💼 LinkedIn: _(Add your LinkedIn URL)_
- 📧 Email: _(Add your email)_

---

⭐ Star this repo if it impressed you · 🔁 Share with your network · 💡 Open an issue for feedback

Built with precision · Designed for recruiters · Proving skills through code

---

## ◈ License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for full details.
