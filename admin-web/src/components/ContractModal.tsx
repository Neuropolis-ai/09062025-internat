'use client';

import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contractData: ContractFormData) => void;
  editContract?: Contract | null;
}

interface ContractFormData {
  title: string;
  description: string;
  budget: number;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline: string;
  department: string;
  requirements: string;
  documents: string[];
  estimatedDuration: number; // в днях
}

interface Contract {
  id: number;
  title: string;
  description: string;
  budget: number;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
  deadline: string;
  createdAt: string;
  department: string;
  executor?: string;
  progress: number;
  documentsCount: number;
  participantsCount: number;
}

const categories = ["Оборудование", "Строительство", "Канцтовары", "Услуги", "Мебель", "Транспорт"];
const departments = ["IT-отдел", "Хозяйственная часть", "Учебная часть", "Администрация", "Библиотека", "Спортивный отдел"];
const priorityOptions = [
  { value: 'low', label: 'Низкий', color: 'bg-gray-100 text-gray-600' },
  { value: 'medium', label: 'Средний', color: 'bg-blue-100 text-blue-600' },
  { value: 'high', label: 'Высокий', color: 'bg-orange-100 text-orange-600' },
  { value: 'urgent', label: 'Срочно', color: 'bg-red-100 text-red-600' }
];

const commonDocuments = [
  "Техническое задание",
  "Смета расходов", 
  "Спецификация товаров/услуг",
  "Требования к участникам",
  "Проект договора",
  "Гарантийные обязательства",
  "Сертификаты качества",
  "Лицензии и разрешения"
];

export default function ContractModal({ isOpen, onClose, onSave, editContract }: ContractModalProps) {
  const [formData, setFormData] = useState<ContractFormData>({
    title: '',
    description: '',
    budget: 0,
    category: '',
    priority: 'medium',
    deadline: '',
    department: '',
    requirements: '',
    documents: [],
    estimatedDuration: 30
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Заполнение формы при редактировании
  useEffect(() => {
    if (editContract) {
      setFormData({
        title: editContract.title,
        description: editContract.description,
        budget: editContract.budget,
        category: editContract.category,
        priority: editContract.priority,
        deadline: editContract.deadline.split('T')[0], // преобразуем к формату YYYY-MM-DD
        department: editContract.department,
        requirements: 'Требования будут загружены при редактировании',
        documents: commonDocuments.slice(0, editContract.documentsCount),
        estimatedDuration: 30
      });
    } else {
      setFormData({
        title: '',
        description: '',
        budget: 0,
        category: '',
        priority: 'medium',
        deadline: '',
        department: '',
        requirements: '',
        documents: [],
        estimatedDuration: 30
      });
    }
    setErrors({});
  }, [editContract, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название заказа обязательно';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    }
    if (formData.budget <= 0) {
      newErrors.budget = 'Бюджет должен быть больше 0';
    }
    if (!formData.category) {
      newErrors.category = 'Выберите категорию';
    }
    if (!formData.department) {
      newErrors.department = 'Выберите отдел';
    }
    if (!formData.deadline) {
      newErrors.deadline = 'Укажите срок выполнения';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      if (deadlineDate <= today) {
        newErrors.deadline = 'Срок выполнения должен быть в будущем';
      }
    }
    if (!formData.requirements.trim()) {
      newErrors.requirements = 'Опишите требования к заказу';
    }
    if (formData.estimatedDuration <= 0) {
      newErrors.estimatedDuration = 'Срок выполнения должен быть больше 0';
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
      budget: 0,
      category: '',
      priority: 'medium',
      deadline: '',
      department: '',
      requirements: '',
      documents: [],
      estimatedDuration: 30
    });
    setErrors({});
    onClose();
  };

  const handleDocumentToggle = (document: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.includes(document)
        ? prev.documents.filter(d => d !== document)
        : [...prev.documents, document]
    }));
  };

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateDeadlineFromDuration = () => {
    const today = new Date();
    const deadline = new Date(today.getTime() + formData.estimatedDuration * 24 * 60 * 60 * 1000);
    return deadline.toISOString().split('T')[0];
  };

  const isEditing = !!editContract;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleCancel} 
      title={isEditing ? "Редактировать заказ" : "Создать госзаказ"} 
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Название заказа *
            </label>
            <input
              type="text"
              id="title"
              className={`admin-input w-full ${errors.title ? 'border-red-500' : ''}`}
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Введите название госзаказа"
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
            Описание заказа *
          </label>
          <textarea
            id="description"
            rows={3}
            className={`admin-input w-full resize-none ${errors.description ? 'border-red-500' : ''}`}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Подробное описание требований к заказу"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Бюджет и отдел */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
              Бюджет (рубли) *
            </label>
            <input
              type="number"
              id="budget"
              min="1"
              className={`admin-input w-full ${errors.budget ? 'border-red-500' : ''}`}
              value={formData.budget || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
              placeholder="Сумма в рублях"
            />
            {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
            {formData.budget > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Примерно: {formatBudget(formData.budget)}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Отдел-заказчик *
            </label>
            <select
              id="department"
              className={`admin-input w-full ${errors.department ? 'border-red-500' : ''}`}
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            >
              <option value="">Выберите отдел</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
          </div>
        </div>

        {/* Приоритет и сроки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Приоритет
            </label>
            <select
              id="priority"
              className="admin-input w-full"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                priorityOptions.find(p => p.value === formData.priority)?.color || 'bg-gray-100 text-gray-600'
              }`}>
                {priorityOptions.find(p => p.value === formData.priority)?.label || 'Средний'}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 mb-1">
              Срок выполнения (дни)
            </label>
            <input
              type="number"
              id="estimatedDuration"
              min="1"
              max="365"
              className={`admin-input w-full ${errors.estimatedDuration ? 'border-red-500' : ''}`}
              value={formData.estimatedDuration || ''}
              onChange={(e) => {
                const duration = parseInt(e.target.value) || 0;
                setFormData(prev => ({ 
                  ...prev, 
                  estimatedDuration: duration,
                  deadline: duration > 0 ? calculateDeadlineFromDuration() : prev.deadline
                }));
              }}
              placeholder="Количество дней"
            />
            {errors.estimatedDuration && <p className="text-red-500 text-xs mt-1">{errors.estimatedDuration}</p>}
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Дедлайн *
            </label>
            <input
              type="date"
              id="deadline"
              className={`admin-input w-full ${errors.deadline ? 'border-red-500' : ''}`}
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
          </div>
        </div>

        {/* Требования */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
            Требования к заказу *
          </label>
          <textarea
            id="requirements"
            rows={4}
            className={`admin-input w-full resize-none ${errors.requirements ? 'border-red-500' : ''}`}
            value={formData.requirements}
            onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
            placeholder="Детальные требования к поставщику, качеству, срокам, гарантиям и т.д."
          />
          {errors.requirements && <p className="text-red-500 text-xs mt-1">{errors.requirements}</p>}
        </div>

        {/* Необходимые документы */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Необходимые документы
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {commonDocuments.map(document => (
              <label key={document} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.documents.includes(document)}
                  onChange={() => handleDocumentToggle(document)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{document}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Выбрано документов: {formData.documents.length}
          </p>
        </div>

        {/* Превью заказа */}
        {formData.title && formData.budget > 0 && formData.department && (
          <div className="p-4 rounded-md" style={{ backgroundColor: 'var(--background-light)' }}>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Превью заказа:</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm admin-text-secondary">Название:</span>
                <span className="text-sm font-medium">{formData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm admin-text-secondary">Бюджет:</span>
                <span className="text-sm font-bold" style={{ color: 'var(--primary-burgundy)' }}>
                  {formatBudget(formData.budget)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm admin-text-secondary">Категория:</span>
                <span className="text-sm font-medium">{formData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm admin-text-secondary">Отдел:</span>
                <span className="text-sm font-medium">{formData.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm admin-text-secondary">Приоритет:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  priorityOptions.find(p => p.value === formData.priority)?.color || 'bg-gray-100 text-gray-600'
                }`}>
                  {priorityOptions.find(p => p.value === formData.priority)?.label || 'Средний'}
                </span>
              </div>
              {formData.deadline && (
                <div className="flex justify-between">
                  <span className="text-sm admin-text-secondary">Дедлайн:</span>
                  <span className="text-sm font-medium">
                    {new Date(formData.deadline).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm admin-text-secondary">Документов:</span>
                <span className="text-sm font-medium">{formData.documents.length}</span>
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
            {isEditing ? 'Сохранить изменения' : 'Создать заказ'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 