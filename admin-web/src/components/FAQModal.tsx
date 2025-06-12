'use client';

import React, { useState, useEffect } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'academic' | 'dormitory' | 'finance' | 'technical' | 'general';
  isVisible: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  views: number;
  helpful: number;
  notHelpful: number;
}

interface FAQFormData {
  question: string;
  answer: string;
  category: 'academic' | 'dormitory' | 'finance' | 'technical' | 'general';
  isVisible: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq?: FAQ | null;
  onSave: (data: FAQFormData) => void;
}

const categoryNames = {
  academic: 'Учебные вопросы',
  dormitory: 'Общежитие',
  finance: 'Финансы и L-Coin',
  technical: 'Технические вопросы',
  general: 'Общие вопросы'
};

const categoryIcons = {
  academic: '📚',
  dormitory: '🏠',
  finance: '💰',
  technical: '💻',
  general: '❓'
};

const priorityNames = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий'
};

export default function FAQModal({ isOpen, onClose, faq, onSave }: FAQModalProps) {
  const [formData, setFormData] = useState<FAQFormData>({
    question: '',
    answer: '',
    category: 'general',
    isVisible: true,
    priority: 'medium'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        isVisible: faq.isVisible,
        priority: faq.priority
      });
    } else {
      setFormData({
        question: '',
        answer: '',
        category: 'general',
        isVisible: true,
        priority: 'medium'
      });
    }
    setErrors({});
  }, [faq, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Вопрос обязателен';
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'Ответ обязателен';
    }

    if (formData.question.length > 200) {
      newErrors.question = 'Вопрос не должен превышать 200 символов';
    }

    if (formData.answer.length > 1000) {
      newErrors.answer = 'Ответ не должен превышать 1000 символов';
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

  const handleInputChange = (field: keyof FAQFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
                          <span className="text-white text-xl">❓</span>
                        </div>
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {faq ? 'Редактировать вопрос' : 'Добавить новый вопрос'}
                          </h3>
                          <p className="text-sm admin-text-secondary">
                            {faq ? 'Изменить существующий вопрос в базе знаний' : 'Создать новый вопрос для FAQ'}
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
                      
                      {/* Вопрос */}
                      <div>
                        <label className="block text-sm font-medium admin-text-secondary mb-1">
                          Вопрос *
                        </label>
                        <input
                          type="text"
                          className={`admin-input w-full ${errors.question ? 'border-red-500' : ''}`}
                          placeholder="Введите вопрос..."
                          value={formData.question}
                          onChange={(e) => handleInputChange('question', e.target.value)}
                        />
                        {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
                        <p className="text-xs admin-text-secondary mt-1">
                          Символов: {formData.question.length}/200
                        </p>
                      </div>

                      {/* Категория */}
                      <div>
                        <label className="block text-sm font-medium admin-text-secondary mb-1">
                          Категория
                        </label>
                        <select
                          className="admin-input w-full"
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value as 'academic' | 'dormitory' | 'finance' | 'technical' | 'general')}
                        >
                          {Object.entries(categoryNames).map(([key, name]) => (
                            <option key={key} value={key}>
                              {categoryIcons[key as keyof typeof categoryIcons]} {name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Приоритет */}
                      <div>
                        <label className="block text-sm font-medium admin-text-secondary mb-1">
                          Приоритет
                        </label>
                        <select
                          className="admin-input w-full"
                          value={formData.priority}
                          onChange={(e) => handleInputChange('priority', e.target.value as 'low' | 'medium' | 'high')}
                        >
                          {Object.entries(priorityNames).map(([key, name]) => (
                            <option key={key} value={key}>{name}</option>
                          ))}
                        </select>
                        <p className="text-xs admin-text-secondary mt-1">
                          Высокий приоритет отображается первым в списке
                        </p>
                      </div>

                      {/* Видимость */}
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 rounded"
                            style={{ color: 'var(--primary-burgundy)' }}
                            checked={formData.isVisible}
                            onChange={(e) => handleInputChange('isVisible', e.target.checked)}
                          />
                          <span className="ml-2 text-sm font-medium admin-text-secondary">
                            👁️ Видимый для пользователей
                          </span>
                        </label>
                        <p className="text-xs admin-text-secondary mt-1 ml-6">
                          Скрытые вопросы доступны только администраторам
                        </p>
                      </div>
                    </div>

                    {/* Ответ */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 mb-3">Подробный ответ</h4>
                      
                      <div>
                        <label className="block text-sm font-medium admin-text-secondary mb-1">
                          Ответ *
                        </label>
                        <textarea
                          rows={8}
                          className={`admin-input w-full resize-none ${errors.answer ? 'border-red-500' : ''}`}
                          placeholder="Введите подробный ответ на вопрос..."
                          value={formData.answer}
                          onChange={(e) => handleInputChange('answer', e.target.value)}
                        />
                        {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer}</p>}
                        <p className="text-xs admin-text-secondary mt-1">
                          Символов: {formData.answer.length}/1000
                        </p>
                      </div>

                      {/* Превью */}
                      <div className="border rounded-lg p-4" style={{ backgroundColor: 'var(--background-gray)' }}>
                        <h5 className="font-medium text-gray-900 mb-2">Превью FAQ</h5>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{categoryIcons[formData.category]}</span>
                            <span className="font-medium">
                              {formData.question || 'Вопрос...'}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              {categoryNames[formData.category]}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              formData.priority === 'high' ? 'bg-red-100 text-red-800' :
                              formData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {priorityNames[formData.priority]}
                            </span>
                            {formData.isVisible ? (
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                Видимый
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                Скрытый
                              </span>
                            )}
                          </div>
                          <p className="text-sm admin-text-secondary">
                            {formData.answer || 'Ответ будет отображаться здесь...'}
                          </p>
                        </div>
                      </div>

                      {/* Подсказки */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h6 className="font-medium text-blue-900 mb-2">💡 Советы по написанию FAQ:</h6>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li>• Формулируйте вопрос так, как его задали бы пользователи</li>
                          <li>• Давайте конкретные и понятные ответы</li>
                          <li>• Используйте нумерованные списки для пошаговых инструкций</li>
                          <li>• Указывайте контактную информацию для дополнительной помощи</li>
                        </ul>
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
                {faq ? 'Сохранить изменения' : 'Создать вопрос'}
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