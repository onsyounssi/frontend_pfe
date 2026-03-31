import { useState } from 'react';

export const useCrud = (initialParents, initialBabysitters) => {
  const [parents, setParents] = useState(initialParents);
  const [babysitters, setBabysitters] = useState(initialBabysitters);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('parents');
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      if (activeTab === 'parents') {
        setParents(parents.filter(item => item.id !== id));
      } else {
        setBabysitters(babysitters.filter(item => item.id !== id));
      }
    }
  };

  const handleSubmit = (formData) => {
    if (activeTab === 'parents') {
      if (editingItem) {
        setParents(parents.map(item =>
          item.id === editingItem.id
            ? { ...item, ...formData }
            : item
        ));
      } else {
        const newId = Math.max(...parents.map(p => p.id), 100) + 1;
        setParents([...parents, { id: newId, ...formData }]);
      }
    } else {
      if (editingItem) {
        setBabysitters(babysitters.map(item =>
          item.id === editingItem.id
            ? { ...item, ...formData, note: parseFloat(formData.note) }
            : item
        ));
      } else {
        const newId = Math.max(...babysitters.map(b => b.id), 200) + 1;
        setBabysitters([...babysitters, {
          id: newId,
          ...formData,
          note: parseFloat(formData.note)
        }]);
      }
    }
    setShowModal(false);
  };

  return {
    parents,
    babysitters,
    showModal,
    editingItem,
    activeTab,
    searchTerm,
    filteredItems: getFilteredItems(),
    setActiveTab,
    setSearchTerm,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    setShowModal
  };
};