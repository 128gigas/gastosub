import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { PersonForm } from './components/PersonForm';
import { PeopleList } from './components/PeopleList';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { SettlementSummary } from './components/SettlementSummary';
import { ShareSummary } from './components/ShareSummary';
import { Users, Receipt, Calculator, Share2, Menu } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'people' | 'expenses' | 'settlements' | 'share'>('people');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: 'people', label: 'Personas', icon: Users },
    { id: 'expenses', label: 'Gastos', icon: Receipt },
    { id: 'settlements', label: 'Liquidación', icon: Calculator },
    { id: 'share', label: 'Compartir', icon: Share2 },
  ] as const;

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Calculator className="w-8 h-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">Divisor de Gastos</span>
                </div>
                {/* Desktop Navigation */}
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        activeTab === id
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab(id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-2 text-base font-medium ${
                      activeTab === id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'people' && (
            <div className="space-y-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Agregar Nueva Persona</h2>
                <PersonForm />
              </div>
              <PeopleList />
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <ExpenseForm />
              <ExpenseList />
            </div>
          )}

          {activeTab === 'settlements' && (
            <div className="space-y-6">
              <SettlementSummary />
            </div>
          )}

          {activeTab === 'share' && (
            <div className="space-y-6">
              <ShareSummary />
            </div>
          )}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;