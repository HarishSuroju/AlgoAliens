# README.md
# Purpose: Project documentation for setup, running, and testing.

# AlgoAliens - Educational Platform

This is a full-stack educational platform built with the MERN stack variation (PostgreSQL, Express, React, Node.js) and styled with TailwindCSS.

---

## 🚀 How to Run

You will need **two separate terminals** to run both the backend and frontend servers.

### 1. Backend Server Setup (`/server`)

-   Navigate to the `server` directory: `cd server`
-   Install dependencies: `npm install`
-   **Database Setup**:
    -   Make sure you have PostgreSQL installed and running.
    -   Create a new database, e.g., `CREATE DATABASE algoaliens_db;`
    -   Create a `.env` file in the `/server` directory by copying `.env.example`.
    -   Fill in your PostgreSQL credentials in the `.env` file.
-   Start the development server: `npm run dev`
-   The server will be running on `http://localhost:5000`.

### 2. Frontend Client Setup (`/client`)

-   Open a **new terminal**.
-   Navigate to the `client` directory: `cd client`
-   Install dependencies: `npm install`
-   Create a `.env` file in the `/client` directory by copying `.env.example` (no changes needed for default setup).
-   Start the development server: `npm run dev`
-   The application will open in your browser at `http://localhost:5173`.

---

## 🧪 API Usage Example (cURL)

1.  **Sign Up a New User:**

    ```sh
    curl -X POST http://localhost:5000/api/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
    ```

2.  **Log In and Get Token:**

    ```sh
    # This command uses `jq` to extract the token. You can also copy it manually.
    TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}' | jq -r .token)
    ```

3.  **Access a Protected Route:**

    ```sh
    curl http://localhost:5000/api/auth/me \
    -H "x-auth-token: $TOKEN"
    ```

---

### Troubleshooting Common Issues

-   **"Routing issues on refresh (404 Not Found)"**: This happens in production when Express doesn't know how to handle frontend routes. The `server/server.js` file includes code to serve the React app's `index.html` for any non-API request, which fixes this. In development, Vite handles this automatically.
-   **"Login page looks ugly"**: This is often due to CSS not being loaded correctly. Ensure `client/src/index.css` is imported in `client/src/main.jsx`. The `tailwind.config.js` is set up with a custom theme and colors to ensure a professional look. Ensure you have run `npm install` in the `/client` directory.