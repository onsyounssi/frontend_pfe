import React, { useState, useEffect } from 'react';
import messageService from '../services/messageService';

function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [myUserId, setMyUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer l'ID de l'utilisateur connecté
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // Si l'id est stocké sous 'id' ou '_id'
        setMyUserId(user.id || user._id);
      } catch (e) {
        console.error("Format de user invalide", e);
      }
    } else {
      // Facultatif: Forcer un id de test si l'utilisateur n'est pas loggué (pour le debug)
      setMyUserId('65e9f8aaaaaa');
    }
  }, []);

  useEffect(() => {
    if (myUserId) {
      loadMessages();
    }
  }, [myUserId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const rawMessages = await messageService.getMessagesByUser(myUserId);

      // Organiser les messages par conversation (par contact)
      const convosMap = new Map();

      rawMessages.forEach(msg => {
        // Démarquer si le contact est l'expéditeur ou le destinataire
        const isMeSender = msg.senderId?._id === myUserId || msg.senderId === myUserId;
        const contactId = isMeSender ? (msg.receiverId?._id || msg.receiverId) : (msg.senderId?._id || msg.senderId);

        // Nom du contact
        const contactData = isMeSender ? msg.receiverId : msg.senderId;
        const contactName = contactData && contactData.firstName ? `${contactData.firstName} ${contactData.lastName}` : 'Utilisateur Inconnu';
        const contactAvatar = contactData?.image ? `http://localhost:5000/uploads/${contactData.image}` : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop';

        if (!convosMap.has(contactId)) {
          convosMap.set(contactId, {
            id: contactId,
            name: contactName,
            avatar: contactAvatar,
            messages: [],
            unread: 0
          });
        }

        const chatEntry = {
          id: msg._id,
          text: msg.text,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: isMeSender ? 'me' : 'other'
        };

        convosMap.get(contactId).messages.push(chatEntry);
      });

      // Transformer la map en array list
      const convosArray = Array.from(convosMap.values());
      setConversations(convosArray);

      if (convosArray.length > 0 && !selectedContactId) {
        setSelectedContactId(convosArray[0].id);
      }

    } catch (err) {
      console.error("Erreur chargement messages :", err);
    } finally {
      setLoading(false);
    }
  };

  const activeConversation = conversations.find(c => c.id === selectedContactId);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedContactId && myUserId) {
      try {
        await messageService.sendMessage(myUserId, selectedContactId, newMessage);
        setNewMessage('');
        // Recharger les messages pour inclure le nouveau
        loadMessages();
      } catch (err) {
        alert("Erreur lors de l'envoi du message : " + err.message);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-600">Messages</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex" style={{ height: '70vh' }}>

          {/* Sidebar - Contact List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-gray-50/50">
            {loading && <p className="p-4 text-gray-500 text-center animate-pulse">Chargement...</p>}
            {!loading && conversations.length === 0 && (
              <p className="p-6 text-gray-500 text-center text-sm">
                Vous n'avez envoyé aucun message pour l'instant. Rendez-vous sur un profil pour initier une discussion.
              </p>
            )}
            {conversations.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedContactId(chat.id)}
                className={`w-full p-4 flex items-center gap-4 hover:bg-white transition border-b border-gray-100 ${selectedContactId === chat.id ? 'bg-white border-l-4 border-l-pink-500 shadow-sm' : ''
                  }`}
              >
                <img
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  src={chat.avatar}
                />
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900 truncate">{chat.name}</p>
                    {chat.unread > 0 && (
                      <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  {chat.messages.length > 0 && (
                    <p className="text-sm text-gray-500 truncate">{chat.messages[chat.messages.length - 1].text}</p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Chat Area */}
          {activeConversation ? (
            <div className="flex-1 flex flex-col bg-white">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <img src={activeConversation.avatar} alt="" className="w-10 h-10 rounded-full" />
                <p className="font-semibold text-gray-900 text-lg">{activeConversation.name}</p>
              </div>

              {/* Messages Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeConversation.messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-sm ${msg.sender === 'me'
                          ? 'bg-pink-500 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        }`}
                    >
                      <p className="text-[15px] leading-relaxed">{msg.text}</p>
                      <p className={`text-xs mt-2 font-medium ${msg.sender === 'me' ? 'text-pink-100 text-right' : 'text-gray-500'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Écrivez votre message..."
                    className="flex-1 rounded-full border border-gray-300 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!myUserId}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!myUserId || !newMessage.trim()}
                    className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition shadow-sm disabled:opacity-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                      <path d="m21.854 2.147-10.94 10.939" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg">Sélectionnez une conversation</p>
                <p className="text-sm mt-1">pour afficher les messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;