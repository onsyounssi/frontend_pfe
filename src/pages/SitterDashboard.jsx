
function SitterDashbord() { 
    return ( 

      <main className="flex-grow"> 
        <section className="bg-gray-100 py-20 text-center"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Trouvez votre baby-sitter</h2> 
        <div className="text-3xl font-bold text-gray-900 mb-6">
        <div className="flex items-center gap-2 mb-4">
        <svg url="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" strokelinejoin="round" class="lucide lucide-funnel w-5 h-5 text-pink-600" aria-hidden="true">
          <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path>
        </svg>
        <h3  className="text-lg font-semibold text-gray-900">Fillters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Ville</label>
          <input placeholder="Ex: Paris" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" type="input" /></div>

        </div>
        </div>
        </div>
        
          <h2 className="text-4xl font-bold mb-4">Welcome to MyApp</h2> 
          <p className="text-gray-600 mb-6"> 
            Build modern applications with React and Tailwind CSS 
          </p> 
          <button className="bg-blue-600 text-white px-6 py-2 rounded"> 
          SitterDashbord 
          </button> 
        </section> 
      </main> 
    ) 
  } 
   
  export default SitterDashbord