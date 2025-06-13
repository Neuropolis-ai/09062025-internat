'use client';

import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';

interface AuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lotData: LotFormData) => void;
  editLot?: AuctionLot | null;
}

interface LotFormData {
  title: string;
  description: string;
  startingPrice: number;
  minBidIncrement: number;
  startTime: string;
  endTime: string;
  imageUrl?: string;
}

interface AuctionLot {
  id: string;
  title: string;
  description: string;
  startingPrice: string;
  currentPrice: string;
  imageUrl?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DRAFT' | 'CANCELLED';
  startTime: string;
  endTime: string;
  minBidIncrement: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
  };
  winner?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  _count: {
    bids: number;
  };
}

const categories = ["Одежда", "Канцтовары", "Сувениры", "Книги", "Игры", "Прочее"];
const sellers = ["Администрация", "Учебная часть", "Творческая мастерская", "Литературный клуб", "Совет учеников", "Спортивный клуб"];
const availableEmojis = ["👕", "📝", "☕", "📚", "🎲", "🏅", "🎖️", "🖊️", "📓", "📔", "🍫", "🧃", "💼", "🎨", "🎭"];

export default function AuctionModal({ isOpen, onClose, onSave, editLot }: AuctionModalProps) {
  const [formData, setFormData] = useState<LotFormData>({
    title: '',
    description: '',
    startingPrice: 0,
    minBidIncrement: 10,
    startTime: '',
    endTime: '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Заполнение формы при редактировании
  useEffect(() => {
    if (editLot) {
      setFormData({
        title: editLot.title,
        description: editLot.description,
        startingPrice: parseInt(editLot.startingPrice),
        minBidIncrement: parseInt(editLot.minBidIncrement),
        startTime: editLot.startTime.slice(0, 16), // для datetime-local
        endTime: editLot.endTime.slice(0, 16), // для datetime-local
        imageUrl: editLot.imageUrl || ''
      });
    } else {
      // Устанавливаем время по умолчанию
      const now = new Date();
      const startTime = new Date(now.getTime() + 60 * 60 * 1000); // через час
      const endTime = new Date(now.getTime() + 25 * 60 * 60 * 1000); // через 25 часов
      
      setFormData({
        title: '',
        description: '',
        startingPrice: 0,
        minBidIncrement: 10,
        startTime: startTime.toISOString().slice(0, 16),
        endTime: endTime.toISOString().slice(0, 16),
        imageUrl: ''
      });
    }
    setErrors({});
  }, [editLot, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название лота обязательно';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    }
    if (formData.startingPrice <= 0) {
      newErrors.startingPrice = 'Стартовая цена должна быть больше 0';
    }
    if (formData.minBidIncrement <= 0) {
      newErrors.minBidIncrement = 'Минимальный шаг ставки должен быть больше 0';
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Время начала обязательно';
    }
    if (!formData.endTime) {
      newErrors.endTime = 'Время окончания обязательно';
    }
    if (formData.startTime && formData.endTime && new Date(formData.startTime) >= new Date(formData.endTime)) {
      newErrors.endTime = 'Время окончания должно быть позже времени начала';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Преобразуем время в ISO формат для API
      const submitData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString()
      };
      onSave(submitData);
      handleCancel();
    }
  };

  const handleCancel = () => {
    const now = new Date();
    const startTime = new Date(now.getTime() + 60 * 60 * 1000);
    const endTime = new Date(now.getTime() + 25 * 60 * 60 * 1000);
    
    setFormData({
      title: '',
      description: '',
      startingPrice: 0,
      minBidIncrement: 10,
      startTime: startTime.toISOString().slice(0, 16),
      endTime: endTime.toISOString().slice(0, 16),
      imageUrl: ''
    });
    setErrors({});
    onClose();
  };

  const isEditing = !!editLot;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleCancel} 
      title={isEditing ? "Редактировать лот" : "Создать лот"} 
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Название лота *
            </label>
            <input
              type="text"
              id="title"
              className={`admin-input w-full ${errors.title ? 'border-red-500' : ''}`}
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Введите название лота"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              URL изображения
            </label>
            <input
              type="url"
              id="imageUrl"
              className="admin-input w-full"
              value={formData.imageUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Описание */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Описание лота *
          </label>
          <textarea
            id="description"
            rows={3}
            className={`admin-input w-full resize-none ${errors.description ? 'border-red-500' : ''}`}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Подробное описание лота для аукциона"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Финансовые параметры */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Стартовая цена (токены) *
            </label>
            <input
              type="number"
              id="startingPrice"
              min="1"
              className={`admin-input w-full ${errors.startingPrice ? 'border-red-500' : ''}`}
              value={formData.startingPrice || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, startingPrice: parseInt(e.target.value) || 0 }))}
              placeholder="Начальная цена в токенах"
            />
            {errors.startingPrice && <p className="text-red-500 text-xs mt-1">{errors.startingPrice}</p>}
          </div>

          <div>
            <label htmlFor="minBidIncrement" className="block text-sm font-medium text-gray-700 mb-1">
              Минимальный шаг ставки *
            </label>
            <input
              type="number"
              id="minBidIncrement"
              min="1"
              className={`admin-input w-full ${errors.minBidIncrement ? 'border-red-500' : ''}`}
              value={formData.minBidIncrement || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, minBidIncrement: parseInt(e.target.value) || 0 }))}
              placeholder="Минимальный шаг ставки"
            />
            {errors.minBidIncrement && <p className="text-red-500 text-xs mt-1">{errors.minBidIncrement}</p>}
          </div>
        </div>

        {/* Время проведения аукциона */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Время начала *
            </label>
            <input
              type="datetime-local"
              id="startTime"
              className={`admin-input w-full ${errors.startTime ? 'border-red-500' : ''}`}
              value={formData.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
            />
            {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
              Время окончания *
            </label>
            <input
              type="datetime-local"
              id="endTime"
              className={`admin-input w-full ${errors.endTime ? 'border-red-500' : ''}`}
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
            />
            {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
          </div>
        </div>

        {/* Превью лота */}
        {formData.title && formData.startingPrice > 0 && (
          <div className="p-4 rounded-md" style={{ backgroundColor: 'var(--background-light)' }}>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Превью лота:</h4>
            <div className="admin-card">
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {isEditing ? 'Редактируется' : 'Новый'}
                  </span>
                  {formData.startTime && formData.endTime && (
                    <span className="text-xs admin-text-secondary">
                      {new Date(formData.startTime).toLocaleDateString('ru-RU')} - {new Date(formData.endTime).toLocaleDateString('ru-RU')}
                    </span>
                  )}
                </div>

                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center text-4xl"
                       style={{ backgroundColor: 'white' }}>
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt={formData.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      '🎯'
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <h5 className="text-lg font-medium text-gray-900 mb-1">{formData.title}</h5>
                  <p className="text-sm admin-text-secondary mb-3">{formData.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-secondary">Стартовая цена:</span>
                      <span className="font-bold" style={{ color: 'var(--primary-burgundy)' }}>
                        {formData.startingPrice} токенов
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-secondary">Шаг ставки:</span>
                      <span className="font-medium">{formData.minBidIncrement} токенов</span>
                    </div>
                    {formData.startTime && (
                      <div className="flex justify-between text-sm">
                        <span className="admin-text-secondary">Начало:</span>
                        <span className="font-medium">{new Date(formData.startTime).toLocaleString('ru-RU')}</span>
                      </div>
                    )}
                    {formData.endTime && (
                      <div className="flex justify-between text-sm">
                        <span className="admin-text-secondary">Окончание:</span>
                        <span className="font-medium">{new Date(formData.endTime).toLocaleString('ru-RU')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="admin-button-secondary px-4 py-2 text-sm font-medium rounded-md"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="admin-button-primary px-4 py-2 text-sm font-medium rounded-md"
            style={{ backgroundColor: 'var(--primary-burgundy)' }}
          >
            {isEditing ? 'Сохранить изменения' : 'Создать лот'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 