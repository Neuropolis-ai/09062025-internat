'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ProductModal from '../../components/ProductModal';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  isActive: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  isActive: boolean;
}

// Тестовые данные товаров
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Ручка гелевая синяя",
    description: "Качественная гелевая ручка для письма",
    price: 25,
    category: "Канцтовары",
    stock: 150,
    image: "🖊️",
    isActive: true
  },
  {
    id: 2,
    name: "Тетрадь 48 листов",
    description: "Тетрадь в клетку для записей",
    price: 45,
    category: "Канцтовары", 
    stock: 80,
    image: "📓",
    isActive: true
  },
  {
    id: 3,
    name: "Шоколадный батончик",
    description: "Вкусный молочный шоколад",
    price: 60,
    category: "Еда",
    stock: 200,
    image: "🍫",
    isActive: true
  },
  {
    id: 4,
    name: "Сок яблочный 0.2л",
    description: "Натуральный яблочный сок",
    price: 35,
    category: "Напитки",
    stock: 120,
    image: "🧃",
    isActive: true
  },
  {
    id: 5,
    name: "Значок лицея",
    description: "Памятный значок с символикой лицея",
    price: 150,
    category: "Сувениры",
    stock: 50,
    image: "🏅",
    isActive: true
  },
  {
    id: 6,
    name: "Блокнот А5",
    description: "Блокнот для заметок в твердой обложке",
    price: 120,
    category: "Канцтовары",
    stock: 0,
    image: "📔",
    isActive: false
  }
];

const categories = ["Все", "Канцтовары", "Еда", "Напитки", "Сувениры"];

export default function ShopPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Статистические данные
  const totalProducts = mockProducts.length;
  const activeProducts = mockProducts.filter(p => p.isActive).length;
  const totalStock = mockProducts.reduce((sum, p) => sum + p.stock, 0);
  const outOfStock = mockProducts.filter(p => p.stock === 0).length;

  // Фильтрация товаров
  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === "Все" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleProduct = (productId: number) => {
    // TODO: API-запрос на изменение статуса товара
    console.log('Изменение статуса товара:', productId);
    alert('Статус товара изменен!');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`Вы уверены, что хотите удалить товар "${product.name}"?`)) {
      // TODO: API-запрос на удаление
      console.log('Удаление товара:', product);
      alert(`Товар "${product.name}" удален`);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleSaveProduct = (productData: ProductFormData) => {
    if (editingProduct) {
      // TODO: API-запрос на обновление товара
      console.log('Обновление товара:', { ...editingProduct, ...productData });
      alert(`Товар "${productData.name}" обновлен!`);
    } else {
      // TODO: API-запрос на создание товара
      console.log('Создание товара:', productData);
      alert(`Товар "${productData.name}" добавлен!`);
    }
  };

  const handleCloseModal = () => {
    setProductModalOpen(false);
    setEditingProduct(null);
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
                  <h1 className="text-2xl font-bold text-white">L-shop</h1>
                  <p className="text-white/90 font-medium">Управление магазином лицея</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAddProduct}
                  className="admin-button-primary text-white px-4 py-2 rounded-md transition-colors"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                >
                  Добавить товар
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
                        <span className="text-white font-bold">📦</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Всего товаров</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalProducts}</dd>
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
                        <span className="text-white font-bold">✅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Активных</dt>
                        <dd className="text-lg font-medium text-gray-900">{activeProducts}</dd>
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
                           style={{ backgroundColor: '#3B82F6' }}>
                        <span className="text-white font-bold">📊</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Общий остаток</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalStock}</dd>
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
                           style={{ backgroundColor: '#EF4444' }}>
                        <span className="text-white font-bold">⚠️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium admin-text-secondary truncate">Нет в наличии</dt>
                        <dd className="text-lg font-medium text-gray-900">{outOfStock}</dd>
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
                      Каталог товаров
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm admin-text-secondary">
                      Управление товарами в L-shop
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="admin-button-primary inline-flex items-center px-4 py-2 text-sm font-medium rounded-md"
                      style={{ backgroundColor: 'var(--primary-burgundy)' }}
                    >
                      <span className="mr-2">➕</span>
                      Добавить товар
                    </button>
                  </div>
                </div>

                {/* Поиск и фильтры */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                      Поиск товаров
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
                </div>
                
                {/* Сетка товаров */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="admin-card hover:shadow-lg transition-shadow">
                      <div className="p-4">
                        {/* Изображение товара */}
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 rounded-lg flex items-center justify-center text-4xl"
                               style={{ backgroundColor: 'var(--background-light)' }}>
                            {product.image}
                          </div>
                        </div>
                        
                        {/* Информация о товаре */}
                        <div className="text-center mb-4">
                          <h4 className="text-lg font-medium text-gray-900 mb-1">
                            {product.name}
                          </h4>
                          <p className="text-sm admin-text-secondary mb-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <span className="text-lg font-bold" style={{ color: 'var(--primary-burgundy)' }}>
                              {product.price} токенов
                            </span>
                          </div>
                          <div className="flex items-center justify-center space-x-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stock > 0 ? `В наличии: ${product.stock}` : 'Нет в наличии'}
                            </span>
                            <span className="admin-text-secondary">
                              {product.category}
                            </span>
                          </div>
                        </div>
                        
                        {/* Статус и действия */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-center">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={product.isActive}
                                onChange={() => handleToggleProduct(product.id)}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">
                                {product.isActive ? 'Активен' : 'Неактивен'}
                              </span>
                            </label>
                          </div>
                          
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                              title="Редактировать"
                            >
                              <span className="text-lg">✏️</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product)}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1"
                              title="Удалить"
                            >
                              <span className="text-lg">🗑️</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Результаты поиска */}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Товары не найдены
                    </h3>
                    <p className="text-sm admin-text-secondary">
                      Попробуйте изменить критерии поиска или добавить новый товар
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Модальное окно товара */}
      <ProductModal 
        isOpen={productModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        editProduct={editingProduct}
      />
    </div>
  );
} 