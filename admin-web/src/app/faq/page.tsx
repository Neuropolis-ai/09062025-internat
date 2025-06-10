'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import FAQModal from '../../components/FAQModal';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'academic' | 'dormitory' | 'finance' | 'technical' | 'general';
  isVisible: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  views: number;
  helpful: number;
  notHelpful: number;
}

interface FAQFormData {
  question: string;
  answer: string;
  category: 'academic' | 'dormitory' | 'finance' | 'technical' | 'general';
  isVisible: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Тестовые данные FAQ
const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'Как войти в мобильное приложение лицея?',
    answer: 'Для входа в мобильное приложение используйте те же данные, что и для входа на сайт. Логин - это ваш номер LINN, пароль выдается классным руководителем или администрацией. При первом входе рекомендуется сменить пароль.',
    category: 'technical',
    isVisible: true,
    priority: 'high',
    createdAt: '2024-01-10 10:00',
    updatedAt: '2024-01-15 14:30',
    createdBy: 'IT-отдел',
    views: 245,
    helpful: 198,
    notHelpful: 12
  },
  {
    id: '2',
    question: 'Как начислить L-Coin за достижения?',
    answer: 'L-Coin начисляются автоматически за: отличные оценки (+10), победы в олимпиадах (+50), участие в мероприятиях (+20), дежурство по лицею (+5). Также учителя могут начислить дополнительные L-Coin через систему поощрений.',
    category: 'finance',
    isVisible: true,
    priority: 'high',
    createdAt: '2024-01-08 09:15',
    updatedAt: '2024-01-12 16:20',
    createdBy: 'Администрация',
    views: 189,
    helpful: 156,
    notHelpful: 8
  },
  {
    id: '3',
    question: 'Правила проживания в общежитии',
    answer: 'Основные правила: соблюдение тишины с 22:00 до 07:00, поддержание чистоты в комнате, запрет на курение и алкоголь, обязательное участие в дежурствах. Посещение других комнат разрешено до 21:00.',
    category: 'dormitory',
    isVisible: true,
    priority: 'medium',
    createdAt: '2024-01-05 11:30',
    updatedAt: '2024-01-10 09:45',
    createdBy: 'Воспитатель',
    views: 134,
    helpful: 118,
    notHelpful: 5
  },
  {
    id: '4',
    question: 'Как подать заявку на академический отпуск?',
    answer: 'Для подачи заявки на академический отпуск необходимо: 1) Написать заявление на имя директора, 2) Предоставить справку о состоянии здоровья (если отпуск по медицинским показаниям), 3) Получить согласие родителей, 4) Пройти собеседование с заместителем директора.',
    category: 'academic',
    isVisible: true,
    priority: 'medium',
    createdAt: '2024-01-03 13:20',
    updatedAt: '2024-01-08 10:15',
    createdBy: 'Завуч',
    views: 67,
    helpful: 52,
    notHelpful: 3
  },
  {
    id: '5',
    question: 'Расписание работы столовой',
    answer: 'Столовая работает: завтрак 07:30-08:30, обед 12:00-14:00, ужин 18:00-19:30. В выходные дни: завтрак 08:00-09:00, обед 13:00-14:30, ужин 18:30-19:30.',
    category: 'general',
    isVisible: true,
    priority: 'low',
    createdAt: '2024-01-01 15:00',
    updatedAt: '2024-01-07 12:30',
    createdBy: 'Администрация',
    views: 98,
    helpful: 87,
    notHelpful: 2
  },
  {
    id: '6',
    question: 'Что делать при проблемах с интернетом в комнате?',
    answer: 'При проблемах с интернетом: 1) Перезагрузите роутер в комнате, 2) Проверьте подключение кабелей, 3) Если проблема не решена, подайте заявку в IT-отдел через приложение или обратитесь к дежурному воспитателю.',
    category: 'technical',
    isVisible: false,
    priority: 'low',
    createdAt: '2023-12-28 16:45',
    updatedAt: '2024-01-02 11:20',
    createdBy: 'IT-отдел',
    views: 45,
    helpful: 32,
    notHelpful: 8
  }
];

const categoryNames = {
  academic: 'Учебные вопросы',
  dormitory: 'Общежитие',
  finance: 'Финансы и L-Coin',
  technical: 'Технические вопросы',
  general: 'Общие вопросы'
};

const categoryIcons = {
  academic: '📚',
  dormitory: '🏠',
  finance: '💰',
  technical: '💻',
  general: '❓'
};

const priorityNames = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

export default function FAQPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");
  const [selectedPriority, setSelectedPriority] = useState<string>("Все");
  const [selectedStatus, setSelectedStatus] = useState<string>("Все");
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  // Статистика
  const totalFAQs = mockFAQs.length;
  const visibleFAQs = mockFAQs.filter(f => f.isVisible).length;
  const totalViews = mockFAQs.reduce((sum, f) => sum + f.views, 0);
  const averageHelpfulness = Math.round(
    (mockFAQs.reduce((sum, f) => sum + f.helpful, 0) / 
     mockFAQs.reduce((sum, f) => sum + f.helpful + f.notHelpful, 0)) * 100
  );

  // Фильтрация FAQ
  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Все" || 
                          categoryNames[faq.category as keyof typeof categoryNames] === selectedCategory;
    const matchesPriority = selectedPriority === "Все" || 
                          priorityNames[faq.priority as keyof typeof priorityNames] === selectedPriority;
    const matchesStatus = selectedStatus === "Все" ||
                         (selectedStatus === "Видимые" && faq.isVisible) ||
                         (selectedStatus === "Скрытые" && !faq.isVisible);
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFaqModalOpen(true);
  };

  const handleDeleteFAQ = (faq: FAQ) => {
    if (confirm(`Вы уверены, что хотите удалить вопрос "${faq.question}"?`)) {
      // TODO: API-запрос на удаление
      console.log('Удаление FAQ:', faq);
      alert(`Вопрос "${faq.question}" удален`);
    }
  };

  const handleToggleVisible = (faq: FAQ) => {
    // TODO: API-запрос на изменение видимости
    console.log('Изменение видимости FAQ:', faq);
    alert(`Видимость вопроса "${faq.question}" изменена`);
  };

  const handleAddFAQ = () => {
    setEditingFAQ(null);
    setFaqModalOpen(true);
  };

  const handleSaveFAQ = (faqData: FAQFormData) => {
    if (editingFAQ) {
      // TODO: API-запрос на обновление FAQ
      console.log('Обновление FAQ:', { ...editingFAQ, ...faqData });
      alert(`Вопрос "${faqData.question}" обновлен!`);
    } else {
      // TODO: API-запрос на создание FAQ
      console.log('Создание FAQ:', faqData);
      alert(`Вопрос "${faqData.question}" создан!`);
    }
  };

  const handleCloseFAQModal = () => {
    setFaqModalOpen(false);
    setEditingFAQ(null);
  };

  const getHelpfulnessPercentage = (helpful: number, notHelpful: number) => {
    const total = helpful + notHelpful;
    return total > 0 ? Math.round((helpful / total) * 100) : 0;
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
                  <h1 className="text-2xl font-bold text-white">Часто задаваемые вопросы</h1>
                  <p className="text-white/90 font-medium">Управление базой знаний и FAQ</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAddFAQ}
                  className="admin-button-primary text-white px-4 py-2 rounded-md transition-colors"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                >
                  Добавить вопрос
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
                        <span className="text-white font-bold">❓</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего вопросов</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalFAQs}</dd>
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
                        <span className="text-white font-bold">👁️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Видимых</dt>
                        <dd className="text-lg font-medium text-gray-900">{visibleFAQs}</dd>
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
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего просмотров</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalViews}</dd>
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
                        <span className="text-white font-bold">👍</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Полезность</dt>
                        <dd className="text-lg font-medium text-gray-900">{averageHelpfulness}%</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Фильтры и поиск */}
            <div className="admin-card mb-6">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium admin-text-secondary mb-2">
                      Поиск вопросов
                    </label>
                    <input
                      type="text"
                      className="admin-input w-full"
                      placeholder="Поиск по вопросу или ответу..."
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
                      Приоритет
                    </label>
                    <select
                      className="admin-input w-full"
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                    >
                      <option value="Все">Все приоритеты</option>
                      {Object.values(priorityNames).map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
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
                      <option value="Видимые">Видимые</option>
                      <option value="Скрытые">Скрытые</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Список FAQ */}
            <div className="admin-card">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Список вопросов
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm admin-text-secondary">
                      Найдено: {filteredFAQs.length} из {totalFAQs} вопросов
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      onClick={handleAddFAQ}
                      className="admin-button-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
                      style={{ backgroundColor: 'var(--primary-burgundy)' }}
                    >
                      <span className="mr-2">❓</span>
                      Добавить вопрос
                    </button>
                  </div>
                </div>

                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--background-gray)' }}>
                      <span className="text-2xl">❓</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Вопросов не найдено</h3>
                    <p className="admin-text-secondary">
                      Попробуйте изменить критерии поиска или добавьте новый вопрос.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFAQs.map((faq) => (
                      <div
                        key={faq.id}
                        className="border rounded-lg p-4"
                        style={{ borderColor: 'var(--divider)' }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-lg">{categoryIcons[faq.category]}</span>
                              <h4 className="text-lg font-medium text-gray-900">
                                {faq.question}
                              </h4>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {categoryNames[faq.category]}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[faq.priority]}`}>
                                {priorityNames[faq.priority]}
                              </span>
                              {faq.isVisible ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Видимый
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Скрытый
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm admin-text-secondary mb-3">
                              {faq.answer}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs admin-text-secondary">
                              <div>
                                <span className="font-medium">Просмотры:</span>
                                <div>{faq.views}</div>
                              </div>
                              <div>
                                <span className="font-medium">Полезность:</span>
                                <div>
                                  👍 {faq.helpful} / 👎 {faq.notHelpful} 
                                  ({getHelpfulnessPercentage(faq.helpful, faq.notHelpful)}%)
                                </div>
                              </div>
                              <div>
                                <span className="font-medium">Создан:</span>
                                <div>{new Date(faq.createdAt).toLocaleDateString('ru-RU')}</div>
                              </div>
                              <div>
                                <span className="font-medium">Автор:</span>
                                <div>{faq.createdBy}</div>
                              </div>
                            </div>

                            {faq.updatedAt !== faq.createdAt && (
                              <div className="mt-2 text-xs admin-text-secondary">
                                <span className="font-medium">Обновлен:</span> {new Date(faq.updatedAt).toLocaleDateString('ru-RU')}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleToggleVisible(faq)}
                              className={`p-2 rounded ${
                                faq.isVisible 
                                  ? 'text-red-600 hover:bg-red-50' 
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={faq.isVisible ? 'Скрыть' : 'Показать'}
                            >
                              {faq.isVisible ? '👁️‍🗨️' : '👁️'}
                            </button>
                            <button
                              onClick={() => handleEditFAQ(faq)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="Редактировать"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteFAQ(faq)}
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
          </div>
        </main>
      </div>

      {/* Модальное окно создания/редактирования FAQ */}
      <FAQModal 
        isOpen={faqModalOpen}
        onClose={handleCloseFAQModal}
        faq={editingFAQ}
        onSave={handleSaveFAQ}
      />
    </div>
  );
} 