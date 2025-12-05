import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit, Trash2, Building2 } from 'lucide-react';
import { EditContribuyenteModal } from './EditContribuyenteModal';
import { getContribuyentes } from "../services/getContribuyentes";

export function ContribuyentesList({ onSelectContribuyente, refreshTrigger }) {
  const [contribuyentes, setContribuyentes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(99);
  const [loading, setLoading] = useState(true);
  const [editingContribuyente, setEditingContribuyente] = useState(null);

  useEffect(() => {
    fetchContribuyentes();
  }, [currentPage, refreshTrigger]);

  const fetchContribuyentes = async () => {
    try {
      setLoading(true);

      const result = await getContribuyentes(currentPage);

      const mapped = result.list.map(item => ({
        id: item.id,
        rnc: item.rncCedula ?? item.RncCedula,
        nombre: item.nombre ?? item.Nombre,
        tipo: item.tipoContribuyenteDesc ?? item.TipoContribuyenteDesc,
        estatus: item.estatusContribuyenteDesc ?? item.EstatusContribuyenteDesc,
        provincia: item.provinciaDesc ?? item.ProvinciaDesc
    }));


      setContribuyentes(mapped);

      if (result.list.length < result.pageSize) {
        setTotalPages(currentPage);
      } else {
        setTotalPages(currentPage + 1);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (confirm(`¿Estás seguro de eliminar al contribuyente "${nombre}"?`)) {
      alert("Delete simulado (aún no implementado en backend).");
      fetchContribuyentes();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Cargando contribuyentes...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 border border-emerald-900/30 rounded-lg shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-gray-300">RNC</th>
                <th className="px-6 py-4 text-left text-gray-300">Nombre</th>
                <th className="px-6 py-4 text-left text-gray-300">Tipo</th>
                <th className="px-6 py-4 text-left text-gray-300">Estatus</th>
                <th className="px-6 py-4 text-left text-gray-300">Provincia</th>
                <th className="px-6 py-4 text-left text-gray-300">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {contribuyentes.map((c) => (
                <tr 
                  key={c.id}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-300">{c.rnc}</td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => onSelectContribuyente(c.id)}
                      className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Building2 className="w-4 h-4" />
                      {c.nombre}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-gray-300">{c.tipo}</td>
                  <td className="px-6 py-4 text-gray-300">{c.estatus}</td>
                  <td className="px-6 py-4 text-gray-300">{c.provincia}</td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingContribuyente(c)}
                        className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(c.id, c.nombre)}
                        className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-gray-400">
              Página {currentPage} de {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {editingContribuyente && (
        <EditContribuyenteModal
          contribuyente={editingContribuyente}
          onClose={() => setEditingContribuyente(null)}
          onSuccess={fetchContribuyentes}
        />
      )}
    </>
  );
}
