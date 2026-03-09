# 🧵 Textile ERP Frontend (Next.js, TanStack Query, Zustand)

A professional-grade ERP dashboard designed for industrial textile manufacturing. This system provides a high-performance interface for real-time production tracking, beam management, and automated payroll generation.

## 🏗️ System Architecture

This repository represents the **Client-Side Interface** of a full-stack distributed system.

* **Frontend:** Next.js (App Router) + Tailwind CSS
* **Communication:** RESTful API (Axios with Interceptors)
* **Backend:** Node.js + Express + MongoDB ([View Backend Repo](https://github.com/rikhtaa/textile-factory-api.git))

---

## 🚀 Tech Stack

**Framework & Language**

* **Next.js 14** (App Router)
* **TypeScript** (Strict Mode)

**State Management**

* **Server State:** TanStack Query v5 (Optimistic UI, Cache Invalidation)
* **Client State:** Zustand (Persistent Auth & UI State)

**Styling & UI**

* **Tailwind CSS**
* **Shadcn UI** (Radix UI Primitives)
* **Sonner** (Toast Notifications)

**Forms & Networking**

* **React Hook Form + Zod** (Schema Validation)
* **Axios** (JWT Authorization Interceptors)

---

## ✨ Engineering Highlights

### ⚡ Optimistic UI Updates

The application utilizes TanStack Query's `onMutate` hook to provide instant feedback. When a user logs production or updates a worker, the UI reflects the change immediately while the request is in-flight, rolling back only in the rare case of a server error.

### 🧵 Complex Production Logic

* **Beam Tracking:** Automatically calculates `remainingMeters` by aggregating production records against total beam length.
* **Shift-Based Reporting:** Specialized views for 3-shift (A, B, C) operational cycles.
* **Price History Tracking:** Quality records include a historical audit log of price changes to ensure historical reports remain accurate even after a rate hike.

### 📄 Professional Reporting

Integrated PDF generation for all operational reports (Daily Looms, Quality Reports, and Operator Payruns) with CSS media print-optimization.

---

## 📦 Project Structure

```text
src/
├── app/                 # Next.js App Router (Pages & Layouts)
├── components/          # Shadcn + Business-specific UI (Comboboxes, Tables)
├── http/                # API Service Layer (Axios instance & Endpoints)
├── store/               # TypeScript Interfaces & Zustand State
├── hooks/               # Custom React hooks for production logic
└── lib/                 # Shared utility functions

```

---

## 🚦 Deployment & Environment

The application is optimized for deployment on **Vercel** or any Node.js environment.

**Required Environment Variables:**

```env
NEXT_PUBLIC_BACKEND_API_URL=https://your-api-url.com/api

```

---

## 🔗 Related Projects

**Backend API Service**

> **Textile ERP Backend** (Node.js, Express, MongoDB)
> [https://github.com/rikhtaa/textile-factory-api.git]

---

## 🔮 Future Roadmap

* **WebSockets:** Real-time "Live Loom" status monitoring.
* **Inventory:** Yarn inventory tracking and procurement logs.
* **Analytics:** Visualizing production efficiency trends using Recharts.

---

## 👤 Author

**Rekhta**

---

## 📝 License

This project is licensed under the Apache-2.0 License.

---
