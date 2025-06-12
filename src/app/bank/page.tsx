'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

interface Transaction {
  id: string;
  studentName: string;
  studentClass: string;
  studentLinn: string;
  operation: 'credit' | 'debit';
  amount: number;
  balance: number;
  description: string;
  category: string;
  accountType: 'account' | 'credit';
  createdAt: string;
  adminName: string;
}

// Тестовые данные транзакций
const mockTransactions: Transaction[] = [
  {
    id: '1',
    studentName: 'Иванов Петр Алексеевич',
    studentClass: '10А',
    studentLinn: 'IV001234',
    operation: 'credit',
    amount: 50,
    balance: 175,
    description: 'Начисление за выполнение задания "Организация утренней зарядки"',
    category: 'Госзаказы',
    accountType: 'account',
    createdAt: '2024-01-20 14:30',
    adminName: 'Смирнова Е.В.'
  },
  {
    id: '2',
    studentName: 'Сидорова Анна Викторовна',
    studentClass: '11Б',
    studentLinn: 'IV001235',
    operation: 'debit',
    amount: 25,
    balance: 73,
    description: 'Покупка в L-shop: Стикеры для планера',
    category: 'L-shop',
    accountType: 'account',
    createdAt: '2024-01-20 12:15',
    adminName: 'Автоматически'
  },
  {
    id: '3',
    studentName: 'Петров Максим Сергеевич',
    studentClass: '9В',
    studentLinn: 'IV001236',
    operation: 'credit',
    amount: 100,
    balance: 187,
    description: 'Выигрыш на аукционе: Бонусные баллы за творческий проект',
    category: 'Аукцион',
    accountType: 'account',
    createdAt: '2024-01-19 16:45',
    adminName: 'Петрова М.А.'
  },
  {
    id: '4',
    studentName: 'Козлова Мария Александровна',
    studentClass: '8А',
    studentLinn: 'IV001237',
    operation: 'debit',
    amount: 30,
    balance: 126,
    description: 'Штраф за нарушение дисциплины в столовой',
    category: 'Штрафы',
    accountType: 'account',
    createdAt: '2024-01-19 10:20',
    adminName: 'Иванов С.П.'
  },
  {
    id: '5',
    studentName: 'Смирнов Алексей Дмитриевич',
    studentClass: '11А',
    studentLinn: 'IV001238',
    operation: 'credit',
    amount: 200,
    balance: 403,
    description: 'Стипендия за отличную учебу',
    category: 'Стипендии',
    accountType: 'account',
    createdAt: '2024-01-18 09:00',
    adminName: 'Директор'
  },
  {
    id: '6',
    studentName: 'Иванов Петр Алексеевич',
    studentClass: '10А',
    studentLinn: 'IV001234',
    operation: 'credit',
    amount: 50,
    balance: 50,
    description: 'Кредит на покупку учебных материалов',
    category: 'Кредиты',
    accountType: 'credit',
    createdAt: '2024-01-17 14:00',
    adminName: 'Финансовый отдел'
  },
  {
    id: '7',
    studentName: 'Козлова Мария Александровна',
    studentClass: '8А',
    studentLinn: 'IV001237',
    operation: 'debit',
    amount: 15,
    balance: 35,
    description: 'Погашение кредита за учебные материалы',
    category: 'Кредиты',
    accountType: 'credit',
    createdAt: '2024-01-16 11:30',
    adminName: 'Автоматически'
  }
];

export default function BankPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOperation, setSelectedOperation] = useState("Все");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedAccountType, setSelectedAccountType] = useState("Все");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Статистика
  const totalTransactions = mockTransactions.length;
  const totalCredits = mockTransactions.filter(t => t.operation === 'credit').length;
  const totalDebits = mockTransactions.filter(t => t.operation === 'debit').length;
  const totalVolume = mockTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Фильтры
  const operations = ["Все", "Поступления", "Списания"];
  const categories = ["Все", ...Array.from(new Set(mockTransactions.map(t => t.category))).sort()];
  const accountTypes = ["Все", "Расчетный счет", "Кредитный счет"];

  // Фильтрация транзакций
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.studentLinn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOperation = selectedOperation === "Все" || 
      (selectedOperation === "Поступления" && transaction.operation === "credit") ||
      (selectedOperation === "Списания" && transaction.operation === "debit");
    const matchesCategory = selectedCategory === "Все" || transaction.category === selectedCategory;
    const matchesAccountType = selectedAccountType === "Все" ||
      (selectedAccountType === "Расчетный счет" && transaction.accountType === "account") ||
      (selectedAccountType === "Кредитный счет" && transaction.accountType === "credit");
    
    let matchesDate = true;
    if (dateFrom) {
      matchesDate = matchesDate && new Date(transaction.createdAt) >= new Date(dateFrom);
    }
    if (dateTo) {
      matchesDate = matchesDate && new Date(transaction.createdAt) <= new Date(dateTo + " 23:59:59");
    }
    
    return matchesSearch && matchesOperation && matchesCategory && matchesAccountType && matchesDate;
  });

  const getOperationText = (operation: string) => {
    return operation === 'credit' ? 'Поступление' : 'Списание';
  };

  const getOperationColor = (operation: string) => {
    return operation === 'credit' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getAccountTypeText = (accountType: string) => {
    return accountType === 'account' ? 'Расчетный' : 'Кредитный';
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('ru-RU');
  };

  return (
    <div className="min-h-screen admin-container flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Основной контент */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="admin-card shadow" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                {/* Кнопка меню для мобильных устройств */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-white hover:bg-white/20 mr-4"
                >
                  <span className="text-xl">☰</span>
                </button>
                
                <div>
                  <h1 className="text-2xl font-bold text-white">Лицейский банк</h1>
                  <p className="text-white/90 font-medium">Мониторинг транзакций и финансовых операций</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="admin-card">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">📊</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего операций</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalTransactions}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">📈</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Поступления</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalCredits}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">📉</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Списания</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalDebits}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">💰</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Общий оборот</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalVolume} L-Coin</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Фильтры и поиск */}
            <div className="admin-card mb-6">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Поиск транзакций
                    </label>
                    <input
                      type="text"
                      className="admin-input w-full"
                      placeholder="Поиск по ученику, LINN или описанию..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Тип операции
                    </label>
                    <select
                      className="admin-input w-full"
                      value={selectedOperation}
                      onChange={(e) => setSelectedOperation(e.target.value)}
                    >
                      {operations.map(operation => (
                        <option key={operation} value={operation}>{operation}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Категория
                    </label>
                    <select
                      className="admin-input w-full"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Тип счета
                    </label>
                    <select
                      className="admin-input w-full"
                      value={selectedAccountType}
                      onChange={(e) => setSelectedAccountType(e.target.value)}
                    >
                      {accountTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Период
                    </label>
                    <div className="space-y-2">
                      <input
                        type="date"
                        className="admin-input w-full text-sm"
                        placeholder="От"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                      <input
                        type="date"
                        className="admin-input w-full text-sm"
                        placeholder="До"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Таблица транзакций */}
            <div className="admin-card">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      История транзакций
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm admin-text-secondary">
                      Найдено: {filteredTransactions.length} из {totalTransactions} операций
                    </p>
                  </div>
                </div>

                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--background-gray)' }}>
                      <span className="text-2xl">🏦</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Транзакций не найдено</h3>
                    <p className="admin-text-secondary">
                      Попробуйте изменить критерии поиска или период.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Дата/Время
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ученик
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Операция
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Сумма
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Баланс после
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Описание
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Администратор
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTransactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDateTime(transaction.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: 'var(--background-gray)' }}>
                                    👤
                                  </div>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{transaction.studentName}</div>
                                  <div className="text-sm admin-text-secondary">{transaction.studentClass} • {transaction.studentLinn}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col space-y-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOperationColor(transaction.operation)}`}>
                                  {getOperationText(transaction.operation)}
                                </span>
                                <span className="text-xs admin-text-secondary">
                                  {getAccountTypeText(transaction.accountType)} • {transaction.category}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`text-sm font-medium ${transaction.operation === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.operation === 'credit' ? '+' : '-'}{transaction.amount} L-Coin
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.balance} L-Coin
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs">
                                {transaction.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm admin-text-secondary">
                              {transaction.adminName}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 