<div align="center">

# 🛡️ SecureVault

### **Zero-Knowledge Client-Side Encrypted Password Manager**

*An enterprise-grade, privacy-first password management platform built with React 18, Node.js, and native Web Crypto APIs.*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)

</div>

---

## 📌 What is SecureVault?

**SecureVault** is a full-stack, zero-knowledge password manager web application. It enables users to securely generate, store, organize, and manage sensitive credentials (usernames, passwords, website URLs, and private notes).

Unlike traditional web applications where sensitive data is encrypted on the server, **SecureVault encrypts everything inside your browser** before any data is sent over the network.

---

## 💡 Why I Built It?

1. **Solving Centralized Password Breach Risks**:
   Most standard web applications store user passwords on centralized servers or encrypt them server-side. If the database or server is compromised, user data is exposed. SecureVault was built using a **Zero-Knowledge Architecture**, ensuring that even if the backend database is hacked, stored ciphertexts remain mathematically impossible to read without the user's master password.

2. **Moving Beyond Outdated Password Regex Rules**:
   Traditional password checkers enforce arbitrary character rules (e.g. requiring 1 uppercase, 1 number) which lead to weak, predictable passwords like `P@ssword1!`. I integrated Dropbox's industry-standard **`zxcvbn` engine** to evaluate real-world password strength using entropy calculations and dictionary matching.

3. **Demonstrating Senior Engineering & Security Concepts**:
   I created this project to demonstrate advanced computer science concepts: client-side Web Crypto APIs (PBKDF2 key derivation, AES-GCM 256-bit AEAD encryption), clean MERN architecture, zero cumulative layout shift (CLS), and modern UI/UX design inspired by 1Password and Linear.

---

## ✨ Core Features

### 🔒 Cryptography & Security
- **Zero-Knowledge Architecture**: Master Password and plaintext credentials never touch the server or network.
- **Client-Side PBKDF2 Key Derivation**: 100,000 SHA-256 iterations derive two distinct keys in browser RAM:
  - `authHash`: Sent to the server for authentication (double-hashed with `bcrypt` on backend).
  - `encryptionKey`: Retained strictly in browser memory for AES-GCM encryption/decryption.
- **AES-GCM 256-bit Encryption**: Field-level encryption using unique 12-byte initialization vectors (IVs) generated via `crypto.getRandomValues()`.
- **Memory-Only Key Retention**: Encryption keys are kept in React/Zustand memory and purged on session lock/logout to prevent XSS persistence attacks.

### 🧠 Password Intelligence & Generator
- **`zxcvbn` Strength Checker**: Real-time entropy scoring (0–4 scale), realistic crack time estimates (*"Crack time: centuries"*), and actionable security suggestions.
- **Cryptographic Password Generator**: Configurable generator (length, uppercase, lowercase, numbers, symbols) utilizing `crypto.getRandomValues()`.

### 🎨 Modern UI & User Experience
- **1Password & Linear Aesthetic**: Styled using Google Fonts (`Space Grotesk`, `Inter`, `JetBrains Mono`), dark slate surfaces, and subtle glow effects.
- **Framer Motion Micro-Interactions**: Smooth 60fps press/hover animations, backdrop blur modals, and drawer menus.
- **Zero CLS Skeleton Loaders**: Layout-matched pulse skeleton loaders eliminate layout shift during payload decryption.
- **Interactive Copy Toasts**: Instant notification feedback when copying usernames or passwords to clipboard.
- **Vault Security Score**: Live dashboard meter calculating overall vault health index.
- **Category Filtering & Search**: Instant client-side filtering by category (Social, Finance, Work, Personal, Other) and quick search.

---

## 🏗️ System Architecture & Data Flow

```
                                    USER BROWSER
 ┌─────────────────────────────────────────────────────────────────────────────────┐
 │ React 18 + Vite + Tailwind CSS + Framer Motion                                  │
 │                                                                                 │
 │ Master Password ──► PBKDF2 Derivation (100,000 iterations, SHA-256)              │
 │                             │                                                   │
 │             ┌───────────────┴───────────────┐                                   │
 │             ▼                               ▼                                   │
 │   Authentication Key                Vault Encryption Key                        │
 │       (SHA-256)                           (AES-GCM 256)                         │
 │             │                               │                                   │
 │             ▼                               ▼                                   │
 │          authHash                      Local RAM Only                           │
 └─────────────┬───────────────────────────────┬───────────────────────────────────┘
               │ JSON over HTTPS               │ Encrypted Payload (Ciphertext)
               ▼                               ▼
 ┌───────────────────────────┐       ┌───────────────────┐
 │   Express.js Backend      │       │ AES-256-GCM       │
 │   - JWT Verification      │       │ Ciphertext + IV   │
 │   - Helmet Headers        │       └─────────┬─────────┘
 │   - Rate Limiting         │                 │
 └─────────────┬─────────────┘                 │
               │ Mongoose ORM                  │
               ▼                               ▼
 ┌─────────────────────────────────────────────────────────────────────────────────┐
 │                                MONGODB ATLAS                                    │
 │ Stores: authHash, salt, ciphertext, initialization vectors (IVs)                │
 └─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 💎 Feature Comparison Matrix

| Feature | Standard Web Apps | SecureVault |
| :--- | :---: | :---: |
| **Data Encryption Location** | Server-Side | 🔒 **Client-Side Browser** |
| **Master Password Exposure** | Sent to Server | 🛡️ **Zero Server Exposure** |
| **Key Derivation Standard** | Basic Hashing | 🔑 **PBKDF2 (100k Iterations)** |
| **Ciphertext Integrity** | None / Basic | 🛡️ **AES-GCM Authenticated (AEAD)** |
| **Password Strength** | Regex Rules | 🧠 **Dropbox `zxcvbn` Entropy Engine** |
| **Layout Shift (CLS)** | Unstable Loaders | ⚡ **Zero CLS Skeleton Suite** |

---

## 💻 Tech Stack

### **Frontend**
- **Core**: React 18, Vite, ES Modules
- **Styling & System**: Tailwind CSS, Google Fonts (`Space Grotesk`, `Inter`, `JetBrains Mono`)
- **Animations**: Framer Motion 60fps micro-interactions
- **Security Engine**: `zxcvbn` (Dropbox Strength Estimator)
- **State & Router**: Zustand, React Router DOM
- **HTTP Client**: Axios with JWT Interceptors

### **Backend**
- **Runtime**: Node.js (`"type": "module"`)
- **Framework**: Express.js with Layered Clean Architecture (Routes → Controllers → Services → Models)
- **Database**: MongoDB & Mongoose ORM
- **Security & Headers**: Helmet, CORS origin controls, `express-rate-limit`, `bcryptjs`, JWT

---

## 📁 Repository Structure

```
SecureVault/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── api/                 # Axios client & service calls
│   │   ├── components/          # Cards, Modals, UI Primitives
│   │   │   ├── ui/              # Button, Skeleton, ConfirmationDialog, Toast
│   │   │   └── skeletons/       # DashboardSkeleton, VaultSkeleton, ProfileSkeleton
│   │   ├── crypto/              # Web Crypto API (PBKDF2 & AES-GCM)
│   │   ├── layouts/             # AuthLayout, DashboardLayout
│   │   ├── pages/               # Login, Register, Dashboard, Vault, Profile
│   │   ├── store/               # Zustand state management
│   │   └── utils/               # zxcvbn strength evaluation wrapper
│   └── vercel.json              # Vercel SPA route rewrite rules
└── server/                      # Node.js + Express Backend
    ├── config/                  # MongoDB connection setup
    ├── controllers/             # Express HTTP request handlers
    ├── middleware/              # JWT auth guard & centralized error handling
    ├── models/                  # Mongoose data schemas
    ├── routes/                  # API endpoint definitions
    ├── services/                # Business logic layer
    └── server.js                # Server entry point
```

---

## ⚙️ Quick Start Guide (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/SecureVault.git
cd SecureVault
```

### 2. Configure & Run Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```
*Server will listen on `http://localhost:5000`*

### 3. Configure & Run Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
*Frontend application will run on `http://localhost:5173`*

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
