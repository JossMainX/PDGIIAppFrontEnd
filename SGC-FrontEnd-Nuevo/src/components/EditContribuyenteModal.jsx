import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getContribuyentesForView, updateContribuyente } from '../services/getContribuyentes';
import { toast } from 'sonner';

export function EditContribuyenteModal({ contribuyente, onClose, onSuccess }) {

  const [formData, setFormData] = useState({
    id: contribuyente.id,
    nombre: contribuyente.nombre,
    rncCedula: contribuyente.rncCedula ?? contribuyente.rnc ?? '',
    tipoContribuyenteId: contribuyente.tipoContribuyenteId ?? '',
    estatusContribuyenteId: contribuyente.estatusContribuyenteId ?? '',
    provinciaId: contribuyente.provinciaId ?? ''
  });

  const [tipos, setTipos] = useState([]);
  const [estatuses, setEstatuses] = useState([]);
  const [provincias, setProvincias] = useState([]);

  useEffect(() => {
    getContribuyentesForView()
      .then(({ tipos, estatuses, provincias }) => {
        setTipos(tipos);
        setEstatuses(estatuses);
        setProvincias(provincias);
      })
      .catch(err => console.error(err));
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateContribuyente({
        id: formData.id,
        nombre: formData.nombre,
        rncCedula: formData.rncCedula,
        tipoContribuyenteId: parseInt(formData.tipoContribuyenteId),
        estatusContribuyenteId: parseInt(formData.estatusContribuyenteId),
        provinciaId: parseInt(formData.provinciaId)
      });
      toast.success('Contribuyente actualizado correctamente');
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar contribuyente');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-emerald-900/30 rounded-lg shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h3 className="text-white">Editar Contribuyente</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>


        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">RNC</label>
              <input
                type="text"
                value={formData.rncCedula}
                onChange={(e) => setFormData({ ...formData, rncCedula: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Tipo Contribuyente</label>
              <select
                value={formData.tipoContribuyenteId}
                onChange={(e) => setFormData({ ...formData, tipoContribuyenteId: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                style={{ colorScheme: 'dark' }}
                required
              >
                <option value="">Selecciona un tipo</option>
                {tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>{tipo.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Estatus</label>
              <select
                value={formData.estatusContribuyenteId}
                onChange={(e) => setFormData({ ...formData, estatusContribuyenteId: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                style={{ colorScheme: 'dark' }}
                required
              >
                <option value="">Selecciona un estatus</option>
                {estatuses.map((estatus) => (
                  <option key={estatus.id} value={estatus.id}>{estatus.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Provincia</label>
              <select
                value={formData.provinciaId}
                onChange={(e) => setFormData({ ...formData, provinciaId: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                style={{ colorScheme: 'dark' }}
                required
              >
                <option value="">Selecciona una provincia</option>
                {provincias.map((prov) => (
                  <option key={prov.id} value={prov.id}>{prov.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
