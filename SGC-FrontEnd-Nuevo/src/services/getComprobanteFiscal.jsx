//GetComprobanteFiscal por Id
export async function getComprobanteFiscalById(contribuyenteid) {
    const token = localStorage.getItem("token");

    const res = await fetch(`https://localhost:7167/api/v1/ComprobanteFiscal/contribuyente/${contribuyenteid}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    
    if (!res.ok) {
        throw new Error("No se pudo obtener el comprobante fiscal.");
    }

    const data = await res.json();

    if (!data || data.data == null) return [];

    const arr = Array.isArray(data.data) ? data.data : [data.data];

    if (!data.success || !data.data) {
        throw new Error("Respuesta inesperada del servidor.");
    }

    return arr.map(c => ({
        id: c.id,
        folio: c.ncf,
        fecha: c.fecha ? c.fecha.split('T')[0] : null,
        tipo: c.tipoNCFNombre,
        subtotal: c.monto,
        iva: c.itbis18,
        total: (c.monto || 0 ) + (c.itbis18 || 0),
        receptor: c.contribuyenteNombre,
        rnc: c.contribuyenteRncCedula,
        sucursal: c.sucursalNombre,
        raw: c
    }));
}


// Función para eliminar ComprobanteFiscal por Id
export async function deleteComprobanteFiscal(id) {
    const token = localStorage.getItem("token");

  const res = await fetch(`https://localhost:7167/api/v1/ComprobanteFiscal/${id}`, {
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

// Función para crear comprobante fiscal
export async function createComprobanteFiscal(payload) {
  const token = localStorage.getItem("token");

  const res = await fetch(`https://localhost:7167/api/v1/ComprobanteFiscal`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("No se pudo crear el Comprobante Fiscal.");

  const data = await res.json();
  return data;
}

export async function getCNFForView() {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `https://localhost:7167/api/v1/ComprobanteFiscal/create-view`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("No se pudo obtener el listado para view.");
  }

  const data = await res.json();

  // NORMALIZACIÓN (AQUÍ ESTÁ LA CLAVE)
  return {
    contribuyentes: data.contribuyentes.map((c) => ({
      id: c.id ?? c.contribuyenteId,
      name: c.name ?? c.nombre ?? c.contribuyenteNombre,
    })),

    sucursales: data.sucursales.map((s) => ({
      id: s.id ?? s.sucursalId,
      name: s.name ?? s.nombre ?? s.sucursalNombre,
    })),

    tiposNCF: data.tiposNCF.map((t) => ({
      id: t.id ?? t.tipoNCFId,
      name: t.name ?? t.nombre ?? t.descripcion ?? t.tipoNCFNombre,
    })),
  };
}

// Función para actualizar contribuyente
export async function updateCompronteFiscal(payload) {
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