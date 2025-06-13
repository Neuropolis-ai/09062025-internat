'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import FAQModal from '../../components/FAQModal';
import { useAdmin } from '../../contexts/AdminContext';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  sortOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FAQFormData {
  question: string;
  answer: string;
  category?: string;
  sortOrder?: number;
  isActive: boolean;
}

const categoryNames = {
  'Учебные вопросы': 'academic',
  'Общежитие': 'dormitory', 
  'Финансы и L-Coin': 'finance',
  'Технические вопросы': 'technical',
  'Общие вопросы': 'general'
};

const categoryIcons = {
  academic: '📚',
  dormitory: '🏠',
  finance: '💰',
  technical: '💻',
  general: '❓'
};

export default function FAQPage() {
  const { 
    faqs, 
    faqStats, 
    loading, 
    error, 
    loadFaqs, 
    createFaq, 
    updateFaq, 
    deleteFaq, 
    loadFaqStats,
    sidebarOpen,
    setSidebarOpen 
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");
  const [selectedStatus, setSelectedStatus] = useState<string>("Все");
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  // Загружаем данные при монтировании
  useEffect(() => {
    loadFaqs();
    loadFaqStats();
  }, []);

  // Фильтрация FAQ
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Все" || faq.category === selectedCategory;
    const matchesStatus = selectedStatus === "Все" ||
                         (selectedStatus === "Активные" && faq.isActive) ||
                         (selectedStatus === "Неактивные" && !faq.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFaqModalOpen(true);
  };

  const handleDeleteFAQ = async (faq: FAQ) => {
    if (confirm(`Вы уверены, что хотите удалить вопрос "${faq.question}"?`)) {
      try {
        await deleteFaq(faq.id);
        alert(`Вопрос "${faq.question}" удален`);
      } catch (err) {
        alert('Ошибка при удалении вопроса');
      }
    }
  };

  const handleToggleVisible = async (faq: FAQ) => {
    try {
      await updateFaq(faq.id, { ...faq, isActive: !faq.isActive });
      alert(`Видимость вопроса "${faq.question}" изменена`);
    } catch (err) {
      alert('Ошибка при изменении видимости');
    }
  };

  const handleAddFAQ = () => {
    setEditingFAQ(null);
    setFaqModalOpen(true);
  };

  const handleSaveFAQ = async (faqData: FAQFormData) => {
    try {
      if (editingFAQ) {
        await updateFaq(editingFAQ.id, faqData);
        alert(`Вопрос "${faqData.question}" обновлен!`);
      } else {
        await createFaq(faqData);
        alert(`Вопрос "${faqData.question}" создан!`);
      }
      setFaqModalOpen(false);
      setEditingFAQ(null);
    } catch (err) {
      alert('Ошибка при сохранении вопроса');
    }
  };

  const handleCloseFAQModal = () => {
    setFaqModalOpen(false);
    setEditingFAQ(null);
  };

  // Статистика
  const totalFAQs = faqStats?.total || faqs.length;
  const activeFAQs = faqStats?.active || faqs.filter(f => f.isActive).length;
  const inactiveFAQs = faqStats?.inactive || faqs.filter(f => !f.isActive).length;
  const totalCategories = faqStats?.categories || new Set(faqs.map(f => f.category)).size;

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
                        <dt className="text-sm font-medium admin-text-secondary truncate">Активных</dt>
                        <dd className="text-lg font-medium text-gray-900">{activeFAQs}</dd>
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
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего категорий</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalCategories}</dd>
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
                      {Object.keys(categoryNames).map(category => (
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
                              <span className="text-lg">{categoryIcons[faq.category as keyof typeof categoryIcons]}</span>
                              <h4 className="text-lg font-medium text-gray-900">
                                {faq.question}
                              </h4>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {faq.category}
                              </span>
                              {faq.isActive ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Активный
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Неактивный
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm admin-text-secondary mb-3">
                              {faq.answer}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs admin-text-secondary">
                              <div>
                                <span className="font-medium">Создан:</span>
                                <div>{new Date(faq.createdAt).toLocaleDateString('ru-RU')}</div>
                              </div>
                              <div>
                                <span className="font-medium">Категория:</span>
                                <div>{faq.category || 'Не указана'}</div>
                              </div>
                              <div>
                                <span className="font-medium">Порядок:</span>
                                <div>{faq.sortOrder || 0}</div>
                              </div>
                              <div>
                                <span className="font-medium">Статус:</span>
                                <div>{faq.isActive ? 'Активный' : 'Неактивный'}</div>
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
                                faq.isActive 
                                  ? 'text-red-600 hover:bg-red-50' 
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={faq.isActive ? 'Сделать неактивным' : 'Сделать активным'}
                            >
                              {faq.isActive ? '👁️‍🗨️' : '👁️'}
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