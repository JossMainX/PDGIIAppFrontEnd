import { useState } from "react";
import { UserPlus } from "lucide-react";
import { registerUser } from "../services/authService";

export function Register({ onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState(""); // <-- NUEVO
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMsg("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      await registerUser({
        username: username, // <-- YA NO SE USA EMAIL COMO USERNAME
        nombreCompleto: name,
        email: email,
        password: password,
      });

      setMsg("Registro exitoso. Ya puedes iniciar sesión.");

      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-emerald-900/30 rounded-lg shadow-2xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-emerald-900/30 p-3 rounded-lg">
              <UserPlus className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <h2 className="text-center text-white mb-8">Crear Cuenta</h2>

          {msg && (
            <div className="p-3 bg-gray-800 text-center text-emerald-400 rounded mb-4">
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Nombre Completo */}
            <div>
              <label className="block text-gray-300 mb-2">Nombre Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                placeholder="Juan Pérez"
                required
              />
            </div>

            {/* Username -- NUEVO CAMPO */}
            <div>
              <label className="block text-gray-300 mb-2">Nombre de Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                placeholder="ejemplo123"
                required
              />
            </div>

            {/* Correo */}
            <div>
              <label className="block text-gray-300 mb-2">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                placeholder="tu@email.com"
                required
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-gray-300 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                required
              />
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-gray-300 mb-2">Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white py-3 rounded-lg transition"
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-emerald-500 hover:text-emerald-400"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
