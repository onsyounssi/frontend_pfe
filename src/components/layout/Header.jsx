import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Calendar,
  MessageCircle,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  Bell
} from "lucide-react";
import sitterProfileService from "../../services/sitterProfileService";

function Header() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sitterProfileId, setSitterProfileId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (user?.role?.toLowerCase() === "baby-sitter") {
      loadSitterProfile();
    }
  }, [user]);

  const loadSitterProfile = async () => {
    try {
      const profile = await sitterProfileService.getMyProfile();
      if (profile && profile._id) {
        setSitterProfileId(profile._id);
      }
    } catch (err) {
      console.error("Erreur chargement profil sitter:", err);
    }
  };

  const handleSitterProfileClick = () => {
    if (sitterProfileId) {
      navigate(`/profil/${sitterProfileId}`);
    } else {
      navigate("/register-sitter");
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    setUser(null);
    navigate("/");
  };

  const role = user?.role?.toLowerCase();
  const isActive = (path) => location.pathname === path;

  // CLASSE DE BASE POUR LES LIENS
  const navLinkClass = (path) => `
    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300
    ${isActive(path)
      ? 'bg-pink-50 text-pink-500 shadow-sm border border-pink-70'
      : 'text-gray-500 hover:text-pink-500 hover:bg-pink-60'}
  `;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-[1000] shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#E91E63] to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-200 group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tighter leading-none hidden sm:block">
            Smart<span className="text-pink-500">Baby</span>Care
          </span>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden lg:flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/" className={navLinkClass("/")}>Accueil</Link>
              <Link to="/register-sitter" className={navLinkClass("/register-sitter")}>Devenir Sitter</Link>
              <Link to="/login" className="text-slate-500 font-bold px-4 py-2 hover:text-pink-500 transition">Connexion</Link>
              <Link to="/register">
                <button className="bg-pink-500 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-pink-600 shadow-md shadow-pink-200 transition-all active:scale-95">
                  Rejoindre
                </button>
              </Link>
            </>
          ) : (
            <>
              {/* Liens Parents */}
              {role === "parente" && (
                <>
                  <Link to="/recherche-sitters" className={navLinkClass("/recherche-sitters")}>
                    <Search className="w-4 h-4" /> Rechercher
                  </Link>
                  <Link to="/reservation" className={navLinkClass("/reservation")}>
                    <Calendar className="w-4 h-4" /> Réservations
                  </Link>
                  <Link to="/chat" className={navLinkClass("/chat")}>
                    <MessageCircle className="w-4 h-4" /> Messagerie
                  </Link>
                  <Link to="/parente" className={navLinkClass("/parente")}>
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                </>
              )}

              {/* Liens Sitters */}
              {role === "baby-sitter" && (
                <>
                  <Link to="/baby-sitter" className={navLinkClass("/baby-sitter")}>
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link to="/chat" className={navLinkClass("/chat")}>
                    <MessageCircle className="w-4 h-4" /> Messages
                  </Link>
                  <button
                    onClick={handleSitterProfileClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 text-gray-600 hover:text-[#E91E63] hover:bg-pink-50 cursor-pointer"
                  >
                    <User className="w-4 h-4" /> Mon Profil
                  </button>
                </>
              )}

              {/* Liens Admin */}
              {role === "admin" && (
                <Link to="/admin" className={navLinkClass("/admin")}>
                  <LayoutDashboard className="w-4 h-4" /> Admin Panel
                </Link>
              )}
            </>
          )}
        </nav>

        {/* SECTION UTILISATEUR & COMPTE */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-6 border-l border-gray-200 pl-6 h-10">
              {/* Notifications / Messages Badge */}
              <Link to="/chat" className="relative p-2 text-gray-500 hover:text-[#E91E63] transition-colors group">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#E91E63] border-2 border-white rounded-full"></span>
              </Link>

              {/* PROFIL PREMIUM */}
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-gray-800 leading-none">
                    {user.firstName || "Utilisateur"}
                  </p>
                  <p className="text-[10px] font-bold text-[#E91E63] uppercase tracking-widest mt-1">
                    {role === 'parente' ? 'Parent Client' : 'Baby Sitter'}
                  </p>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gray-100 border-2 border-white shadow-md overflow-hidden group-hover:border-pink-200 transition-colors">
                    <img
                      src={user.image ? `http://localhost:5000/uploads/${user.image}` : `https://ui-avatars.com/api/?name=${user.firstName}&background=fde7f3&color=ec4899&bold=true`}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                </div>

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            className="lg:hidden p-2 text-slate-600 active:scale-95 transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 p-4 space-y-2 animate-in slide-in-from-top duration-300">
          {user ? (
            <>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest px-4 mb-2 mt-4">Navigation</p>
              {role === 'parente' ? (
                <>
                  <Link to="/recherche-sitters" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass("/recherche-sitters")}>Rechercher</Link>
                  <Link to="/reservation" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass("/reservation")}>Réservations</Link>
                  <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass("/chat")}>Messages</Link>
                  <Link to="/parente" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass("/parente")}>Dashboard</Link>
                </>
              ) : role === 'baby-sitter' ? (
                <>
                  <Link to="/baby-sitter" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass("/baby-sitter")}>Dashboard</Link>
                  <Link to="/chat" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass("/chat")}>Messages</Link>
                  <button
                    onClick={handleSitterProfileClick}
                    className="w-full text-left px-4 py-3 text-gray-600 font-bold hover:bg-pink-50 hover:text-[#E91E63] rounded-xl transition"
                  >
                    Mon Profil
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition">Déconnexion</button>
                </>
              ) : (
                <>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition">Déconnexion</button>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 font-bold text-gray-700">Connexion</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 font-bold text-[#E91E63]">S'inscrire</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;