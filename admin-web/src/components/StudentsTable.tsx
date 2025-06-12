'use client';

import React from 'react';

interface Student {
  id: number;
  fullName: string;
  class: string;
  cottage: string;
  linn: string;
  tokens: number;
}

// Тестовые данные учеников
const mockStudents: Student[] = [
  {
    id: 1,
    fullName: "Иванов Алексей Петрович",
    class: "10А",
    cottage: "Альфа",
    linn: "L001247",
    tokens: 1250
  },
  {
    id: 2,
    fullName: "Петрова Мария Сергеевна",
    class: "9Б",
    cottage: "Бета",
    linn: "L002156",
    tokens: 980
  },
  {
    id: 3,
    fullName: "Сидоров Дмитрий Александрович",
    class: "11В",
    cottage: "Гамма",
    linn: "L003089",
    tokens: 1750
  },
  {
    id: 4,
    fullName: "Козлова Екатерина Михайловна",
    class: "10Б",
    cottage: "Дельта",
    linn: "L004123",
    tokens: 1100
  },
  {
    id: 5,
    fullName: "Морозов Артем Владимирович",
    class: "9А",
    cottage: "Альфа",
    linn: "L005067",
    tokens: 890
  }
];

export default function StudentsTable() {
  const handleEdit = (student: Student) => {
    // TODO: Открыть модал редактирования
    alert(`Редактирование ученика: ${student.fullName}`);
    console.log('Редактирование ученика:', student);
  };

  const handleDelete = (student: Student) => {
    // Подтверждение удаления
    if (confirm(`Вы уверены, что хотите удалить ученика ${student.fullName}?`)) {
      // TODO: API-запрос на удаление
      alert(`Ученик ${student.fullName} удален`);
      console.log('Удаление ученика:', student);
    }
  };

  const handleTokens = (student: Student) => {
    // TODO: Открыть модал управления токенами
    const action = prompt(`Управление токенами для ${student.fullName}\nТекущий баланс: ${student.tokens} токенов\n\nВведите количество токенов для начисления (+) или списания (-):`, '0');
    
    if (action !== null && action !== '') {
      const amount = parseInt(action);
      if (!isNaN(amount)) {
        const newBalance = student.tokens + amount;
        if (newBalance >= 0) {
          alert(`Операция выполнена!\nНовый баланс: ${newBalance} токенов`);
          console.log('Операция с токенами:', { student, amount, newBalance });
        } else {
          alert('Ошибка: недостаточно токенов для списания');
        }
      } else {
        alert('Ошибка: введите корректное число');
      }
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y admin-border" style={{ borderColor: 'var(--divider)' }}>
          <thead style={{ backgroundColor: 'var(--background-light)' }}>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                Фамилия Имя
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                Класс
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                Коттедж
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                LINN
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                Токены (расчетный счет)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium admin-text-secondary uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="admin-card divide-y" style={{ borderColor: 'var(--divider)' }}>
            {mockStudents.map((student, index) => (
              <tr 
                key={student.id}
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div 
                        className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: 'var(--primary-burgundy)' }}
                      >
                        {student.fullName.split(' ')[0][0]}{student.fullName.split(' ')[1][0]}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.fullName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                    {student.class}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.cottage}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono admin-text-secondary">
                  {student.linn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {student.tokens}
                    </span>
                    <span className="ml-1 text-xs admin-text-secondary">токенов</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Редактировать"
                    >
                      <span className="text-lg">✏️</span>
                    </button>
                    <button
                      onClick={() => handleDelete(student)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Удалить"
                    >
                      <span className="text-lg">🗑️</span>
                    </button>
                    <button
                      onClick={() => handleTokens(student)}
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
      
      {/* Информация о количестве записей */}
      <div className="admin-border px-6 py-3 flex items-center justify-between" 
           style={{ borderTopColor: 'var(--divider)', borderTopWidth: '1px' }}>
        <div className="text-sm admin-text-secondary">
          Показано {mockStudents.length} из {mockStudents.length} учеников
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm admin-text-secondary hover:text-gray-900 transition-colors">
            Предыдущая
          </button>
          <span className="px-3 py-1 text-sm bg-gray-100 rounded">1</span>
          <button className="px-3 py-1 text-sm admin-text-secondary hover:text-gray-900 transition-colors">
            Следующая
          </button>
        </div>
      </div>
    </div>
  );
} 