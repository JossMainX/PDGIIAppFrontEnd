// services/registerUser.jsx

export async function registerUser(data) {
  const res = await fetch("https://localhost:7167/api/v1/Usuario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: data.username,
      password: data.password,
      nombreCompleto: data.nombreCompleto,
      email: data.email,
      rolId: 2 // siempre supervisor
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error en el registro");
  }

  return res.json();
}

export async function loginUser(username, password) {
  const res = await fetch("https://localhost:7167/api/v1/Auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error en el inicio de sesión");
  }

  const result = await res.json();

  // La API devuelve: { success: true, data: "JWT" }
  const token = result.data;

  if (!token) throw new Error("Token no recibido");

  // Guardar token en localStorage
  localStorage.setItem("token", token);

  // Extraer contenido del JWT
  const payload = JSON.parse(atob(token.split(".")[1]));

  // Rol que viene en el JWT
  const roleId = payload.roleId;
  const roleDesc = payload.roleDesc;

  // Guardar rol
  localStorage.setItem("roleId", roleId);
  localStorage.setItem("roleDesc", roleDesc);

  return { token, roleId, roleDesc };
}
