import { useState } from 'react';
import { LogOut, UserPlus, FileText } from 'lucide-react';
import { ContribuyentesList } from './ContribuyentesList.';
import { ContribuyenteDetail } from './ContribuyenteDetail';
import { AddContribuyenteModal } from './AddContribuyenteModal';

type User = {
  id: string;
  email: string;
  name: string;
};

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [selectedContribuyenteId, setSelectedContribuyenteId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
            
            <ContribuyentesList 
              onSelectContribuyente={setSelectedContribuyenteId}
              refreshTrigger={refreshTrigger}
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
