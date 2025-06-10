'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ContractModal from '../../components/ContractModal';

interface TaskBid {
  id: string;
  studentName: string;
  studentClass: string;
  bidAmount: number;
  comment: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  minBid: number;
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  createdAt: string;
  deadline: string;
  assignedTo?: string;
  department: string;
  priority: 'low' | 'medium' | 'high';
  bids: TaskBid[];
}

interface TaskFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  minBid: number;
  deadline: string;
  department: string;
  priority: 'low' | 'medium' | 'high';
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Организация утренней зарядки',
    description: 'Проведение утренней зарядки для младших классов. Необходимо подготовить комплекс упражнений и провести занятие в течение недели.',
    category: 'Спорт',
    price: 15,
    minBid: 10,
    status: 'open',
    createdAt: '2024-01-10',
    deadline: '2024-01-20',
    department: 'Физкультурный отдел',
    priority: 'medium',
    bids: [
      {
        id: '1',
        studentName: 'Иванов Петр',
        studentClass: '10А',
        bidAmount: 12,
        comment: 'Имею опыт проведения зарядки в летнем лагере. Готов разработать интересную программу упражнений.',
        submittedAt: '2024-01-11 10:30',
        status: 'pending'
      },
      {
        id: '2',
        studentName: 'Сидорова Анна',
        studentClass: '11Б',
        bidAmount: 15,
        comment: 'Занимаюсь спортом 5 лет, имею сертификат инструктора по фитнесу.',
        submittedAt: '2024-01-11 14:20',
        status: 'pending'
      }
    ]
  },
  {
    id: '2',
    title: 'Помощь в библиотеке',
    description: 'Помощь библиотекарю в каталогизации новых поступлений, расстановке книг и подготовке выставки.',
    category: 'Образование',
    price: 20,
    minBid: 15,
    status: 'assigned',
    createdAt: '2024-01-08',
    deadline: '2024-01-25',
    assignedTo: 'Петрова Мария, 9В',
    department: 'Библиотека',
    priority: 'low',
    bids: [
      {
        id: '3',
        studentName: 'Петрова Мария',
        studentClass: '9В',
        bidAmount: 18,
        comment: 'Люблю читать и работать с книгами. Помогала в школьной библиотеке в прошлом году.',
        submittedAt: '2024-01-09 09:15',
        status: 'accepted'
      }
    ]
  },
  {
    id: '3',
    title: 'Оформление стенда к празднику',
    description: 'Создание информационного стенда к предстоящему празднику. Требуется креативный подход и аккуратность.',
    category: 'Творчество',
    price: 25,
    minBid: 20,
    status: 'open',
    createdAt: '2024-01-12',
    deadline: '2024-01-18',
    department: 'Творческий отдел',
    priority: 'high',
    bids: []
  },
  {
    id: '4',
    title: 'Дежурство в столовой',
    description: 'Помощь в сервировке столов, уборке после приема пищи, поддержание порядка в обеденном зале.',
    category: 'Общественная работа',
    price: 12,
    minBid: 8,
    status: 'completed',
    createdAt: '2024-01-05',
    deadline: '2024-01-15',
    assignedTo: 'Козлов Андрей, 8А',
    department: 'Хозяйственный отдел',
    priority: 'medium',
    bids: [
      {
        id: '4',
        studentName: 'Козлов Андрей',
        studentClass: '8А',
        bidAmount: 10,
        comment: 'Ответственно отношусь к поручениям, готов помочь.',
        submittedAt: '2024-01-06 16:45',
        status: 'accepted'
      }
    ]
  },
  {
    id: '5',
    title: 'Техническая поддержка мероприятия',
    description: 'Помощь в настройке звуковой аппаратуры и освещения для школьного концерта.',
    category: 'Техническое обеспечение',
    price: 30,
    minBid: 25,
    status: 'open',
    createdAt: '2024-01-13',
    deadline: '2024-01-22',
    department: 'Технический отдел',
    priority: 'high',
    bids: [
      {
        id: '5',
        studentName: 'Смирнов Игорь',
        studentClass: '11А',
        bidAmount: 28,
        comment: 'Увлекаюсь техникой, имею опыт работы с аудиоаппаратурой.',
        submittedAt: '2024-01-14 11:00',
        status: 'pending'
      }
    ]
  }
];

const categories = ["Все", "Спорт", "Образование", "Творчество", "Общественная работа", "Техническое обеспечение"];
const statusFilters = ["Все", "Открытые", "Назначенные", "Завершенные", "Отмененные"];
const priorityFilters = ["Все", "Высокий", "Средний", "Низкий"];

export default function ContractsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedStatus, setSelectedStatus] = useState("Все");
  const [selectedPriority, setSelectedPriority] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);

  // Статистические данные
  const totalTasks = mockTasks.length;
  const openTasks = mockTasks.filter(t => t.status === 'open').length;
  const assignedTasks = mockTasks.filter(t => t.status === 'assigned').length;
  const totalBids = mockTasks.reduce((sum, t) => sum + t.bids.length, 0);

  // Фильтрация заданий
  const filteredTasks = mockTasks.filter(task => {
    const matchesCategory = selectedCategory === "Все" || task.category === selectedCategory;
    const matchesStatus = selectedStatus === "Все" || 
      (selectedStatus === "Открытые" && task.status === "open") ||
      (selectedStatus === "Назначенные" && task.status === "assigned") ||
      (selectedStatus === "Завершенные" && task.status === "completed") ||
      (selectedStatus === "Отмененные" && task.status === "cancelled");
    const matchesPriority = selectedPriority === "Все" ||
      (selectedPriority === "Высокий" && task.priority === "high") ||
      (selectedPriority === "Средний" && task.priority === "medium") ||
      (selectedPriority === "Низкий" && task.priority === "low");
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesPriority && matchesSearch;
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Открыто';
      case 'assigned': return 'Назначено';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Отменено';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return priority;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsViewingDetails(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setContractModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    if (confirm(`Вы уверены, что хотите удалить задание "${task.title}"?`)) {
      // TODO: API-запрос на удаление
      console.log('Удаление задания:', task);
      alert(`Задание "${task.title}" удалено`);
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setContractModalOpen(true);
  };

  const handleSaveTask = (taskData: TaskFormData) => {
    if (editingTask) {
      // TODO: API-запрос на обновление задания
      console.log('Обновление задания:', { ...editingTask, ...taskData });
      alert(`Задание "${taskData.title}" обновлено!`);
    } else {
      // TODO: API-запрос на создание задания
      console.log('Создание задания:', taskData);
      alert(`Задание "${taskData.title}" создано!`);
    }
  };

  const handleCloseModal = () => {
    setContractModalOpen(false);
    setEditingTask(null);
  };

  const handleAcceptBid = (taskId: string, bidId: string) => {
    // TODO: API-запрос на принятие отклика
    console.log('Принять отклик:', taskId, bidId);
    alert('Отклик принят!');
  };

  const handleRejectBid = (taskId: string, bidId: string) => {
    // TODO: API-запрос на отклонение отклика
    console.log('Отклонить отклик:', taskId, bidId);
    alert('Отклик отклонен!');
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
                  onClick={handleAddTask}
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
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего заданий</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalTasks}</dd>
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
                        <dt className="text-sm font-medium admin-text-secondary truncate">Открытые задания</dt>
                        <dd className="text-lg font-medium text-gray-900">{openTasks}</dd>
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
                        <dt className="text-sm font-medium admin-text-secondary truncate">Назначенные задания</dt>
                        <dd className="text-lg font-medium text-gray-900">{assignedTasks}</dd>
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
                      Поиск заданий
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

                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Приоритет
                    </label>
                    <select
                      className="admin-input w-full"
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                    >
                      {priorityFilters.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Список заданий */}
            <div className="admin-card">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Список заданий
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm admin-text-secondary">
                      Управление заданиями от администрации для учеников
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      onClick={handleAddTask}
                      className="admin-button-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
                      style={{ backgroundColor: 'var(--primary-burgundy)' }}
                    >
                      <span className="mr-2">📋</span>
                      Добавить задание
                    </button>
                  </div>
                </div>

                {filteredTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--background-gray)' }}>
                      <span className="text-2xl">📋</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Заданий не найдено</h3>
                    <p className="admin-text-secondary">
                      Попробуйте изменить критерии поиска или создайте новое задание.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        style={{ borderColor: 'var(--divider)' }}
                        onClick={() => handleViewTask(task)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-medium text-gray-900 flex-1">
                            {task.title}
                          </h4>
                          <span className="text-xl ml-2">👁️</span>
                        </div>
                        
                        <p className="admin-text-secondary text-sm mb-4 line-clamp-2">
                          {task.description}
                        </p>

                        <div className="flex items-center justify-between mb-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {getStatusText(task.status)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {getPriorityText(task.priority)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm admin-text-secondary mb-3">
                          <div className="flex items-center">
                            <span className="mr-1">💰</span>
                            {task.price} L-Coin
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">👥</span>
                            {task.bids.length} откликов
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">📅</span>
                            до {new Date(task.deadline).toLocaleDateString('ru-RU')}
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">🏷️</span>
                            {task.category}
                          </div>
                        </div>

                        {task.assignedTo && (
                          <div className="mt-3 p-2 bg-green-50 rounded-md">
                            <p className="text-sm text-green-800">
                              <strong>Назначено:</strong> {task.assignedTo}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTask(task);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Редактировать"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task);
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

      {/* Модальное окно деталей задания */}
      {isViewingDetails && selectedTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md admin-card">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{selectedTask.title}</h3>
                <p className="mt-1 text-sm admin-text-secondary">{selectedTask.department}</p>
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
                <p className="text-sm admin-text-secondary">{selectedTask.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium admin-text-secondary">Стоимость:</span>
                  <p className="text-sm text-gray-900">{selectedTask.price} L-Coin</p>
                </div>
                <div>
                  <span className="text-sm font-medium admin-text-secondary">Минимальная ставка:</span>
                  <p className="text-sm text-gray-900">{selectedTask.minBid} L-Coin</p>
                </div>
                <div>
                  <span className="text-sm font-medium admin-text-secondary">Дедлайн:</span>
                  <p className="text-sm text-gray-900">{new Date(selectedTask.deadline).toLocaleDateString('ru-RU')}</p>
                </div>
                <div>
                  <span className="text-sm font-medium admin-text-secondary">Приоритет:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                    {getPriorityText(selectedTask.priority)}
                  </span>
                </div>
              </div>

              {selectedTask.bids.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Отклики учеников ({selectedTask.bids.length})</h4>
                  <div className="space-y-4">
                    {selectedTask.bids.map((bid) => (
                      <div key={bid.id} className="border rounded-lg p-4" style={{ borderColor: 'var(--divider)' }}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900">{bid.studentName}</h5>
                            <p className="text-xs admin-text-secondary">{bid.studentClass} • {bid.submittedAt}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium" style={{ color: 'var(--primary-burgundy)' }}>{bid.bidAmount} L-Coin</span>
                            {bid.status === 'pending' && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleAcceptBid(selectedTask.id, bid.id)}
                                  className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700"
                                >
                                  Принять
                                </button>
                                <button
                                  onClick={() => handleRejectBid(selectedTask.id, bid.id)}
                                  className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700"
                                >
                                  Отклонить
                                </button>
                              </div>
                            )}
                            {bid.status === 'accepted' && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                                Принято
                              </span>
                            )}
                            {bid.status === 'rejected' && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-md">
                                Отклонено
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm admin-text-secondary">{bid.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTask.bids.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--background-gray)' }}>
                    <span className="text-2xl">👥</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Откликов пока нет</h3>
                  <p className="admin-text-secondary">
                    Ученики еще не откликнулись на это задание.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления/редактирования задания */}
      <ContractModal 
        isOpen={contractModalOpen} 
        onClose={handleCloseModal}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </div>
  );
} 