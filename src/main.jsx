// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./hooks/useAuth.jsx"; // ✅ import AuthProvider
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ import GoogleOAuthProvider
const clientId = "760916582807-o4kbvbujmgso6gi0mk9nvqjp41bioegg.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <GoogleOAuthProvider clientId={clientId}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </GoogleOAuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
