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
