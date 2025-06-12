'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import AuctionModal from '../../components/AuctionModal';

interface AuctionLot {
  id: number;
  title: string;
  description: string;
  startPrice: number;
  currentPrice: number;
  category: string;
  image: string;
  status: 'active' | 'completed' | 'upcoming';
  endDate: string;
  bidsCount: number;
  winner?: string;
  seller: string;
}

interface LotFormData {
  title: string;
  description: string;
  startPrice: number;
  category: string;
  image: string;
  duration: number;
  seller: string;
  minBidStep: number;
}

// Тестовые данные лотов
const mockLots: AuctionLot[] = [
  {
    id: 1,
    title: "Футболка с логотипом лицея",
    description: "Эксклюзивная футболка с символикой лицея, размер M",
    startPrice: 200,
    currentPrice: 450,
    category: "Одежда",
    image: "👕",
    status: "active",
    endDate: "2024-12-15T18:00:00Z",
    bidsCount: 12,
    seller: "Администрация"
  },
  {
    id: 2,
    title: "Набор канцтоваров премиум",
    description: "Качественные ручки, карандаши, маркеры в подарочной упаковке",
    startPrice: 150,
    currentPrice: 280,
    category: "Канцтовары",
    image: "📝",
    status: "active",
    endDate: "2024-12-14T15:30:00Z",
    bidsCount: 8,
    seller: "Учебная часть"
  },
  {
    id: 3,
    title: "Кружка с гербом лицея",
    description: "Керамическая кружка с официальным гербом лицея",
    startPrice: 100,
    currentPrice: 350,
    category: "Сувениры",
    image: "☕",
    status: "completed",
    endDate: "2024-12-10T12:00:00Z",
    bidsCount: 15,
    winner: "Петрова Мария Сергеевна",
    seller: "Творческая мастерская"
  },
  {
    id: 4,
    title: "Книга стихов выпускников",
    description: "Авторский сборник стихов от выпускников лицея",
    startPrice: 300,
    currentPrice: 300,
    category: "Книги",
    image: "📚",
    status: "upcoming",
    endDate: "2024-12-20T20:00:00Z",
    bidsCount: 0,
    seller: "Литературный клуб"
  },
  {
    id: 5,
    title: "Настольная игра 'Лицейская монополия'",
    description: "Уникальная настольная игра на тему лицея",
    startPrice: 500,
    currentPrice: 750,
    category: "Игры",
    image: "🎲",
    status: "active",
    endDate: "2024-12-16T16:00:00Z",
    bidsCount: 6,
    seller: "Совет учеников"
  }
];

const categories = ["Все", "Одежда", "Канцтовары", "Сувениры", "Книги", "Игры"];
const statusFilters = ["Все", "Активные", "Завершенные", "Предстоящие"];

export default function AuctionPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedStatus, setSelectedStatus] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [auctionModalOpen, setAuctionModalOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<AuctionLot | null>(null);

  // Статистические данные
  const totalLots = mockLots.length;
  const activeLots = mockLots.filter(lot => lot.status === 'active').length;
  const completedLots = mockLots.filter(lot => lot.status === 'completed').length;
  const totalBids = mockLots.reduce((sum, lot) => sum + lot.bidsCount, 0);

  // Фильтрация лотов
  const filteredLots = mockLots.filter(lot => {
    const matchesCategory = selectedCategory === "Все" || lot.category === selectedCategory;
    const matchesStatus = selectedStatus === "Все" || 
      (selectedStatus === "Активные" && lot.status === "active") ||
      (selectedStatus === "Завершенные" && lot.status === "completed") ||
      (selectedStatus === "Предстоящие" && lot.status === "upcoming");
    const matchesSearch = lot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lot.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активный';
      case 'completed': return 'Завершен';
      case 'upcoming': return 'Предстоящий';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Завершен";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}д ${hours}ч`;
    if (hours > 0) return `${hours}ч ${minutes}м`;
    return `${minutes}м`;
  };

  const handleEditLot = (lot: AuctionLot) => {
    setEditingLot(lot);
    setAuctionModalOpen(true);
  };

  const handleDeleteLot = (lot: AuctionLot) => {
    if (confirm(`Вы уверены, что хотите удалить лот "${lot.title}"?`)) {
      // TODO: API-запрос на удаление
      console.log('Удаление лота:', lot);
      alert(`Лот "${lot.title}" удален`);
    }
  };

  const handleViewBids = (lot: AuctionLot) => {
    // TODO: Открыть модал просмотра ставок
    console.log('Просмотр ставок лота:', lot);
    alert(`Просмотр ставок для лота: ${lot.title}\nСтавок: ${lot.bidsCount}`);
  };

  const handleAddLot = () => {
    setEditingLot(null);
    setAuctionModalOpen(true);
  };

  const handleSaveLot = (lotData: LotFormData) => {
    if (editingLot) {
      // TODO: API-запрос на обновление лота
      console.log('Обновление лота:', { ...editingLot, ...lotData });
      alert(`Лот "${lotData.title}" обновлен!`);
    } else {
      // TODO: API-запрос на создание лота
      console.log('Создание лота:', lotData);
      alert(`Лот "${lotData.title}" создан!`);
    }
  };

  const handleCloseModal = () => {
    setAuctionModalOpen(false);
    setEditingLot(null);
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
                  <h1 className="text-2xl font-bold text-white">Аукцион</h1>
                  <p className="text-white/90 font-medium">Управление лотами и торгами</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAddLot}
                  className="admin-button-primary text-white px-4 py-2 rounded-md transition-colors"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                >
                  Создать лот
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Статистические карточки */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="admin-card">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center" 
                           style={{ backgroundColor: 'var(--primary-burgundy)' }}>
                        <span className="text-white font-bold">🎯</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего лотов</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalLots}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center"
                           style={{ backgroundColor: '#10B981' }}>
                        <span className="text-white font-bold">🔥</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Активных</dt>
                        <dd className="text-lg font-medium text-gray-900">{activeLots}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center"
                           style={{ backgroundColor: '#6B7280' }}>
                        <span className="text-white font-bold">✅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Завершенных</dt>
                        <dd className="text-lg font-medium text-gray-900">{completedLots}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md flex items-center justify-center"
                           style={{ backgroundColor: '#F59E0B' }}>
                        <span className="text-white font-bold">💰</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего ставок</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalBids}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Фильтры и поиск */}
            <div className="admin-card">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Лоты аукциона
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm admin-text-secondary">
                      Управление аукционными лотами лицея
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      type="button"
                      onClick={handleAddLot}
                      className="admin-button-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
                      style={{ backgroundColor: 'var(--primary-burgundy)' }}
                    >
                      <span className="mr-2">🎯</span>
                      Создать лот
                    </button>
                  </div>
                </div>

                {/* Поиск и фильтры */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                      Поиск лотов
                    </label>
                    <input
                      type="text"
                      id="search"
                      className="admin-input w-full"
                      placeholder="Введите название или описание..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Категория
                    </label>
                    <select
                      id="category"
                      className="admin-input w-full"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Статус
                    </label>
                    <select
                      id="status"
                      className="admin-input w-full"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      {statusFilters.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Сетка лотов */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLots.map((lot) => (
                    <div key={lot.id} className="admin-card hover:shadow-lg transition-shadow">
                      <div className="p-4">
                        {/* Статус и время */}
                        <div className="flex justify-between items-start mb-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lot.status)}`}>
                            {getStatusText(lot.status)}
                          </span>
                          {lot.status === 'active' && (
                            <span className="text-xs admin-text-secondary">
                              {formatTimeRemaining(lot.endDate)}
                            </span>
                          )}
                        </div>

                        {/* Изображение лота */}
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 rounded-lg flex items-center justify-center text-4xl"
                               style={{ backgroundColor: 'var(--background-light)' }}>
                            {lot.image}
                          </div>
                        </div>
                        
                        {/* Информация о лоте */}
                        <div className="text-center mb-4">
                          <h4 className="text-lg font-medium text-gray-900 mb-1">
                            {lot.title}
                          </h4>
                          <p className="text-sm admin-text-secondary mb-3">
                            {lot.description}
                          </p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="admin-text-secondary">Стартовая цена:</span>
                              <span className="font-medium">{lot.startPrice} токенов</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="admin-text-secondary">Текущая цена:</span>
                              <span className="font-bold" style={{ color: 'var(--primary-burgundy)' }}>
                                {lot.currentPrice} токенов
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="admin-text-secondary">Ставок:</span>
                              <span className="font-medium">{lot.bidsCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="admin-text-secondary">Продавец:</span>
                              <span className="font-medium">{lot.seller}</span>
                            </div>
                            {lot.winner && (
                              <div className="flex justify-between text-sm">
                                <span className="admin-text-secondary">Победитель:</span>
                                <span className="font-medium text-green-600">{lot.winner}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Действия */}
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleViewBids(lot)}
                            className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                            title="Просмотр ставок"
                          >
                            <span className="text-lg">👁️</span>
                          </button>
                          <button
                            onClick={() => handleEditLot(lot)}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            title="Редактировать"
                          >
                            <span className="text-lg">✏️</span>
                          </button>
                          <button
                            onClick={() => handleDeleteLot(lot)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Удалить"
                          >
                            <span className="text-lg">🗑️</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Результаты поиска */}
                {filteredLots.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Лоты не найдены
                    </h3>
                    <p className="text-sm admin-text-secondary">
                      Попробуйте изменить критерии поиска или создать новый лот
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Модальное окно лота */}
      <AuctionModal 
        isOpen={auctionModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveLot}
        editLot={editingLot}
      />
    </div>
  );
} 