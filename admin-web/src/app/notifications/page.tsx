'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import NotificationModal from '../../components/NotificationModal';

// Обновленные интерфейсы для соответствия backend API
interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'GENERAL' | 'SYSTEM' | 'ACHIEVEMENT' | 'TRANSACTION' | 'AUCTION' | 'CONTRACT';
  isGlobal: boolean;
  createdAt: string;
  updatedAt: string;
  userNotifications: UserNotification[];
  _count: {
    userNotifications: number;
  };
}

interface UserNotification {
  id: string;
  userId: string;
  notificationId: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface NotificationFormData {
  title: string;
  content: string;
  type: 'GENERAL' | 'SYSTEM' | 'ACHIEVEMENT' | 'TRANSACTION' | 'AUCTION' | 'CONTRACT';
  isGlobal: boolean;
  userIds?: string[];
}

const typeFilters = ["Все", "Общие", "Системные", "Достижения", "Транзакции", "Аукционы", "Контракты"];
const statusFilters = ["Все", "Глобальные", "Персональные"];

export default function NotificationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Все");
  const [selectedStatus, setSelectedStatus] = useState("Все");
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка уведомлений из API
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/v1/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        console.error('Ошибка загрузки уведомлений:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка сети при загрузке уведомлений:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Статистика
  const totalNotifications = notifications.length;
  const globalNotifications = notifications.filter(n => n.isGlobal).length;
  const personalNotifications = notifications.filter(n => !n.isGlobal).length;
  const totalRecipients = notifications.reduce((sum, n) => sum + n._count.userNotifications, 0);

  // Фильтрация уведомлений
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "Все" ||
      (selectedType === "Общие" && notification.type === "GENERAL") ||
      (selectedType === "Системные" && notification.type === "SYSTEM") ||
      (selectedType === "Достижения" && notification.type === "ACHIEVEMENT") ||
      (selectedType === "Транзакции" && notification.type === "TRANSACTION") ||
      (selectedType === "Аукционы" && notification.type === "AUCTION") ||
      (selectedType === "Контракты" && notification.type === "CONTRACT");
    const matchesStatus = selectedStatus === "Все" ||
      (selectedStatus === "Глобальные" && notification.isGlobal) ||
      (selectedStatus === "Персональные" && !notification.isGlobal);
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeText = (type: string) => {
    switch (type) {
      case 'GENERAL': return 'Общее';
      case 'SYSTEM': return 'Системное';
      case 'ACHIEVEMENT': return 'Достижение';
      case 'TRANSACTION': return 'Транзакция';
      case 'AUCTION': return 'Аукцион';
      case 'CONTRACT': return 'Контракт';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'GENERAL': return 'bg-blue-100 text-blue-800';
      case 'SYSTEM': return 'bg-gray-100 text-gray-800';
      case 'ACHIEVEMENT': return 'bg-green-100 text-green-800';
      case 'TRANSACTION': return 'bg-yellow-100 text-yellow-800';
      case 'AUCTION': return 'bg-purple-100 text-purple-800';
      case 'CONTRACT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'GENERAL': return '📢';
      case 'SYSTEM': return '⚙️';
      case 'ACHIEVEMENT': return '🏆';
      case 'TRANSACTION': return '💰';
      case 'AUCTION': return '🔨';
      case 'CONTRACT': return '📄';
      default: return '📢';
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEditNotification = (notification: Notification) => {
    setEditingNotification(notification);
    setNotificationModalOpen(true);
  };

  const handleDeleteNotification = async (notification: Notification) => {
    if (confirm(`Вы уверены, что хотите удалить уведомление "${notification.title}"?`)) {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/notifications/${notification.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await loadNotifications(); // Перезагружаем список
          alert(`Уведомление "${notification.title}" удалено`);
        } else {
          alert('Ошибка при удалении уведомления');
        }
      } catch (error) {
        console.error('Ошибка при удалении уведомления:', error);
        alert('Ошибка при удалении уведомления');
      }
    }
  };

  const handleAddNotification = () => {
    setEditingNotification(null);
    setNotificationModalOpen(true);
  };

  const handleSaveNotification = async (notificationData: NotificationFormData) => {
    try {
      let response;
      
      if (editingNotification) {
        // Обновление существующего уведомления
        response = await fetch(`http://localhost:3001/api/v1/notifications/${editingNotification.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationData),
        });
      } else {
        // Создание нового уведомления
        response = await fetch('http://localhost:3001/api/v1/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationData),
        });
      }

      if (response.ok) {
        await loadNotifications(); // Перезагружаем список
        alert(`Уведомление "${notificationData.title}" ${editingNotification ? 'обновлено' : 'создано'}!`);
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка при сохранении уведомления:', error);
      alert('Ошибка при сохранении уведомления');
    }
  };

  const handleCloseModal = () => {
    setNotificationModalOpen(false);
    setEditingNotification(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen admin-container flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка уведомлений...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen admin-container flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Основной контент */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="shadow" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-8">
              <div className="flex items-center">
                {/* Кнопка меню для мобильных устройств */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-white hover:bg-white/20 mr-4"
                >
                  <span className="text-xl">☰</span>
                </button>
                
                <div>
                  <h1 className="text-2xl font-bold text-white">Уведомления</h1>
                  <p className="text-white/90 font-medium">Управление системными уведомлениями</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAddNotification}
                  className="admin-button-primary text-white px-4 py-2 rounded-md transition-colors"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                >
                  Создать уведомление
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
                        <span className="text-white font-bold">📢</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего уведомлений</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalNotifications}</dd>
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
                        <span className="text-white font-bold">🌐</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Глобальных</dt>
                        <dd className="text-lg font-medium text-gray-900">{globalNotifications}</dd>
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
                        <span className="text-white font-bold">👤</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Персональных</dt>
                        <dd className="text-lg font-medium text-gray-900">{personalNotifications}</dd>
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
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего получателей</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalRecipients}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Фильтры и поиск */}
            <div className="admin-card mb-6">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Поиск уведомлений
                    </label>
                    <input
                      type="text"
                      className="admin-input w-full"
                      placeholder="Поиск по заголовку или содержанию..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Тип
                    </label>
                    <select
                      className="admin-input w-full"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      {typeFilters.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
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
                </div>
              </div>
            </div>

            {/* Список уведомлений */}
            <div className="admin-card">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Список уведомлений
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm admin-text-secondary">
                      Найдено: {filteredNotifications.length} из {totalNotifications} уведомлений
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      onClick={handleAddNotification}
                      className="admin-button-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
                      style={{ backgroundColor: 'var(--primary-burgundy)' }}
                    >
                      <span className="mr-2">📢</span>
                      Создать уведомление
                    </button>
                  </div>
                </div>

                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--background-gray)' }}>
                      <span className="text-2xl">📢</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Уведомлений не найдено</h3>
                    <p className="admin-text-secondary">
                      Попробуйте изменить критерии поиска или создайте новое уведомление.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`border rounded-lg p-4 ${notification.isGlobal ? 'border-blue-300 bg-blue-50' : 'border-gray-300'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-xl">{getTypeIcon(notification.type)}</span>
                              <h4 className="text-lg font-medium text-gray-900">
                                {notification.title}
                                {notification.isGlobal && <span className="ml-2 text-blue-600">🌐</span>}
                              </h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                                {getTypeText(notification.type)}
                              </span>
                              {notification.isGlobal ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Глобальное
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Персональное
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm admin-text-secondary mb-3 line-clamp-2">
                              {notification.content}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm admin-text-secondary">
                              <div>
                                <span className="font-medium">Получателей:</span>
                                <div>{notification._count.userNotifications} пользователей</div>
                              </div>
                              <div>
                                <span className="font-medium">Создано:</span>
                                <div>{formatDateTime(notification.createdAt)}</div>
                              </div>
                              <div>
                                <span className="font-medium">Обновлено:</span>
                                <div>{formatDateTime(notification.updatedAt)}</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleEditNotification(notification)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="Редактировать"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteNotification(notification)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              title="Удалить"
                            >
                              🗑️
                            </button>
                          </div>
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

      {/* Модальное окно создания/редактирования уведомления */}
      <NotificationModal 
        isOpen={notificationModalOpen}
        onClose={handleCloseModal}
        notification={editingNotification}
        onSave={handleSaveNotification}
      />
    </div>
  );
} 