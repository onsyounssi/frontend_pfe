import React, { useState } from 'react';

function PaymentStep({ formData, onInputChange }) {
  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Informations de Paiement</h3>

      <div className="flex space-x-4 mb-6">
        <button
          className={`flex-1 flex flex-col items-center justify-center py-4 border-2 rounded-xl transition ${paymentMethod === 'creditCard' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
            }`}
          onClick={() => setPaymentMethod('creditCard')}
        >
          <span className="text-2xl mb-2">💳</span>
          <span className={`font-semibold ${paymentMethod === 'creditCard' ? 'text-pink-600' : 'text-gray-600'}`}>Carte Bancaire</span>
        </button>
        <button
          className={`flex-1 flex flex-col items-center justify-center py-4 border-2 rounded-xl transition ${paymentMethod === 'paypal' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
            }`}
          onClick={() => setPaymentMethod('paypal')}
        >
          <span className="text-2xl mb-2">📱</span>
          <span className={`font-semibold ${paymentMethod === 'paypal' ? 'text-pink-600' : 'text-gray-600'}`}>PayPal</span>
        </button>
      </div>

      {paymentMethod === 'creditCard' && (
        <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom sur la carte</label>
            <input
              type="text"
              name="cardName"
              value={formData.cardName || ''}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
            <div className="relative">
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber || ''}
                onChange={onInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                placeholder="0000 0000 0000 0000"
                maxLength="19"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">💳</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
              <input
                type="text"
                name="cardExpiry"
                value={formData.cardExpiry || ''}
                onChange={onInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                placeholder="MM/AA"
                maxLength="5"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
              <input
                type="text"
                name="cardCVC"
                value={formData.cardCVC || ''}
                onChange={onInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition"
                placeholder="123"
                maxLength="4"
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'paypal' && (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-600 mb-4">Vous serez redirigé vers PayPal pour finaliser votre paiement en toute sécurité.</p>
          <div className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-sm opacity-50 cursor-not-allowed">
            Continuer avec PayPal
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-start">
        <span className="mr-2">🔒</span>
        <span className="text-sm">Paiement 100% sécurisé (Ceci est une simulation de démonstration).</span>
      </div>
    </div>
  );
}

export default PaymentStep;
