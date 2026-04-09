import React, { useState, useEffect, useRef } from 'react';
import messageService from '../services/messageService';
import sitterProfileService from '../services/sitterProfileService';
import bookingService from '../services/bookingService';
import Header from '../components/layout/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

function MessagesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContactId, setSelectedContactId] = useState(
    location.state?.contactId || location.state?.parentId || location.state?.sitterId || null
  );
  const [newMessage, setNewMessage] = useState('');
  const [myUserId, setMyUserId] = useState(null);
  const [myAvatar, setMyAvatar] = useState('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100');
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // ÉTATS POUR LE MODAL DE SÉLECTION DE PROFIL (ADAPTATIF)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [availableContacts, setAvailableContacts] = useState([]);
  const [contactSearchTerm, setContactSearchTerm] = useState('');

  const messagesEndRef = useRef(null);

  // RÉPONSES RAPIDES SELON LE RÔLE
  const getQuickReplies = () => {
    if (userRole === 'baby-sitter') {
      return ["Je suis disponible !", "À quelle heure dois-je arriver ?", "J'ai bien reçu votre demande.", "Merci beaucoup !"];
    }
    return ["Bonjour !", "Quels sont vos tarifs ?", "Seriez-vous disponible ?", "À bientôt !"];
  };

  const quickReplies = getQuickReplies();

  // Initialisation : Récupérer mon ID et mon avatar
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setMyUserId(user.id || user._id);
        setUserRole(user.role?.toLowerCase());
        if (user.image && user.image !== "default.jpg" && user.image !== "default-avatar.png") {
          setMyAvatar(`http://localhost:5000/uploads/${user.image}`);
        } else {
          setMyAvatar('https://ui-avatars.com/api/?name=' + (user.firstName || 'U') + '&background=random');
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Charger les messages et rafraîchir toutes les 5 secondes (Temps Réel)
  useEffect(() => {
    if (myUserId) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [myUserId]);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedContactId, conversations]);

  const loadMessages = async () => {
    try {
      const rawMessages = await messageService.getMessagesByUser(myUserId);
      const convosMap = new Map();

      rawMessages.forEach(msg => {
        const isMeSender = (msg.senderId._id || msg.senderId) === myUserId;
        const contact = isMeSender ? msg.receiverId : msg.senderId;

        if (!contact) return;
        const contactId = contact._id;

        if (!convosMap.has(contactId)) {
          const contactImage = contact.image && contact.image !== 'default.jpg' && contact.image !== 'default-avatar.png'
            ? `http://localhost:5000/uploads/${contact.image}`
            : `https://ui-avatars.com/api/?name=${contact.firstName || 'U'}&background=random`;

          convosMap.set(contactId, {
            id: contactId,
            name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || contact.nom || 'Utilisateur',
            avatar: contactImage,
            messages: [],
            lastUpdate: msg.createdAt,
            city: contact.city || 'Non spécifié',
            unreadCount: 0
          });
        }

        convosMap.get(contactId).messages.push({
          id: msg._id,
          text: msg.text,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: isMeSender ? 'me' : 'other'
        });
        convosMap.get(contactId).lastUpdate = msg.createdAt;
      });

      // GESTION DU CONTACT REDIRIGÉ (DYNAMIQUE) - Éviter les doublons
      const redirectedId = location.state?.contactId || location.state?.parentId || location.state?.sitterId;
      if (redirectedId && !convosMap.has(redirectedId)) {
        convosMap.set(redirectedId, {
          id: redirectedId,
          name: location.state?.contactName || "Nouveau Contact",
          avatar: location.state?.contactImage && location.state.contactImage !== 'default.jpg' && location.state.contactImage !== 'default-avatar.png'
            ? `http://localhost:5000/uploads/${location.state.contactImage}` 
            : `https://ui-avatars.com/api/?name=${location.state?.contactName || 'U'}&background=random`,
          messages: [],
          lastUpdate: new Date().toISOString(),
          city: location.state?.contactCity || 'Nouveau Contact',
          unreadCount: 0,
          isVerified: true
        });
      }

      const sorted = Array.from(convosMap.values()).sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
      setConversations(sorted);

      if (sorted.length > 0 && !selectedContactId) {
        setSelectedContactId(sorted[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await messageService.sendMessage(myUserId, selectedContactId, newMessage);
      setNewMessage('');
      loadMessages();
    } catch (err) {
      alert("Erreur d'envoi");
    } finally {
      setIsSending(false);
    }
  };

  const activeChat = conversations.find(c => c.id === selectedContactId);

  const openNewChatModal = async () => {
    setIsContactModalOpen(true);
    if (availableContacts.length === 0) {
      try {
        if (userRole === 'baby-sitter') {
          const bookings = await bookingService.getMyBookingsAsSitter();
          const parentsMap = new Map();
          bookings.forEach(b => {
            if (b.parentId && b.parentId._id) {
              parentsMap.set(b.parentId._id, {
                _id: b.parentId._id,
                nom: `${b.parentId.firstName} ${b.parentId.lastName}`,
                image: b.parentId.image,
                localisation: b.parentId.city || "Parent (Client)"
              });
            }
          });
          setAvailableContacts(Array.from(parentsMap.values()));
        } else {
          const data = await sitterProfileService.getAllSitters();
          setAvailableContacts(data);
        }
      } catch (err) {
        console.error("Erreur chargement contacts modal:", err);
      }
    }
  };

  const handleSelectContact = (contact) => {
    const existing = conversations.find(c => c.id === contact._id);
    if (!existing) {
      const virtualConvo = {
        id: contact._id,
        name: contact.nom,
        avatar: contact.image && contact.image !== 'default.jpg' ? `http://localhost:5000/uploads/${contact.image}` : `https://ui-avatars.com/api/?name=${contact.nom || 'U'}&background=random`,
        messages: [],
        lastUpdate: new Date().toISOString(),
        city: contact.localisation || 'Client',
        unreadCount: 0
      };
      setConversations([virtualConvo, ...conversations]);
    }
    setSelectedContactId(contact._id);
    setIsContactModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header />

      <div className="flex flex-1 overflow-hidden p-6 gap-6 max-w-[1600px] mx-auto w-full">
        {/* SIDEBAR - LISTE DES PROFILS (COLONNE 1) */}
        <div className="w-1/4 bg-white rounded-3xl shadow-xl shadow-slate-200 border border-white flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {userRole === 'baby-sitter' ? 'Mes Parents' : 'Tous les Sitters'}
              </h2>
              <button
                onClick={openNewChatModal}
                className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-xl shadow-lg transition-transform active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 text-sm focus:ring-2 focus:ring-pink-500/20 placeholder-slate-400 font-medium"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-2">
            {conversations
              .filter(chat => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedContactId(chat.id)}
                  className={`group flex items-center gap-4 p-4 cursor-pointer transition-all duration-300 rounded-2xl relative border ${selectedContactId === chat.id
                    ? 'bg-white shadow-xl shadow-slate-200 border-pink-100'
                    : 'bg-transparent border-transparent hover:bg-slate-50'
                    }`}
                >
                  {/* Indicateur de sélection subtil */}
                  {selectedContactId === chat.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-pink-500 rounded-r-full shadow-[0_0_10px_rgba(236,72,153,0.4)]" />
                  )}

                  <div className="relative flex-shrink-0">
                    <img
                      src={chat.avatar}
                      className={`w-14 h-14 rounded-2xl object-cover border-2 transition-all duration-300 ${selectedContactId === chat.id ? 'border-pink-500 scale-105' : 'border-white shadow-sm'
                        }`}
                      alt=""
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className={`font-black truncate text-sm transition-colors flex items-center gap-1 ${selectedContactId === chat.id ? 'text-pink-600' : 'text-slate-900'
                        }`}>
                        {chat.name}
                        <svg className="w-3 h-3 text-blue-500 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${userRole === 'baby-sitter' ? 'bg-blue-50 text-blue-500' : 'bg-pink-50 text-pink-500'
                        }`}>
                        {userRole === 'baby-sitter' ? 'Parent' : 'Sitter'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold truncate">
                        📍 {chat.city}
                      </span>
                    </div>

                    <p className={`text-[11px] truncate leading-tight ${selectedContactId === chat.id ? 'text-slate-600' : 'text-slate-400 font-medium'
                      }`}>
                      {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1]?.text : "Démarrer la discussion..."}
                    </p>
                  </div>

                  {/* Date ou Badge non lu */}
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-[9px] text-slate-300 font-black uppercase tracking-tighter">
                      {formatDistanceToNow(new Date(chat.lastUpdate), { addSuffix: false, locale: fr }).replace('environ', '').trim()}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.6)]"></span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ZONE DE CHAT ET ÉCRITEUR (COLONNE 2 & 3) */}
        <div className="flex-1 flex gap-6 bg-transparent">
          <div className={`${activeChat ? 'flex-1' : 'w-full'} bg-white rounded-3xl shadow-xl shadow-slate-200 border border-white flex flex-col overflow-hidden transition-all duration-500`}>
            {activeChat ? (
              <>
                <div className="p-5 border-b border-slate-50 bg-white/50 backdrop-blur-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={activeChat.avatar} className="w-10 h-10 rounded-2xl object-cover border-2 border-slate-50 shadow-sm" alt="" />
                    <div>
                      <h3 className="font-black text-slate-900 tracking-tight">{activeChat.name}</h3>
                      <p className="text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Connecté
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 scrollbar-hide">
                  {activeChat.messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
                      <img
                        src={msg.sender === 'me' ? myAvatar : activeChat.avatar}
                        alt="avatar"
                        className="w-8 h-8 rounded-full border border-gray-200 shadow-sm object-cover"
                        onClick={() => {
                          if (msg.sender !== 'me' && activeChat.profileId) {
                            navigate(`/profil/${activeChat.profileId}`);
                          }
                        }}
                        style={{ cursor: msg.sender !== 'me' ? 'pointer' : 'default' }}
                      />
                      <div className={`max-w-md p-4 rounded-3xl shadow-sm border ${msg.sender === 'me'
                        ? 'bg-pink-500 text-white border-pink-400 rounded-br-none'
                        : 'bg-white text-slate-800 border-slate-100 rounded-bl-none'
                        }`}>
                        <p className="text-sm font-semibold leading-relaxed">{msg.text}</p>
                        <p className={`text-[10px] mt-2 font-black uppercase tracking-tighter opacity-70 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-6 border-t border-slate-50 bg-white">
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                    {quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setNewMessage(reply); }}
                        className="bg-slate-50 hover:bg-pink-50 text-slate-600 hover:text-pink-600 text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all border border-slate-100 shadow-sm"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSend} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={isSending ? "Envoi..." : "Tapez un message..."}
                      disabled={isSending}
                      className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-pink-500/10 text-slate-700 placeholder-slate-400 shadow-inner transition-all text-sm font-medium"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || isSending}
                      className={`p-4 rounded-2xl shadow-lg transition-all active:scale-90 flex items-center justify-center ${newMessage.trim() && !isSending ? 'bg-pink-500 hover:bg-pink-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
                    >
                      {isSending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-6">
                <div className="w-40 h-40 bg-slate-100 rounded-full flex items-center justify-center shadow-inner">
                  <svg className="w-20 h-20 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <p className="text-xl font-black text-slate-400 uppercase tracking-widest">Aucune discussion sélectionnée</p>
              </div>
            )}
          </div>

          {activeChat && (
            <div className="w-1/4 bg-white rounded-3xl shadow-xl shadow-slate-200 border border-white flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
              <div className="p-8 text-center border-b border-slate-50 bg-gradient-to-b from-white to-slate-50/50">
                <div className="relative inline-block mb-6">
                  <img src={activeChat.avatar} className="w-32 h-32 rounded-[40px] object-cover border-4 border-white shadow-2xl mx-auto" alt="" />
                  <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-2xl shadow-lg">
                    <div className="w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-inner animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1 flex items-center justify-center gap-2">
                  {activeChat.name}
                  <svg className="w-5 h-5 text-blue-500 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                </h3>
                <p className="text-xs text-pink-500 font-bold uppercase tracking-widest bg-pink-50 py-1.5 px-4 rounded-full inline-block border border-pink-100 shadow-sm mt-2">{activeChat.city}</p>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto scrollbar-hide">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">Évaluation & Expérience</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 text-lg">★★★★★</span>
                    <span className="text-xs font-bold text-slate-700">5.0</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-1 rounded-md">Vérifié</span>
                    <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-1 rounded-md">Expérimenté</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">Statut du compte</p>
                  <div className="flex items-center gap-3 bg-green-50 p-4 rounded-2xl border border-green-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <p className="text-xs font-bold text-green-700 uppercase tracking-widest">Connecté & Actif</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">À propos</p>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "Passionné(e) par la garde d'enfants et dévoué(e) à leur bien-être au quotidien."
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Dernière activité</p>
                  <p className="text-[11px] font-bold text-slate-500">{formatDistanceToNow(new Date(activeChat.lastUpdate), { addSuffix: true, locale: fr })}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isContactModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="bg-pink-500 p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black mb-1">Nouveau Message</h2>
                <p className="text-pink-100 text-xs font-bold uppercase tracking-widest">Gérez vos relations ici</p>
              </div>
              <button onClick={() => setIsContactModalOpen(false)} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 space-y-4">
              <input
                type="text"
                placeholder="Rechercher..."
                value={contactSearchTerm}
                onChange={e => setContactSearchTerm(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-2xl py-4 px-6 font-bold text-sm focus:ring-2 focus:ring-pink-500/20 shadow-inner"
              />
              <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                {availableContacts
                  .filter(c => c.nom.toLowerCase().includes(contactSearchTerm.toLowerCase()))
                  .map(c => (
                    <div
                      key={c._id}
                      onClick={() => handleSelectContact(c)}
                      className="flex items-center gap-4 p-4 bg-white hover:bg-slate-50 border-2 border-transparent hover:border-pink-100 rounded-3xl cursor-pointer transition-all group shadow-sm hover:shadow-md"
                    >
                      <div className="relative">
                        <img
                                                    src={c.image && c.image !== 'default.jpg' && c.image !== 'default-avatar.png' ? `http://localhost:5000/uploads/${c.image}` : `https://ui-avatars.com/api/?name=${c.nom || 'U'}&background=random`}
                          className="w-14 h-14 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition duration-300"
                          alt=""
                        />
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-slate-900 text-sm group-hover:text-pink-600 transition">{c.nom}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                            {userRole === 'baby-sitter' ? 'Client' : 'Sitter'}
                          </span>
                          <p className="text-[10px] text-slate-400 font-bold">📍 {c.localisation || 'Tunis'}</p>
                        </div>
                      </div>
                      <div className="text-pink-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessagesPage;