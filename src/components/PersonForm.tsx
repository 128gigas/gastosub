import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Person } from '../types';
import { UserPlus, Save } from 'lucide-react';

interface PersonFormProps {
  person?: Person;
  onClose?: () => void;
}

export const PersonForm: React.FC<PersonFormProps> = ({ person, onClose }) => {
  const { people, addPerson, updatePerson } = useApp();
  const [formData, setFormData] = useState({
    fullName: person?.fullName || '',
    bankName: person?.bankName || '',
    accountNumber: person?.accountNumber || '',
    partnerId: person?.partnerId || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (person) {
      updatePerson(person.id, formData);
    } else {
      addPerson(formData);
    }
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.fullName}
          onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Banco</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.bankName}
          onChange={e => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Número de Cuenta</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.accountNumber}
          onChange={e => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Asociacion</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.partnerId}
          onChange={e => setFormData(prev => ({ ...prev, partnerId: e.target.value }))}
        >
          <option value="">Sin asociacion</option>
          {people
            .filter(p => p.id !== person?.id)
            .map(p => (
              <option key={p.id} value={p.id}>{p.fullName}</option>
            ))}
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          {person ? <Save className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
          {person ? 'Guardar Cambios' : 'Agregar Persona'}
        </button>
      </div>
    </form>
  );
};