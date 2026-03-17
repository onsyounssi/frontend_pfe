import React, { useState } from 'react';
import Header from '../components/parent/Header';


function ParentDashboard() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Mon tableau de bord</h2>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Prochaines gardes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prochaines gardes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">2</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-10 h-10 text-pink-500" aria-hidden="true">
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
            </div>
          </div>

          {/* Gardes passées */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gardes passées</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">2</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big w-10 h-10 text-green-500" aria-hidden="true">
                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                <path d="m9 11 3 3L22 4"></path>
              </svg>
            </div>
          </div>

          {/* Baby-sitters favoris */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Baby-sitters favoris</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart w-10 h-10 text-pink-500 fill-pink-500" aria-hidden="true">
                <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Prochaines gardes */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Prochaines gardes</h3>
          <div className="space-y-4">
            {/* Garde 1 */}
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">Inès R.</h4>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Confirmée
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-4 h-4" aria-hidden="true">
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                      <span>15 fév 2024</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4" aria-hidden="true">
                        <path d="M12 6v6l4 2"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                      <span>18:00 - 22:00</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Lucas (3 ans)</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-semibold">
                    Détails
                  </button>
                  <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm font-semibold">
                    Contacter
                  </button>
                </div>
              </div>
            </div>

            {/* Garde 2 */}
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">Asma T.</h4>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      En attente
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-4 h-4" aria-hidden="true">
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                      <span>20 fév 2024</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4" aria-hidden="true">
                        <path d="M12 6v6l4 2"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                      <span>14:00 - 18:00</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Emma (5 ans), Lucas (3 ans)</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-semibold">
                    Détails
                  </button>
                  <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm font-semibold">
                    Contacter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historique */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Historique</h3>
          <div className="space-y-4">
            {/* Historique 1 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">Inès R.</h4>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      Terminée
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-4 h-4" aria-hidden="true">
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                      <span>12 fév 2024</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4" aria-hidden="true">
                        <path d="M12 6v6l4 2"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                      <span>18:00 - 22:00</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star w-4 h-4 text-yellow-400 fill-yellow-400" aria-hidden="true">
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                      </svg>
                      <span>5/5</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900">60DNT</span>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-semibold">
                    Voir détails
                  </button>
                </div>
              </div>
            </div>

            {/* Historique 2 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">Nessrin K.</h4>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      Terminée
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-4 h-4" aria-hidden="true">
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                      <span>8 fév 2024</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4" aria-hidden="true">
                        <path d="M12 6v6l4 2"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                      <span>19:00 - 23:00</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star w-4 h-4 text-yellow-400 fill-yellow-400" aria-hidden="true">
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                      </svg>
                      <span>4/5</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900">64DNT</span>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-semibold">
                    Voir détails
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ParentDashboard;