// src/LoginForm.jsx
import { useState } from "react";

function LoginForm({ onSwitch }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login:", { email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Welcome Back</h2>

            <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" /> Remember me
                </label>
                <button type="button" className="text-blue-500 hover:underline">
                    Forgot Password?
                </button>
            </div>

            <button
                type="submit"
                className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
                Log In
            </button>

            <div className="flex items-center justify-between mt-4">
                <hr className="w-1/4 border-gray-300" />
                <span className="text-sm text-gray-500">or continue with</span>
                <hr className="w-1/4 border-gray-300" />
            </div>

            <div className="flex justify-center gap-4 mt-2">
                <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                    <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
                    Google
                </button>
                <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                    <img src="/github-icon.svg" alt="GitHub" className="w-5 h-5" />
                    GitHub
                </button>
            </div>

            <p className="mt-4 text-sm text-center">
                Don’t have an account?{" "}
                <button
                    type="button"
                    onClick={onSwitch}
                    className="text-blue-500 hover:underline"
                >
                    Sign Up
                </button>
            </p>
        </form>
    );
}

export default LoginForm;
