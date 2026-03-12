// components/DateTimeForm.jsx
import React from 'react';

const DateTimeForm = ({ formData, onChange, onSubmit }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <form onSubmit={onSubmit}>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Choisissez la date et l'heure
          </h2>
          
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="date" 
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="startTime" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Heure début
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={onChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              
              <div>
                <label 
                  htmlFor="endTime" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Heure fin
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={onChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <div className="flex-1"></div>
          <button
            type="submit"
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition font-semibold"
          >
            Suivant
          </button>
        </div>
      </form>
    </div>
  );
};

export default DateTimeForm;