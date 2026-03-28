const Header = () => {
    return (
        <header className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-pink-600">SmartBabyCare</h1>
      <nav className="hidden md:flex space-x-8">
        <a href="#" className="text-pink-600 font-semibold">Tableau de bord</a>
        <a href="/babysitter" className="text-gray-600 hover:text-pink-600">Recherche</a>
        <a href="/chat" className="text-gray-600 hover:text-pink-600">Messages</a>
      </nav>
      <button className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition">
        Mon compte
      </button>
    </div>
  </header>
    )
}

export default Header;