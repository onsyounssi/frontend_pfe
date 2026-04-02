import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/Footer";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fonction pour gérer la recherche
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Redirige vers la page recherche avec le paramètre de recherche
      navigate(`/recherche-sitters?query=${searchTerm}`);
    } else {
      navigate("/recherche-sitters");
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[url('src/assets/image/baby_care_hero.jpeg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/60 via-pink-700/30 to-black/20"></div>
        <div className="relative py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-7/12">
                <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow">
                  Trouvez la <span className="text-pink-200">Garde Parfaite</span> pour Vos Enfants
                </h2>
                <p className="text-white/90 text-lg mb-6">
                  Parents et baby-sitters vérifiés. Recherche simple, matching IA et réservation en quelques clics.
                </p>

                {/* Barre de Recherche Dynamique */}
                <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-3 md:p-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-7 flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search w-5 text-gray-400">
                        <path d="m21 21-4.34-4.34"></path>
                        <circle cx="11" cy="11" r="8"></circle>
                      </svg>
                      <input 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Ville, besoin, age..." 
                        className="w-full bg-transparent focus:outline-none text-gray-700" 
                        type="text" 
                      />
                    </div>
                    <div className="md:col-span-5 flex gap-3">
                      <button 
                        type="submit"
                        className="w-full bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition font-semibold shadow-lg shadow-pink-600/20"
                      >
                        Rechercher
                      </button>
                      <Link to="/register" className="hidden md:inline-flex w-full">
                        <button type="button" className="w-full bg-white text-pink-700 border border-pink-200 px-6 py-3 rounded-xl hover:bg-pink-50 transition font-semibold">
                          S’inscrire
                        </button>
                      </Link>
                    </div>
                  </div>
                </form>
              </div>

              {/* Points Forts IA */}
              <div className="md:w-5/12 w-full">
                <div className="bg-white/10 border border-white/20 rounded-3xl p-5 backdrop-blur">
                  <h3 className="text-white font-semibold text-lg mb-3">Pourquoi SmartBabyCare ?</h3>
                  <div className="space-y-4">
                    <FeatureItem icon="shield" text="Profils vérifiés & sécurité renforcée." />
                    <FeatureItem icon="heart" text="Matching IA selon vos besoins." />
                    <FeatureItem icon="check" text="Réservation rapide & transparente." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Arguments */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h4 className="text-3xl font-bold text-gray-900 mb-12">Pourquoi Choisir SmartBabyCare ?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <CardArgument 
              title="Recherche Intelligente" 
              desc="Trouvez des profils basés sur vos critères et les besoins spécifiques de votre enfant."
              icon="search"
            />
            <CardArgument 
              title="Matching IA" 
              desc="Notre algorithme d'IA vous recommande les baby-sitters avec le meilleur taux de succès."
              icon="heart"
            />
            <CardArgument 
              title="Profils Vérifiés" 
              desc="Sécurité maximale grâce à la vérification d'identité et des antécédents."
              icon="shield"
            />
          </div>
        </div>
      </section>

      {/* Call to Action IA */}
      <section className="py-16 bg-pink-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">L'Intelligence Artificielle au Service de Votre Sérénité</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Notre IA analyse plus de 50 points de données pour garantir que la baby-sitter recommandée correspond parfaitement.
          </p>
          <Link to="/recherche-sitters">
            <button className="bg-pink-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-pink-700 transition duration-300 shadow-lg">
              Découvrir le Matching IA
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// Composants réutilisables pour plus de clarté
const FeatureItem = ({ icon, text }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-xl bg-white/15 text-pink-200">
      {/* Remplacer par des composants SVG si nécessaire */}
      <div className="w-5 h-5 border-2 border-current rounded-full" />
    </div>
    <p className="text-white/90">{text}</p>
  </div>
);

const CardArgument = ({ title, desc }) => (
  <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition duration-300">
    <div className="inline-flex items-center justify-center p-3 rounded-full bg-pink-100 mb-4 text-pink-600 font-bold">
      ✓
    </div>
    <h5 className="text-xl font-semibold text-gray-900 mb-2">{title}</h5>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default Home;