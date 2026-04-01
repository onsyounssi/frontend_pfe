import React from 'react';

function DateTimeForm({ formData, onInputChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Choisissez la date et l'heure</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date
          </label>
          <input
            name="date"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={formData.date}
            onChange={onInputChange}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Heure début
            </label>
            <input
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={onInputChange}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Heure fin
            </label>
            <input
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={onInputChange}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
      </div>
    </div>

  )
}


export default DateTimeForm;