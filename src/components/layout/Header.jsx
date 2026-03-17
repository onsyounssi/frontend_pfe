function Header(){
    return(
<header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-600">
            <a href="/">SmartBabyCare</a>
            </h1>
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-600 hover:text-pink-600">Comment ça  marche </a>
            <a href="#" className="text-gray-600 hover:text-pink-600">Devenir Sitter</a>
            <a href="/login" className="text-gray-600 hover:text-pink-600">Connexion</a>
          </nav>
          <a href="/reservation">
          <button className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition">
            Réserver 
          </button>
          </a>
        </div>
      </header>
    );
}
export default Header 