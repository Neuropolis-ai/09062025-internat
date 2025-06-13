'use client';

import React from 'react';
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

interface StudentsTableProps {
  onEdit: (student: User) => void;
  onTokens: (student: User) => void;
  onStudentClick?: (student: User) => void;
}

export default function StudentsTable({ onEdit, onTokens, onStudentClick }: StudentsTableProps) {
  const { students, loading, error, loadUsers, deleteUser } = useAdmin();

  const handleDelete = async (student: User) => {
    if (confirm(`Вы уверены, что хотите удалить ученика ${student.firstName} ${student.lastName}?`)) {
      try {
        await deleteUser(student.id);
        alert(`Ученик ${student.firstName} ${student.lastName} удален`);
      } catch (err) {
        console.error('Ошибка удаления:', err);
        alert('Ошибка при удалении ученика');
      }
    }
  };

  const handleStudentClick = (student: User) => {
    if (onStudentClick) {
      onStudentClick(student);
    } else {
      onEdit(student); // fallback если onStudentClick не передан
    }
  };

  const handleTokens = (student: User) => {
    const currentTokens = student.profileData?.tokens || student.profileData?.tokensAccount || 0;
    const action = prompt(`Управление токенами для ${student.firstName} ${student.lastName}\nТекущий баланс: ${currentTokens} токенов\n\nВведите количество токенов для начисления (+) или списания (-):`, '0');
    
    if (action !== null && action !== '') {
      const amount = parseInt(action);
      if (!isNaN(amount)) {
        // TODO: Подключить updateUser для изменения токенов
        console.log('Нужно обновить токены:', { student, amount });
        alert('Функционал управления токенами в разработке.');
      }
    }
  };

  // Функция для получения общего количества токенов
  const getTotalTokens = (student: User) => {
    const profileData = student.profileData || {};
    const tokensAccount = profileData.tokensAccount || 0;
    const tokensCredit = profileData.tokensCredit || 0;
    const tokens = profileData.tokens || 0;
    
    // Если есть разделение на аккаунт и кредит, показываем их сумму, иначе показываем tokens
    if (tokensAccount > 0 || tokensCredit > 0) {
      return tokensAccount + tokensCredit;
    }
    return tokens;
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Загружаем данные студентов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-red-500 mb-4">{error}</p>
        <button
          onClick={loadUsers}
          className="admin-button-primary px-4 py-2 text-sm font-medium text-white"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y admin-border" style={{ borderColor: 'var(--divider)' }}>
        <thead style={{ backgroundColor: 'var(--background-light)' }}>
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
              Фамилия Имя
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
              Класс
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
              Коттедж
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
              Токены
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
              Должности
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
              Статус
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="admin-card divide-y" style={{ borderColor: 'var(--divider)' }}>
          {students.map((student: User) => (
            <tr key={student.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleStudentClick(student)}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {student.lastName} {student.firstName}
                  {student.middleName && <div className="text-xs text-gray-500">{student.middleName}</div>}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {student.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                  {student.profileData?.className || 'Не указан'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {student.profileData?.cottage || 'Не указан'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {getTotalTokens(student)}
                </div>
                {student.profileData?.tokensAccount !== undefined && student.profileData?.tokensCredit !== undefined && (
                  <div className="text-xs text-gray-500">
                    Р: {student.profileData.tokensAccount} | К: {student.profileData.tokensCredit}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {student.profileData?.positions && student.profileData.positions.length > 0 ? (
                    <div className="max-w-32">
                      <div className="text-xs">
                        {student.profileData.positions.slice(0, 2).map((position: string, index: number) => (
                          <span key={index} className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs mr-1 mb-1">
                            {position}
                          </span>
                        ))}
                        {student.profileData.positions.length > 2 && (
                          <span className="text-gray-500">+{student.profileData.positions.length - 2}</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">Нет должностей</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {student.isActive ? 'Активен' : 'Неактивен'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(student);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Редактировать"
                  >
                    <span className="text-lg">✏️</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(student);
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Удалить"
                  >
                    <span className="text-lg">🗑️</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTokens(student);
                    }}
                    className="text-gray-400 hover:text-green-600 transition-colors"
                    title="Начислить/Снять токены"
                  >
                    <span className="text-lg">💰</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 