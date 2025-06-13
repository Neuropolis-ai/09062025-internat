'use client';

import { useState, useEffect } from 'react';

interface Contract {
  id: string;
  title: string;
  description: string;
  rewardAmount: number;
  requirements?: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  deadline?: string;
  maxParticipants: number;
  createdAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
  };
  _count: {
    bids: number;
  };
}

interface ContractFormData {
  title: string;
  description: string;
  category: string;
  rewardAmount: number;
  requirements?: string;
  deadline?: string;
  maxParticipants: number;
}

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract?: Contract | null;
  onSave: (data: ContractFormData) => void;
}

export default function ContractModal({ isOpen, onClose, contract, onSave }: ContractModalProps) {
  const [formData, setFormData] = useState<ContractFormData>({
    title: '',
    description: '',
    category: '',
    rewardAmount: 0,
    requirements: '',
    deadline: '',
    maxParticipants: 1
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

  useEffect(() => {
    if (contract) {
      setFormData({
        title: contract.title,
        description: contract.description,
        category: contract.category,
        rewardAmount: contract.rewardAmount,
        requirements: contract.requirements || '',
        deadline: contract.deadline ? contract.deadline.slice(0, 16) : '',
        maxParticipants: contract.maxParticipants
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        title: '',
        description: '',
        category: '',
        rewardAmount: 0,
        requirements: '',
        deadline: tomorrow.toISOString().slice(0, 16),
        maxParticipants: 1
      });
    }
  }, [contract]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.title.trim()) {
      alert('Введите название контракта');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Введите описание контракта');
      return;
    }
    
    if (!formData.category) {
      alert('Выберите категорию');
      return;
    }
    
    if (formData.rewardAmount <= 0) {
      alert('Введите корректную сумму вознаграждения');
      return;
    }
    
    if (formData.maxParticipants <= 0) {
      alert('Введите корректное количество участников');
      return;
    }
    
    if (formData.deadline) {
      const deadline = new Date(formData.deadline);
      const today = new Date();
      
      if (deadline <= today) {
        alert('Дедлайн должен быть в будущем');
        return;
      }
    }

    onSave(formData);
    onClose();
  };

  const handleInputChange = (field: keyof ContractFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md admin-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {contract ? 'Редактировать контракт' : 'Создать новый контракт'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Название контракта */}
          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">
              Название контракта *
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
              Описание *
            </label>
            <textarea
              required
              rows={4}
              className="admin-input w-full resize-none"
              placeholder="Подробное описание задач и условий выполнения контракта"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          {/* Требования */}
          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">
              Требования к исполнителю
            </label>
            <textarea
              rows={3}
              className="admin-input w-full resize-none"
              placeholder="Специальные навыки, опыт или требования для выполнения контракта"
              value={formData.requirements || ''}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
            />
          </div>

          {/* Категория и Вознаграждение */}
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
                Вознаграждение (L-Coin) *
              </label>
              <input
                type="number"
                required
                min="1"
                className="admin-input w-full"
                placeholder="50"
                value={formData.rewardAmount || ''}
                onChange={(e) => handleInputChange('rewardAmount', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Максимальное количество участников и Дедлайн */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">
                Максимальное количество участников *
              </label>
              <input
                type="number"
                required
                min="1"
                max="10"
                className="admin-input w-full"
                value={formData.maxParticipants || ''}
                onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 1)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-secondary mb-2">
                Дедлайн
              </label>
              <input
                type="datetime-local"
                className="admin-input w-full"
                value={formData.deadline || ''}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
              />
            </div>
          </div>

          {/* Превью контракта */}
          {formData.title && formData.rewardAmount > 0 && (
            <div className="p-4 rounded-md" style={{ backgroundColor: 'var(--background-light)' }}>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Превью контракта:</h4>
              <div className="admin-card">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-medium text-gray-900">
                      {formData.title}
                    </h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Открыт
                    </span>
                  </div>
                  
                  <p className="admin-text-secondary text-sm mb-4">
                    {formData.description}
                  </p>

                  <div className="text-sm space-y-2">
                    <div className="flex items-center">
                      <span className="mr-1">💰</span>
                      {formData.rewardAmount} L-Coin
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">👥</span>
                      до {formData.maxParticipants} участников
                    </div>
                    {formData.deadline && (
                      <div className="flex items-center">
                        <span className="mr-1">📅</span>
                        до {new Date(formData.deadline).toLocaleDateString('ru-RU')}
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="mr-1">🏷️</span>
                      {formData.category}
                    </div>
                  </div>

                  {formData.requirements && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Требования:</strong> {formData.requirements}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="admin-button-secondary px-4 py-2 text-sm font-medium rounded-md"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="admin-button-primary px-4 py-2 text-sm font-medium rounded-md"
              style={{ backgroundColor: 'var(--primary-burgundy)' }}
            >
              {contract ? 'Сохранить изменения' : 'Создать контракт'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 