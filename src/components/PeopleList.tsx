import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Person } from '../types';
import { PersonForm } from './PersonForm';
import { Pencil, Trash2, Users } from 'lucide-react';

export const PeopleList: React.FC = () => {
  const { people, deletePerson } = useApp();
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const handleDelete = async (id: string) => {
    const success = await deletePerson(id);
    if (!success) {
      // Password verification failed, do nothing
      return;
    }
  };

  if (people.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay personas</h3>
          <p className="mt-1 text-sm text-gray-500">Comienza agregando una nueva persona.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {editingPerson && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Editar Persona</h2>
            <PersonForm
              person={editingPerson}
              onClose={() => setEditingPerson(null)}
            />
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <div className="block md:hidden">
          {people.map(person => (
            <div key={person.id} className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{person.fullName}</h3>
                  <p className="text-sm text-gray-500">{person.bankName}</p>
                  <p className="text-sm text-gray-500">{person.accountNumber}</p>
                  <p className="text-sm text-gray-500">
                    Asociacion: {person.partnerId ? people.find(p => p.id === person.partnerId)?.fullName : '-'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingPerson(person)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Editar persona"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(person.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Eliminar persona"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <table className="hidden md:table min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre Completo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Banco
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número de Cuenta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asociacion
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {people.map(person => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {person.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {person.bankName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {person.accountNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {person.partnerId ? people.find(p => p.id === person.partnerId)?.fullName : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingPerson(person)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    title="Editar persona"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(person.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Eliminar persona"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};