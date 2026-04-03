import React, { useState, useEffect, useRef } from 'react';
import messageService from '../services/messageService';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [myUserId, setMyUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);

  // Initialisation : Récupérer mon ID
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setMyUserId(user.id || user._id);
    } else {
      setMyUserId('65e9f8aaaaaa'); // Fallback test
    }
  }, []);

  // Charger les messages et rafraîchir toutes les 5 secondes
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
          convosMap.set(contactId, {
            id: contactId,
            name: `${contact.firstName} ${contact.lastName}`,
            avatar: contact.image ? `http://localhost:5000/uploads/${contact.image}` : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
            messages: [],
            lastUpdate: msg.createdAt,
            unreadCount: 2 // Ici vous pouvez lier un vrai compteur si vous avez un champ 'read'
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
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await messageService.sendMessage(myUserId, selectedContactId, newMessage);
      setNewMessage('');
      loadMessages();
    } catch (err) {
      alert("Erreur d'envoi");
    }
  };

  const activeChat = conversations.find(c => c.id === selectedContactId);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* HEADER DYNAMIQUE */}
      <header className="bg-white px-8 py-4 flex justify-between items-center border-b">
        <h1 className="text-3xl font-bold text-pink-600">Messages</h1>
        <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-medium transition shadow-md">
          Nouveau message
        </button>
      </header>

      {/* CONTENU PRINCIPAL */}
      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        {/* SIDEBAR - LISTE DES CONTACTS */}
        <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedContactId(chat.id)}
              className={`flex items-center gap-4 p-5 cursor-pointer transition relative border-b border-gray-50 ${
                selectedContactId === chat.id ? 'bg-pink-50/30' : 'hover:bg-gray-50'
              }`}
            >
              {selectedContactId === chat.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-pink-500 rounded-r-lg" />}
              <img src={chat.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" alt="" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-gray-900 truncate">{chat.name}</h3>
                  <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{chat.unreadCount}</span>
                </div>
                <p className="text-sm text-gray-500 truncate font-medium">
                  {chat.messages[chat.messages.length - 1]?.text}
                </p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
                   {formatDistanceToNow(new Date(chat.lastUpdate), { addSuffix: true, locale: fr })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ZONE DE CHAT */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {activeChat ? (
            <>
              <div className="p-5 border-b border-gray-100 flex items-center gap-4">
                <div className="font-bold text-xl text-gray-800">{activeChat.name}</div>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white">
                {activeChat.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-4 rounded-2xl shadow-sm ${
                      msg.sender === 'me' 
                        ? 'bg-pink-500 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                      <p className={`text-[10px] mt-2 font-bold ${msg.sender === 'me' ? 'text-pink-100 text-right' : 'text-gray-400'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* BARRE D'ENVOI */}
              <form onSubmit={handleSend} className="p-6 border-t border-gray-100 bg-gray-50 flex items-center gap-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-inner transition"
                />
                <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-xl shadow-lg transition-transform active:scale-95">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
               <p className="text-xl font-medium">Sélectionnez une discussion</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;