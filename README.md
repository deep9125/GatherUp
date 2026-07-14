# 🎉 GatherUp

**GatherUp** is a full-stack event management platform that allows Managers to create, manage, and analyze events, while Users can discover events, book tickets, join groups, and give feedback — all in one place.

---

## 🚀 Features

### 👤 Users
- Register & log in securely (JWT-based auth)
- Browse all upcoming events
- Book tickets and receive confirmation emails with a unique ticket code
- View personal ticket details
- Join event-specific groups and collaborate with attendees
- Rate and leave feedback on events

### 🛠️ Managers
- Create, edit, and delete events (with image upload)
- View all events they manage
- Track attendance — mark attendees as present or absent
- Access event analytics and ratings dashboard

---

## 🏗️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| **Frontend** | React 19, React Router v7, Recharts   |
| **Backend**  | Node.js, Express 5                    |
| **Database** | MongoDB (local), Mongoose             |
| **Auth**     | JWT (`jsonwebtoken`), bcrypt          |
| **Email**    | Nodemailer                            |
| **File Uploads** | Multer                            |
| **Build Tool** | Vite                                |
| **Notifications** | React Hot Toast                  |

---

## 📁 Project Structure

```
GatherUp/
├── src/
│   ├── backend/                  # Express API server
│   │   ├── index.js              # Server entry point
│   │   ├── middleware/
│   │   │   └── auth.js           # JWT protect & authorize middleware
│   │   ├── models/
│   │   │   ├── userModel.js
│   │   │   ├── eventModel.js
│   │   │   └── groupModel.js
│   │   ├── routes/
│   │   │   ├── userRoutes.js
│   │   │   ├── eventRoutes.js
│   │   │   └── groupRoutes.js
│   │   └── utils/
│   │       ├── emailService.js
│   │       └── codeGenerator.js
│   ├── component/                # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── EventCard.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── ManagerDashboard.jsx
│   │   ├── UserSidebar.jsx
│   │   ├── ManagerSidebar.jsx
│   │   └── ViewGroup.jsx
│   ├── pages/                    # Route-level page components
│   │   ├── login.jsx
│   │   ├── SignupPage.jsx
│   │   ├── AllEventsPage.jsx
│   │   ├── EventDetail.jsx
│   │   ├── MyEventPage.jsx
│   │   ├── TicketPage.jsx
│   │   ├── AddEventForm.jsx
│   │   ├── EditEventForm.jsx
│   │   ├── AttendancePage.jsx
│   │   ├── EventAnalytics.jsx
│   │   ├── FeedbackForm.jsx
│   │   └── CreateGroupForm.jsx
│   ├── context/
│   │   └── AppContext.jsx        # Global auth state
│   ├── hooks/
│   │   └── useRedirector.js      # Role-based redirect hook
│   ├── App.jsx                   # Router & protected routes
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── .gitignore
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/GatherUp.git
cd GatherUp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `src/backend/`:

```env
JWT_SECRET=your_super_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

> **Note:** Use a Gmail [App Password](https://support.google.com/accounts/answer/185833) for `EMAIL_PASS` if 2FA is enabled.

---

### 4. Start the backend server

```bash
node src/backend/index.js
```

> Backend runs on **http://localhost:3000**

### 5. Start the frontend dev server

```bash
npm run dev
```

> Frontend runs on **http://localhost:5173**

---

## 🔌 API Overview

### Auth — `/api/users`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login and receive JWT token |

### Events — `/api/events`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/viewAllEvent` | Public | Get all events |
| GET | `/:eventId` | Public | Get single event details |
| POST | `/addEvent` | Manager | Create a new event (with image) |
| PUT | `/:eventId` | Manager | Update an event |
| DELETE | `/:eventId` | Manager | Delete an event |
| POST | `/:eventId/join` | User | Book a ticket for an event |
| POST | `/:eventId/rate` | User | Submit a rating/feedback |
| POST | `/:eventId/attendance` | Manager | Record attendance |
| GET | `/manager/:managerId` | Public | Get events by manager |

### Groups — `/api/groups`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/create` | User | Create a group for an event |
| GET | `/:groupId` | User | View a group |

---

## 🔐 Authentication & Roles

- JWT tokens are stored in React context after login.
- The `protect` middleware validates the token on protected routes.
- The `authorize('Manager')` middleware enforces role-based access.
- Frontend route guards (`ProtectedRoute`) prevent unauthorized navigation.

| Role | Capabilities |
|------|-------------|
| **User** | Browse, book, group, rate events |
| **Manager** | Full CRUD on events, attendance, analytics |

---

## 📧 Email Notifications

After a successful ticket booking, attendees automatically receive a confirmation email containing:
- Event name, date, time, and location
- A **unique ticket code** to present at the event entrance

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
