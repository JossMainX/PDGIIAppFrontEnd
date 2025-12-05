import { useState } from "react";
import { LogIn } from "lucide-react";
import { loginUser } from "../services/authService"; // <-- ruta que tú uses

export default function Login({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await loginUser(username, password);

    console.log("Login exitoso:", result);

    onLogin(username);

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-emerald-900/30 rounded-lg shadow-2xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-emerald-900/30 p-3 rounded-lg">
              <LogIn className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <h2 className="text-center text-white mb-8">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* USERNAME */}
            <div>
              <label htmlFor="username" className="block text-gray-300 mb-2">
                Usuario
              </label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                placeholder="Tu usuario"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white py-3 rounded-lg transition-colors"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿No tienes cuenta?{" "}
              <button
                onClick={onSwitchToRegister}
                className="text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Regístrate
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
