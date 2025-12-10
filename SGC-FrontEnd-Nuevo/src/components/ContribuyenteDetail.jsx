import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, FileText, Calendar, DollarSign } from 'lucide-react';
import { AddComprobanteModal } from './AddComprobanteModal';
import { EditComprobanteModal } from './EditComprobanteModal';
import { getContribuyenteById } from "../services/getContribuyentes";

const generateMockComprobantes = () => {
  return Array.from({ length: 15 }, (_, i) => ({
    id: `comp-${i + 1}`,
    folio: `F${String(i + 1).padStart(6, '0')}`,
    fecha: new Date(2024, 11, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    tipo: ['Ingreso', 'Egreso', 'Nómina'][Math.floor(Math.random() * 3)],
    subtotal: Math.random() * 10000 + 1000,
    iva: 0,
    total: 0,
    receptor: `Cliente ${i + 1}`,
    created_at: new Date(2024, 11, i + 1).toISOString()
  })).map(comp => ({
    ...comp,
    iva: comp.subtotal * 0.16,
    total: comp.subtotal * 1.16
  }));
};

export function ContribuyenteDetail({ contribuyenteId, onBack }) {
  const [contribuyente, setContribuyente] = useState(null);
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingComprobante, setEditingComprobante] = useState(null);

  useEffect(() => {
    fetchContribuyente();
    fetchComprobantes();
  }, [contribuyenteId]);

  const fetchContribuyente = async () => {
    setLoading(true);
    try {
      const data = await getContribuyenteById(contribuyenteId);

      // Normalizar campos del backend
      const mapped = {
        id: data.id,
        nombre: data.nombre ?? data.Nombre,
        rfc: data.rncCedula ?? data.RncCedula,
        telefono: data.telefono ?? data.Telefono,
        direccion: data.direccion ?? data.Direccion,
        tipo: data.tipoContribuyenteDesc ?? data.TipoContribuyenteDesc,
        estatus: data.estatusContribuyenteDesc ?? data.EstatusContribuyenteDesc,
        municipio: data.municipioDesc ?? data.municipioDesc
      };

      setContribuyente(mapped);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComprobantes = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setComprobantes(generateMockComprobantes());
  };

  const handleDelete = async (id, folio) => {
    if (confirm(`¿Estás seguro de eliminar el comprobante "${folio}"?`)) {
      await new Promise(resolve => setTimeout(resolve, 300));
      fetchComprobantes();
    }
  };

  const handleComprobanteAdded = () => {
    setShowAddModal(false);
    fetchComprobantes();
  };

  const handleEditSuccess = () => {
    setEditingComprobante(null);
    fetchComprobantes();
  };

  if (loading || !contribuyente) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400">
        Cargando datos del contribuyente...
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white">Detalles del Contribuyente</h2>
        </div>

        {/* Info del Contribuyente */}
        <div className="bg-gray-900 border border-emerald-900/30 rounded-lg shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Nombre</p>
              <p className="text-white">{contribuyente.nombre}</p>
            </div>
            <div>
              <p className="text-gray-400">RNC / Cédula</p>
              <p className="text-white">{contribuyente.rfc}</p>
            </div>
            <div>
              <p className="text-gray-400">Teléfono</p>
              <p className="text-white">{contribuyente.telefono}</p>
            </div>
            <div>
              <p className="text-gray-400">Dirección</p>
              <p className="text-white">{contribuyente.direccion}</p>
            </div>
            <div>
              <p className="text-gray-400">Tipo</p>
              <p className="text-white">{contribuyente.tipo}</p>
            </div>
            <div>
              <p className="text-gray-400">Estatus</p>
              <p className="text-white">{contribuyente.estatus}</p>
            </div>
            <div>
              <p className="text-gray-400">Municipio</p>
              <p className="text-white">{contribuyente.municipio}</p>
            </div>
          </div>
        </div>

        {/* Comprobantes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white">Comprobantes Fiscales</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Agregar Comprobante
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comprobantes.map((comprobante) => (
              <div 
                key={comprobante.id}
                className="bg-gray-900 border border-emerald-900/30 rounded-lg shadow-lg p-4 hover:border-emerald-700/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-900/30 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-white">{comprobante.folio}</p>
                      <p className="text-gray-400">{comprobante.tipo}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{comprobante.fecha}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>Total: ${comprobante.total.toFixed(2)}</span>
                  </div>
                  <div className="text-gray-400">
                    <span>Receptor: {comprobante.receptor}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
                  <button
                    onClick={() => setEditingComprobante(comprobante)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(comprobante.id, comprobante.folio)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddComprobanteModal
          contribuyenteId={contribuyenteId}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleComprobanteAdded}
        />
      )}

      {editingComprobante && (
        <EditComprobanteModal
          comprobante={editingComprobante}
          onClose={() => setEditingComprobante(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
