import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getContribuyentesForView, updateContribuyente } from '../services/getContribuyentes';
import { toast } from 'sonner';

export function EditContribuyenteModal({ contribuyente, onClose, onSuccess }) {

  const [formData, setFormData] = useState({
    id: contribuyente.id,
    nombre: contribuyente.nombre,
    rncCedula: contribuyente.rncCedula ?? contribuyente.rnc ?? '',
    direccion: contribuyente.direccion ?? '',
    telefono: contribuyente.telefono ?? '',
    tipoContribuyenteId: contribuyente.tipoContribuyenteId?.toString() ?? '',
    estatusContribuyenteId: contribuyente.estatusContribuyenteId?.toString() ?? '',
    municipioId: contribuyente.municipioId?.toString() ?? ''
  });

  const [tipos, setTipos] = useState([]);
  const [estatuses, setEstatuses] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  useEffect(() => {
    getContribuyentesForView()
      .then(({ tipos, estatuses, municipios }) => {
        setTipos(tipos);
        setEstatuses(estatuses);
        setMunicipios(municipios);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setFormData({
      id: contribuyente.id,
      nombre: contribuyente.nombre,
      rncCedula: contribuyente.rncCedula ?? contribuyente.rnc ?? '',
      direccion: contribuyente.direccion ?? '',
      telefono: contribuyente.telefono ?? '',
      tipoContribuyenteId: contribuyente.tipoContribuyenteId?.toString() ?? '',
      estatusContribuyenteId: contribuyente.estatusContribuyenteId?.toString() ?? '',
      municipioId: contribuyente.municipioId?.toString() ?? ''
    });
  }, [contribuyente]);

  // Si no tenemos los IDs (por ejemplo si el listado no los traía), intentar
  // resolverlos por coincidencia de nombre una vez cargados los catálogos
  useEffect(() => {
    if (!formData.tipoContribuyenteId && contribuyente?.tipo && tipos.length) {
      const match = tipos.find(t => t.name === contribuyente.tipo);
      if (match) {
        setFormData(prev => ({ ...prev, tipoContribuyenteId: String(match.id) }));
      }
    }

    if (!formData.estatusContribuyenteId && contribuyente?.estatus && estatuses.length) {
      const match = estatuses.find(e => e.name === contribuyente.estatus);
      if (match) {
        setFormData(prev => ({ ...prev, estatusContribuyenteId: String(match.id) }));
      }
    }

    if (!formData.municipioId && contribuyente?.municipio && municipios.length) {
      const match = municipios.find(m => m.name === contribuyente.municipio);
      if (match) {
        setFormData(prev => ({ ...prev, municipioId: String(match.id) }));
      }
    }
  }, [
    tipos,
    estatuses,
    municipios,
    contribuyente,
    formData.tipoContribuyenteId,
    formData.estatusContribuyenteId,
    formData.municipioId
  ]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateContribuyente({
        id: formData.id,
        nombre: formData.nombre,
        rncCedula: formData.rncCedula,
        direccion: formData.direccion,
        telefono: formData.telefono,
        tipoContribuyenteId: parseInt(formData.tipoContribuyenteId),
        estatusContribuyenteId: parseInt(formData.estatusContribuyenteId),
        municipioId: parseInt(formData.municipioId)
      });
      toast.success('Contribuyente actualizado correctamente');
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar contribuyente');
    }
  };

  const formatTelefono = (value) => {
    let numbers = value.replace(/\D/g, "");
    if (numbers.length > 3 && numbers.length <= 6) {
      numbers = numbers.slice(0,3) + "-" + numbers.slice(3);
    } else if (numbers.length > 6) {
      numbers = numbers.slice(0,3) + "-" + numbers.slice(3,6) + "-" + numbers.slice(6,10);
    }
    return numbers;
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
                disabled
                value={formData.nombre}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                onKeyDown={(e) => e.preventDefault()}
                tabIndex={-1}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white cursor-not-allowed"
              />
            </div>

            <div> 
              <label className="block text-gray-300 mb-2">RNC</label>
              <input
                type="text"
                disabled
                value={formData.rncCedula}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                onKeyDown={(e) => e.preventDefault()}
                tabIndex={-1}
                maxLength={13} // 3+7+1 + 2 guiones
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Direccion</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Telefono</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: formatTelefono(e.target.value) })}
                maxLength={12} // 10 digits + 2 dashes
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
                <option value="">Selecciona el tipo</option>
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
              <label className="block text-gray-300 mb-2">Municipio</label>
              <select
                value={formData.municipioId}
                onChange={(e) => setFormData({ ...formData, municipioId: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none 
                focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                style={{ colorScheme: 'dark' }}
                required
              >
                <option value="">Selecciona un Municipio</option>
                {municipios.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
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
