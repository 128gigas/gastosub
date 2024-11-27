import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Receipt } from 'lucide-react';

export const ExpenseForm: React.FC = () => {
  const { people, addExpense } = useApp();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paidById: '',
    splitBetween: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      description: formData.description,
      amount: Number(formData.amount),
      paidById: formData.paidById,
      splitBetween: formData.splitBetween.length ? formData.splitBetween : [formData.paidById],
    });
    setFormData({
      description: '',
      amount: '',
      paidById: '',
      splitBetween: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Agregar Nuevo Gasto</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Monto</label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.amount}
          onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Pagado Por</label>
        <select
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.paidById}
          onChange={e => setFormData(prev => ({ ...prev, paidById: e.target.value }))}
        >
          <option value="">Seleccionar persona</option>
          {people.map(person => (
            <option key={person.id} value={person.id}>{person.fullName}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Dividir Entre</label>
        <div className="mt-2 space-y-2">
          {people.map(person => (
            <label key={person.id} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                checked={formData.splitBetween.includes(person.id)}
                onChange={e => {
                  setFormData(prev => ({
                    ...prev,
                    splitBetween: e.target.checked
                      ? [...prev.splitBetween, person.id]
                      : prev.splitBetween.filter(id => id !== person.id)
                  }));
                }}
              />
              <span className="ml-2 text-sm text-gray-700">{person.fullName}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
      >
        <Receipt className="w-4 h-4 mr-2" />
        Agregar Gasto
      </button>
    </form>
  );
};