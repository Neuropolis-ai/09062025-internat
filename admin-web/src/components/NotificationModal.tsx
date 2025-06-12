'use client';

import React, { useState, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  target: 'all' | 'students' | 'teachers' | 'parents' | 'specific';
  targetDetails?: string;
  isActive: boolean;
  isImportant: boolean;
  createdAt: string;
  expiresAt?: string;
  createdBy: string;
  readCount: number;
  totalRecipients: number;
}

interface NotificationFormData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  target: 'all' | 'students' | 'teachers' | 'parents' | 'specific';
  targetDetails?: string;
  isImportant: boolean;
  expiresAt?: string;
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
    message: '',
    type: 'info',
    target: 'all',
    targetDetails: '',
    isImportant: false,
    expiresAt: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        target: notification.target,
        targetDetails: notification.targetDetails || '',
        isImportant: notification.isImportant,
        expiresAt: notification.expiresAt || ''
      });
    } else {
      setFormData({
        title: '',
        message: '',
        type: 'info',
        target: 'all',
        targetDetails: '',
        isImportant: false,
        expiresAt: ''
      });
    }
    setErrors({});
  }, [notification, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Заголовок обязателен';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Текст уведомления обязателен';
    }

    if (formData.target === 'specific' && !formData.targetDetails?.trim()) {
      newErrors.targetDetails = 'Укажите целевую аудиторию';
    }

    if (formData.expiresAt && new Date(formData.expiresAt) <= new Date()) {
      newErrors.expiresAt = 'Дата истечения должна быть в будущем';
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

  const handleInputChange = (field: keyof NotificationFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '📢';
    }
  };

  const formatDateTimeLocal = (dateTime: string) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toISOString().slice(0, 16);
  };

  const getTargetDescription = (target: string) => {
    switch (target) {
      case 'all': return 'Все пользователи системы';
      case 'students': return 'Все ученики лицея';
      case 'teachers': return 'Все учителя';
      case 'parents': return 'Все родители';
      case 'specific': return 'Выборочная группа';
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

                      {/* Тип уведомления */}
                      <div>
                        <label className="block text-sm font-medium admin-text-secondary mb-1">
                          Тип уведомления
                        </label>
                        <select
                          className="admin-input w-full"
                          value={formData.type}
                          onChange={(e) => handleInputChange('type', e.target.value as 'info' | 'warning' | 'success' | 'error')}
                        >
                          <option value="info">ℹ️ Информация</option>
                          <option value="warning">⚠️ Предупреждение</option>
                          <option value="success">✅ Успех</option>
                          <option value="error">❌ Ошибка</option>
                        </select>
                      </div>

                      {/* Текст уведомления */}
                      <div>
                        <label className="block text-sm font-medium admin-text-secondary mb-1">
                          Текст уведомления *
                        </label>
                        <textarea
                          rows={4}
                          className={`admin-input w-full resize-none ${errors.message ? 'border-red-500' : ''}`}
                          placeholder="Введите подробный текст уведомления..."
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                        />
                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                        <p className="text-xs admin-text-secondary mt-1">
                          Символов: {formData.message.length}/500
                        </p>
                      </div>

                      {/* Дата истечения */}
                      <div>
                        <label className="block text-sm font-medium admin-text-secondary mb-1">
                          Дата истечения (необязательно)
                        </label>
                        <input
                          type="datetime-local"
                          className={`admin-input w-full ${errors.expiresAt ? 'border-red-500' : ''}`}
                          value={formatDateTimeLocal(formData.expiresAt || '')}
                          onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                        />
                        {errors.expiresAt && <p className="text-red-500 text-xs mt-1">{errors.expiresAt}</p>}
                        <p className="text-xs admin-text-secondary mt-1">
                          Если не указано, уведомление будет активно до ручного отключения
                        </p>
                      </div>
                    </div>

                    {/* Настройки доставки */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 mb-3">Настройки доставки</h4>
                      
                      {/* Целевая аудитория */}
                      <div>
                        <label className="block text-sm font-medium admin-text-secondary mb-1">
                          Целевая аудитория
                        </label>
                        <select
                          className="admin-input w-full"
                          value={formData.target}
                          onChange={(e) => handleInputChange('target', e.target.value as 'all' | 'students' | 'teachers' | 'parents' | 'specific')}
                        >
                          <option value="all">👥 Все пользователи</option>
                          <option value="students">🎓 Ученики</option>
                          <option value="teachers">👨‍🏫 Учителя</option>
                          <option value="parents">👪 Родители</option>
                          <option value="specific">🎯 Выборочно</option>
                        </select>
                        <p className="text-xs admin-text-secondary mt-1">
                          {getTargetDescription(formData.target)}
                        </p>
                      </div>

                      {/* Детали целевой аудитории */}
                      {formData.target === 'specific' && (
                        <div>
                          <label className="block text-sm font-medium admin-text-secondary mb-1">
                            Описание целевой группы *
                          </label>
                          <input
                            type="text"
                            className={`admin-input w-full ${errors.targetDetails ? 'border-red-500' : ''}`}
                            placeholder="Например: Ученики 10А класса, Участники кружка робототехники"
                            value={formData.targetDetails}
                            onChange={(e) => handleInputChange('targetDetails', e.target.value)}
                          />
                          {errors.targetDetails && <p className="text-red-500 text-xs mt-1">{errors.targetDetails}</p>}
                        </div>
                      )}

                      {/* Важность */}
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 rounded"
                            style={{ color: 'var(--primary-burgundy)' }}
                            checked={formData.isImportant}
                            onChange={(e) => handleInputChange('isImportant', e.target.checked)}
                          />
                          <span className="ml-2 text-sm font-medium admin-text-secondary">
                            ⭐ Важное уведомление
                          </span>
                        </label>
                        <p className="text-xs admin-text-secondary mt-1 ml-6">
                          Важные уведомления выделяются в интерфейсе и отправляются push-уведомлениями
                        </p>
                      </div>

                      {/* Превью */}
                      <div className="border rounded-lg p-4" style={{ backgroundColor: 'var(--background-gray)' }}>
                        <h5 className="font-medium text-gray-900 mb-2">Превью уведомления</h5>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getTypeIcon(formData.type)}</span>
                            <span className="font-medium">{formData.title || 'Заголовок уведомления'}</span>
                            {formData.isImportant && <span className="text-red-600">⭐</span>}
                          </div>
                          <p className="text-sm admin-text-secondary">
                            {formData.message || 'Текст уведомления будет отображаться здесь...'}
                          </p>
                          <div className="flex items-center justify-between text-xs admin-text-secondary">
                            <span>Для: {getTargetDescription(formData.target)}</span>
                            {formData.expiresAt && (
                              <span>До: {new Date(formData.expiresAt).toLocaleDateString('ru-RU')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                style={{ backgroundColor: 'var(--primary-burgundy)' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7A1F32'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-burgundy)'}
              >
                {notification ? 'Сохранить изменения' : 'Создать уведомление'}
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