'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
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
        <header className="admin-card shadow" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                {/* Кнопка меню для мобильных устройств */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-white hover:bg-white/20 mr-4"
                >
                  <span className="text-xl">☰</span>
                </button>
                
                <div>
                  <h1 className="text-2xl font-bold text-white">Ученики</h1>
                  <p className="text-white/90 font-medium">Управление учениками лицея</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setAddModalOpen(true)}
                  className="admin-button-primary text-white px-4 py-2 rounded-md transition-colors"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                >
                  Добавить ученика
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="admin-card">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Список учеников
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm admin-text-secondary">
                      Управление учениками лицея-интерната "Подмосковный"
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      type="button"
                      onClick={() => setAddModalOpen(true)}
                      className="admin-button-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
                      style={{ backgroundColor: 'var(--primary-burgundy)' }}
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