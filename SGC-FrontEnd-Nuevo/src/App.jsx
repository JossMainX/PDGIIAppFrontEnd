import { useState } from "react";
import Login from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (email, password) => {
    // Simulación login
    setUser({
      id: "1",
      email,
      name: email.split("@")[0],
    });
  };

  const handleRegister = (email, password, name) => {
    // Simulación register
    setUser({
      id: "1",
      email,
      name,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setShowRegister(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950">
        {showRegister ? (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950">
      <Dashboard user={user} onLogout={handleLogout} />
    </div>
  );
}
