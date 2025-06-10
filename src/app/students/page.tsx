'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import AddStudentModal from '../../components/AddStudentModal';
import TokensModal from '../../components/TokensModal';

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

// Тестовые данные учеников
const mockStudents: Student[] = [
  {
    id: '1',
    fullName: 'Иванов Петр Алексеевич',
    class: '10А',
    cottage: 'Аргон',
    linn: 'IV001234',
    accountTokens: 125,
    creditTokens: 50,
    achievements: ['Лучший в спорте', 'Активист года'],
    positions: ['Староста класса'],
    belongsTo: 'Дом Аргон',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    fullName: 'Сидорова Анна Викторовна',
    class: '11Б',
    cottage: 'Гелий',
    linn: 'IV001235',
    accountTokens: 98,
    creditTokens: 25,
    achievements: ['Отличница', 'Победитель олимпиады'],
    positions: ['Заместитель старосты'],
    belongsTo: 'Дом Гелий',
    createdAt: '2024-01-12'
  },
  {
    id: '3',
    fullName: 'Петров Максим Сергеевич',
    class: '9В',
    cottage: 'Неон',
    linn: 'IV001236',
    accountTokens: 87,
    creditTokens: 35,
    achievements: ['Творческий конкурс'],
    positions: [],
    belongsTo: 'Дом Неон',
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    fullName: 'Козлова Мария Александровна',
    class: '8А',
    cottage: 'Криптон',
    linn: 'IV001237',
    accountTokens: 156,
    creditTokens: 10,
    achievements: ['Лучший дебютант'],
    positions: ['Физорг'],
    belongsTo: 'Дом Криптон',
    createdAt: '2024-01-08'
  },
  {
    id: '5',
    fullName: 'Смирнов Алексей Дмитриевич',
    class: '11А',
    cottage: 'Аргон',
    linn: 'IV001238',
    accountTokens: 203,
    creditTokens: 75,
    achievements: ['Технический лидер', 'Золотая медаль'],
    positions: ['Глава совета'],
    belongsTo: 'Дом Аргон',
    createdAt: '2024-01-05'
  }
];

export default function StudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("Все");
  const [selectedCottage, setSelectedCottage] = useState("Все");
  
  // Состояния для модальных окон
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [tokensModalOpen, setTokensModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudentForTokens, setSelectedStudentForTokens] = useState<Student | null>(null);

  // Статистика
  const totalStudents = mockStudents.length;
  const totalTokens = mockStudents.reduce((sum, student) => sum + student.accountTokens, 0);
  const averageTokens = Math.round(totalTokens / totalStudents);
  const totalCreditTokens = mockStudents.reduce((sum, student) => sum + student.creditTokens, 0);

  // Фильтры
  const classes = ["Все", ...Array.from(new Set(mockStudents.map(s => s.class))).sort()];
  const cottages = ["Все", ...Array.from(new Set(mockStudents.map(s => s.cottage))).sort()];

  // Фильтрация учеников
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.linn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "Все" || student.class === selectedClass;
    const matchesCottage = selectedCottage === "Все" || student.cottage === selectedCottage;
    return matchesSearch && matchesClass && matchesCottage;
  });

  const handleAddStudent = () => {
    setEditingStudent(null);
    setAddStudentModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setAddStudentModalOpen(true);
  };

  const handleDeleteStudent = (student: Student) => {
    if (confirm(`Вы уверены, что хотите удалить ученика "${student.fullName}"?`)) {
      // TODO: API-запрос на удаление
      alert(`Ученик "${student.fullName}" удален`);
    }
  };

  const handleManageTokens = (student: Student) => {
    setSelectedStudentForTokens(student);
    setTokensModalOpen(true);
  };

  const handleSaveStudent = (studentData: StudentFormData) => {
    if (editingStudent) {
      // TODO: API-запрос на обновление ученика
      console.log('Обновление ученика:', { ...editingStudent, ...studentData });
      alert(`Данные ученика "${studentData.fullName}" обновлены!`);
    } else {
      // TODO: API-запрос на создание ученика
      const newLinn = `IV${String(Date.now()).slice(-6)}`;
      console.log('Создание ученика:', { ...studentData, linn: newLinn });
      alert(`Ученик "${studentData.fullName}" добавлен! LINN: ${newLinn}`);
    }
  };

  const handleTokensOperation = (
    studentId: string, 
    operation: 'add' | 'subtract', 
    accountType: 'account' | 'credit', 
    amount: number, 
    comment: string
  ) => {
    // TODO: API-запрос на изменение токенов
    const student = mockStudents.find(s => s.id === studentId);
    if (student) {
      const operationText = operation === 'add' ? 'начислено' : 'списано';
      const accountText = accountType === 'account' ? 'расчетного' : 'кредитного';
      console.log(`Операция с токенами:`, {
        studentId,
        operation,
        accountType,
        amount,
        comment
      });
      alert(`${operationText} ${amount} L-Coin ${operation === 'add' ? 'на' : 'с'} ${accountText} счета ученика "${student.fullName}"`);
    }
  };

  const handleCloseAddStudentModal = () => {
    setAddStudentModalOpen(false);
    setEditingStudent(null);
  };

  const handleCloseTokensModal = () => {
    setTokensModalOpen(false);
    setSelectedStudentForTokens(null);
  };

  return (
    <div className="min-h-screen admin-container flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Основной контент */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="shadow" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-8">
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
                  <p className="text-white/90 font-medium">Управление учениками и их данными</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAddStudent}
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
            {/* Статистика */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="admin-card">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">👥</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего учеников</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalStudents}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">💰</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего токенов</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalTokens}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">📊</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Средний баланс</dt>
                        <dd className="text-lg font-medium text-gray-900">{averageTokens}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">🏦</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Кредитные токены</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalCreditTokens}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Фильтры и поиск */}
            <div className="admin-card mb-6">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Поиск учеников
                    </label>
                    <input
                      type="text"
                      className="admin-input w-full"
                      placeholder="Поиск по имени или LINN..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Класс
                    </label>
                    <select
                      className="admin-input w-full"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                    >
                      {classes.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Коттедж
                    </label>
                    <select
                      className="admin-input w-full"
                      value={selectedCottage}
                      onChange={(e) => setSelectedCottage(e.target.value)}
                    >
                      {cottages.map(cottage => (
                        <option key={cottage} value={cottage}>{cottage}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Таблица учеников */}
            <div className="admin-card">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Список учеников
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm admin-text-secondary">
                      Найдено: {filteredStudents.length} из {totalStudents} учеников
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      onClick={handleAddStudent}
                      className="admin-button-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
                      style={{ backgroundColor: 'var(--primary-burgundy)' }}
                    >
                      <span className="mr-2">👥</span>
                      Добавить ученика
                    </button>
                  </div>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--background-gray)' }}>
                      <span className="text-2xl">👥</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Учеников не найдено</h3>
                    <p className="admin-text-secondary">
                      Попробуйте изменить критерии поиска или добавьте нового ученика.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Фамилия Имя
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Класс
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Коттедж
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            LINN
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Кол-во токенов на расчетном счете
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--background-gray)' }}>
                                    <span className="text-lg">👤</span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                                  <div className="text-sm admin-text-secondary">{student.belongsTo}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {student.class}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.cottage}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                              {student.linn}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <span className="font-medium">{student.accountTokens}</span> L-Coin
                                {student.creditTokens > 0 && (
                                  <div className="text-xs admin-text-secondary">
                                    Кредит: {student.creditTokens} L-Coin
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEditStudent(student)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Редактировать"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleManageTokens(student)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                                  title="Управление токенами"
                                >
                                  💰
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(student)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                                  title="Удалить"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Модальные окна */}
      <AddStudentModal 
        isOpen={addStudentModalOpen}
        onClose={handleCloseAddStudentModal}
        student={editingStudent}
        onSave={handleSaveStudent}
      />

      <TokensModal 
        isOpen={tokensModalOpen}
        onClose={handleCloseTokensModal}
        student={selectedStudentForTokens}
        onSave={handleTokensOperation}
      />
    </div>
  );
} 