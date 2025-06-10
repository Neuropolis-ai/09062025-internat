'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TransactionModal from '../../components/TransactionModal';

interface Transaction {
  id: number;
  studentName: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  balance: number;
}

interface TransactionFormData {
  studentName: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  category: string;
}

// Тестовые данные транзакций
const mockTransactions: Transaction[] = [
  {
    id: 1,
    studentName: "Иванов Алексей Петрович",
    type: 'credit',
    amount: 500,
    description: "Поощрение за отличную учебу",
    date: "2024-12-09",
    balance: 1250
  },
  {
    id: 2,
    studentName: "Петрова Мария Сергеевна",
    type: 'debit',
    amount: 200,
    description: "Покупка в L-shop",
    date: "2024-12-08",
    balance: 980
  },
  {
    id: 3,
    studentName: "Сидоров Дмитрий Александрович",
    type: 'credit',
    amount: 750,
    description: "Победа в олимпиаде",
    date: "2024-12-07",
    balance: 1750
  },
  {
    id: 4,
    studentName: "Козлова Екатерина Михайловна",
    type: 'debit',
    amount: 150,
    description: "Оплата мероприятия",
    date: "2024-12-06",
    balance: 1100
  },
  {
    id: 5,
    studentName: "Морозов Артем Владимирович",
    type: 'credit',
    amount: 300,
    description: "Участие в конкурсе",
    date: "2024-12-05",
    balance: 890
  }
];

export default function BankPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  // Статистические данные
  const totalTokens = 125450;
  const todayTransactions = 8;
  const weeklyIncome = 3250;
  const weeklyExpense = 1890;

  const handleNewTransaction = (transactionData: TransactionFormData) => {
    // TODO: Здесь будет API-запрос на создание транзакции
    console.log('Новая транзакция:', transactionData);
    alert(`Транзакция создана!\n${transactionData.type === 'credit' ? 'Поступление' : 'Списание'} ${transactionData.amount} токенов для ${transactionData.studentName}`);
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
                  <p className="text-white/90 font-medium">Управление токенами и транзакциями</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setTransactionModalOpen(true)}
                  className="admin-button-primary text-white px-4 py-2 rounded-md transition-colors"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                >
                  Новая транзакция
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Статистические карточки */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="admin-card">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" 
                           style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">💰</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего токенов</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalTokens.toLocaleString()}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center"
                           style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">📊</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Транзакций сегодня</dt>
                        <dd className="text-lg font-medium text-gray-900">{todayTransactions}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center"
                           style={{ backgroundColor: '#10B981' }}>
                        <span className="text-white font-bold">↗️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Доходы за неделю</dt>
                        <dd className="text-lg font-medium text-gray-900">+{weeklyIncome.toLocaleString()}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center"
                           style={{ backgroundColor: '#EF4444' }}>
                        <span className="text-white font-bold">↘️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Расходы за неделю</dt>
                        <dd className="text-lg font-medium text-gray-900">-{weeklyExpense.toLocaleString()}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Фильтры и управление */}
            <div className="admin-card">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      История транзакций
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm admin-text-secondary">
                      Все операции с токенами в лицейском банке
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="admin-input text-sm"
                    >
                      <option value="day">За день</option>
                      <option value="week">За неделю</option>
                      <option value="month">За месяц</option>
                      <option value="all">Все время</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setTransactionModalOpen(true)}
                      className="admin-button-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
                      style={{ backgroundColor: 'var(--primary-burgundy)' }}
                    >
                      <span className="mr-2">💰</span>
                      Новая транзакция
                    </button>
                  </div>
                </div>
                
                {/* Таблица транзакций */}
                <div className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y admin-border" style={{ borderColor: 'var(--divider)' }}>
                      <thead style={{ backgroundColor: 'var(--background-light)' }}>
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                            Дата
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                            Ученик
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                            Операция
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                            Сумма
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                            Описание
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                            Баланс
                          </th>
                        </tr>
                      </thead>
                      <tbody className="admin-card divide-y" style={{ borderColor: 'var(--divider)' }}>
                        {mockTransactions.map((transaction, index) => (
                          <tr 
                            key={transaction.id}
                            className={`hover:bg-gray-50 transition-colors ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm admin-text-secondary">
                              {new Date(transaction.date).toLocaleDateString('ru-RU')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                  <div 
                                    className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                    style={{ backgroundColor: 'var(--primary-burgundy)' }}
                                  >
                                    {transaction.studentName.split(' ')[0][0]}{transaction.studentName.split(' ')[1][0]}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {transaction.studentName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                transaction.type === 'credit' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.type === 'credit' ? '💰 Поступление' : '💸 Списание'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-medium ${
                                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {transaction.balance.toLocaleString()} токенов
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Пагинация */}
                  <div className="admin-border px-6 py-3 flex items-center justify-between" 
                       style={{ borderTopColor: 'var(--divider)', borderTopWidth: '1px' }}>
                    <div className="text-sm admin-text-secondary">
                      Показано {mockTransactions.length} из {mockTransactions.length} транзакций
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-sm admin-text-secondary hover:text-gray-900 transition-colors">
                        Предыдущая
                      </button>
                      <span className="px-3 py-1 text-sm bg-gray-100 rounded">1</span>
                      <button className="px-3 py-1 text-sm admin-text-secondary hover:text-gray-900 transition-colors">
                        Следующая
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Модальное окно создания транзакции */}
      <TransactionModal 
        isOpen={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        onSave={handleNewTransaction}
      />
    </div>
  );
} 