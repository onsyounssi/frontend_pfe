import React from 'react';
import { ArrowLeft, MapPin, Star } from 'lucide-react';

export default function ProfilPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-pink-600">SmartBabyCare</h1>
        </div>
      </header>


         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profil principal */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img 
                alt="Inès R." 
                className="w-full h-64 md:h-full object-cover" 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Inès R.</h2>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>Tunis 15ème</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold text-gray-900">4.9</span>
                  <span className="text-gray-500">(42)</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Nourrissons (0-2 ans)
                </span>
                <span className="text-gray-600">5 ans d'expérience</span>
              </div>

              <p className="text-gray-700 mb-4">
                Baby-sitter expérimentée spécialisée dans la garde de nourrissons. 
                Patiente, attentionnée et passionnée par le bien-être des tout-petits.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Langues</p>
                  <p className="font-semibold text-gray-900">Français, Anglais, Arabe </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Certifications</p>
                  <p className="font-semibold text-gray-900">2</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-2xl font-bold text-pink-600">15DNT/h</p>
                  <p className="text-sm text-gray-500">Tarif horaire</p>
                </div>
                <button className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition font-semibold">
                  Réserver
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Disponibilités */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Disponibilités</h3>
          <div className="grid grid-cols-7 gap-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
              <div key={day} className="text-center">
                <p className="text-sm font-semibold text-gray-700 mb-2">{day}</p>
                <div className={`h-10 rounded-lg flex items-center justify-center ${
                  index < 5 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  {index < 5 ? '✓' : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avis */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Avis (42)</h3>
          <div className="space-y-4">
            {/* Avis 1 */}
            <div className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">Marie D.</p>
                  <p className="text-sm text-gray-500">Il y a 2 semaines</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">Inès est exceptionnelle ! Très professionnelle et rassurante.</p>
            </div>

            {/* Avis 2 */}
            <div className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">Thomas L.</p>
                  <p className="text-sm text-gray-500">Il y a 1 mois</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">Notre bébé adore Inès. Elle est douce et très à l'écoute.</p>
            </div>

            {/* Avis 3 */}
            <div className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">Sophie M.</p>
                  <p className="text-sm text-gray-500">Il y a 2 mois</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                  <Star className="w-4 h-4 text-gray-300" />
                </div>
              </div>
              <p className="text-gray-700">Très bien, ponctuelle et sérieuse. Je recommande !</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
        
      