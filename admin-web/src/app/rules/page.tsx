'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

interface Rule {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'academic' | 'behavioral' | 'dormitory' | 'safety';
  isActive: boolean;
  lastUpdated: string;
  updatedBy: string;
  version: number;
}

// Тестовые данные правил
const mockRules: Rule[] = [
  {
    id: '1',
    title: 'Общие правила поведения',
    content: `1. Соблюдать вежливость и уважение к окружающим
2. Приходить в лицей вовремя и готовыми к занятиям
3. Носить школьную форму согласно установленным требованиям
4. Беречь школьное имущество и поддерживать чистоту
5. Соблюдать правила безопасности на территории лицея`,
    category: 'general',
    isActive: true,
    lastUpdated: '2024-01-15 10:30',
    updatedBy: 'Администрация',
    version: 3
  },
  {
    id: '2',
    title: 'Академические требования',
    content: `1. Посещать все занятия согласно расписанию
2. Выполнять домашние задания в установленные сроки
3. Уважительно относиться к учителям и одноклассникам
4. Активно участвовать в учебном процессе
5. Соблюдать дисциплину на уроках и во время перемен`,
    category: 'academic',
    isActive: true,
    lastUpdated: '2024-01-10 14:20',
    updatedBy: 'Завуч',
    version: 2
  },
  {
    id: '3',
    title: 'Правила поведения в общежитии',
    content: `1. Соблюдать тишину в часы отдыха (22:00 - 07:00)
2. Поддерживать порядок в своей комнате
3. Уважать личное пространство соседей
4. Участвовать в общих мероприятиях и дежурствах
5. Соблюдать правила пожарной безопасности`,
    category: 'dormitory',
    isActive: true,
    lastUpdated: '2024-01-12 16:45',
    updatedBy: 'Воспитатель',
    version: 4
  },
  {
    id: '4',
    title: 'Правила техники безопасности',
    content: `1. Строго соблюдать инструкции при работе с оборудованием
2. Использовать средства индивидуальной защиты
3. Немедленно сообщать о любых ЧП администрации
4. Не находиться в здании после окончания занятий без разрешения
5. Соблюдать правила эвакуации при ЧС`,
    category: 'safety',
    isActive: true,
    lastUpdated: '2024-01-08 09:15',
    updatedBy: 'Ответственный по ТБ',
    version: 1
  },
  {
    id: '5',
    title: 'Дисциплинарные меры',
    content: `1. Предупреждение за незначительные нарушения
2. Замечание в дневник за повторные нарушения
3. Вызов родителей при серьезных проступках
4. Временное отстранение от занятий
5. Исключение из лицея в исключительных случаях`,
    category: 'behavioral',
    isActive: false,
    lastUpdated: '2024-01-05 11:00',
    updatedBy: 'Директор',
    version: 2
  }
];

const categoryNames = {
  general: 'Общие правила',
  academic: 'Академические требования',
  behavioral: 'Поведение и дисциплина',
  dormitory: 'Правила общежития',
  safety: 'Техника безопасности'
};

const categoryIcons = {
  general: '📋',
  academic: '📚',
  behavioral: '⚖️',
  dormitory: '🏠',
  safety: '🛡️'
};

export default function RulesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");
  const [selectedStatus, setSelectedStatus] = useState<string>("Все");
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Статистика
  const totalRules = mockRules.length;
  const activeRules = mockRules.filter(r => r.isActive).length;
  const categoriesCount = Object.keys(categoryNames).length;
  const lastUpdate = Math.max(...mockRules.map(r => new Date(r.lastUpdated).getTime()));

  // Фильтрация правил
  const filteredRules = mockRules.filter(rule => {
    const matchesSearch = rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Все" || 
                          categoryNames[rule.category as keyof typeof categoryNames] === selectedCategory;
    const matchesStatus = selectedStatus === "Все" ||
                         (selectedStatus === "Активные" && rule.isActive) ||
                         (selectedStatus === "Неактивные" && !rule.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule);
    setIsEditing(true);
  };

  const handleSaveRule = () => {
    if (editingRule) {
      // TODO: API-запрос на сохранение
      console.log('Сохранение правила:', editingRule);
      alert(`Правило "${editingRule.title}" сохранено!`);
      setIsEditing(false);
      setEditingRule(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingRule(null);
  };

  const handleDeleteRule = (rule: Rule) => {
    if (confirm(`Вы уверены, что хотите удалить правило "${rule.title}"?`)) {
      // TODO: API-запрос на удаление
      console.log('Удаление правила:', rule);
      alert(`Правило "${rule.title}" удалено`);
    }
  };

  const handleToggleActive = (rule: Rule) => {
    // TODO: API-запрос на изменение статуса
    console.log('Изменение статуса правила:', rule);
    alert(`Статус правила "${rule.title}" изменен`);
  };

  const handleCreateNewRule = () => {
    const newRule: Rule = {
      id: '',
      title: 'Новое правило',
      content: 'Содержание нового правила...',
      category: 'general',
      isActive: true,
      lastUpdated: new Date().toLocaleDateString('ru-RU'),
      updatedBy: 'Администратор',
      version: 1
    };
    setEditingRule(newRule);
    setIsEditing(true);
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
                  <h1 className="text-2xl font-bold text-white">Правила лицея</h1>
                  <p className="text-white/90 font-medium">Управление правилами и положениями</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCreateNewRule}
                  className="admin-button-primary text-white px-4 py-2 rounded-md transition-colors"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                >
                  Создать правило
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
                        <span className="text-white font-bold">📋</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего правил</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalRules}</dd>
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
                        <span className="text-white font-bold">✅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Активных</dt>
                        <dd className="text-lg font-medium text-gray-900">{activeRules}</dd>
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
                        <span className="text-white font-bold">📂</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Категорий</dt>
                        <dd className="text-lg font-medium text-gray-900">{categoriesCount}</dd>
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
                        <span className="text-white font-bold">🕒</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Последнее обновление</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {new Date(lastUpdate).toLocaleDateString('ru-RU')}
                        </dd>
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
                      Поиск правил
                    </label>
                    <input
                      type="text"
                      className="admin-input w-full"
                      placeholder="Поиск по названию или содержанию..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Категория
                    </label>
                    <select
                      className="admin-input w-full"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="Все">Все категории</option>
                      {Object.values(categoryNames).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Статус
                    </label>
                    <select
                      className="admin-input w-full"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="Все">Все</option>
                      <option value="Активные">Активные</option>
                      <option value="Неактивные">Неактивные</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Список правил или редактор */}
            {isEditing && editingRule ? (
              /* Редактор правила */
              <div className="admin-card mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {editingRule.id ? 'Редактировать правило' : 'Создать новое правило'}
                      </h3>
                      <p className="mt-1 text-sm admin-text-secondary">
                        {editingRule.id ? 'Внесите изменения в существующее правило' : 'Создайте новое правило для лицея'}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveRule}
                        className="admin-button-primary px-4 py-2 text-sm font-medium rounded-md"
                        style={{ backgroundColor: 'var(--primary-burgundy)' }}
                      >
                        Сохранить
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium admin-text-secondary mb-2">
                        Название правила
                      </label>
                      <input
                        type="text"
                        className="admin-input w-full"
                        value={editingRule.title}
                        onChange={(e) => setEditingRule({...editingRule, title: e.target.value})}
                        placeholder="Введите название правила"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium admin-text-secondary mb-2">
                        Категория
                      </label>
                      <select
                        className="admin-input w-full"
                        value={editingRule.category}
                        onChange={(e) => setEditingRule({...editingRule, category: e.target.value as 'general' | 'academic' | 'behavioral' | 'dormitory' | 'safety'})}
                      >
                        {Object.entries(categoryNames).map(([key, name]) => (
                          <option key={key} value={key}>{categoryIcons[key as keyof typeof categoryIcons]} {name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Содержание правила
                    </label>
                    <textarea
                      rows={12}
                      className="admin-input w-full resize-none"
                      value={editingRule.content}
                      onChange={(e) => setEditingRule({...editingRule, content: e.target.value})}
                      placeholder="Введите подробное содержание правила..."
                    />
                    <p className="text-xs admin-text-secondary mt-1">
                      Используйте нумерованные списки для лучшей читаемости
                    </p>
                  </div>

                  <div className="mt-6 flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 rounded"
                      style={{ color: 'var(--primary-burgundy)' }}
                      checked={editingRule.isActive}
                      onChange={(e) => setEditingRule({...editingRule, isActive: e.target.checked})}
                    />
                    <span className="ml-2 text-sm font-medium admin-text-secondary">
                      Правило активно (отображается пользователям)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Список правил */
              <div className="admin-card">
                <div className="px-4 py-5 sm:p-6">
                  <div className="sm:flex sm:items-center sm:justify-between mb-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Список правил
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm admin-text-secondary">
                        Найдено: {filteredRules.length} из {totalRules} правил
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <button
                        onClick={handleCreateNewRule}
                        className="admin-button-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
                        style={{ backgroundColor: 'var(--primary-burgundy)' }}
                      >
                        <span className="mr-2">📋</span>
                        Создать правило
                      </button>
                    </div>
                  </div>

                  {filteredRules.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--background-gray)' }}>
                        <span className="text-2xl">📋</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Правил не найдено</h3>
                      <p className="admin-text-secondary">
                        Попробуйте изменить критерии поиска или создайте новое правило.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredRules.map((rule) => (
                        <div
                          key={rule.id}
                          className="border rounded-lg p-6"
                          style={{ borderColor: 'var(--divider)' }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <span className="text-xl">{categoryIcons[rule.category]}</span>
                                <h4 className="text-lg font-medium text-gray-900">
                                  {rule.title}
                                </h4>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {categoryNames[rule.category]}
                                </span>
                                {rule.isActive ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Активно
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Неактивно
                                  </span>
                                )}
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  v{rule.version}
                                </span>
                              </div>
                              
                              <div className="text-sm admin-text-secondary mb-4 whitespace-pre-line">
                                {rule.content}
                              </div>

                              <div className="flex items-center justify-between text-xs admin-text-secondary">
                                <span>
                                  Обновлено: {new Date(rule.lastUpdated).toLocaleDateString('ru-RU')} 
                                  {rule.updatedBy && ` • ${rule.updatedBy}`}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => handleToggleActive(rule)}
                                className={`p-2 rounded ${
                                  rule.isActive 
                                    ? 'text-red-600 hover:bg-red-50' 
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                                title={rule.isActive ? 'Деактивировать' : 'Активировать'}
                              >
                                {rule.isActive ? '🔴' : '🟢'}
                              </button>
                              <button
                                onClick={() => handleEditRule(rule)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                title="Редактировать"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteRule(rule)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                title="Удалить"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 