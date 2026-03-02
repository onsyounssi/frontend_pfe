function AdminDashbord() { 
    return ( 
      <main className="flex"> 
        <aside className="w-72 hidden md:flex flex-col border-r border-gray-200 bg-white sticky top-0 h-screen">
          <div className="px-6 py-5 border-b-4 bg-pink-600 border-pink-600">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-pink-600 text-white flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-5 h-5" aria-hidden="true">
                  <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                  <path d="M20 2v4"></path>
                  <path d="M22 4h-4"></path>
                  <circle cx="4" cy="20" r="2"></circle>
                </svg></div><div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/80 font-semibold">Admin</p>
                  <p className="text-lg font-extrabold text-white">SmartBabyCare</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-4 flex-1">
            <p className="px-2 text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold mb-2">Gestion</p>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition border bg-pink-600 text-white border-transparent">
                <span className="text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users w-4 h-4" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <circle cx="9" cy="7" r="4"></circle></svg></span>
                  <span className="font-semibold">Parents</span></button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition border bg-white text-gray-700 border-gray-100 hover:bg-gray-50"><span class="text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart w-4 h-4" aria-hidden="true">
                      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path></svg></span>
                      <span className="font-semibold">Baby-sitters</span></button></div></div>
                      <div className="px-4 pb-6">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings w-4 h-4" aria-hidden="true">
                            <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
        <span className="font-semibold">Paramètres</span>
        </button></div>
      </aside>
      <section className="flex-1">
        <div className="px-4 sm:px-6 lg:px-10 py-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Gestion des Parents</h2>
              <p className="text-sm text-gray-600 mt-1">CRUD statique (create / edit / delete) sans API.</p></div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true">
                    <path d="m21 21-4.34-4.34"></path>
                  <circle cx="11" cy="11" r="8"></circle></svg>
                  <input placeholder="Rechercher…" className="pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
                    </div>
                    <button className="inline-flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition bg-pink-600 hover:bg-pink-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus w-4 h-4" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="M12 5v14"></path>
                        </svg>Ajouter</button>
                        </div></div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                              <tr><th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">ID</th>
                              <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Nom</th>
                              <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Ville</th>
                              <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Statut</th>
                              <th className="px-6 py-3 font-semibold uppercase text-xs tracking-wide">Actions</th></tr></thead>
                              <tbody className="divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50/60">
                                  <td className="px-6 py-3 text-gray-800 whitespace-nowrap">101</td>
                                  <td className="px-6 py-3 text-gray-800 whitespace-nowrap">F. Martin</td>
                                  <td className="px-6 py-3 text-gray-800 whitespace-nowrap">Paris</td>
                                  <td className="px-6 py-3 text-gray-800 whitespace-nowrap">Actif</td>
                                  <td className="px-6 py-3">
                                    <div className="flex items-center gap-2">
                                      <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition text-gray-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil w-4 h-4" aria-hidden="true">
                                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path><path d="m15 5 4 4"></path></svg>
                                        <span className="hidden sm:inline">Modifier</span></button>
                                        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 transition">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 w-4 h-4" aria-hidden="true"><path d="M10 11v6"></path><path d="M14 11v6"></path>
                                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                          <path d="M3 6h18"></path>
                                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                          
                                          <span className="hidden sm:inline">Supprimer</span></button>
                                          </div></td></tr><tr class="hover:bg-gray-50/60">
                                            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">102</td>
                                            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">S. Diallo</td>
                                            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">Lyon</td>
                                            <td className="px-6 py-3 text-gray-800 whitespace-nowrap">Actif</td>
                                            <td className="px-6 py-3">
                                              <div className="flex items-center gap-2">
                                              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition text-gray-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil w-4 h-4" aria-hidden="true">
                                                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                                                <path d="m15 5 4 4"></path></svg>
                                                <span className="hidden sm:inline">Modifier</span></button>
                                                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 transition">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 w-4 h-4" aria-hidden="true">
                                                    <path d="M10 11v6"></path>
                                                    <path d="M14 11v6"></path>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                                    <path d="M3 6h18"></path>
                                                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    <span class="hidden sm:inline">Supprimer</span></button>
                                                    </div></td></tr><tr className="hover:bg-gray-50/60">
                                                      <td className="px-6 py-3 text-gray-800 whitespace-nowrap">103</td>
                                                      <td class="px-6 py-3 text-gray-800 whitespace-nowrap">A. Benali</td>
                                                      <td className="px-6 py-3 text-gray-800 whitespace-nowrap">Bordeaux</td><td className="px-6 py-3 text-gray-800 whitespace-nowrap">En pause</td>
                                                      <td className="px-6 py-3">
                                                        <div className="flex items-center gap-2">
                                                          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition text-gray-800">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-pencil w-4 h-4" aria-hidden="true">
                                                              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                                                              <path d="m15 5 4 4"></path></svg>
                                                              <span className="hidden sm:inline">Modifier</span></button>
                                                            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 transition">
                                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash2 lucide-trash-2 w-4 h-4" aria-hidden="true">
                                                                <path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                                                <path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                                <span className="hidden sm:inline">Supprimer</span></button></div></td></tr>
                                                                </tbody>
                                                                </table></div></div></div>
                                                  </section>
                                                  </main> 
    ) 
  } 
   
  export default AdminDashbord