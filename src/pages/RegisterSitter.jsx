import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Camera, Save } from 'lucide-react';

const RegisterSitter = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    tarifHoraire: '',
    experience: '',
    localisation: '',
    specialite: '',
    description: '',
    langues: '',
    image: null,
    disponibilites: {
      lun: false, mar: false, mer: false, jeu: false, ven: false, sam: false, dim: false
    }
  });

  // Gestion des changements de texte
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gestion des cases à cocher (Disponibilités)
  const handleCheck = (day) => {
    setFormData({
      ...formData,
      disponibilites: { 
        ...formData.disponibilites, 
        [day]: !formData.disponibilites[day] 
      }
    });
  };

  // Gestion de l'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // On ajoute tous les champs simples
    Object.keys(formData).forEach(key => {
      if (key === 'disponibilites') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await axios.post('http://localhost:5000/api/SitterProfiles/register', data);
      alert("Profil créé avec succès !");
      navigate('/babysitter'); // Redirection vers le dashboard
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création du profil");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-2xl my-10">
      <h2 className="text-3xl font-bold text-pink-600 mb-6">Devenir Baby-sitter</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Photo */}
        <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-200 rounded-xl">
          {imagePreview ? (
            <img src={imagePreview} className="w-32 h-32 rounded-full object-cover mb-2" alt="Preview" />
          ) : (
            <Camera className="w-12 h-12 text-gray-400 mb-2" />
          )}
          <input type="file" onChange={handleImageChange} className="text-sm" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="nom" placeholder="Nom complet" onChange={handleChange} className="border p-3 rounded-lg" required />
          <input name="tarifHoraire" type="number" placeholder="Tarif (DNT/h)" onChange={handleChange} className="border p-3 rounded-lg" required />
          <input name="localisation" placeholder="Ville (ex: Tunis 15ème)" onChange={handleChange} className="border p-3 rounded-lg" />
          <input name="experience" placeholder="Expérience (ex: 5 ans)" onChange={handleChange} className="border p-3 rounded-lg" />
        </div>

        <textarea name="description" placeholder="Parlez de vous..." onChange={handleChange} className="w-full border p-3 rounded-lg h-32"></textarea>

        {/* Section Disponibilités */}
        <div>
          <h3 className="font-semibold mb-3">Vos disponibilités</h3>
          <div className="flex flex-wrap gap-2">
            {Object.keys(formData.disponibilites).map(day => (
              <button 
                key={day} type="button"
                onClick={() => handleCheck(day)}
                className={`px-4 py-2 rounded-lg border transition ${formData.disponibilites[day] ? 'bg-pink-500 text-white' : 'bg-gray-50'}`}
              >
                {day.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold hover:bg-pink-700 flex items-center justify-center gap-2">
          <Save size={20} /> Enregistrer mon profil
        </button>
      </form>
    </div>
  );
};

export default RegisterSitter;