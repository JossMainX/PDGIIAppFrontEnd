import { useState } from 'react';
import { X } from 'lucide-react';

interface AddComprobanteModalProps {
  contribuyenteId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddComprobanteModal({ contribuyenteId, onClose, onSuccess }: AddComprobanteModalProps) {
  const [formData, setFormData] = useState({
    folio: '',
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'Ingreso',
    subtotal: '',
    receptor: ''
  });

  const subtotal = parseFloat(formData.subtotal) || 0;
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-emerald-900/30 rounded-lg shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h3 className="text-white">Agregar Comprobante Fiscal</h3>
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
              <label className="block text-gray-300 mb-2">Folio</label>
              <input
                type="text"
                value={formData.folio}
                onChange={(e) => setFormData({ ...formData, folio: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                placeholder="F000001"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Fecha</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              >
                <option value="Ingreso">Ingreso</option>
                <option value="Egreso">Egreso</option>
                <option value="Nómina">Nómina</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Receptor</label>
              <input
                type="text"
                value={formData.receptor}
                onChange={(e) => setFormData({ ...formData, receptor: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                placeholder="Nombre del receptor"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Subtotal</label>
              <input
                type="number"
                step="0.01"
                value={formData.subtotal}
                onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Calculation Summary */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>IVA (16%):</span>
              <span>${iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white border-t border-gray-700 pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
