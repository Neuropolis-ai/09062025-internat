'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAdmin } from '../../contexts/AdminContext';

interface Transaction {
  id: string;
  amount: string;
  transactionType: 'CREDIT' | 'DEBIT' | 'TRANSFER' | 'PURCHASE' | 'REWARD';
  description: string;
  referenceId?: string;
  referenceType?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  processedAt?: string;
  createdAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  fromAccount?: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      middleName?: string;
    };
    balance: string;
  };
  toAccount?: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      middleName?: string;
    };
    balance: string;
  };
}

interface BankStats {
  totalTokens: number;
  totalUsers: number;
  todayTransactions: number;
  weeklyIncome: number;
  weeklyExpense: number;
}

interface TransactionFormData {
  userId: string;
  type: 'CREDIT' | 'DEBIT' | 'REWARD';
  amount: number;
  description: string;
  category?: string;
}

export default function BankPage() {
  const { loading, error } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<BankStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    userId: '',
    type: 'CREDIT',
    amount: 0,
    description: '',
    category: 'manual'
  });

  useEffect(() => {
    loadData();
  }, [selectedType, selectedUser]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      
      // Загружаем статистику
      const statsResponse = await fetch('http://localhost:3001/api/v1/transactions/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Загружаем пользователей
      const usersResponse = await fetch('http://localhost:3001/api/v1/users');
      const usersData = await usersResponse.json();
      setUsers(usersData.filter((user: any) => user.role === 'STUDENT'));

      // Загружаем транзакции с фильтрами
      let url = 'http://localhost:3001/api/v1/transactions?limit=100';
      if (selectedType !== 'all') {
        url += `&type=${selectedType}`;
      }
      if (selectedUser !== 'all') {
        url += `&userId=${selectedUser}`;
      }

      const transactionsResponse = await fetch(url);
      const transactionsData = await transactionsResponse.json();
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/api/v1/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({
          userId: '',
          type: 'CREDIT',
          amount: 0,
          description: '',
          category: 'manual'
        });
        loadData(); // Перезагружаем данные
      } else {
        const errorData = await response.json();
        alert('Ошибка: ' + errorData.message);
      }
    } catch (error) {
      console.error('Ошибка создания транзакции:', error);
      alert('Ошибка создания транзакции');
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'CREDIT': 'Пополнение',
      'DEBIT': 'Списание',
      'TRANSFER': 'Перевод',
      'PURCHASE': 'Покупка',
      'REWARD': 'Награда'
    };
    return types[type] || type;
  };

  const getTransactionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'CREDIT': 'text-green-600 bg-green-100',
      'DEBIT': 'text-red-600 bg-red-100',
      'TRANSFER': 'text-blue-600 bg-blue-100',
      'PURCHASE': 'text-purple-600 bg-purple-100',
      'REWARD': 'text-yellow-600 bg-yellow-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'COMPLETED': 'text-green-600 bg-green-100',
      'PENDING': 'text-yellow-600 bg-yellow-100',
      'FAILED': 'text-red-600 bg-red-100',
      'CANCELLED': 'text-gray-600 bg-gray-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const formatUserName = (user: any) => {
    if (!user) return 'Неизвестно';
    return `${user.lastName} ${user.firstName}${user.middleName ? ` ${user.middleName}` : ''}`;
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка данных банка...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Ошибка: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-600 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Открыть меню</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="ml-4 lg:ml-0 text-2xl font-bold text-gray-900">🏦 L-Bank</h1>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + Создать транзакцию
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        {stats && (
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">₽</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Всего токенов</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalTokens.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Пользователей</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 font-bold">📊</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Транзакций сегодня</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.todayTransactions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">↗</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Доходы за неделю</p>
                    <p className="text-2xl font-bold text-green-600">+{stats.weeklyIncome.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold">↘</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Расходы за неделю</p>
                    <p className="text-2xl font-bold text-red-600">{stats.weeklyExpense.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип транзакции</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Все типы</option>
                  <option value="CREDIT">Пополнение</option>
                  <option value="DEBIT">Списание</option>
                  <option value="TRANSFER">Перевод</option>
                  <option value="PURCHASE">Покупка</option>
                  <option value="REWARD">Награда</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Пользователь</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Все пользователи</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {formatUserName(user)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={loadData}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  🔄 Обновить
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                История транзакций ({transactions.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Тип
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Сумма
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Описание
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Участники
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.createdAt).toLocaleString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTransactionTypeColor(transaction.transactionType)}`}>
                          {getTransactionTypeLabel(transaction.transactionType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={transaction.transactionType === 'CREDIT' || transaction.transactionType === 'REWARD' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.transactionType === 'CREDIT' || transaction.transactionType === 'REWARD' ? '+' : ''}
                          {Number(transaction.amount).toLocaleString()} L-Coin
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="space-y-1">
                          {transaction.fromAccount && (
                            <div className="text-red-600">
                              От: {formatUserName(transaction.fromAccount.user)}
                            </div>
                          )}
                          {transaction.toAccount && (
                            <div className="text-green-600">
                              К: {formatUserName(transaction.toAccount.user)}
                            </div>
                          )}
                          {!transaction.fromAccount && !transaction.toAccount && (
                            <div className="text-gray-500">
                              Создал: {formatUserName(transaction.creator)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status === 'COMPLETED' ? 'Завершена' : 
                           transaction.status === 'PENDING' ? 'В обработке' :
                           transaction.status === 'FAILED' ? 'Ошибка' : 'Отменена'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {transactions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Транзакции не найдены</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Transaction Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Создать транзакцию</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Закрыть</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Пользователь
                </label>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Выберите пользователя</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {formatUserName(user)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип транзакции
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CREDIT">Пополнение</option>
                  <option value="DEBIT">Списание</option>
                  <option value="REWARD">Награда</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сумма (L-Coin)
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 