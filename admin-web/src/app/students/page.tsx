'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import PageHeader from '../../components/PageHeader';
import StudentsTable from '../../components/StudentsTable';
import AddStudentModal from '../../components/AddStudentModal';

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

export default function StudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleAddStudent = (studentData: StudentFormData) => {
    // TODO: Здесь будет API-запрос на добавление ученика
    console.log('Добавление ученика:', studentData);
    alert(`Ученик ${studentData.fullName} успешно добавлен!`);
  };

  return (
    <div className="min-h-screen admin-container flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Основной контент */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <PageHeader 
          title="Ученики"
          subtitle="Управление учениками лицея-интерната «Подмосковный»"
          onMenuToggle={() => setSidebarOpen(true)}
        />

        {/* Main content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="max-w-7xl mx-auto">
            <div className="admin-card-shadow">
              <div className="px-6 py-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 className="text-xl leading-6 font-semibold text-gray-900">
                      Список учеников
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm admin-text-secondary">
                      Полная информация об учениках лицея с возможностью управления токенами и данными
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      type="button"
                      onClick={() => setAddModalOpen(true)}
                      className="admin-button-primary inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-colors"
                    >
                      <span className="mr-2">👤</span>
                      Добавить ученика
                    </button>
                  </div>
                </div>
                
                {/* Таблица учеников */}
                <StudentsTable />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Модальное окно добавления ученика */}
      <AddStudentModal 
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAddStudent}
      />
    </div>
  );
} 