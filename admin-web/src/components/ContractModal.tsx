'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  minBid: number;
  deadline: string;
  department: string;
  priority: 'low' | 'medium' | 'high';
}

interface TaskFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  minBid: number;
  deadline: string;
  department: string;
  priority: 'low' | 'medium' | 'high';
}

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  onSave: (data: TaskFormData) => void;
}

export default function ContractModal({ isOpen, onClose, task, onSave }: ContractModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    category: '',
    price: 0,
    minBid: 0,
    deadline: '',
    department: '',
    priority: 'medium'
  });

  const categories = [
    'Спорт',
    'Образование', 
    'Творчество',
    'Общественная работа',
    'Техническое обеспечение',
    'Уборка',
    'Мероприятия',
    'Дежурство'
  ];

  const departments = [
    'Физкультурный отдел',
    'Библиотека',
    'Творческий отдел',
    'Хозяйственный отдел',
    'Технический отдел',
    'Учебный отдел',
    'Воспитательный отдел',
    'Административный отдел'
  ];

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        category: task.category,
        price: task.price,
        minBid: task.minBid,
        deadline: task.deadline,
        department: task.department,
        priority: task.priority
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        price: 0,
        minBid: 0,
        deadline: '',
        department: '',
        priority: 'medium'
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.title.trim()) {
      alert('Введите название задания');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Введите описание задания');
      return;
    }
    
    if (!formData.category) {
      alert('Выберите категорию');
      return;
    }
    
    if (!formData.department) {
      alert('Выберите отдел');
      return;
    }
    
    if (formData.price <= 0) {
      alert('Введите корректную стоимость');
      return;
    }
    
    if (formData.minBid <= 0) {
      alert('Введите корректную минимальную ставку');
      return;
    }
    
    if (formData.minBid > formData.price) {
      alert('Минимальная ставка не может быть больше стоимости');
      return;
    }
    
    if (!formData.deadline) {
      alert('Выберите дедлайн');
      return;
    }
    
    const deadline = new Date(formData.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deadline <= today) {
      alert('Дедлайн должен быть в будущем');
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleInputChange = (field: keyof TaskFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDate(tomorrow);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md admin-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {task ? 'Редактировать задание' : 'Создать новое задание'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Название задания */}
          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">
              Название задания *
            </label>
            <input
              type="text"
              required
              className="admin-input w-full"
              placeholder="Например: Организация утренней зарядки"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">
              Полное описание задания *
            </label>
            <textarea
              required
              rows={4}
              className="admin-input w-full"
              placeholder="Детальное описание того, что нужно сделать..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          {/* Категория и Отдел */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">
                Категория *
              </label>
              <select
                required
                className="admin-input w-full"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="">Выберите категорию</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">
                Ответственный отдел *
              </label>
              <select
                required
                className="admin-input w-full"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
              >
                <option value="">Выберите отдел</option>
                {departments.map(department => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Стоимость и минимальная ставка */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">
                💰 Стоимость (L-Coin) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="1"
                className="admin-input w-full"
                placeholder="25"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
              />
              <p className="text-xs admin-text-secondary mt-1">
                Максимальная сумма за выполнение
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">
                💰 Минимальная ставка (L-Coin) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="1"
                className="admin-input w-full"
                placeholder="15"
                value={formData.minBid || ''}
                onChange={(e) => handleInputChange('minBid', parseInt(e.target.value) || 0)}
              />
              <p className="text-xs admin-text-secondary mt-1">
                Минимум для подачи отклика
              </p>
            </div>
          </div>

          {/* Дедлайн и приоритет */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">
                📅 Дедлайн *
              </label>
              <input
                type="date"
                required
                min={getMinDate()}
                className="admin-input w-full"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">
                Приоритет
              </label>
              <select
                className="admin-input w-full"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as 'low' | 'medium' | 'high')}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
          </div>

          {/* Превью */}
          {formData.title && formData.price && formData.minBid && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-gray)' }}>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Превью задания</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Название:</strong> {formData.title}</p>
                {formData.category && <p><strong>Категория:</strong> {formData.category}</p>}
                {formData.department && <p><strong>Отдел:</strong> {formData.department}</p>}
                <p><strong>Стоимость:</strong> {formData.price} L-Coin</p>
                <p><strong>Минимальная ставка:</strong> {formData.minBid} L-Coin</p>
                {formData.deadline && (
                  <p><strong>Дедлайн:</strong> {new Date(formData.deadline).toLocaleDateString('ru-RU')}</p>
                )}
                <p><strong>Приоритет:</strong> {
                  formData.priority === 'low' ? 'Низкий' :
                  formData.priority === 'medium' ? 'Средний' : 'Высокий'
                }</p>
              </div>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ 
                borderColor: 'var(--divider)',
                color: 'var(--text-secondary)'
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="admin-button-primary px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: 'var(--primary-burgundy)' }}
            >
              {task ? 'Обновить задание' : 'Создать задание'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 