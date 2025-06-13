'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ContractModal from '../../components/ContractModal';

interface ContractBid {
  id: string;
  bidAmount: number;
  comment: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface Contract {
  id: string;
  title: string;
  description: string;
  rewardAmount: number;
  requirements?: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  deadline?: string;
  maxParticipants: number;
  createdAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
  };
  _count: {
    bids: number;
  };
}

interface ContractFormData {
  title: string;
  description: string;
  category: string;
  rewardAmount: number;
  requirements?: string;
  deadline?: string;
  maxParticipants: number;
}

const categories = ["Все", "Спорт", "Образование", "Творчество", "Общественная работа", "Техническое обеспечение"];
const statusFilters = ["Все", "Открытые", "В работе", "Завершенные", "Отмененные"];

export default function ContractsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedStatus, setSelectedStatus] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/v1/contracts');
      if (response.ok) {
        const data = await response.json();
        setContracts(data);
      } else {
        console.error('Ошибка загрузки контрактов:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка загрузки контрактов:', error);
    } finally {
      setLoading(false);
    }
  };

  // Статистические данные
  const totalContracts = contracts.length;
  const openContracts = contracts.filter(c => c.status === 'OPEN').length;
  const inProgressContracts = contracts.filter(c => c.status === 'IN_PROGRESS').length;
  const totalBids = contracts.reduce((sum, c) => sum + c._count.bids, 0);

  // Фильтрация контрактов
  const filteredContracts = contracts.filter(contract => {
    const matchesCategory = selectedCategory === "Все" || contract.category === selectedCategory;
    const matchesStatus = selectedStatus === "Все" || 
      (selectedStatus === "Открытые" && contract.status === "OPEN") ||
      (selectedStatus === "В работе" && contract.status === "IN_PROGRESS") ||
      (selectedStatus === "Завершенные" && contract.status === "COMPLETED") ||
      (selectedStatus === "Отмененные" && contract.status === "CANCELLED");
    const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN': return 'Открыт';
      case 'IN_PROGRESS': return 'В работе';
      case 'COMPLETED': return 'Завершен';
      case 'CANCELLED': return 'Отменен';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsViewingDetails(true);
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setContractModalOpen(true);
  };

  const handleDeleteContract = async (contract: Contract) => {
    if (confirm(`Вы уверены, что хотите удалить контракт "${contract.title}"?`)) {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/contracts/${contract.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await loadContracts();
          alert(`Контракт "${contract.title}" удален`);
        } else {
          alert('Ошибка при удалении контракта');
        }
      } catch (error) {
        console.error('Ошибка при удалении:', error);
        alert('Ошибка при удалении контракта');
      }
    }
  };

  const handleAddContract = () => {
    setEditingContract(null);
    setContractModalOpen(true);
  };

  const handleSaveContract = async (contractData: ContractFormData) => {
    try {
      if (editingContract) {
        // Обновление контракта
        const response = await fetch(`http://localhost:3001/api/v1/contracts/${editingContract.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contractData),
        });

        if (response.ok) {
          await loadContracts();
          alert(`Контракт "${contractData.title}" обновлен!`);
        } else {
          alert('Ошибка при обновлении контракта');
        }
      } else {
        // Создание контракта
        const response = await fetch('http://localhost:3001/api/v1/contracts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contractData),
        });

        if (response.ok) {
          await loadContracts();
          alert(`Контракт "${contractData.title}" создан!`);
        } else {
          alert('Ошибка при создании контракта');
        }
      }
    } catch (error) {
      console.error('Ошибка при сохранении контракта:', error);
      alert('Ошибка при сохранении контракта');
    }
  };

  const handleCloseModal = () => {
    setContractModalOpen(false);
    setEditingContract(null);
  };

  const handleViewBids = async (contract: Contract) => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/contracts/${contract.id}/bids`);
      if (response.ok) {
        const bids = await response.json();
        alert(`Заявки для контракта: ${contract.title}\nВсего заявок: ${bids.length}\n\n${bids.map((bid: any) => 
          `${bid.bidAmount} L-Coin от ${bid.user.firstName} ${bid.user.lastName}\nКомментарий: ${bid.comment}\nСтатус: ${bid.status}\n(${new Date(bid.createdAt).toLocaleString('ru-RU')})`
        ).join('\n\n')}`);
      } else {
        alert('Ошибка при загрузке заявок');
      }
    } catch (error) {
      console.error('Ошибка при загрузке заявок:', error);
      alert('Ошибка при загрузке заявок');
    }
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
                  <h1 className="text-2xl font-bold text-white">Госзаказы</h1>
                  <p className="text-white/90 font-medium">Управление заданиями и откликами учеников</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAddContract}
                  className="admin-button-primary text-white px-4 py-2 rounded-md transition-colors"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                >
                  Добавить задание
                </button>
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
                        <span className="text-white font-bold">📋</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего контрактов</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalContracts}</dd>
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
                        <span className="text-white font-bold">🟢</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Открытые контракты</dt>
                        <dd className="text-lg font-medium text-gray-900">{openContracts}</dd>
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
                        <span className="text-white font-bold">✅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Контракты в работе</dt>
                        <dd className="text-lg font-medium text-gray-900">{inProgressContracts}</dd>
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
                        <span className="text-white font-bold">👥</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего откликов</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalBids}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Фильтры и поиск */}
            <div className="admin-card mb-6">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Поиск контрактов
                    </label>
                    <input
                      type="text"
                      className="admin-input w-full"
                      placeholder="Поиск по названию или описанию..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Статус
                    </label>
                    <select
                      className="admin-input w-full"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      {statusFilters.map(status => (
                        <option key={status} value={status}>{status}</option>
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
                </div>
              </div>
            </div>

            {/* Список контрактов */}
            <div className="admin-card">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Список контрактов
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm admin-text-secondary">
                      Управление контрактами от администрации для учеников
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      onClick={handleAddContract}
                      className="admin-button-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
                      style={{ backgroundColor: 'var(--primary-burgundy)' }}
                    >
                      <span className="mr-2">📋</span>
                      Добавить задание
                    </button>
                  </div>
                </div>

                {filteredContracts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--background-gray)' }}>
                      <span className="text-2xl">📋</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Контрактов не найдено</h3>
                    <p className="admin-text-secondary">
                      Попробуйте изменить критерии поиска или создайте новый контракт.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredContracts.map((contract) => (
                      <div
                        key={contract.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        style={{ borderColor: 'var(--divider)' }}
                        onClick={() => handleViewContract(contract)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-medium text-gray-900 flex-1">
                            {contract.title}
                          </h4>
                          <span className="text-xl ml-2">👁️</span>
                        </div>
                        
                        <p className="admin-text-secondary text-sm mb-4 line-clamp-2">
                          {contract.description}
                        </p>

                        <div className="flex items-center justify-between mb-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                            {getStatusText(contract.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm admin-text-secondary mb-3">
                          <div className="flex items-center">
                            <span className="mr-1">💰</span>
                            {contract.rewardAmount} L-Coin
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">👥</span>
                            {contract._count.bids} откликов
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">📅</span>
                            до {contract.deadline ? new Date(contract.deadline).toLocaleDateString('ru-RU') : 'нет'}
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">🏷️</span>
                            {contract.category}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditContract(contract);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Редактировать"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteContract(contract);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Удалить"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Модальное окно деталей контракта */}
      {isViewingDetails && selectedContract && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md admin-card">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{selectedContract.title}</h3>
                <p className="mt-1 text-sm admin-text-secondary">{selectedContract.category}</p>
              </div>
              <button
                onClick={() => setIsViewingDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-2">Описание</h4>
                <p className="text-sm admin-text-secondary">{selectedContract.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium admin-text-secondary">Стоимость:</span>
                  <p className="text-sm text-gray-900">{selectedContract.rewardAmount} L-Coin</p>
                </div>
                <div>
                  <span className="text-sm font-medium admin-text-secondary">Максимальное количество участников:</span>
                  <p className="text-sm text-gray-900">{selectedContract.maxParticipants}</p>
                </div>
                <div>
                  <span className="text-sm font-medium admin-text-secondary">Дедлайн:</span>
                  <p className="text-sm text-gray-900">{selectedContract.deadline ? new Date(selectedContract.deadline).toLocaleDateString('ru-RU') : 'нет'}</p>
                </div>
              </div>

              {selectedContract._count.bids > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Отклики учеников ({selectedContract._count.bids})</h4>
                  <div className="space-y-4">
                    {contracts.map((contract) => (
                      <div key={contract.id} className="border rounded-lg p-4" style={{ borderColor: 'var(--divider)' }}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">{contract.title}</h5>
                            <p className="text-xs admin-text-secondary">{contract.category} • {contract.status}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium" style={{ color: 'var(--primary-burgundy)' }}>{contract.rewardAmount} L-Coin</span>
                            {contract.status === 'OPEN' && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleViewBids(contract)}
                                  className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                                >
                                  Посмотреть отклики
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm admin-text-secondary">{contract.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedContract._count.bids === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--background-gray)' }}>
                    <span className="text-2xl">👥</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Откликов пока нет</h3>
                  <p className="admin-text-secondary">
                    Ученики еще не откликнулись на этот контракт.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления/редактирования контракта */}
      <ContractModal 
        isOpen={contractModalOpen} 
        onClose={handleCloseModal}
        contract={editingContract}
        onSave={handleSaveContract}
      />
    </div>
  );
} 