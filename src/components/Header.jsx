import ParentDashbord from "../pages/ParentDashboard"

function Header() { 
  return ( 
    <header className="bg-white shadow-md"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center"> 
        <h1 className="text-2xl font-bold text-pink-600">SmartBabyCare</h1> 
        <nav className="hidden md:flex space-x-8"> 
          <a href="#" className="text-gray-600 hover:text-pink-600">Comment ça marche</a> 
          <a href="#" className="text-gray-600 hover:text-pink-600">Devenir Sitter</a> 
          <a href="#" className="text-gray-600 hover:text-pink-600">Connexion</a> 
        </nav> 
        <button type="submit" className="bg-pink-500 text-white px-4 rounded-full hover:bg-pink-600 transition duration-300"> 
       Réserver </button>
      </div> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center"> 
          <h1 className="text-2xl font-bold text-pink-600">SmartBabyCare</h1> 
          <nav className="hidden md:flex space-x-8"> 
            <a href="#" className="text-gray-600 hover:text-pink-600">Tableau de bord </a> 
            <a href="#" className="text-gray-600 hover:text-pink-600">Recherche</a> 
            <a href="#" className="text-gray-600 hover:text-pink-600">Messages</a> 
          </nav> 
          <button type="submit" className="bg-pink-500 text-white px-4 rounded-full hover:bg-pink-600 transition duration-300"> 
         Mon compte </button>
        </div> 
    </header> 
  ) 
} 

 
export default Header