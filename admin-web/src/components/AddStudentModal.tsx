'use client';

import React, { useState } from 'react';
import Modal from './ui/Modal';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: StudentFormData) => void;
}

interface StudentFormData {
  fullName: string;
  class: string;
  cottage: string;
  tokensAccount: number;
  tokensCredit: number;
  membership: string;
  positions: string[];
  achievements: string[];
}

const cottages = ['Альфа', 'Бета', 'Гамма', 'Дельта', 'Эпсилон'];
const classes = ['9А', '9Б', '9В', '10А', '10Б', '10В', '11А', '11Б', '11В'];
const memberships = ['Ученик', 'Староста', 'Заместитель старосты', 'Дежурный'];
const availablePositions = ['Президент', 'Вице-президент', 'Министр образования', 'Министр культуры', 'Министр спорта'];
const availableAchievements = ['Отличник', 'Спортсмен', 'Активист', 'Творческая личность', 'Лидер'];

export default function AddStudentModal({ isOpen, onClose, onSave }: AddStudentModalProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    fullName: '',
    class: '',
    cottage: '',
    tokensAccount: 0,
    tokensCredit: 0,
    membership: '',
    positions: [],
    achievements: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Фамилия и имя обязательны';
    }
    if (!formData.class) {
      newErrors.class = 'Выберите класс';
    }
    if (!formData.cottage) {
      newErrors.cottage = 'Выберите коттедж';
    }
    if (formData.tokensAccount < 0) {
      newErrors.tokensAccount = 'Токены не могут быть отрицательными';
    }
    if (formData.tokensCredit < 0) {
      newErrors.tokensCredit = 'Токены не могут быть отрицательными';
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
        fullName: '',
        class: '',
        cottage: '',
        tokensAccount: 0,
        tokensCredit: 0,
        membership: '',
        positions: [],
        achievements: []
      });
      setErrors({});
      onClose();
    }
  };

  const handleCancel = () => {
    // Сброс формы при отмене
    setFormData({
      fullName: '',
      class: '',
      cottage: '',
      tokensAccount: 0,
      tokensCredit: 0,
      membership: '',
      positions: [],
      achievements: []
    });
    setErrors({});
    onClose();
  };

  const handlePositionToggle = (position: string) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.includes(position)
        ? prev.positions.filter(p => p !== position)
        : [...prev.positions, position]
    }));
  };

  const handleAchievementToggle = (achievement: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.includes(achievement)
        ? prev.achievements.filter(a => a !== achievement)
        : [...prev.achievements, achievement]
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Добавить ученика" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Фамилия Имя Отчество *
            </label>
            <input
              type="text"
              id="fullName"
              className={`admin-input w-full ${errors.fullName ? 'border-red-500' : ''}`}
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Введите ФИО ученика"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
              Класс *
            </label>
            <select
              id="class"
              className={`admin-input w-full ${errors.class ? 'border-red-500' : ''}`}
              value={formData.class}
              onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
            >
              <option value="">Выберите класс</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cottage" className="block text-sm font-medium text-gray-700 mb-1">
              Коттедж *
            </label>
            <select
              id="cottage"
              className={`admin-input w-full ${errors.cottage ? 'border-red-500' : ''}`}
              value={formData.cottage}
              onChange={(e) => setFormData(prev => ({ ...prev, cottage: e.target.value }))}
            >
              <option value="">Выберите коттедж</option>
              {cottages.map(cottage => (
                <option key={cottage} value={cottage}>{cottage}</option>
              ))}
            </select>
            {errors.cottage && <p className="text-red-500 text-xs mt-1">{errors.cottage}</p>}
          </div>

          <div>
            <label htmlFor="membership" className="block text-sm font-medium text-gray-700 mb-1">
              Принадлежность
            </label>
            <select
              id="membership"
              className="admin-input w-full"
              value={formData.membership}
              onChange={(e) => setFormData(prev => ({ ...prev, membership: e.target.value }))}
            >
              <option value="">Выберите принадлежность</option>
              {memberships.map(membership => (
                <option key={membership} value={membership}>{membership}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Токены */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tokensAccount" className="block text-sm font-medium text-gray-700 mb-1">
              Токены расчетный счет
            </label>
            <input
              type="number"
              id="tokensAccount"
              min="0"
              className={`admin-input w-full ${errors.tokensAccount ? 'border-red-500' : ''}`}
              value={formData.tokensAccount}
              onChange={(e) => setFormData(prev => ({ ...prev, tokensAccount: parseInt(e.target.value) || 0 }))}
              placeholder="0"
            />
            {errors.tokensAccount && <p className="text-red-500 text-xs mt-1">{errors.tokensAccount}</p>}
          </div>

          <div>
            <label htmlFor="tokensCredit" className="block text-sm font-medium text-gray-700 mb-1">
              Токены кредитный счет
            </label>
            <input
              type="number"
              id="tokensCredit"
              min="0"
              className={`admin-input w-full ${errors.tokensCredit ? 'border-red-500' : ''}`}
              value={formData.tokensCredit}
              onChange={(e) => setFormData(prev => ({ ...prev, tokensCredit: parseInt(e.target.value) || 0 }))}
              placeholder="0"
            />
            {errors.tokensCredit && <p className="text-red-500 text-xs mt-1">{errors.tokensCredit}</p>}
          </div>
        </div>

        {/* Должности */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Должности
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availablePositions.map(position => (
              <label key={position} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.positions.includes(position)}
                  onChange={() => handlePositionToggle(position)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{position}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Достижения */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Достижения
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableAchievements.map(achievement => (
              <label key={achievement} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.achievements.includes(achievement)}
                  onChange={() => handleAchievementToggle(achievement)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{achievement}</span>
              </label>
            ))}
          </div>
        </div>

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
            Сохранить
          </button>
        </div>
      </form>
    </Modal>
  );
} 