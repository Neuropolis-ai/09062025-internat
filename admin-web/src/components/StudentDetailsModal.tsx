'use client';

import React from 'react';
import Modal from './ui/Modal';

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
  createdAt?: string;
  updatedAt?: string;
}

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: User | null;
  onEdit: () => void;
  onTokens: () => void;
}

export default function StudentDetailsModal({ isOpen, onClose, student, onEdit, onTokens }: StudentDetailsModalProps) {
  if (!student) return null;

  // Функция для получения общего количества токенов
  const getTotalTokens = () => {
    const profileData = student.profileData || {};
    const tokensAccount = profileData.tokensAccount || 0;
    const tokensCredit = profileData.tokensCredit || 0;
    const tokens = profileData.tokens || 0;
    
    if (tokensAccount > 0 || tokensCredit > 0) {
      return tokensAccount + tokensCredit;
    }
    return tokens;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Информация о студенте" size="lg">
      <div className="space-y-6">
        {/* Шапка с основной информацией */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {student.firstName[0]}{student.lastName[0]}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {student.lastName} {student.firstName} {student.middleName}
              </h3>
              <p className="text-sm text-gray-600">{student.email}</p>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {student.isActive ? 'Активен' : 'Неактивен'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Учебная информация</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Класс</label>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium text-white" 
                        style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                    {student.profileData?.className || 'Не указан'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Коттедж</label>
                <p className="mt-1 text-sm text-gray-900">{student.profileData?.cottage || 'Не указан'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Принадлежность</label>
                <p className="mt-1 text-sm text-gray-900">{student.profileData?.membership || 'Не указана'}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Контактная информация</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-sm text-gray-900">{student.email}</p>
              </div>
              {student.profileData?.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Телефон</label>
                  <p className="mt-1 text-sm text-gray-900">{student.profileData.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Токены */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Токены</h4>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{getTotalTokens()}</div>
                <div className="text-sm text-gray-600">Общий баланс</div>
              </div>
              {student.profileData?.tokensAccount !== undefined && (
                <div className="text-center">
                  <div className="text-xl font-semibold text-green-600">{student.profileData.tokensAccount}</div>
                  <div className="text-sm text-gray-600">Расчетный счет</div>
                </div>
              )}
              {student.profileData?.tokensCredit !== undefined && (
                <div className="text-center">
                  <div className="text-xl font-semibold text-orange-600">{student.profileData.tokensCredit}</div>
                  <div className="text-sm text-gray-600">Кредитный счет</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Должности */}
        {student.profileData?.positions && student.profileData.positions.length > 0 && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Должности</h4>
            <div className="flex flex-wrap gap-2">
              {student.profileData.positions.map((position: string, index: number) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {position}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Достижения */}
        {student.profileData?.achievements && student.profileData.achievements.length > 0 && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Достижения</h4>
            <div className="flex flex-wrap gap-2">
              {student.profileData.achievements.map((achievement: string, index: number) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  🏆 {achievement}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Закрыть
          </button>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                onTokens();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
            >
              💰 Управление токенами
            </button>
            <button
              onClick={() => {
                onEdit();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
              style={{ backgroundColor: 'var(--primary-burgundy)' }}
            >
              ✏️ Редактировать
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
} 