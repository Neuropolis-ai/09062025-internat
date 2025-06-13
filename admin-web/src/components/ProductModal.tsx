'use client';

import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: ProductFormData) => Promise<void>;
  editProduct?: Product | null;
  categories: {id: string, name: string}[];
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stockQuantity: number;
  imageUrl?: string;
  isActive: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: {
    id: string;
    name: string;
    description?: string;
  };
  stockQuantity: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const availableEmojis = ["🖊️", "📓", "📔", "📝", "✏️", "🍫", "🍪", "🍎", "🧃", "☕", "🥤", "🏅", "🎖️", "📚", "💼"];

export default function ProductModal({ isOpen, onClose, onSave, editProduct, categories }: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    stockQuantity: 0,
    imageUrl: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Заполнение формы при редактировании
  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name,
        description: editProduct.description,
        price: parseInt(editProduct.price) || 0,
        categoryId: editProduct.category.id,
        stockQuantity: editProduct.stockQuantity,
        imageUrl: editProduct.imageUrl || '',
        isActive: editProduct.isActive
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        stockQuantity: 0,
        imageUrl: '',
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
    if (!formData.categoryId) {
      newErrors.categoryId = 'Выберите категорию';
    }
    if (formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Количество не может быть отрицательным';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setSaving(true);
        await onSave(formData);
        handleCancel();
      } catch (error) {
        console.error('Ошибка при сохранении:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      stockQuantity: 0,
      imageUrl: '',
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
              disabled={saving}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Категория *
            </label>
            <select
              id="categoryId"
              className={`admin-input w-full ${errors.categoryId ? 'border-red-500' : ''}`}
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              disabled={saving}
            >
              <option value="">Выберите категорию</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
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
            disabled={saving}
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
              disabled={saving}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
              Количество на складе *
            </label>
            <input
              type="number"
              id="stockQuantity"
              min="0"
              className={`admin-input w-full ${errors.stockQuantity ? 'border-red-500' : ''}`}
              value={formData.stockQuantity || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))}
              placeholder="Количество товара"
              disabled={saving}
            />
            {errors.stockQuantity && <p className="text-red-500 text-xs mt-1">{errors.stockQuantity}</p>}
          </div>
        </div>

        {/* URL изображения */}
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
            disabled={saving}
          />
          <p className="text-xs text-gray-500 mt-1">
            Оставьте пустым для отображения иконки по умолчанию
          </p>
        </div>

        {/* Статус */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            disabled={saving}
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Товар активен (доступен для покупки)
          </label>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={saving}
          >
            Отменить
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Сохранение...' : (isEditing ? 'Обновить' : 'Добавить')}
          </button>
        </div>
      </form>
    </Modal>
  );
} 