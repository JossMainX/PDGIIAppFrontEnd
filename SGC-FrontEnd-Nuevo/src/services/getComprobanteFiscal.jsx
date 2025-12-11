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