import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  getCNFForView,
  createComprobanteFiscal,
} from "../services/getComprobanteFiscal";

export function AddComprobanteModal({ onClose, onSuccess, prefilledContribuyente }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Datos para selects
  const [viewData, setViewData] = useState({
    contribuyentes: [],
    sucursales: [],
    tiposNCF: [],
  });

  // Estado del formulario (SOLO lo que backend necesita)
  const [formData, setFormData] = useState({
    monto: "",
    contribuyenteId: prefilledContribuyente?.id ?? "",
    sucursalId: "",
    tipoNCFId: "",
  });

  // Datos derivados para mostrar en modo prellenado
  const prefilledName =
    prefilledContribuyente?.nombre ??
    prefilledContribuyente?.name ??
    "";
  const prefilledRnc =
    prefilledContribuyente?.rfc ??
    prefilledContribuyente?.rncCedula ??
    prefilledContribuyente?.rnc ??
    "";

  useEffect(() => {
    async function loadViewData() {
      try {
        const data = await getCNFForView();
        setViewData(data);
      } catch (err) {
        console.error(err);
        setError("Error cargando datos para el formulario");
      } finally {
        setLoading(false);
      }
    }

    loadViewData();
  }, []);

  // Si venimos desde ContribuyenteDetail, fijar contribuyente y bloquear edición
  useEffect(() => {
    if (prefilledContribuyente?.id) {
      setFormData((prev) => ({
        ...prev,
        contribuyenteId: String(prefilledContribuyente.id),
      }));
    }
  }, [prefilledContribuyente]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      monto: Number(formData.monto),
      contribuyenteId: Number(formData.contribuyenteId),
      sucursalId: Number(formData.sucursalId),
      tipoNCFId: Number(formData.tipoNCFId),
    };

    try {
      await createComprobanteFiscal(payload);
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("No se pudo crear el Comprobante Fiscal");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <span className="text-white">Cargando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <span className="text-red-400">{error}</span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-emerald-900/30 rounded-lg shadow-2xl w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h3 className="text-white text-lg font-semibold">
            Agregar Comprobante Fiscal
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Contribuyente */}
          {prefilledContribuyente ? (
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Contribuyente</label>
                  <input
                    type="text"
                    value={prefilledName}
                    disabled
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">RNC</label>
                  <input
                    type="text"
                    value={prefilledRnc}
                    disabled
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white cursor-not-allowed"
                  />
                </div>
              </div>
              {prefilledName && prefilledRnc ? (
                <p className="text-gray-400 text-sm">
                  {prefilledName} - RNC ({prefilledRnc})
                </p>
              ) : null}
            </div>
          ) : (
            <div>
              <label className="block text-gray-300 mb-1">Contribuyente</label>
              <select
                value={formData.contribuyenteId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contribuyenteId: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option value="">Seleccione</option>
                {viewData.contribuyentes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sucursal */}
          <div>
            <label className="block text-gray-300 mb-1">Sucursal</label>
            <select
              value={formData.sucursalId}
              onChange={(e) =>
                setFormData({ ...formData, sucursalId: e.target.value })
              }
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            >
              <option value="">Seleccione</option>
              {viewData.sucursales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo NCF */}
          <div>
            <label className="block text-gray-300 mb-1">Tipo NCF</label>
            <select
              value={formData.tipoNCFId}
              onChange={(e) =>
                setFormData({ ...formData, tipoNCFId: e.target.value })
              }
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            >
              <option value="">Seleccione</option>
              {viewData.tiposNCF.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Monto */}
          <div>
            <label className="block text-gray-300 mb-1">Monto</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.monto}
              onChange={(e) =>
                setFormData({ ...formData, monto: e.target.value })
              }
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded text-white"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
