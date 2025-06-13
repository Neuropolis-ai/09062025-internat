'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import PageHeader from '../../components/PageHeader';
import StudentsTable from '../../components/StudentsTable';
import AddStudentModal from '../../components/AddStudentModal';
import EditStudentModal from '../../components/EditStudentModal';
import TokensModal from '../../components/TokensModal';
import StudentDetailsModal from '../../components/StudentDetailsModal';
import { useAdmin } from '../../contexts/AdminContext';

interface StudentFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  class: string;
  cottage: string;
  phone: string;
  tokensAccount: number;
  tokensCredit: number;
  membership: string;
  positions: string[];
  achievements: string[];
}

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

export default function StudentsPage() {
  const { sidebarOpen, setSidebarOpen, createUser, loading, error } = useAdmin();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [tokensModalOpen, setTokensModalOpen] = useState(false);
  const [tokensStudent, setTokensStudent] = useState<User | null>(null);

  const handleAddStudent = async (studentData: StudentFormData) => {
    try {
      // Проверяем, что имя и фамилия не пустые
      if (!studentData.lastName.trim() || !studentData.firstName.trim()) {
        alert('Фамилия и имя не могут быть пустыми');
        return;
      }

      // Проверяем email
      if (!studentData.email.trim()) {
        alert('Email обязателен');
        return;
      }

      const apiUserData = {
        email: studentData.email.trim(),
        firstName: studentData.firstName.trim(),
        lastName: studentData.lastName.trim(),
        middleName: studentData.middleName?.trim() || '',
        role: 'STUDENT',
        profileData: {
          className: studentData.class,
          cottage: studentData.cottage,
          phone: studentData.phone,
          membership: studentData.membership,
          positions: studentData.positions,
          achievements: studentData.achievements,
          tokensAccount: studentData.tokensAccount,
          tokensCredit: studentData.tokensCredit,
        }
      };

      console.log('Создание студента с данными:', apiUserData);
      await createUser(apiUserData);
      setAddModalOpen(false);
      alert('Студент успешно добавлен!');
    } catch (err) {
      console.error('Ошибка добавления ученика:', err);
      alert('Ошибка при добавлении ученика: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
    }
  };
  
  // Обработчик клика на строку в таблице - открывает детальный просмотр
  const handleStudentDetails = (student: User) => {
    setSelectedStudent(student);
    setDetailsModalOpen(true);
  };

  // Обработчик кнопки редактирования
  const handleEditStudent = (student: User) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  // Обработчик кнопки управления токенами
  const handleTokens = (student: User) => {
    setTokensStudent(student);
    setTokensModalOpen(true);
  };

  // Обработчики из модала детального просмотра
  const handleEditFromDetails = () => {
    setDetailsModalOpen(false);
    setEditModalOpen(true);
  };

  const handleTokensFromDetails = () => {
    setTokensStudent(selectedStudent);
    setDetailsModalOpen(false);
    setTokensModalOpen(true);
  };

  return (
    <div className="min-h-screen admin-container flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <PageHeader 
          title="Ученики"
          subtitle="Управление учениками лицея"
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-400">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Ошибка</h3>
                    <div className="mt-2 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="admin-card-shadow">
              <div className="px-6 py-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Список учеников</h3>
                    <p className="mt-2 text-sm text-gray-600">Полная информация об учениках. Нажмите на строку для просмотра деталей</p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      type="button"
                      onClick={() => setAddModalOpen(true)}
                      disabled={loading}
                      className="admin-button-primary"
                    >
                      {loading ? 'Загрузка...' : 'Добавить ученика'}
                    </button>
                  </div>
                </div>
                
                <StudentsTable 
                  onEdit={handleEditStudent} // Кнопка редактирования
                  onTokens={handleTokens}
                  onStudentClick={handleStudentDetails} // Клик на строку открывает детали
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Модал добавления студента */}
      <AddStudentModal 
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAddStudent}
      />
      
      {/* Модал детального просмотра студента */}
      <StudentDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        student={selectedStudent}
        onEdit={handleEditFromDetails}
        onTokens={handleTokensFromDetails}
      />
      
      {/* Модал редактирования студента */}
      <EditStudentModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        student={selectedStudent}
      />

      {/* Модал управления токенами */}
      <TokensModal
        isOpen={tokensModalOpen}
        onClose={() => setTokensModalOpen(false)}
        student={tokensStudent}
      />
    </div>
  );
} 