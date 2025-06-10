'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ContractModal from '../../components/ContractModal';

interface Contract {
  id: number;
  title: string;
  description: string;
  budget: number;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
  deadline: string;
  createdAt: string;
  department: string;
  executor?: string;
  progress: number;
  documentsCount: number;
  participantsCount: number;
}

interface ContractFormData {
  title: string;
  description: string;
  budget: number;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline: string;
  department: string;
  requirements: string;
  documents: string[];
  estimatedDuration: number;
}

// Тестовые данные контрактов
const mockContracts: Contract[] = [
  {
    id: 1,
    title: "Поставка компьютерного оборудования",
    description: "Закупка 50 новых компьютеров для обновления компьютерного класса",
    budget: 2500000,
    category: "Оборудование",
    priority: "high",
    status: "open",
    deadline: "2024-12-31T23:59:59Z",
    createdAt: "2024-11-15T10:00:00Z",
    department: "IT-отдел",
    progress: 0,
    documentsCount: 8,
    participantsCount: 5
  },
  {
    id: 2,
    title: "Ремонт спортивного зала",
    description: "Капитальный ремонт спортивного зала с заменой покрытия и оборудования",
    budget: 1800000,
    category: "Строительство",
    priority: "medium",
    status: "in_progress",
    deadline: "2025-01-20T23:59:59Z",
    createdAt: "2024-10-20T14:30:00Z",
    department: "Хозяйственная часть",
    executor: "ООО \"СтройМастер\"",
    progress: 35,
    documentsCount: 12,
    participantsCount: 3
  },
  {
    id: 3,
    title: "Закупка канцелярских товаров",
    description: "Поставка канцелярских принадлежностей на учебный год",
    budget: 150000,
    category: "Канцтовары",
    priority: "low",
    status: "completed",
    deadline: "2024-08-31T23:59:59Z",
    createdAt: "2024-06-15T09:00:00Z",
    department: "Учебная часть",
    executor: "ИП Петров А.А.",
    progress: 100,
    documentsCount: 6,
    participantsCount: 8
  },
  {
    id: 4,
    title: "Организация питания",
    description: "Заключение договора на организацию питания учащихся",
    budget: 5000000,
    category: "Услуги",
    priority: "urgent",
    status: "open",
    deadline: "2024-12-25T23:59:59Z",
    createdAt: "2024-11-01T12:00:00Z",
    department: "Администрация",
    progress: 0,
    documentsCount: 15,
    participantsCount: 12
  },
  {
    id: 5,
    title: "Модернизация библиотеки",
    description: "Закупка новых книг и мебели для библиотеки",
    budget: 800000,
    category: "Оборудование",
    priority: "medium",
    status: "draft",
    deadline: "2025-03-15T23:59:59Z",
    createdAt: "2024-11-20T16:45:00Z",
    department: "Библиотека",
    progress: 0,
    documentsCount: 3,
    participantsCount: 0
  }
];

const categories = ["Все", "Оборудование", "Строительство", "Канцтовары", "Услуги", "Мебель"];
const statusFilters = ["Все", "Черновик", "Открытые", "В работе", "Завершенные", "Отмененные"];
const priorityFilters = ["Все", "Низкий", "Средний", "Высокий", "Срочно"];
const departments = ["Все", "IT-отдел", "Хозяйственная часть", "Учебная часть", "Администрация", "Библиотека"];

export default function ContractsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedStatus, setSelectedStatus] = useState("Все");
  const [selectedPriority, setSelectedPriority] = useState("Все");
  const [selectedDepartment, setSelectedDepartment] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  // Статистические данные
  const totalContracts = mockContracts.length;
  const openContracts = mockContracts.filter(c => c.status === 'open').length;
  const inProgressContracts = mockContracts.filter(c => c.status === 'in_progress').length;
  const totalBudget = mockContracts.reduce((sum, c) => sum + c.budget, 0);

  // Фильтрация контрактов
  const filteredContracts = mockContracts.filter(contract => {
    const matchesCategory = selectedCategory === "Все" || contract.category === selectedCategory;
    const matchesStatus = selectedStatus === "Все" || 
      (selectedStatus === "Черновик" && contract.status === "draft") ||
      (selectedStatus === "Открытые" && contract.status === "open") ||
      (selectedStatus === "В работе" && contract.status === "in_progress") ||
      (selectedStatus === "Завершенные" && contract.status === "completed") ||
      (selectedStatus === "Отмененные" && contract.status === "cancelled");
    const matchesPriority = selectedPriority === "Все" ||
      (selectedPriority === "Низкий" && contract.priority === "low") ||
      (selectedPriority === "Средний" && contract.priority === "medium") ||
      (selectedPriority === "Высокий" && contract.priority === "high") ||
      (selectedPriority === "Срочно" && contract.priority === "urgent");
    const matchesDepartment = selectedDepartment === "Все" || contract.department === selectedDepartment;
    const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesPriority && matchesDepartment && matchesSearch;
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Черновик';
      case 'open': return 'Открыт';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Завершен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'Низкий';
      case 'medium': return 'Средний';
      case 'high': return 'Высокий';
      case 'urgent': return 'Срочно';
      default: return priority;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-600';
      case 'medium': return 'bg-blue-100 text-blue-600';
      case 'high': return 'bg-orange-100 text-orange-600';
      case 'urgent': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setContractModalOpen(true);
  };

  const handleDeleteContract = (contract: Contract) => {
    if (confirm(`Вы уверены, что хотите удалить контракт "${contract.title}"?`)) {
      // TODO: API-запрос на удаление
      console.log('Удаление контракта:', contract);
      alert(`Контракт "${contract.title}" удален`);
    }
  };

  const handleViewContract = (contract: Contract) => {
    // TODO: Открыть подробную информацию о контракте
    console.log('Просмотр контракта:', contract);
    alert(`Просмотр контракта: ${contract.title}\nБюджет: ${formatBudget(contract.budget)}\nСтатус: ${getStatusText(contract.status)}`);
  };

  const handleAddContract = () => {
    setEditingContract(null);
    setContractModalOpen(true);
  };

  const handleSaveContract = (contractData: ContractFormData) => {
    if (editingContract) {
      // TODO: API-запрос на обновление контракта
      console.log('Обновление контракта:', { ...editingContract, ...contractData });
      alert(`Контракт "${contractData.title}" обновлен!`);
    } else {
      // TODO: API-запрос на создание контракта
      console.log('Создание контракта:', contractData);
      alert(`Контракт "${contractData.title}" создан!`);
    }
  };

  const handleCloseModal = () => {
    setContractModalOpen(false);
    setEditingContract(null);
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
                  <p className="text-white/90 font-medium">Управление контрактами и тендерами</p>
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
                  Создать заказ
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
                        <span className="text-white font-bold">🏛️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего заказов</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalContracts}</dd>
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
                           style={{ backgroundColor: '#3B82F6' }}>
                        <span className="text-white font-bold">📋</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Открытых</dt>
                        <dd className="text-lg font-medium text-gray-900">{openContracts}</dd>
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
                           style={{ backgroundColor: '#F59E0B' }}>
                        <span className="text-white font-bold">⚡</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">В работе</dt>
                        <dd className="text-lg font-medium text-gray-900">{inProgressContracts}</dd>
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
                        <span className="text-white font-bold">💰</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Общий бюджет</dt>
                        <dd className="text-lg font-medium text-gray-900">{formatBudget(totalBudget)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Фильтры и поиск */}
            <div className="admin-card">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Государственные заказы
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm admin-text-secondary">
                      Управление контрактами и тендерами лицея
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      type="button"
                      onClick={handleAddContract}
                      className="admin-button-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
                      style={{ backgroundColor: 'var(--primary-burgundy)' }}
                    >
                      <span className="mr-2">📋</span>
                      Создать заказ
                    </button>
                  </div>
                </div>

                {/* Поиск и фильтры */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                      Поиск заказов
                    </label>
                    <input
                      type="text"
                      id="search"
                      className="admin-input w-full"
                      placeholder="Введите название..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Категория
                    </label>
                    <select
                      id="category"
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
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Статус
                    </label>
                    <select
                      id="status"
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
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Приоритет
                    </label>
                    <select
                      id="priority"
                      className="admin-input w-full"
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                    >
                      {priorityFilters.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                      Отдел
                    </label>
                    <select
                      id="department"
                      className="admin-input w-full"
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Таблица контрактов */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Заказ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Бюджет
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Статус
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Приоритет
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Прогресс
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Дедлайн
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredContracts.map((contract) => (
                        <tr key={contract.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {contract.title}
                                </div>
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                  {contract.description}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {contract.department} • 📄 {contract.documentsCount} • 👥 {contract.participantsCount}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatBudget(contract.budget)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {contract.category}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                              {getStatusText(contract.status)}
                            </span>
                            {contract.executor && (
                              <div className="text-xs text-gray-500 mt-1">
                                {contract.executor}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(contract.priority)}`}>
                              {getPriorityText(contract.priority)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-burgundy h-2 rounded-full" 
                                style={{ 
                                  width: `${contract.progress}%`,
                                  backgroundColor: 'var(--primary-burgundy)'
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {contract.progress}%
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(contract.deadline)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewContract(contract)}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                title="Просмотр"
                              >
                                👁️
                              </button>
                              <button
                                onClick={() => handleEditContract(contract)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                title="Редактировать"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteContract(contract)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Удалить"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Результаты поиска */}
                {filteredContracts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Заказы не найдены
                    </h3>
                    <p className="text-sm admin-text-secondary">
                      Попробуйте изменить критерии поиска или создать новый заказ
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Модальное окно контракта */}
      <ContractModal 
        isOpen={contractModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveContract}
        editContract={editingContract}
      />
    </div>
  );
} 