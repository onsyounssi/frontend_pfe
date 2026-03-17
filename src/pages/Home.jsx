import Header from "../components/layout/Header";
import Footer from "../components/Footer";
function Home() {
    return ( 
     
      <main className="flex-grow" >
        <Header />

        <section className="relative overflow-hidden bg-[url('src/assets/image/photo-page_accueil.jpeg')] 
        bg-cover bg-center"> 
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/60 via-pink-700/30 to-black/20" > </div>
          <div className="relative py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div class="md:w-7/12">
                  <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow">
                  Trouvez la 
                  <span className="text-pink-200">Garde Parfailte </span>
                  pour Vos Enfants </h2>
                  <p className="text-gray-600 mb-6">
                    Parent et baby-sitters vérifiés. Recherche simple, matching IA et réservation en quelques clics.
                  </p>
                  <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-3 md:p-4"> 
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-7 flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search w-5 text-gray-400 " aria-hidden="true" >
                        <path d="m21 21-4.34-4.34"></path>
                        <circle cx="11" cy="11" r="8"></circle>
                      </svg>
                      <input placeholder="Ville, besoin, age..." className="w-full bg-transparent focus:outline-none text-gray-700" type="text"></input>
                    </div>
                    <div className="md:col-span-5 flex gap-3">
                      <a href="/babysitter" className="w-full">
                      <button className="w-full bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition font-semibold shadow-lg shadow-pink-600/20">
                        Rechercher </button>
                        </a>
                       <a href="/register" className="hidden md:inline-flex w-full">
                      <button className="hidden md:inline-flex w-full bg-white text-pink-700 border border-pink-200 px-6 py-3 rounded-xl hover:bg-pink-50 transition font-semibold">
                        S’inscrire</button>
                        </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="md:w-5/12 w-full">
                <div className="bg-white/10 border border-white/20 rounded-3xl p-5 backdrop-blur">
                  <h3 className="text-white font-semibold text-lg mb-3">Pourquoi SmartBabyCare ?</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white/15">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield w-5 h-5 text-pink-200" aria-hidden="true">
                          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z">
                            </path>
                        </svg>
                      </div>
                      <p className="text-white/90">Profils vérifiés &amp; sécurité renforcée.</p>
                    </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-white/15">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart w-5 h-5 text-pink-200" aria-hidden="true">
                            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
                            </svg>
                      </div>
                            <p className="text-white/90">Matching IA selon vos besoins.</p>
                          </div>
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-xl bg-white/15">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big w-5 h-5 text-pink-200" aria-hidden="true">
                                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                  <path d="m9 11 3 3L22 4"></path>
                                  </svg>
                                  </div>
                                  <p className="text-white/90">Réservation rapide &amp; transparente.</p>
                              </div>
                           </div>
                         </div>
                        </div>
                      </div> 
                    </div>
                  </div> 
                                 
        </section>
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h4 className="text-3xl font-bold text-gray-900 mb-12">
                Pourquoi Choisir SmartBabyCare ?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition duration-300">
                <div class="inline-flex items-center justify-center p-3 rounded-full bg-pink-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search w-6 h-6 text-pink-500" aria-hidden="true">
                  <path d="m21 21-4.34-4.34"></path>
                  <circle cx="11" cy="11" r="8"></circle>
                  </svg>
              </div>
              <h5 className="text-xl font-semibold text-gray-900 mb-2">
                Recherche Intelligente</h5>
                <p className="text-gray-600">
                  Trouvez des profils basés sur vos critères et les besoins spécifiques de votre enfant.
                </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition duration-300">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-pink-100 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart w-6 h-6 text-pink-500" aria-hidden="true">
                        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg></div>
                        <h6 class="text-xl font-semibold text-gray-900 mb-2">Matching IA</h6>
                        <p className="text-gray-600">
                          Notre algorithme d'IA vous recommande les baby-sitters avec le meilleur taux de succès.
                          </p>
                   </div>
                            <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition duration-300">
                              <div className="inline-flex items-center justify-center p-3 rounded-full bg-pink-100 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield w-6 h-6 text-pink-500" aria-hidden="true">
                                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z">
                                    </path>
                                 </svg>
                              </div>
                              <h7 class="text-xl font-semibold text-gray-900 mb-2">Profils Vérifiés</h7>
                              <p class="text-gray-600">Sécurité maximale grâce à la vérification d'identité et des antécédents.
                              </p>
                            </div>
                        </div>
                      </div>
              </section> 
              <section className="py-16 bg-pink-100/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h8 className="text-3xl font-bold text-gray-900 mb-4">L'Intelligence Artificielle au Service de Votre Sérénité</h8>
                  <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                    Notre IA analyse plus de 50 points de données pour garantir que la baby-sitter recommandée correspond parfaitement à la personnalité et aux besoins de votre enfant.</p>
                    <button className="bg-pink-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-pink-700 transition duration-300">Découvrir le Matching IA</button>
                </div>
              </section>

               < Footer />
            
        </main> 
    ) 
  } 
   
   export default Home