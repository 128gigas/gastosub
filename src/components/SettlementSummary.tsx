import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Receipt, DollarSign } from 'lucide-react';

export const SettlementSummary: React.FC = () => {
  const { settlements, people, expenses } = useApp();

  const getPersonName = (id: string) => {
    return people.find(p => p.id === id)?.fullName || 'Desconocido';
  };

  const getPersonDetails = (id: string) => {
    const person = people.find(p => p.id === id);
    if (!person) return null;
    return `${person.bankName} - ${person.accountNumber}`;
  };

  const expenseBreakdowns = expenses.map(expense => {
    const splitAmount = expense.amount / expense.splitBetween.length;
    const payer = getPersonName(expense.paidById);
    const debtors = expense.splitBetween
      .filter(id => id !== expense.paidById)
      .map(id => ({
        name: getPersonName(id),
        amount: splitAmount
      }));

    return {
      description: expense.description,
      amount: expense.amount,
      payer,
      debtors,
      date: new Date(expense.date).toLocaleDateString(),
      splitAmount
    };
  });

  return (
    <div className="space-y-6">
      {/* Desglose Detallado de Gastos */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Receipt className="w-5 h-5 mr-2" />
          Desglose Detallado de Gastos
        </h2>
        {expenseBreakdowns.length === 0 ? (
          <p className="text-gray-500">No hay gastos registrados</p>
        ) : (
          <div className="space-y-4">
            {expenseBreakdowns.map((breakdown, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{breakdown.description}</h3>
                    <p className="text-sm text-gray-500">Fecha: {breakdown.date}</p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${breakdown.amount.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Pagado por: {breakdown.payer}</p>
                {breakdown.debtors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Deben pagar:</p>
                    <ul className="ml-4 text-sm text-gray-600">
                      {breakdown.debtors.map((debtor, i) => (
                        <li key={i}>
                          {debtor.name}: ${debtor.amount.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Liquidaciones Finales */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Liquidaciones Finales
        </h2>
        {settlements.length === 0 ? (
          <p className="text-gray-500">No hay liquidaciones pendientes</p>
        ) : (
          <div className="space-y-4">
            {settlements.map((settlement, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{getPersonName(settlement.from)}</p>
                  <p className="text-sm text-gray-500">{getPersonDetails(settlement.from)}</p>
                </div>
                
                <div className="flex items-center px-4">
                  <span className="text-lg font-semibold text-gray-900">
                    ${settlement.amount.toFixed(2)}
                  </span>
                  <ArrowRight className="w-5 h-5 mx-2 text-gray-400" />
                </div>
                
                <div className="flex-1 text-right">
                  <p className="font-medium text-gray-900">{getPersonName(settlement.to)}</p>
                  <p className="text-sm text-gray-500">{getPersonDetails(settlement.to)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};