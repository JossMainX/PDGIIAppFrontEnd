import { useState } from 'react';
import { LogOut, UserPlus, FileText } from 'lucide-react';
import { ContribuyentesList } from './ContribuyentesList.';
import { ContribuyenteDetail } from './ContribuyenteDetail';
import { AddContribuyenteModal } from './AddContribuyenteModal';

export function Dashboard({ user, onLogout }) {
  const [selectedContribuyenteId, setSelectedContribuyenteId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filterNombre, setFilterNombre] = useState("");
  const [filterRnc, setFilterRnc] = useState("");
  const [filterMunicipio, setFilterMunicipio] = useState("");

  const formatRncCedula = (value) => {
    let numbers = value.replace(/\D/g, "");
    if (numbers.length > 3 && numbers.length <= 10) {
      numbers = numbers.slice(0, 3) + "-" + numbers.slice(3);
    } else if (numbers.length > 10) {
      numbers =
        numbers.slice(0, 3) +
        "-" +
        numbers.slice(3, 10) +
        "-" +
        numbers.slice(10, 11);
    }
    return numbers;
  };

  const handleContribuyenteAdded = () => {
    setShowAddModal(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBackToList = () => {
    setSelectedContribuyenteId(null);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gray-900 border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-900/30 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-emerald-500" />
              </div>
              <h1 className="text-white">Sistema de Comprobantes Fiscales</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Hola, {user.name}</span>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedContribuyenteId ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white">Contribuyentes</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                Agregar Contribuyente
              </button>
            </div>

            <div className="bg-gray-900 border border-emerald-900/30 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Nombre</label>
                <input
                  type="text"
                  value={filterNombre}
                  onChange={(e) => setFilterNombre(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">RNC</label>
                <input
                  type="text"
                  value={filterRnc}
                  onChange={(e) => setFilterRnc(formatRncCedula(e.target.value))}
                  maxLength={13}
                  placeholder="001-1234567-8"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">Municipio</label>
                <input
                  type="text"
                  value={filterMunicipio}
                  onChange={(e) => setFilterMunicipio(e.target.value)}
                  placeholder="Ej: Santo Domingo"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>
            </div>
            
            <ContribuyentesList 
              onSelectContribuyente={setSelectedContribuyenteId}
              refreshTrigger={refreshTrigger}
              filterNombre={filterNombre}
              filterRnc={filterRnc}
              filterMunicipio={filterMunicipio}
            />
          </>
        ) : (
          <ContribuyenteDetail 
            contribuyenteId={selectedContribuyenteId}
            onBack={handleBackToList}
          />
        )}
      </main>

      {/* Add Contribuyente Modal */}
      {showAddModal && (
        <AddContribuyenteModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleContribuyenteAdded}
        />
      )}
    </div>
  );
}
