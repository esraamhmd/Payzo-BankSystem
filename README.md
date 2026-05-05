# 💰 Payzo - Banking System  

<div align="center">

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
<img src="https://img.shields.io/badge/Material_UI-007FFF?style=for-the-badge&logo=mui&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />

<br/><br/>


### A full-stack modern banking web application - send money, track transactions, and manage finances with a beautiful UI.

<br/>

</div>


https://github.com/user-attachments/assets/2f944150-dc70-4223-b02e-155eee7b7e6c


---

## 📖 Introduction

**Payzo** is a complete full-stack banking system built from scratch with Next.js  and Express. It delivers a real banking experience  account creation, money transfers, deposits, withdrawals, transaction history, and an admin dashboard  all secured with JWT authentication and MongoDB Atlas.

| Typical Banking Tutorial | Payzo |
|--------------------------|-------|
| Fake hardcoded balances | ✅ Real MongoDB database with live balances |
| No real authentication | ✅ JWT with HttpOnly cookies — secure by default |
| No transaction logic | ✅ Full transfer, deposit & withdrawal with validation |
| Desktop only | ✅ Fully responsive — mobile, tablet, and desktop |
| UI library defaults | ✅ Custom Payzo green design system with MUI v6 |
| No admin features | ✅ Full admin panel with user management |
| No charts | ✅ Live spending charts with Recharts |

---

## ✨ Features

### 🔐 Authentication
- Register with name, email, and password
- Login with JWT stored in HttpOnly cookie
- Auto-logout when token expires
- Protected routes — redirect to login if not authenticated

### 💸 Transfer & Payments
- Send money to any Payzo account number instantly
- Deposit funds into your account
- Withdraw cash from your balance
- Real-time balance updates after every transaction

### 📊 Dashboard
- Live balance with account number copy button
- Stat cards - Total Sent, Received, Deposited, Withdrawn
- Activity bar chart - 7-day and 30-day views
- Transaction split donut chart
- Recent transactions table with horizontal scroll on mobile

### 🧾 Transaction History
- Full paginated history of all transactions
- Type, status, amount, and date for every entry
- Color-coded: green for received, red for sent

### 👤 Admin Panel
- System stats — total users, volume, balances
- Full user management table
- Suspend or activate any user account
- Admin-only route protected on both frontend and backend

### 📱 Fully Responsive

| Screen | Layout |
|--------|--------|
| Desktop | Full sidebar + all columns visible |
| Tablet | Collapsible sidebar + horizontal table scroll |
| Mobile | Hamburger drawer + stacked cards |

---

## 🚀 Tech Stack

### Frontend
- **Next.js ** — App Router, server components, file-based routing
- **React.js ** — Latest React with concurrent features
- **TypeScript** — Full type safety across all components and hooks
- **Material UI ** — Component library with custom Payzo green theme
- **Redux Toolkit** — Global auth state management
- **TanStack Query** — Server state, caching, and mutations
- **Recharts** — Bar and donut charts for spending analytics
- **React Hook Form** — Form state management

### Backend
- **Node.js + Express** — REST API with TypeScript
- **MongoDB Atlas + Mongoose** — Cloud database with UUID account numbers
- **JWT** — Stateless auth with HttpOnly cookies
- **Zod** — Request body validation on all endpoints
- **bcryptjs** — Password hashing with salt rounds 12

---

## 🔄 Redux State

| Slice | Stores | Actions |
|-------|--------|---------|
| `auth` | user object, isAuthenticated | `setUser`, `clearUser` |

---

## 🛣️ API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account — starts with $5,000 |
| POST | `/api/auth/login` | Login and set JWT cookie |
| POST | `/api/auth/logout` | Clear JWT cookie |
| GET  | `/api/auth/me` | Get current user |
| GET  | `/api/transactions/summary` | Balance + stats + recent transactions |
| GET  | `/api/transactions` | Paginated transaction history |
| POST | `/api/transactions/transfer` | Send money to another account |
| POST | `/api/transactions/deposit` | Add funds |
| POST | `/api/transactions/withdraw` | Cash out |
| GET  | `/api/admin/stats` | System stats (admin only) |
| GET  | `/api/admin/users` | All users (admin only) |
| PUT  | `/api/admin/users/:id` | Suspend or activate user (admin only) |

---



## 📁 Project Structure

```
bank-system/
├── backend/
│   └── src/
│       ├── config/        # DB + JWT config
│       ├── controllers/   # Auth, transactions, admin
│       ├── middleware/     # Auth guard, validation, errors
│       ├── models/        # User, Transaction (Mongoose)
│       ├── routes/        # authRoutes, transactionRoutes, adminRoutes
│       └── utils/         # Zod validation schemas
│
└── frontend/
    └── src/
        ├── app/           # Next.js pages (login, register, dashboard, transfer, transactions, admin)
        ├── components/    # Sidebar, AppLayout, charts, Toast, TransactionRow
        ├── hooks/         # useAuth, useTransactions, useAdmin
        ├── lib/           # api.ts (fetch wrapper), queryClient
        ├── store/         # Redux store, authSlice
        └── types/         # TypeScript interfaces
```

---

## 🔒 Security

- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT stored in **HttpOnly cookies** — not accessible via JavaScript
- All routes protected with auth middleware
- Admin routes check `role === 'admin'` on the backend
- Environment variables never committed to Git

---


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

<div align="center">

**Built with ❤️ using Next.js + Express + MongoDB**

</div>
