import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, FileText, Calendar, DollarSign } from 'lucide-react';
import { AddComprobanteModal } from './AddComprobanteModal';
import { EditComprobanteModal } from './EditComprobanteModal';

type Comprobante = {
  id: string;
  folio: string;
  fecha: string;
  tipo: string;
  subtotal: number;
  iva: number;
  total: number;
  receptor: string;
  created_at: string;
};

interface ContribuyenteDetailProps {
  contribuyenteId: string;
  onBack: () => void;
}

// Mock data
const mockContribuyente = {
  id: 'contrib-1',
  nombre: 'Contribuyente Ejemplo S.A. de C.V.',
  rfc: 'CEJ850101ABC',
  email: 'contacto@ejemplo.com',
  telefono: '5555555555',
  direccion: 'Av. Principal 123, Col. Centro, CDMX'
};

const generateMockComprobantes = (): Comprobante[] => {
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

export function ContribuyenteDetail({ contribuyenteId, onBack }: ContribuyenteDetailProps) {
  const [comprobantes, setComprobantes] = useState<Comprobante[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingComprobante, setEditingComprobante] = useState<Comprobante | null>(null);

  useEffect(() => {
    fetchComprobantes();
  }, []);

  const fetchComprobantes = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setComprobantes(generateMockComprobantes());
    setLoading(false);
  };

  const handleDelete = async (id: string, folio: string) => {
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

        {/* Contribuyente Info */}
        <div className="bg-gray-900 border border-emerald-900/30 rounded-lg shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Nombre</p>
              <p className="text-white">{mockContribuyente.nombre}</p>
            </div>
            <div>
              <p className="text-gray-400">RFC</p>
              <p className="text-white">{mockContribuyente.rfc}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="text-white">{mockContribuyente.email}</p>
            </div>
            <div>
              <p className="text-gray-400">Teléfono</p>
              <p className="text-white">{mockContribuyente.telefono}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-400">Dirección</p>
              <p className="text-white">{mockContribuyente.direccion}</p>
            </div>
          </div>
        </div>

        {/* Comprobantes Section */}
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

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">Cargando comprobantes...</div>
            </div>
          ) : (
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
          )}
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
