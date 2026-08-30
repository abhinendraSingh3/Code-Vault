<div align="center">

  <h1>⚡ Code Vault ⚡</h1>
  <p><strong>A modern, full-stack code snippet management platform built with NestJS, React 19, PostgreSQL, and Monaco Editor.</strong></p>

  <p>
    <a href="#key-features">Key Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#api-endpoints">API Endpoints</a> •
    <a href="#license">License</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/NestJS-v11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
    <img src="https://img.shields.io/badge/React-v19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-v5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-v6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/PostgreSQL-v16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/TypeORM-v11-FE0803?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM" />
  </p>

</div>

---

## 📌 Overview

**Code Vault** is a centralized developer workspace to store, organize, version, and share code snippets effortlessly. Equipped with VS Code's **Monaco Editor** integration, version tracking, multi-language support, and tokenized snippet sharing, Code Vault simplifies code reuse and collaboration for developers and technical teams.

---

## ✨ Key Features

- 💻 **Monaco Code Editor**: Full-fledged code editing experience powered by VS Code's editor engine, featuring syntax highlighting, line numbers, and theme support across multiple programming languages.
- 🔒 **Secure Authentication**: User sign-up, login, and token-based state management implemented via NestJS Passport JWT strategy and bcrypt password hashing.
- 📝 **Snippet Management**: Create, edit, inspect, and delete snippets with customizable titles, descriptions, programming language categorization, and tags.
- 📜 **Version History & Revision Control**: Automatic snippet versioning tracking previous edits (`SnippetVersions`), enabling developers to inspect changes and preserve historical revisions.
- 🔗 **Tokenized Snippet Sharing**: Share code snippets publicly or securely via custom generated share tokens (`ShareToken`).
- 🔍 **Smart Search & Filtering**: Instantly search snippets by title, filter by target programming languages, or browse shared vaults.
- 👤 **User Profiles & Customization**: Manage user credentials, profile details, and account settings.

---

## 🛠️ Tech Stack

### **Backend**
- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **Database & ORM**: PostgreSQL with [TypeORM](https://typeorm.io/)
- **Authentication**: Passport.js with JWT Strategy & Bcrypt password hashing
- **Validation**: `class-validator` & `class-transformer`
- **Config**: `@nestjs/config` for environment variables

### **Frontend**
- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/) & TypeScript
- **Code Editor**: `@monaco-editor/react` (Monaco Editor)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/) with request/response interceptors for automatic JWT handling

---

## 📁 Project Structure

```text
code-vault-nest/
├── backend/                  # NestJS Backend API
│   ├── src/
│   │   ├── auth/             # JWT Authentication (Login/Register guards & strategies)
│   │   ├── users/            # User management service, controller, and entity
│   │   ├── snippet/          # Snippets, Versioning, and Share Token modules
│   │   │   ├── entities/     # TypeORM Entities (Snippet, SnippetVersions, ShareToken)
│   │   │   ├── dto/          # Data Transfer Objects & validation rules
│   │   │   └── ...
│   │   ├── app.module.ts     # Main application module & PostgreSQL TypeORM setup
│   │   └── main.ts           # Application entry point & CORS configuration
│   ├── .env.example          # Sample backend environment configuration
│   └── package.json
│
├── frontend/                 # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── api/              # Axios API instances & service functions
│   │   ├── components/       # UI Components (Monaco Editor, Cards, Modals)
│   │   ├── pages/            # App pages (Dashboard, Create, Edit, Versions, Search, Profile)
│   │   ├── types/            # TypeScript interfaces & types
│   │   ├── App.tsx           # Router & navigation setup
│   │   └── main.tsx          # Frontend entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

Follow the instructions below to get a local development instance up and running.

### **Prerequisites**

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) database server running locally or hosted remotely

---

### **1. Clone the Repository**

```bash
git clone https://github.com/your-username/code-vault-nest.git
cd code-vault-nest
```

---

### **2. Setup & Run Backend**

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` folder based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variables with your PostgreSQL credentials:
   ```env
   port=4000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_postgres_password
   DB_NAME=codeVaultNestJs
   jwtSecret=your_super_secret_jwt_key
   jwt_expiry=1h
   ```

5. Start the backend development server:
   ```bash
   npm run start:dev
   ```

   The server will start running at `http://localhost:4000`.

---

### **3. Setup & Run Frontend**

1. Open a new terminal tab and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 🔑 Environment Variables

### Backend Configuration (`backend/.env`)

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `port` | Port number for the NestJS API server | `4000` |
| `DB_HOST` | PostgreSQL Database Host | `localhost` |
| `DB_PORT` | PostgreSQL Database Port | `5432` |
| `DB_USERNAME` | PostgreSQL Database User | `postgres` |
| `DB_PASSWORD` | PostgreSQL Password | — |
| `DB_NAME` | PostgreSQL Database Name | `codeVaultNestJs` |
| `jwtSecret` | Secret key for JWT signing | — |
| `jwt_expiry` | Expiration time for JWT tokens | `1h` |

---

## 🔌 API Endpoints Summary

### **Authentication & Users**
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/signup` | Register a new user account | ❌ |
| `POST` | `/auth/login` | Authenticate user & return JWT token | ❌ |
| `GET` | `/users/profile` | Fetch logged-in user profile details | 🔒 |
| `PATCH` | `/users/profile` | Update user profile information | 🔒 |

### **Snippets & Versioning**
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/snippet` | Get all snippets for logged-in user | 🔒 |
| `POST` | `/snippet` | Create a new code snippet | 🔒 |
| `GET` | `/snippet/:id` | Get details of a specific snippet | 🔒 |
| `PATCH` | `/snippet/:id` | Update snippet content & create new version | 🔒 |
| `DELETE` | `/snippet/:id` | Delete a snippet | 🔒 |
| `GET` | `/snippet/:id/versions` | View version history for a snippet | 🔒 |
| `POST` | `/snippet/:id/share` | Generate a shareable token for snippet | 🔒 |
| `GET` | `/snippet/share/:token` | View shared snippet via public token | ❌ |

---

## 🧪 Testing & Linting

### **Backend**
```bash
# Run unit tests
npm --prefix backend run test

# Run e2e tests
npm --prefix backend run test:e2e

# Run linter
npm --prefix backend run lint
```

### **Frontend**
```bash
# Run linter
npm --prefix frontend run lint
```

---

## 🤝 Contributing

Contributions are always welcome! Feel free to open an issue or submit a pull request if you'd like to improve Code Vault.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
