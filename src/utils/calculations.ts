import { Person, Expense, Settlement } from '../types';

export const calculateSettlements = (expenses: Expense[], people: Person[]): Settlement[] => {
  // Track net balances for each person (positive means they are owed money)
  const balances = new Map<string, number>();
  people.forEach(person => balances.set(person.id, 0));

  // Calculate net balance for each person across all expenses
  expenses.forEach(expense => {
    const payer = expense.paidById;
    const splitAmount = expense.amount / expense.splitBetween.length;
    
    // Add the full amount to payer's balance
    balances.set(payer, (balances.get(payer) || 0) + expense.amount);
    
    // Subtract each person's share from their balance
    expense.splitBetween.forEach(personId => {
      balances.set(personId, (balances.get(personId) || 0) - splitAmount);
    });
  });

  // Convert balances to array of {id, balance} for easier processing
  const balanceArray = Array.from(balances.entries())
    .map(([id, balance]) => ({ id, balance: Number(balance.toFixed(2)) }))
    .filter(({ balance }) => Math.abs(balance) >= 0.01); // Filter out zero balances

  // Sort by balance (descending for positive, ascending for negative)
  const debtors = balanceArray
    .filter(({ balance }) => balance < 0)
    .sort((a, b) => a.balance - b.balance);
  const creditors = balanceArray
    .filter(({ balance }) => balance > 0)
    .sort((a, b) => b.balance - a.balance);

  const settlements: Settlement[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  // Helper to find partner ID
  const getPartnerId = (personId: string) => 
    people.find(p => p.id === personId)?.partnerId;

  // Create settlements prioritizing partner payments
  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    
    // Find the amount that can be settled
    const amount = Math.min(Math.abs(debtor.balance), creditor.balance);
    
    if (amount >= 0.01) {
      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: Number(amount.toFixed(2))
      });
    }

    // Update balances
    debtor.balance += amount;
    creditor.balance -= amount;

    // Move to next person if their balance is settled
    if (Math.abs(debtor.balance) < 0.01) debtorIndex++;
    if (Math.abs(creditor.balance) < 0.01) creditorIndex++;
  }

  // Sort settlements to prioritize partner payments
  return settlements.sort((a, b) => {
    const aToPartner = getPartnerId(a.from) === a.to;
    const bToPartner = getPartnerId(b.from) === b.to;
    if (aToPartner && !bToPartner) return -1;
    if (!aToPartner && bToPartner) return 1;
    return b.amount - a.amount;
  });
};