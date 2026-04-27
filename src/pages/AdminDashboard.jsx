import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import SearchBar from '../components/common/SearchBar';
import Modal from '../components/common/Modal';
import ParentsTable from '../components/tables/ParentsTable';
import BabysittersTable from '../components/tables/BabysittersTable';
import ParentForm from '../components/forms/ParentForm';
import BabysitterForm from '../components/forms/BabysitterForm';
import userService from '../services/userService';
import sitterService from '../services/sitterService';
import { AlertTriangle } from 'lucide-react';
import Toast from '../components/common/Toast';

function profileBelongsToUser(profile, userId) {
  const uid = String(userId);
  const refs = [
    profile?.utilisateur,
    profile?.user,
    profile?.userId,
    profile?.sitterUser,
    profile?.user?._id,
  ]
    .filter((x) => x != null)
    .map((x) => (typeof x === 'object' && x._id ? String(x._id) : String(x)));
  return refs.includes(uid);
}

function findSitterProfileForUser(profiles, user) {
  const uid = user._id || user.id;
  const byRef = profiles.find((p) => profileBelongsToUser(p, uid));
  if (byRef) return byRef;
  const un = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();
  if (!un) return null;
  return (
    profiles.find((p) => {
      const pn = `${p.prenom || ''} ${p.nom || ''}`.trim().toLowerCase();
      return pn && pn === un;
    }) || null
  );
}

function splitFullName(fullName) {
  const name = String(fullName || '').trim();
  if (!name) return { firstName: '', lastName: '' };
  const parts = name.split(/\s+/);
  return {
    firstName: parts.slice(0, -1).join(' ') || parts[0],
    lastName: parts.length > 1 ? parts.slice(-1)[0] : '',
  };
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') === 'babysitters' ? 'babysitters' : 'parents';

  const setActiveTab = useCallback(
    (tab) => {
      setSearchParams({ tab: tab === 'babysitters' ? 'babysitters' : 'parents' });
    },
    [setSearchParams]
  );

  const [parents, setParents] = useState([]);
  const [babysitters, setBabysitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null, name: '' });

  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: 'parents' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const raw = localStorage.getItem('user');
    if (!token || !raw) {
      navigate('/login', { replace: true, state: { from: '/admin' } });
      return;
    }
    try {
      const u = JSON.parse(raw);
      if (String(u.role || '').toLowerCase() !== 'admin') {
        navigate('/', { replace: true });
      }
    } catch {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const loadUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const [usersData, profilesData] = await Promise.all([
        userService.getAllUsers(),
        sitterService.getAllSitters().catch(() => []),
      ]);

      const users = Array.isArray(usersData) ? usersData : [];
      const profiles = Array.isArray(profilesData) ? profilesData : [];

      const parentsData = users
        .filter((u) => u.role === 'parente' || u.role === 'parent')
        .map((u) => ({
          id: u._id,
          nom: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
          ville: u.ville || 'Non spécifié',
          statut: u.statut || 'Actif',
          email: u.email,
          phone: u.phone,
          raw: u,
        }));

      const sitterUsers = users.filter((u) => u.role === 'baby-sitter');
      const sittersData = sitterUsers.map((u) => {
        const profile = findSitterProfileForUser(profiles, u);
        const nom = profile
          ? `${profile.prenom || ''} ${profile.nom || ''}`.trim()
          : `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email;
        return {
          id: u._id,
          profileId: profile?._id || null,
          nom,
          specialite: profile?.specialite || u.specialite || 'Général',
          note:
            profile != null && profile.noteMoyenne != null
              ? Number(profile.noteMoyenne)
              : u.note != null
                ? Number(u.note)
                : '—',
          nbAvis: profile?.nbAvis != null ? profile.nbAvis : 0,
          email: u.email,
          phone: u.phone,
          raw: u,
        };
      });

      setParents(parentsData);
      setBabysitters(sittersData);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger les utilisateurs. Vérifiez la connexion et vos droits admin.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (activeTab === 'parents') {
      return parents.filter(
        (item) =>
          !q ||
          item.nom.toLowerCase().includes(q) ||
          item.ville.toLowerCase().includes(q) ||
          (item.email && item.email.toLowerCase().includes(q))
      );
    }
    return babysitters.filter(
      (item) =>
        !q ||
        item.nom.toLowerCase().includes(q) ||
        item.specialite.toLowerCase().includes(q) ||
        (item.email && item.email.toLowerCase().includes(q))
    );
  }, [activeTab, parents, babysitters, searchTerm]);

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const user = [...parents, ...babysitters].find((u) => u.id === id);
    setConfirmDelete({ show: true, id, name: user?.nom || 'cet utilisateur' });
  };

  const executeDelete = async () => {
    const { id } = confirmDelete;
    if (!id) return;

    try {
      setDeletingId(id);
      setConfirmDelete({ show: false, id: null, name: '' });
      await userService.deleteUser(id);
      await loadUsers(true);
      setToast({ message: 'Utilisateur supprimé avec succès.', type: 'success' });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erreur lors de la suppression.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      if (editingItem) {
        const { firstName, lastName } = splitFullName(formData.nom || editingItem.nom);
        const updatePayload = {
          firstName,
          lastName,
          email: formData.email,
          phone: formData.phone,
          ...(activeTab === 'parents'
            ? {
              ville: formData.ville,
              statut: formData.statut,
            }
            : {
              specialite: formData.specialite,
              note: Number(formData.note),
            }),
        };

        await userService.updateUser(editingItem.id, updatePayload);

        if (activeTab === 'babysitters' && editingItem.profileId) {
          await sitterService.updateSitter(editingItem.profileId, {
            prenom: firstName,
            nom: lastName,
            specialite: formData.specialite,
            noteMoyenne: Number(formData.note),
          });
        }
      } else {
        const { firstName, lastName } = splitFullName(formData.nom);
        // On construit un objet propre sans le champ "nom" original 
        const payload = {
          firstName,
          lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: activeTab === 'parents' ? 'parente' : 'baby-sitter',
          acceptTerms: true,
          statut: formData.statut || 'Actif',
          ...(activeTab === 'parents' ? { ville: formData.ville } : { specialite: formData.specialite })
        };
        await userService.createUser(payload);
      }
      setShowModal(false);
      setEditingItem(null);
      await loadUsers(true);
      setToast({ message: `Utilisateur ${editingItem ? 'mis à jour' : 'créé'} avec succès !`, type: 'success' });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erreur réseau.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewSitterProfile = (profileId) => {
    navigate(`/profil/${profileId}`);
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
          onCancel={() => !submitting && setShowModal(false)}
          isSubmitting={submitting}
        />
      );
    }
    return (
      <BabysitterForm
        initialData={editingItem}
        onSubmit={handleSubmit}
        onCancel={() => !submitting && setShowModal(false)}
        isSubmitting={submitting}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />

        <main className="flex-1 min-w-0">
          {/* Onglets mobile */}
          <div className="md:hidden flex border-b border-gray-200 bg-white sticky top-0 z-10">
            {['parents', 'babysitters'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-bold ${activeTab === tab ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'
                  }`}
              >
                {tab === 'parents' ? 'Parents' : 'Baby-sitters'}
              </button>
            ))}
          </div>

          <div className="px-4 sm:px-6 lg:px-10 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Parents</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{loading ? '…' : parents.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Baby-sitters</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{loading ? '…' : babysitters.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Profils liés</p>
                <p className="text-2xl font-black text-pink-600 mt-1">
                  {loading ? '…' : babysitters.filter((b) => b.profileId).length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">
                    {activeTab === 'parents' ? 'Gestion des parents' : 'Gestion des baby-sitters'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Données chargées depuis l&apos;API ; les baby-sitters sont enrichis avec les profils publics
                    lorsque c&apos;est possible.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button
                    type="button"
                    onClick={() => loadUsers(true)}
                    disabled={loading || refreshing}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50"
                  >
                    {refreshing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                        Actualisation…
                      </>
                    ) : (
                      '↻ Actualiser'
                    )}
                  </button>
                  <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onAddClick={handleAdd}
                    addDisabled={loading || !!deletingId}
                  />
                </div>
              </div>

              {loading && (
                <div className="p-8 text-center text-pink-600 font-semibold flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                  Chargement…
                </div>
              )}
              {error && (
                <div className="p-4 m-4 bg-red-50 border border-red-100 rounded-xl text-red-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => loadUsers(false)}
                    className="text-sm font-bold underline"
                  >
                    Réessayer
                  </button>
                </div>
              )}

              {!loading && !error && (
                <div className="overflow-x-auto">
                  {activeTab === 'parents' ? (
                    <ParentsTable
                      parents={filtered}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      deletingId={deletingId}
                    />
                  ) : (
                    <BabysittersTable
                      babysitters={filtered}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewProfile={handleViewSitterProfile}
                      deletingId={deletingId}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Modal isOpen={showModal} onClose={() => !submitting && setShowModal(false)} title={getModalTitle()}>
        {renderForm()}
      </Modal>

      {/* Modal de confirmation de suppression style Google/Premium */}
      <Modal
        isOpen={confirmDelete.show}
        onClose={() => setConfirmDelete({ show: false, id: null, name: '' })}
        title="Confirmation de suppression"
      >
        <div className="text-center p-2">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100">
            <AlertTriangle size={40} strokeWidth={2.5} />
          </div>

          <h4 className="text-lg font-bold text-gray-900 mb-2">Attention : Action irréversible</h4>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Êtes-vous sûr de vouloir supprimer définitivement <strong>{confirmDelete.name}</strong> ?
            <br />
            <span className="text-sm mt-2 block font-medium text-red-500">
              Toutes les données associées (profil, réservations, messages) seront supprimées de la base de données.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setConfirmDelete({ show: false, id: null, name: '' })}
              className="flex-1 px-6 py-3 border-2 border-gray-100 rounded-2xl text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-200 transition-all duration-200"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={executeDelete}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdminDashboard;