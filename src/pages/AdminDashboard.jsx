import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import SearchBar from '../components/common/SearchBar';
import Modal from '../components/common/Modal';
import ParentsTable from '../components/tables/ParentsTable';
import BabysittersTable from '../components/tables/BabysittersTable';
import ParentForm from '../components/forms/ParentForm';
import BabysitterForm from '../components/forms/BabysitterForm';
import userService from '../services/userService';

function AdminDashboard() {
  const [parents, setParents] = useState([]);
  const [babysitters, setBabysitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('parents');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();

      // Mapper les rôles
      const parentsData = data
        .filter(u => u.role === 'parente' || u.role === 'parent')
        .map(u => ({
          id: u._id,
          nom: `${u.firstName} ${u.lastName}`,
          ville: u.ville || 'Non spécifié',
          statut: u.statut || 'Actif',
          email: u.email
        }));

      const sittersData = data
        .filter(u => u.role === 'baby-sitter')
        .map(u => ({
          id: u._id,
          nom: `${u.firstName} ${u.lastName}`,
          specialite: u.specialite || 'Général',
          note: u.note || 4.5, // Note par défaut temporaire
          email: u.email
        }));

      setParents(parentsData);
      setBabysitters(sittersData);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getFilteredItems = () => {
    if (activeTab === 'parents') {
      return parents.filter(item =>
        item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ville.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return babysitters.filter(item =>
        item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.specialite.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await userService.deleteUser(id);
        // Rafraîchir la liste après suppression
        loadUsers();
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await userService.updateUser(editingItem.id, formData);
      } else {
        // Normalement on envoie les donnees avec création de passeword etc, l'admin doit fournir un mail etc.
        // On ajoute un rôle par défaut en fonction de l'onglet actif.
        const payload = {
          ...formData,
          role: activeTab === 'parents' ? 'parente' : 'baby-sitter'
        };
        await userService.createUser(payload);
      }
      setShowModal(false);
      loadUsers();
    } catch (err) {
      alert('Erreur réseau.');
    }
  };

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
                    Données synchronisées avec MongoDB en temps réel.
                  </p>
                </div>

                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onAddClick={handleAdd}
                />
              </div>

              {/* Error and Loading Handlers */}
              {loading && <div className="p-8 text-center text-pink-500 font-semibold animate-pulse">Chargement en cours, veuillez patienter...</div>}
              {error && <div className="p-4 bg-red-100 text-red-600">{error}</div>}

              {/* Table */}
              {!loading && !error && (
                <div className="overflow-x-auto">
                  {activeTab === 'parents' ? (
                    <ParentsTable
                      parents={getFilteredItems()}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ) : (
                    <BabysittersTable
                      babysitters={getFilteredItems()}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  )}
                </div>
              )}
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