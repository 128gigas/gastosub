export interface Person {
  id: string;
  fullName: string;
  bankName: string;
  accountNumber: string;
  partnerId?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidById: string;
  splitBetween: string[];
  date: string;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}