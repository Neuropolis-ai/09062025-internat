'use client';

import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: ProductFormData) => void;
  editProduct?: Product | null;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  isActive: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  isActive: boolean;
}

const categories = ["Канцтовары", "Еда", "Напитки", "Сувениры"];
const availableEmojis = ["🖊️", "📓", "📔", "📝", "✏️", "🍫", "🍪", "🍎", "🧃", "☕", "🥤", "🏅", "🎖️", "📚", "💼"];

export default function ProductModal({ isOpen, onClose, onSave, editProduct }: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    image: '📦',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Заполнение формы при редактировании
  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name,
        description: editProduct.description,
        price: editProduct.price,
        category: editProduct.category,
        stock: editProduct.stock,
        image: editProduct.image,
        isActive: editProduct.isActive
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
        image: '📦',
        isActive: true
      });
    }
    setErrors({});
  }, [editProduct, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название товара обязательно';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Цена должна быть больше 0';
    }
    if (!formData.category) {
      newErrors.category = 'Выберите категорию';
    }
    if (formData.stock < 0) {
      newErrors.stock = 'Количество не может быть отрицательным';
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
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      image: '📦',
      isActive: true
    });
    setErrors({});
    onClose();
  };

  const isEditing = !!editProduct;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleCancel} 
      title={isEditing ? "Редактировать товар" : "Добавить товар"} 
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Название товара *
            </label>
            <input
              type="text"
              id="name"
              className={`admin-input w-full ${errors.name ? 'border-red-500' : ''}`}
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Введите название товара"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
            Описание *
          </label>
          <textarea
            id="description"
            rows={3}
            className={`admin-input w-full resize-none ${errors.description ? 'border-red-500' : ''}`}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Подробное описание товара"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Цена и количество */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Цена (токены) *
            </label>
            <input
              type="number"
              id="price"
              min="1"
              className={`admin-input w-full ${errors.price ? 'border-red-500' : ''}`}
              value={formData.price || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
              placeholder="Цена в токенах"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Количество на складе
            </label>
            <input
              type="number"
              id="stock"
              min="0"
              className={`admin-input w-full ${errors.stock ? 'border-red-500' : ''}`}
              value={formData.stock || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
              placeholder="Количество товара"
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
          </div>
        </div>

        {/* Выбор изображения */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Изображение товара
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

        {/* Статус активности */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Товар активен (доступен для покупки)
            </span>
          </label>
        </div>

        {/* Превью товара */}
        {formData.name && formData.price > 0 && (
          <div className="p-4 rounded-md" style={{ backgroundColor: 'var(--background-light)' }}>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Превью товара:</h4>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                   style={{ backgroundColor: 'white' }}>
                {formData.image}
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{formData.name}</h5>
                <p className="text-sm admin-text-secondary">{formData.description}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm font-bold" style={{ color: 'var(--primary-burgundy)' }}>
                    {formData.price} токенов
                  </span>
                  <span className="text-xs admin-text-secondary">
                    {formData.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    formData.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {formData.stock > 0 ? `В наличии: ${formData.stock}` : 'Нет в наличии'}
                  </span>
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
            {isEditing ? 'Сохранить изменения' : 'Добавить товар'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 