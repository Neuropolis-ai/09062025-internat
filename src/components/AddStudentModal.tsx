'use client';

import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';

interface Student {
  id: string;
  fullName: string;
  class: string;
  cottage: string;
  linn: string;
  accountTokens: number;
  creditTokens: number;
  achievements: string[];
  positions: string[];
  belongsTo: string;
  createdAt: string;
}

interface StudentFormData {
  fullName: string;
  class: string;
  cottage: string;
  accountTokens: number;
  creditTokens: number;
  achievements: string[];
  positions: string[];
  belongsTo: string;
}

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null;
  onSave: (data: StudentFormData) => void;
}

export default function AddStudentModal({ isOpen, onClose, student, onSave }: AddStudentModalProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    fullName: '',
    class: '',
    cottage: '',
    accountTokens: 0,
    creditTokens: 0,
    achievements: [],
    positions: [],
    belongsTo: ''
  });

  const [newAchievement, setNewAchievement] = useState('');
  const [newPosition, setNewPosition] = useState('');

  // Опции для выбора
  const classes = [
    '8А', '8Б', '8В', '9А', '9Б', '9В', '10А', '10Б', '10В', '11А', '11Б', '11В'
  ];

  const cottages = [
    'Аргон', 'Гелий', 'Неон', 'Криптон', 'Ксенон'
  ];

  const belongsToOptions = [
    'Дом Аргон', 'Дом Гелий', 'Дом Неон', 'Дом Криптон', 'Дом Ксенон'
  ];

  const predefinedAchievements = [
    'Отличник учебы', 'Активист года', 'Лучший в спорте', 'Творческий лидер',
    'Технический лидер', 'Социальный активист', 'Победитель олимпиады',
    'Лучший дебютант', 'Золотая медаль', 'Серебряная медаль'
  ];

  const predefinedPositions = [
    'Староста класса', 'Заместитель старосты', 'Физорг', 'Культорг',
    'Ответственный за дежурство', 'Глава совета', 'Помощник воспитателя',
    'Лидер спортивной секции', 'Редактор газеты'
  ];

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName,
        class: student.class,
        cottage: student.cottage,
        accountTokens: student.accountTokens,
        creditTokens: student.creditTokens,
        achievements: student.achievements,
        positions: student.positions,
        belongsTo: student.belongsTo
      });
    } else {
      setFormData({
        fullName: '',
        class: '',
        cottage: '',
        accountTokens: 0,
        creditTokens: 0,
        achievements: [],
        positions: [],
        belongsTo: ''
      });
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.fullName.trim()) {
      alert('Введите полное имя ученика');
      return;
    }
    
    if (!formData.class) {
      alert('Выберите класс');
      return;
    }
    
    if (!formData.cottage) {
      alert('Выберите коттедж');
      return;
    }
    
    if (!formData.belongsTo) {
      alert('Выберите принадлежность к дому');
      return;
    }
    
    if (formData.accountTokens < 0) {
      alert('Количество токенов на расчетном счете не может быть отрицательным');
      return;
    }
    
    if (formData.creditTokens < 0) {
      alert('Количество кредитных токенов не может быть отрицательным');
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleInputChange = (field: keyof StudentFormData, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addAchievement = (achievement: string) => {
    if (achievement && !formData.achievements.includes(achievement)) {
      handleInputChange('achievements', [...formData.achievements, achievement]);
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    const newAchievements = formData.achievements.filter((_, i) => i !== index);
    handleInputChange('achievements', newAchievements);
  };

  const addPosition = (position: string) => {
    if (position && !formData.positions.includes(position)) {
      handleInputChange('positions', [...formData.positions, position]);
      setNewPosition('');
    }
  };

  const removePosition = (index: number) => {
    const newPositions = formData.positions.filter((_, i) => i !== index);
    handleInputChange('positions', newPositions);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={student ? 'Редактировать ученика' : 'Добавить ученика'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">
              Фамилия Имя Отчество *
            </label>
            <input
              type="text"
              required
              className="admin-input w-full"
              placeholder="Иванов Петр Алексеевич"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">
              Класс *
            </label>
            <select
              required
              className="admin-input w-full"
              value={formData.class}
              onChange={(e) => handleInputChange('class', e.target.value)}
            >
              <option value="">Выберите класс</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Коттедж и принадлежность */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">
              Коттедж *
            </label>
            <select
              required
              className="admin-input w-full"
              value={formData.cottage}
              onChange={(e) => handleInputChange('cottage', e.target.value)}
            >
              <option value="">Выберите коттедж</option>
              {cottages.map(cottage => (
                <option key={cottage} value={cottage}>{cottage}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">
              Принадлежность *
            </label>
            <select
              required
              className="admin-input w-full"
              value={formData.belongsTo}
              onChange={(e) => handleInputChange('belongsTo', e.target.value)}
            >
              <option value="">Выберите дом</option>
              {belongsToOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Токены */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">
              💰 Токены (расчетный счет)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              className="admin-input w-full"
              placeholder="0"
              value={formData.accountTokens || ''}
              onChange={(e) => handleInputChange('accountTokens', parseInt(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium admin-text-secondary mb-2">
              🏦 Токены (кредитный счет)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              className="admin-input w-full"
              placeholder="0"
              value={formData.creditTokens || ''}
              onChange={(e) => handleInputChange('creditTokens', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Должности */}
        <div>
          <label className="block text-sm font-medium admin-text-secondary mb-2">
            👔 Должности
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <select
              className="admin-input"
              value=""
              onChange={(e) => addPosition(e.target.value)}
            >
              <option value="">Выберите должность</option>
              {predefinedPositions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>

            <div className="flex">
              <input
                type="text"
                className="admin-input flex-1"
                placeholder="Или введите свою должность"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addPosition(newPosition);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addPosition(newPosition)}
                className="ml-2 px-3 py-2 text-sm rounded-md"
                style={{ backgroundColor: 'var(--primary-burgundy)', color: 'white' }}
              >
                ➕
              </button>
            </div>
          </div>

          {formData.positions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.positions.map((position, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {position}
                  <button
                    type="button"
                    onClick={() => removePosition(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Достижения */}
        <div>
          <label className="block text-sm font-medium admin-text-secondary mb-2">
            🏆 Достижения
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <select
              className="admin-input"
              value=""
              onChange={(e) => addAchievement(e.target.value)}
            >
              <option value="">Выберите достижение</option>
              {predefinedAchievements.map(achievement => (
                <option key={achievement} value={achievement}>{achievement}</option>
              ))}
            </select>

            <div className="flex">
              <input
                type="text"
                className="admin-input flex-1"
                placeholder="Или введите свое достижение"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAchievement(newAchievement);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addAchievement(newAchievement)}
                className="ml-2 px-3 py-2 text-sm rounded-md"
                style={{ backgroundColor: 'var(--primary-burgundy)', color: 'white' }}
              >
                ➕
              </button>
            </div>
          </div>

          {formData.achievements.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.achievements.map((achievement, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  {achievement}
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Превью LINN */}
        {formData.fullName && formData.class && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-gray)' }}>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Превью данных ученика</h4>
            <div className="space-y-1 text-sm">
              <p><strong>ФИО:</strong> {formData.fullName}</p>
              <p><strong>Класс:</strong> {formData.class}</p>
              <p><strong>Коттедж:</strong> {formData.cottage}</p>
              <p><strong>Принадлежность:</strong> {formData.belongsTo}</p>
              <p><strong>Расчетный счет:</strong> {formData.accountTokens} L-Coin</p>
              <p><strong>Кредитный счет:</strong> {formData.creditTokens} L-Coin</p>
              {formData.positions.length > 0 && (
                <p><strong>Должности:</strong> {formData.positions.join(', ')}</p>
              )}
              {formData.achievements.length > 0 && (
                <p><strong>Достижения:</strong> {formData.achievements.join(', ')}</p>
              )}
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
            {student ? 'Обновить ученика' : 'Добавить ученика'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 