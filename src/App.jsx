import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

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