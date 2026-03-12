import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import SearchBar from '../components/common/SearchBar';
import Modal from '../components/common/Modal';
import ParentsTable from '../components/tables/ParentsTable';
import BabysittersTable from '../components/tables/BabysittersTable';
import ParentForm from '../components/forms/ParentForm';
import BabysitterForm from '../components/forms/BabysitterForm';
import { useCrud } from '../hooks/useCrud';

const AdminDashboard = () => {
  const initialParents = [
    { id: 101, nom: 'F. Martin', ville: 'Paris', statut: 'Actif' },
    { id: 102, nom: 'S. Diallo', ville: 'Lyon', statut: 'Actif' },
    { id: 103, nom: 'A. Benali', ville: 'Bordeaux', statut: 'En pause' }
  ];

  const initialBabysitters = [
    { id: 201, nom: 'Inès R.', specialite: 'Nourrissons', note: 4.9 },
    { id: 202, nom: 'Asma T.', specialite: 'Multi-enfants', note: 4.8 },
    { id: 203, nom: 'Nessrin K.', specialite: 'Urgences', note: 4.7 }
  ];

  const {
    activeTab,
    searchTerm,
    filteredItems,
    showModal,
    editingItem,
    parents,
    babysitters,
    setActiveTab,
    setSearchTerm,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    setShowModal
  } = useCrud(initialParents, initialBabysitters);

  const getModalTitle = () => {
    if (editingItem) {
      return `Modifier ${activeTab === 'parents' ? 'le parent' : 'le baby-sitter'}`;
    }
    return `Ajouter ${activeTab === 'parents' ? 'un parent' : 'un baby-sitter'}`;
  };

  const renderForm = () => {
    if (activeTab === 'parents') {
      return (
        <ParentForm
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      );
    }
    return (
      <BabysitterForm
        initialData={editingItem}
        onSubmit={handleSubmit}
        onCancel={() => setShowModal(false)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-10 py-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">
                    {activeTab === 'parents' ? 'Gestion des Parents' : 'Gestion des Baby-sitters'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    CRUD statique (create / edit / delete) sans API.
                  </p>
                </div>
                
                <SearchBar 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onAddClick={handleAdd}
                />
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {activeTab === 'parents' ? (
                  <ParentsTable 
                    parents={filteredItems}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ) : (
                  <BabysittersTable 
                    babysitters={filteredItems}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title={getModalTitle()}
      >
        {renderForm()}
      </Modal>
    </div>
  );
};

export default AdminDashboard;