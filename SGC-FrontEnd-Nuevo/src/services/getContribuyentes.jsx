export async function getContribuyentes(pageNumber = 1) {
  const token = localStorage.getItem("token");

  const res = await fetch(`https://localhost:7167/api/v1/Contribuyente?pageNumber=${pageNumber}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error("No se pudo obtener el listado.");
  }

  const data = await res.json();

  if (!data.success || !Array.isArray(data.data)) {
    throw new Error("Respuesta inesperada del servidor.");
  }

  return {
    list: data.data,
    pageNumber: data.pageNumber,
    pageSize: data.pageSize
  };
}

export async function getContribuyenteById(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`https://localhost:7167/api/v1/Contribuyente/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error("No se pudo obtener el contribuyente.");
  }

  const data = await res.json();

  if (!data.success || !data.data) {
    throw new Error("Respuesta inesperada del servidor.");
  }

  return data.data;
}


// services/contribuyentesService.js
export async function getContribuyentesForView() {
  const token = localStorage.getItem("token");

  const res = await fetch(`https://localhost:7167/api/v1/Contribuyente/view`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error("No se pudo obtener el listado para view.");

  const data = await res.json();

  if (!Array.isArray(data)) throw new Error("Respuesta inesperada del servidor.");

  // Eliminamos duplicados por ID usando Map
  const tiposMap = new Map();
  const estatusMap = new Map();
  const municipioMap = new Map();

  data.forEach(item => {
    if (item.tipoContribuyenteId && !tiposMap.has(item.tipoContribuyenteId)) {
      tiposMap.set(item.tipoContribuyenteId, { id: item.tipoContribuyenteId, name: item.tipoContribuyenteDesc });
    }
    if (item.estatusContribuyenteId && !estatusMap.has(item.estatusContribuyenteId)) {
      estatusMap.set(item.estatusContribuyenteId, { id: item.estatusContribuyenteId, name: item.estatusContribuyenteDesc });
    }
    if (item.municipioId && !municipioMap.has(item.municipioId)) {
      municipioMap.set(item.municipioId, { id: item.municipioId, name: item.municipioDesc });
    }
  });

  return {
    tipos: Array.from(tiposMap.values()),
    estatuses: Array.from(estatusMap.values()),
    municipios: Array.from(municipioMap.values()).sort((a, b) => b.name.localeCompare(a.name))
  };
}

// Función para crear contribuyente
export async function createContribuyente(payload) {
  const token = localStorage.getItem("token");

  const res = await fetch(`https://localhost:7167/api/v1/Contribuyente`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("No se pudo crear el contribuyente.");

  const data = await res.json();
  return data;
}

// Función para actualizar contribuyente
export async function updateContribuyente(payload) {
  const token = localStorage.getItem("token");

  const res = await fetch(`https://localhost:7167/api/v1/Contribuyente/${payload.id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("No se pudo actualizar el contribuyente.");

  const data = await res.json();
  return data;
}

// Función para eliminar contribuyente
export async function deleteContribuyente(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`https://localhost:7167/api/v1/Contribuyente/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error("No se pudo eliminar el contribuyente.");

  const data = await res.json();
  return data;
}