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
  startPrice: number;
  category: string;
  image: string;
  duration: number; // в часах
  seller: string;
  minBidStep: number;
}

interface AuctionLot {
  id: number;
  title: string;
  description: string;
  startPrice: number;
  currentPrice: number;
  category: string;
  image: string;
  status: 'active' | 'completed' | 'upcoming';
  endDate: string;
  bidsCount: number;
  winner?: string;
  seller: string;
}

const categories = ["Одежда", "Канцтовары", "Сувениры", "Книги", "Игры", "Прочее"];
const sellers = ["Администрация", "Учебная часть", "Творческая мастерская", "Литературный клуб", "Совет учеников", "Спортивный клуб"];
const availableEmojis = ["👕", "📝", "☕", "📚", "🎲", "🏅", "🎖️", "🖊️", "📓", "📔", "🍫", "🧃", "💼", "🎨", "🎭"];

export default function AuctionModal({ isOpen, onClose, onSave, editLot }: AuctionModalProps) {
  const [formData, setFormData] = useState<LotFormData>({
    title: '',
    description: '',
    startPrice: 0,
    category: '',
    image: '🎯',
    duration: 24,
    seller: '',
    minBidStep: 10
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Заполнение формы при редактировании
  useEffect(() => {
    if (editLot) {
      setFormData({
        title: editLot.title,
        description: editLot.description,
        startPrice: editLot.startPrice,
        category: editLot.category,
        image: editLot.image,
        duration: 24, // можно высчитать из endDate
        seller: editLot.seller,
        minBidStep: 10 // значение по умолчанию
      });
    } else {
      setFormData({
        title: '',
        description: '',
        startPrice: 0,
        category: '',
        image: '🎯',
        duration: 24,
        seller: '',
        minBidStep: 10
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
    if (formData.startPrice <= 0) {
      newErrors.startPrice = 'Стартовая цена должна быть больше 0';
    }
    if (!formData.category) {
      newErrors.category = 'Выберите категорию';
    }
    if (!formData.seller) {
      newErrors.seller = 'Выберите продавца';
    }
    if (formData.duration <= 0) {
      newErrors.duration = 'Длительность должна быть больше 0';
    }
    if (formData.minBidStep <= 0) {
      newErrors.minBidStep = 'Минимальный шаг ставки должен быть больше 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      handleCancel();
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      startPrice: 0,
      category: '',
      image: '🎯',
      duration: 24,
      seller: '',
      minBidStep: 10
    });
    setErrors({});
    onClose();
  };

  const calculateEndDate = () => {
    const now = new Date();
    const endDate = new Date(now.getTime() + formData.duration * 60 * 60 * 1000);
    return endDate.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Категория *
            </label>
            <select
              id="category"
              className={`admin-input w-full ${errors.category ? 'border-red-500' : ''}`}
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">Выберите категорию</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
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
            <label htmlFor="startPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Стартовая цена (токены) *
            </label>
            <input
              type="number"
              id="startPrice"
              min="1"
              className={`admin-input w-full ${errors.startPrice ? 'border-red-500' : ''}`}
              value={formData.startPrice || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, startPrice: parseInt(e.target.value) || 0 }))}
              placeholder="Начальная цена в токенах"
            />
            {errors.startPrice && <p className="text-red-500 text-xs mt-1">{errors.startPrice}</p>}
          </div>

          <div>
            <label htmlFor="minBidStep" className="block text-sm font-medium text-gray-700 mb-1">
              Минимальный шаг ставки *
            </label>
            <input
              type="number"
              id="minBidStep"
              min="1"
              className={`admin-input w-full ${errors.minBidStep ? 'border-red-500' : ''}`}
              value={formData.minBidStep || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, minBidStep: parseInt(e.target.value) || 0 }))}
              placeholder="Минимальный шаг ставки"
            />
            {errors.minBidStep && <p className="text-red-500 text-xs mt-1">{errors.minBidStep}</p>}
          </div>
        </div>

        {/* Продавец и длительность */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="seller" className="block text-sm font-medium text-gray-700 mb-1">
              Продавец *
            </label>
            <select
              id="seller"
              className={`admin-input w-full ${errors.seller ? 'border-red-500' : ''}`}
              value={formData.seller}
              onChange={(e) => setFormData(prev => ({ ...prev, seller: e.target.value }))}
            >
              <option value="">Выберите продавца</option>
              {sellers.map(seller => (
                <option key={seller} value={seller}>{seller}</option>
              ))}
            </select>
            {errors.seller && <p className="text-red-500 text-xs mt-1">{errors.seller}</p>}
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Длительность (часы) *
            </label>
            <select
              id="duration"
              className={`admin-input w-full ${errors.duration ? 'border-red-500' : ''}`}
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            >
              <option value={1}>1 час</option>
              <option value={6}>6 часов</option>
              <option value={12}>12 часов</option>
              <option value={24}>1 день</option>
              <option value={48}>2 дня</option>
              <option value={72}>3 дня</option>
              <option value={168}>1 неделя</option>
            </select>
            {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
          </div>
        </div>

        {/* Выбор изображения */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Изображение лота
          </label>
          <div className="grid grid-cols-5 gap-3">
            {availableEmojis.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, image: emoji }))}
                className={`p-3 rounded-md border text-2xl transition-colors ${
                  formData.image === emoji
                    ? 'border-burgundy bg-burgundy/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{
                  borderColor: formData.image === emoji ? 'var(--primary-burgundy)' : undefined,
                  backgroundColor: formData.image === emoji ? 'rgba(139, 36, 57, 0.1)' : undefined
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Превью лота */}
        {formData.title && formData.startPrice > 0 && formData.seller && (
          <div className="p-4 rounded-md" style={{ backgroundColor: 'var(--background-light)' }}>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Превью лота:</h4>
            <div className="admin-card">
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Предстоящий
                  </span>
                  <span className="text-xs admin-text-secondary">
                    {formData.duration}ч
                  </span>
                </div>

                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center text-4xl"
                       style={{ backgroundColor: 'white' }}>
                    {formData.image}
                  </div>
                </div>
                
                <div className="text-center">
                  <h5 className="text-lg font-medium text-gray-900 mb-1">{formData.title}</h5>
                  <p className="text-sm admin-text-secondary mb-3">{formData.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-secondary">Стартовая цена:</span>
                      <span className="font-bold" style={{ color: 'var(--primary-burgundy)' }}>
                        {formData.startPrice} токенов
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-secondary">Шаг ставки:</span>
                      <span className="font-medium">{formData.minBidStep} токенов</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-secondary">Продавец:</span>
                      <span className="font-medium">{formData.seller}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-secondary">Категория:</span>
                      <span className="font-medium">{formData.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="admin-text-secondary">Завершится:</span>
                      <span className="font-medium">{calculateEndDate()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Кнопки */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border admin-border rounded-md hover:bg-gray-50 transition-colors"
          >
            Отменить
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