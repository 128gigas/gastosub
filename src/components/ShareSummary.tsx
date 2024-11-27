import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Copy, Download, Check } from 'lucide-react';
import { jsPDF } from 'jspdf';

export const ShareSummary: React.FC = () => {
  const { expenses, settlements, people } = useApp();
  const [copied, setCopied] = useState(false);

  const getPersonName = (id: string) => {
    return people.find(p => p.id === id)?.fullName || 'Desconocido';
  };

  const getPersonDetails = (id: string) => {
    const person = people.find(p => p.id === id);
    if (!person) return '';
    return `${person.bankName} - ${person.accountNumber}`;
  };

  const generateTextSummary = () => {
    let summary = '💰 *Resumen de Gastos* 💰\n\n';

    summary += '*Desglose de Gastos:*\n';
    expenses.forEach((expense, index) => {
      const splitAmount = expense.amount / expense.splitBetween.length;
      summary += `\n${index + 1}. ${expense.description}\n`;
      summary += `   Monto: $${expense.amount.toFixed(2)}\n`;
      summary += `   Pagado por: ${getPersonName(expense.paidById)}\n`;
      summary += `   Dividido entre: ${expense.splitBetween.map(id => getPersonName(id)).join(', ')}\n`;
      summary += `   Cada persona paga: $${splitAmount.toFixed(2)}\n`;
    });

    summary += '\n*Pagos Requeridos:*\n';
    settlements.forEach((settlement, index) => {
      summary += `\n${index + 1}. ${getPersonName(settlement.from)} → ${getPersonName(settlement.to)}\n`;
      summary += `   Monto: $${settlement.amount.toFixed(2)}\n`;
      summary += `   Datos de pago: ${getPersonDetails(settlement.to)}\n`;
    });

    return summary;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const lineHeight = 8;
    let y = 20;

    doc.setFontSize(20);
    doc.text('Resumen de Gastos', 105, y, { align: 'center' });
    y += lineHeight * 2;

    doc.setFontSize(16);
    doc.text('Desglose de Gastos:', 20, y);
    y += lineHeight * 1.5;

    doc.setFontSize(12);
    expenses.forEach((expense) => {
      const splitAmount = expense.amount / expense.splitBetween.length;
      
      doc.text(`${expense.description}`, 20, y);
      y += lineHeight;
      doc.text(`Monto: $${expense.amount .toFixed(2)}`, 30, y);
      y += lineHeight;
      doc.text(`Pagado por: ${getPersonName(expense.paidById)}`, 30, y);
      y += lineHeight;
      doc.text(`Dividido entre: ${expense.splitBetween.map(id => getPersonName(id)).join(', ')}`, 30, y);
      y += lineHeight;
      doc.text(`Cada persona paga: $${splitAmount.toFixed(2)}`, 30, y);
      y += lineHeight * 1.5;

      if (y > 250) {
        doc.addPage();
        y = 20;
      }
    });

    doc.setFontSize(16);
    doc.text('Pagos Requeridos:', 20, y);
    y += lineHeight * 1.5;

    doc.setFontSize(12);
    settlements.forEach((settlement) => {
      doc.text(`${getPersonName(settlement.from)} → ${getPersonName(settlement.to)}`, 20, y);
      y += lineHeight;
      doc.text(`Monto: $${settlement.amount.toFixed(2)}`, 30, y);
      y += lineHeight;
      doc.text(`Datos de pago: ${getPersonDetails(settlement.to)}`, 30, y);
      y += lineHeight * 1.5;

      if (y > 250) {
        doc.addPage();
        y = 20;
      }
    });

    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generado el ${today}`, 105, 280, { align: 'center' });

    doc.save('resumen-gastos.pdf');
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateTextSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar texto:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Formato de Texto para WhatsApp */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Resumen para WhatsApp</h2>
          <button
            onClick={handleCopyText}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                ¡Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Texto
              </>
            )}
          </button>
        </div>
        <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm font-mono">
          {generateTextSummary()}
        </pre>
      </div>

      {/* Descarga PDF */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Recibo PDF</h2>
          <button
            onClick={generatePDF}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
};