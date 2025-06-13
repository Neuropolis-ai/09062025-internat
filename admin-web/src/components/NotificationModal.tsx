'use client';

import React, { useState, useEffect } from 'react';

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

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification?: Notification | null;
  onSave: (data: NotificationFormData) => void;
}

export default function NotificationModal({ isOpen, onClose, notification, onSave }: NotificationModalProps) {
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    content: '',
    type: 'GENERAL',
    isGlobal: true,
    userIds: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title,
        content: notification.content,
        type: notification.type,
        isGlobal: notification.isGlobal,
        userIds: []
      });
    } else {
      setFormData({
        title: '',
        content: '',
        type: 'GENERAL',
        isGlobal: true,
        userIds: []
      });
    }
    setErrors({});
  }, [notification, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Заголовок обязателен';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Содержание уведомления обязательно';
    }

    if (!formData.isGlobal && (!formData.userIds || formData.userIds.length === 0)) {
      newErrors.userIds = 'Для персонального уведомления укажите получателей';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleInputChange = (field: keyof NotificationFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'GENERAL': return 'Общие объявления и информация';
      case 'SYSTEM': return 'Системные сообщения';
      case 'ACHIEVEMENT': return 'Уведомления о достижениях';
      case 'TRANSACTION': return 'Уведомления о транзакциях';
      case 'AUCTION': return 'Уведомления об аукционах';
      case 'CONTRACT': return 'Уведомления о контрактах';
      default: return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full">
                  {/* Заголовок модального окна */}
                  <div className="mb-6 border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                          <span className="text-white text-xl">📢</span>
                        </div>
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {notification ? 'Редактировать уведомление' : 'Создать уведомление'}
                          </h3>
                          <p className="text-sm admin-text-secondary">
                            {notification ? 'Изменить параметры существующего уведомления' : 'Создать новое уведомление для пользователей'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <span className="text-xl">✕</span>
                      </button>
                    </div>
                  </div>

                  {/* Табы для переключения между формой и превью */}
                  <div className="flex border-b mb-6">
                    <button
                      type="button"
                      className={`px-4 py-2 font-medium text-sm ${!showPreview ? 'border-b-2 text-blue-600' : 'text-gray-500'}`}
                      style={{ borderColor: !showPreview ? 'var(--primary-burgundy)' : 'transparent' }}
                      onClick={() => setShowPreview(false)}
                    >
                      📝 Редактирование
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 font-medium text-sm ${showPreview ? 'border-b-2 text-blue-600' : 'text-gray-500'}`}
                      style={{ borderColor: showPreview ? 'var(--primary-burgundy)' : 'transparent' }}
                      onClick={() => setShowPreview(true)}
                    >
                      👁️ Превью
                    </button>
                  </div>

                  {!showPreview ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Основная информация */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 mb-3">Основная информация</h4>
                        
                        {/* Заголовок */}
                        <div>
                          <label className="block text-sm font-medium admin-text-secondary mb-1">
                            Заголовок уведомления *
                          </label>
                          <input
                            type="text"
                            className={`admin-input w-full ${errors.title ? 'border-red-500' : ''}`}
                            placeholder="Введите заголовок уведомления"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                          />
                          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        {/* Содержание */}
                        <div>
                          <label className="block text-sm font-medium admin-text-secondary mb-1">
                            Содержание уведомления *
                          </label>
                          <textarea
                            className={`admin-input w-full h-32 ${errors.content ? 'border-red-500' : ''}`}
                            placeholder="Введите текст уведомления"
                            value={formData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            rows={4}
                          />
                          {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                        </div>

                        {/* Тип уведомления */}
                        <div>
                          <label className="block text-sm font-medium admin-text-secondary mb-1">
                            Тип уведомления
                          </label>
                          <select
                            className="admin-input w-full"
                            value={formData.type}
                            onChange={(e) => handleInputChange('type', e.target.value as any)}
                          >
                            <option value="GENERAL">📢 Общее</option>
                            <option value="SYSTEM">⚙️ Системное</option>
                            <option value="ACHIEVEMENT">🏆 Достижение</option>
                            <option value="TRANSACTION">💰 Транзакция</option>
                            <option value="AUCTION">🔨 Аукцион</option>
                            <option value="CONTRACT">📄 Контракт</option>
                          </select>
                          <p className="text-xs admin-text-secondary mt-1">
                            {getTypeDescription(formData.type)}
                          </p>
                        </div>
                      </div>

                      {/* Настройки отправки */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 mb-3">Настройки отправки</h4>

                        {/* Тип отправки */}
                        <div>
                          <label className="block text-sm font-medium admin-text-secondary mb-2">
                            Тип отправки
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="sendType"
                                className="mr-2"
                                checked={formData.isGlobal}
                                onChange={() => handleInputChange('isGlobal', true)}
                              />
                              <span className="text-sm">🌐 Глобальное (всем пользователям)</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="sendType"
                                className="mr-2"
                                checked={!formData.isGlobal}
                                onChange={() => handleInputChange('isGlobal', false)}
                              />
                              <span className="text-sm">👤 Персональное (выборочно)</span>
                            </label>
                          </div>
                        </div>

                        {/* Список получателей для персональных уведомлений */}
                        {!formData.isGlobal && (
                          <div>
                            <label className="block text-sm font-medium admin-text-secondary mb-1">
                              ID получателей *
                            </label>
                            <textarea
                              className={`admin-input w-full h-24 ${errors.userIds ? 'border-red-500' : ''}`}
                              placeholder="Введите ID пользователей через запятую (например: user1, user2, user3)"
                              value={formData.userIds?.join(', ') || ''}
                              onChange={(e) => {
                                const userIds = e.target.value.split(',').map(id => id.trim()).filter(id => id);
                                handleInputChange('userIds', userIds);
                              }}
                              rows={3}
                            />
                            {errors.userIds && <p className="text-red-500 text-xs mt-1">{errors.userIds}</p>}
                            <p className="text-xs admin-text-secondary mt-1">
                              Введите ID пользователей через запятую для персональной отправки
                            </p>
                          </div>
                        )}

                        {/* Информационная карточка */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h5 className="font-medium text-blue-900 mb-2">ℹ️ Информация</h5>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Глобальные уведомления отправляются всем активным пользователям</li>
                            <li>• Персональные уведомления отправляются только указанным пользователям</li>
                            <li>• Тип уведомления определяет его категорию и отображение</li>
                            <li>• Все уведомления сохраняются в истории</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Превью уведомления */
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 mb-4">Превью уведомления</h4>
                      
                      <div className={`border rounded-lg p-4 ${formData.isGlobal ? 'border-blue-300 bg-blue-50' : 'border-gray-300'}`}>
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{getTypeIcon(formData.type)}</span>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-medium text-gray-900">
                                {formData.title || 'Заголовок уведомления'}
                                {formData.isGlobal && <span className="ml-2 text-blue-600">🌐</span>}
                              </h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(formData.type)}`}>
                                {getTypeText(formData.type)}
                              </span>
                              {formData.isGlobal ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Глобальное
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Персональное
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm admin-text-secondary mb-3">
                              {formData.content || 'Содержание уведомления будет отображаться здесь'}
                            </p>

                            <div className="grid grid-cols-2 gap-4 text-sm admin-text-secondary">
                              <div>
                                <span className="font-medium">Получателей:</span>
                                <div>
                                  {formData.isGlobal 
                                    ? 'Все пользователи' 
                                    : `${formData.userIds?.length || 0} пользователей`
                                  }
                                </div>
                              </div>
                              <div>
                                <span className="font-medium">Создано:</span>
                                <div>{new Date().toLocaleDateString('ru-RU')}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {!formData.isGlobal && formData.userIds && formData.userIds.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Список получателей:</h5>
                          <div className="flex flex-wrap gap-2">
                            {formData.userIds.map((userId, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                                {userId}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                style={{ backgroundColor: 'var(--primary-burgundy)' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-burgundy-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-burgundy)'}
              >
                {notification ? 'Обновить уведомление' : 'Создать уведомление'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                onClick={onClose}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 