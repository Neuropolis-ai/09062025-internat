'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import AuctionModal from '../../components/AuctionModal';

interface AuctionLot {
  id: string;
  title: string;
  description: string;
  startingPrice: string;
  currentPrice: string;
  imageUrl?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DRAFT' | 'CANCELLED';
  startTime: string;
  endTime: string;
  minBidIncrement: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
  };
  winner?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  _count: {
    bids: number;
  };
}

interface LotFormData {
  title: string;
  description: string;
  startingPrice: number;
  minBidIncrement: number;
  startTime: string;
  endTime: string;
  imageUrl?: string;
}

export default function AuctionPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedStatus, setSelectedStatus] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [auctionModalOpen, setAuctionModalOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<AuctionLot | null>(null);
  const [auctions, setAuctions] = useState<AuctionLot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/v1/auctions');
      if (response.ok) {
        const data = await response.json();
        setAuctions(data);
      } else {
        console.error('Ошибка загрузки аукционов:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка загрузки аукционов:', error);
    } finally {
      setLoading(false);
    }
  };

  // Статистические данные
  const totalLots = auctions.length;
  const activeLots = auctions.filter(lot => lot.status === 'ACTIVE').length;
  const completedLots = auctions.filter(lot => lot.status === 'COMPLETED').length;
  const totalBids = auctions.reduce((sum, lot) => sum + lot._count.bids, 0);

  // Фильтрация лотов
  const filteredLots = auctions.filter(lot => {
    const matchesStatus = selectedStatus === "Все" || 
      (selectedStatus === "Активные" && lot.status === "ACTIVE") ||
      (selectedStatus === "Завершенные" && lot.status === "COMPLETED") ||
      (selectedStatus === "Черновики" && lot.status === "DRAFT") ||
      (selectedStatus === "Отмененные" && lot.status === "CANCELLED");
    const matchesSearch = lot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lot.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Активный';
      case 'COMPLETED': return 'Завершен';
      case 'DRAFT': return 'Черновик';
      case 'CANCELLED': return 'Отменен';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'DRAFT': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
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

  const handleDeleteLot = async (lot: AuctionLot) => {
    if (confirm(`Вы уверены, что хотите удалить лот "${lot.title}"?`)) {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/auctions/${lot.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await loadAuctions();
          alert(`Лот "${lot.title}" удален`);
        } else {
          alert('Ошибка при удалении лота');
        }
      } catch (error) {
        console.error('Ошибка при удалении:', error);
        alert('Ошибка при удалении лота');
      }
    }
  };

  const handleViewBids = async (lot: AuctionLot) => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/auctions/${lot.id}/bids`);
      if (response.ok) {
        const bids = await response.json();
        alert(`Ставки для лота: ${lot.title}\nВсего ставок: ${bids.length}\n\n${bids.map((bid: any) => 
          `${bid.amount} L-Coin от ${bid.bidder.firstName} ${bid.bidder.lastName} (${new Date(bid.createdAt).toLocaleString('ru-RU')})`
        ).join('\n')}`);
      } else {
        alert('Ошибка при загрузке ставок');
      }
    } catch (error) {
      console.error('Ошибка при загрузке ставок:', error);
      alert('Ошибка при загрузке ставок');
    }
  };

  const handleAddLot = () => {
    setEditingLot(null);
    setAuctionModalOpen(true);
  };

  const handleSaveLot = async (lotData: LotFormData) => {
    try {
      if (editingLot) {
        // Обновление лота
        const response = await fetch(`http://localhost:3001/api/v1/auctions/${editingLot.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lotData),
        });

        if (response.ok) {
          await loadAuctions();
          alert(`Лот "${lotData.title}" обновлен!`);
        } else {
          alert('Ошибка при обновлении лота');
        }
      } else {
        // Создание лота
        const response = await fetch('http://localhost:3001/api/v1/auctions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lotData),
        });

        if (response.ok) {
          await loadAuctions();
          alert(`Лот "${lotData.title}" создан!`);
        } else {
          alert('Ошибка при создании лота');
        }
      }
    } catch (error) {
      console.error('Ошибка при сохранении лота:', error);
      alert('Ошибка при сохранении лота');
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
                      {["Все", "Одежда", "Канцтовары", "Сувениры", "Книги", "Игры"].map(category => (
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
                      {["Все", "Активные", "Завершенные", "Черновики", "Отмененные"].map(status => (
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
                          {lot.status === 'ACTIVE' && (
                            <span className="text-xs admin-text-secondary">
                              {formatTimeRemaining(lot.endTime)}
                            </span>
                          )}
                        </div>

                        {/* Изображение лота */}
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 rounded-lg flex items-center justify-center text-4xl"
                               style={{ backgroundColor: 'var(--background-light)' }}>
                            {lot.imageUrl && <img src={lot.imageUrl} alt={lot.title} className="w-full h-full object-cover rounded-lg" />}
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
                              <span className="font-medium">{lot.startingPrice} токенов</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="admin-text-secondary">Текущая цена:</span>
                              <span className="font-bold" style={{ color: 'var(--primary-burgundy)' }}>
                                {lot.currentPrice} токенов
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="admin-text-secondary">Ставок:</span>
                              <span className="font-medium">{lot._count.bids}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="admin-text-secondary">Продавец:</span>
                              <span className="font-medium">{lot.creator.firstName} {lot.creator.lastName}</span>
                            </div>
                            {lot.winner && (
                              <div className="flex justify-between text-sm">
                                <span className="admin-text-secondary">Победитель:</span>
                                <span className="font-medium text-green-600">{lot.winner.firstName} {lot.winner.lastName}</span>
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