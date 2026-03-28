import React, { useState } from 'react';

function MessagesPage  () {
  const [messages] = useState([
    {
      id: 1,
      name: 'Inès R.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      lastMessage: 'Parfait, je serai là à 18h',
      time: 'Il y a 5 min',
      unread: 2,
      active: true,
      conversation: [
        { id: 1, text: 'Bonjour ! Je confirme ma disponibilité pour ce soir.', time: '14:30', sender: 'other' },
        { id: 2, text: 'Parfait, merci beaucoup !', time: '14:32', sender: 'me' },
        { id: 3, text: 'Parfait, je serai là à 18h', time: '14:35', sender: 'other' }
      ]
    },
    {
      id: 2,
      name: 'Asma T.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      lastMessage: 'Merci pour la garde d\'hier',
      time: 'Hier',
      unread: 0,
      active: false,
      conversation: [
        { id: 1, text: 'Merci pour la garde d\'hier', time: 'Hier', sender: 'other' }
      ]
    },
    {
      id: 3,
      name: 'Nessrin K.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      lastMessage: 'Je confirme pour demain',
      time: 'Il y a 2 jours',
      unread: 0,
      active: false,
      conversation: [
        { id: 1, text: 'Je confirme pour demain', time: 'Il y a 2 jours', sender: 'other' }
      ]
    }
  ]);

  const [selectedChat, setSelectedChat] = useState(messages[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Logique pour envoyer le message
      console.log('Message envoyé:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-600">Messages</h1>
          <button className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition">
            Nouveau message
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Sidebar - Contact List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              {messages.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition ${
                    selectedChat?.id === chat.id ? 'bg-pink-50 border-l-4 border-pink-500' : ''
                  }`}
                >
                  <img
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                    src={chat.avatar}
                  />
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900">{chat.name}</p>
                      {chat.unread > 0 && (
                        <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    <p className="text-xs text-gray-400 mt-1">{chat.time}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Chat Area */}
            {selectedChat && (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900">{selectedChat.name}</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedChat.conversation.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          msg.sender === 'me'
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === 'me' ? 'text-pink-100' : 'text-gray-500'
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Tapez votre message..."
                      className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5"
                        aria-hidden="true"
                      >
                        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                        <path d="m21.854 2.147-10.94 10.939" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;