'use client';

import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import { useAdmin } from '../contexts/AdminContext';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: string;
  profileData?: {
    className?: string;
    cottage?: string;
    tokens?: number;
    tokensAccount?: number;
    tokensCredit?: number;
    phone?: string;
    membership?: string;
    positions?: string[];
    achievements?: string[];
  };
  isActive: boolean;
}

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: User | null;
}

const cottages = ['Альфа', 'Бета', 'Гамма', 'Дельта', 'Эпсилон'];
const classes = ['9А', '9Б', '9В', '10А', '10Б', '10В', '11А', '11Б', '11В'];
const memberships = ['Ученик', 'Староста', 'Заместитель старосты', 'Дежурный'];
const availablePositions = ['Президент', 'Вице-президент', 'Министр образования', 'Министр культуры', 'Министр спорта'];
const availableAchievements = ['Отличник', 'Спортсмен', 'Активист', 'Творческая личность', 'Лидер'];

export default function EditStudentModal({ isOpen, onClose, student }: EditStudentModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { updateUser, loading } = useAdmin();
  
  useEffect(() => {
    if (student) {
      setFormData({
        ...student,
        profileData: {
          className: student.profileData?.className || '',
          cottage: student.profileData?.cottage || '',
          tokens: student.profileData?.tokens || 0,
          tokensAccount: student.profileData?.tokensAccount || 0,
          tokensCredit: student.profileData?.tokensCredit || 0,
          phone: student.profileData?.phone || '',
          membership: student.profileData?.membership || '',
          positions: student.profileData?.positions || [],
          achievements: student.profileData?.achievements || [],
          ...student.profileData
        }
      });
    }
  }, [student]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'Имя обязательно';
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    }
    if (!formData.middleName?.trim()) {
      newErrors.middleName = 'Отчество обязательно';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    if (!validateForm()) {
      return;
    }

    try {
      await updateUser(student.id, formData);
      onClose();
    } catch (error) {
      console.error("Failed to update student", error);
      // Можно добавить обработку ошибок, например, показать уведомление
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        [name]: name === 'tokensAccount' || name === 'tokensCredit' ? parseInt(value) || 0 : value
      }
    }));
  };

  const handlePositionToggle = (position: string) => {
    setFormData(prev => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        positions: prev.profileData?.positions?.includes(position)
          ? prev.profileData.positions.filter(p => p !== position)
          : [...(prev.profileData?.positions || []), position]
      }
    }));
  };

  const handleAchievementToggle = (achievement: string) => {
    setFormData(prev => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        achievements: prev.profileData?.achievements?.includes(achievement)
          ? prev.profileData.achievements.filter(a => a !== achievement)
          : [...(prev.profileData?.achievements || []), achievement]
      }
    }));
  };

  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Редактировать данные ученика" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Имя *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleChange}
              className={`admin-input w-full ${errors.firstName ? 'border-red-500' : ''}`}
              placeholder="Введите имя ученика"
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Фамилия *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleChange}
              className={`admin-input w-full ${errors.lastName ? 'border-red-500' : ''}`}
              placeholder="Введите фамилию ученика"
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
              Отчество
            </label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName || ''}
              onChange={handleChange}
              className={`admin-input w-full ${errors.middleName ? 'border-red-500' : ''}`}
              placeholder="Введите отчество ученика"
            />
            {errors.middleName && <p className="text-red-500 text-xs mt-1">{errors.middleName}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className={`admin-input w-full ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Введите email ученика"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">
              Класс
            </label>
            <select
              name="className"
              value={formData.profileData?.className || ''}
              onChange={handleProfileDataChange}
              className="admin-input w-full"
            >
              <option value="">Выберите класс</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cottage" className="block text-sm font-medium text-gray-700 mb-1">
              Коттедж
            </label>
            <select
              name="cottage"
              value={formData.profileData?.cottage || ''}
              onChange={handleProfileDataChange}
              className="admin-input w-full"
            >
              <option value="">Выберите коттедж</option>
              {cottages.map(cottage => (
                <option key={cottage} value={cottage}>{cottage}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="membership" className="block text-sm font-medium text-gray-700 mb-1">
              Принадлежность
            </label>
            <select
              name="membership"
              value={formData.profileData?.membership || ''}
              onChange={handleProfileDataChange}
              className="admin-input w-full"
            >
              <option value="">Выберите принадлежность</option>
              {memberships.map(membership => (
                <option key={membership} value={membership}>{membership}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Телефон
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.profileData?.phone || ''}
              onChange={handleProfileDataChange}
              className="admin-input w-full"
              placeholder="Введите номер телефона"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tokensAccount" className="block text-sm font-medium text-gray-700 mb-1">
              Токены расчетный счет
            </label>
            <input
              type="number"
              name="tokensAccount"
              min="0"
              value={formData.profileData?.tokensAccount || 0}
              onChange={handleProfileDataChange}
              className="admin-input w-full"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="tokensCredit" className="block text-sm font-medium text-gray-700 mb-1">
              Токены кредитный счет
            </label>
            <input
              type="number"
              name="tokensCredit"
              min="0"
              value={formData.profileData?.tokensCredit || 0}
              onChange={handleProfileDataChange}
              className="admin-input w-full"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Должности
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availablePositions.map(position => (
              <label key={position} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.profileData?.positions?.includes(position) || false}
                  onChange={() => handlePositionToggle(position)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{position}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Достижения
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableAchievements.map(achievement => (
              <label key={achievement} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.profileData?.achievements?.includes(achievement) || false}
                  onChange={() => handleAchievementToggle(achievement)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{achievement}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border admin-border rounded-md hover:bg-gray-50 transition-colors"
          >
            Отменить
          </button>
          <button
            type="submit"
            className="admin-button-primary px-4 py-2 text-sm font-medium rounded-md"
            style={{ backgroundColor: 'var(--primary-burgundy)' }}
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 