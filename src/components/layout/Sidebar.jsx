import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, Heart, Settings, Home, MessageSquare, Search, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, onLogout }) => {
  const menuItems = [
    { id: 'parents', label: 'Parents', icon: Users },
    { id: 'babysitters', label: 'Baby-sitters', icon: Heart },
  ];

  const navLinkClass = (isActive) =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition border text-left ${
      isActive
        ? 'bg-pink-600 text-white border-transparent'
        : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'
    }`;

  return (
    <aside className="w-72 hidden md:flex flex-col border-r border-gray-200 bg-white sticky top-0 h-screen">
      <div className="px-6 py-5 border-b-4 bg-pink-600 border-pink-600">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white/20 text-white flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/80 font-semibold">Admin</p>
            <p className="text-lg font-extrabold text-white">SmartBabyCare</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 flex-1 overflow-y-auto">
        <p className="px-2 text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold mb-2">Gestion</p>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={navLinkClass(isActive)}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-700'}`} />
                <span className="font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>

        <p className="px-2 text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold mb-2 mt-6">
          Pages app
        </p>
        <div className="space-y-1">
          <Link to="/" className={navLinkClass(false)}>
            <Home className="w-4 h-4 text-gray-700" />
            <span className="font-semibold">Accueil</span>
          </Link>
          <Link to="/recherche-sitters" className={navLinkClass(false)}>
            <Search className="w-4 h-4 text-gray-700" />
            <span className="font-semibold">Recherche sitters</span>
          </Link>
          <Link to="/reviews" className={navLinkClass(false)}>
            <MessageSquare className="w-4 h-4 text-gray-700" />
            <span className="font-semibold">Avis</span>
          </Link>
        </div>
      </div>

      <div className="px-4 pb-6 space-y-1 border-t border-gray-100 pt-4">
        <Link
          to="/reservation"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
        >
          <Settings className="w-4 h-4" />
          <span className="font-semibold">Réservations</span>
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-red-100 text-red-700 hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-semibold">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
