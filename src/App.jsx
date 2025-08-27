import { useState } from "react";
<<<<<<< HEAD
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
=======
import LoginForm from "./components/LoginForm.jsx";
import SignUpForm from "./components/SignUpForm.jsx";
>>>>>>> 7dde328 (App.jsx changes are made)

function App() {
    const [showSignUp, setShowSignUp] = useState(false);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg">
                {showSignUp ? (
                    <SignUpForm onSwitch={() => setShowSignUp(false)} />
                ) : (
                    <LoginForm onSwitch={() => setShowSignUp(true)} />
                )}
            </div>
        </div>
    );
}

export default App;