# ICOSST-2026

**20th International Conference on Open Source Systems & Technologies (ICOSST 2026)**  
*Organized by Al-Khawarizmi Institute of Computer Science (KICS), University of Engineering and Technology (UET) Lahore, Pakistan*  
**Dates:** 22–23 December 2026

---

## 📌 Project Overview
ICOSST 2026 is an end-to-end, production-grade MERN (MongoDB, Express, React, Node.js) conference management and registration platform. It manages delegate onboarding, dynamic fee calculations, category-based permissions, verification passes, and administrative scheduling.

### Key Capabilities
- **7 Delegate Categories:**
  1. Attendee / Participant
  2. Organizer
  3. Workshop Presenter
  4. Media Person
  5. Invited Speaker
  6. Presenter & Co-Presenter
  7. Paper Presenter
- **Role-Tailored Dashboards:** Dedicated operational interfaces customized for each participant category upon registration or sign-in.
- **Admin Event Master Hub:** Comprehensive oversight of conference events, session readiness, room capacities, audit logs, and delegate distribution across all categories.
- **Official Institutional Branding:** Authentic 20th IEEE ICOSST 2026 emblem and UET academic aesthetic.
- **Zero-Docker Flexibility:** Built with an embedded `MongoMemoryReplSet` fallback enabling immediate local development with full replica-set ACID transaction support without requiring local MongoDB or Docker daemon.

---

## 🏗️ Architecture & Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons, React Router 7
- **Backend:** Node.js, Express, Mongoose, JSON Web Tokens (JWT), bcryptjs
- **Database:** MongoDB (Supports MongoDB URI or auto-starting In-Memory Replica Set)
- **Tooling:** Concurrently, Vitest, Supertest

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- Git

### 2. Installation
Clone the repository and install root and package dependencies:
```bash
git clone https://github.com/maazwajid99/ICOSST-2026.git
cd ICOSST-2026
npm install
npm --prefix server install
npm --prefix client install
```

### 3. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```
*(Default settings automatically spin up the in-memory MongoDB replica set if no remote URI is configured).*

### 4. Running Locally
Start both backend API server and frontend client concurrently:
```bash
npm run dev
```
Or run individually:
```bash
# Terminal 1 - Backend Server (Port 5000)
npm run dev:server

# Terminal 2 - Frontend Client (Port 5173)
npm run dev:client
```

---

## 👥 Default Test Accounts
Pre-configured seed accounts available for quick evaluation:

| Role / Category | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@kics.edu.pk` | `AdminPass2026!` |
| **Attendee / Participant** | `attendee@test.com` | `AttendeePass2026!` |
| **Organizer** | `organizer@kics.edu.pk` | `OrganizerPass2026!` |
| **Workshop Presenter** | `workshop@test.com` | `WorkshopPass2026!` |
| **Media Person** | `press@techtimes.pk` | `MediaPass2026!` |
| **Invited Speaker** | `keynote@mit.edu` | `SpeakerPass2026!` |
| **Presenter & Co-Presenter** | `presenter@fast.nu` | `PresenterPass2026!` |
| **Paper Presenter** | `author@lums.edu.pk` | `PaperPass2026!` |

---

## 📄 License & Ownership
Copyright © 2026 KICS, UET Lahore. All rights reserved.
