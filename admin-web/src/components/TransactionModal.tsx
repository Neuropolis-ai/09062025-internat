'use client';

import React, { useState } from 'react';
import Modal from './ui/Modal';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transactionData: TransactionFormData) => void;
}

interface TransactionFormData {
  studentName: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  category: string;
}

// Список учеников (в реальном приложении будет из API)
const students = [
  'Иванов Алексей Петрович',
  'Петрова Мария Сергеевна', 
  'Сидоров Дмитрий Александрович',
  'Козлова Екатерина Михайловна',
  'Морозов Артем Владимирович'
];

// Категории операций
const creditCategories = [
  'Поощрение за учебу',
  'Участие в конкурсе',
  'Победа в олимпиаде',
  'Дисциплина',
  'Общественная работа',
  'Спортивные достижения',
  'Творческая деятельность',
  'Прочее'
];

const debitCategories = [
  'Покупка в L-shop',
  'Оплата мероприятия',
  'Штраф за нарушение',
  'Покупка канцтоваров',
  'Услуги столовой',
  'Развлечения',
  'Прочее'
];

export default function TransactionModal({ isOpen, onClose, onSave }: TransactionModalProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    studentName: '',
    type: 'credit',
    amount: 0,
    description: '',
    category: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentName) {
      newErrors.studentName = 'Выберите ученика';
    }
    if (formData.amount <= 0) {
      newErrors.amount = 'Сумма должна быть больше 0';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    }
    if (!formData.category) {
      newErrors.category = 'Выберите категорию';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      // Сброс формы
      setFormData({
        studentName: '',
        type: 'credit',
        amount: 0,
        description: '',
        category: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleCancel = () => {
    // Сброс формы при отмене
    setFormData({
      studentName: '',
      type: 'credit',
      amount: 0,
      description: '',
      category: ''
    });
    setErrors({});
    onClose();
  };

  const handleTypeChange = (newType: 'credit' | 'debit') => {
    setFormData(prev => ({
      ...prev,
      type: newType,
      category: '' // Сброс категории при смене типа
    }));
  };

  const currentCategories = formData.type === 'credit' ? creditCategories : debitCategories;

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Новая транзакция" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Выбор ученика */}
        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
            Ученик *
          </label>
          <select
            id="studentName"
            className={`admin-input w-full ${errors.studentName ? 'border-red-500' : ''}`}
            value={formData.studentName}
            onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
          >
            <option value="">Выберите ученика</option>
            {students.map(student => (
              <option key={student} value={student}>{student}</option>
            ))}
          </select>
          {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName}</p>}
        </div>

        {/* Тип операции */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Тип операции *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange('credit')}
              className={`p-3 rounded-md border text-sm font-medium transition-colors ${
                formData.type === 'credit'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              💰 Поступление
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('debit')}
              className={`p-3 rounded-md border text-sm font-medium transition-colors ${
                formData.type === 'debit'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              💸 Списание
            </button>
          </div>
        </div>

        {/* Сумма */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Сумма (токены) *
          </label>
          <input
            type="number"
            id="amount"
            min="1"
            className={`admin-input w-full ${errors.amount ? 'border-red-500' : ''}`}
            value={formData.amount || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
            placeholder="Введите сумму"
          />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
        </div>

        {/* Категория */}
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
            {currentCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
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
            placeholder="Подробное описание операции"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Превью транзакции */}
        {formData.studentName && formData.amount > 0 && (
          <div className="p-4 rounded-md" style={{ backgroundColor: 'var(--background-light)' }}>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Превью транзакции:</h4>
            <div className="text-sm text-gray-600">
              <p><strong>Ученик:</strong> {formData.studentName}</p>
              <p><strong>Операция:</strong> {formData.type === 'credit' ? '💰 Поступление' : '💸 Списание'}</p>
              <p><strong>Сумма:</strong> 
                <span className={formData.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                  {formData.type === 'credit' ? '+' : '-'}{formData.amount.toLocaleString()} токенов
                </span>
              </p>
              {formData.category && <p><strong>Категория:</strong> {formData.category}</p>}
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
            Создать транзакцию
          </button>
        </div>
      </form>
    </Modal>
  );
} 