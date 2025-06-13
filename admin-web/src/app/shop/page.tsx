'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ProductModal from '../../components/ProductModal';
import { useAdmin } from '../../contexts/AdminContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: {
    id: string;
    name: string;
    description?: string;
  };
  stockQuantity: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stockQuantity: number;
  imageUrl?: string;
  isActive: boolean;
}

export default function ShopPage() {
  const { loading, error } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [productLoading, setProductLoading] = useState(false);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setProductLoading(true);
      const response = await fetch('http://localhost:3001/api/v1/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Ошибка загрузки продуктов:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
    } finally {
      setProductLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/products/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Ошибка загрузки категорий:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  // Статистические данные
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);
  const outOfStock = products.filter(p => p.stockQuantity === 0).length;

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "Все" || product.category.name === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggleProduct = async (productId: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const response = await fetch(`http://localhost:3001/api/v1/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !product.isActive
        }),
      });

      if (response.ok) {
        await loadProducts(); // Перезагружаем данные
        alert(`Статус товара "${product.name}" изменен!`);
      } else {
        alert('Ошибка при изменении статуса товара');
      }
    } catch (error) {
      console.error('Ошибка при изменении статуса:', error);
      alert('Ошибка при изменении статуса товара');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`Вы уверены, что хотите удалить товар "${product.name}"?`)) {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/products/${product.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await loadProducts(); // Перезагружаем данные
          alert(`Товар "${product.name}" удален`);
        } else {
          alert('Ошибка при удалении товара');
        }
      } catch (error) {
        console.error('Ошибка при удалении:', error);
        alert('Ошибка при удалении товара');
      }
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (productData: ProductFormData) => {
    try {
      if (editingProduct) {
        // Обновление товара
        const response = await fetch(`http://localhost:3001/api/v1/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });

        if (response.ok) {
          await loadProducts();
          alert(`Товар "${productData.name}" обновлен!`);
        } else {
          alert('Ошибка при обновлении товара');
        }
      } else {
        // Создание товара
        const response = await fetch('http://localhost:3001/api/v1/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });

        if (response.ok) {
          await loadProducts();
          alert(`Товар "${productData.name}" добавлен!`);
        } else {
          alert('Ошибка при создании товара');
        }
      }
    } catch (error) {
      console.error('Ошибка при сохранении товара:', error);
      alert('Ошибка при сохранении товара');
    }
  };

  const handleCloseModal = () => {
    setProductModalOpen(false);
    setEditingProduct(null);
  };

  const categoryOptions = ["Все", ...categories.map(cat => cat.name)];

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
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="admin-card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-lg">📦</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Всего товаров</p>
                  <p className="text-2xl font-semibold admin-text">{totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="admin-card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-lg">✅</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Активные</p>
                  <p className="text-2xl font-semibold admin-text">{activeProducts}</p>
                </div>
              </div>
            </div>

            <div className="admin-card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-lg">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Общий остаток</p>
                  <p className="text-2xl font-semibold admin-text">{totalStock}</p>
                </div>
              </div>
            </div>

            <div className="admin-card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 text-lg">⚠️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Нет в наличии</p>
                  <p className="text-2xl font-semibold admin-text">{outOfStock}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Фильтры и поиск */}
          <div className="admin-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Поиск */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Поиск товаров..."
                    className="admin-input pl-10 pr-4 py-2 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                </div>

                {/* Фильтр по категориям */}
                <select
                  className="admin-input"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-500">
                Показано: {filteredProducts.length} из {totalProducts}
              </div>
            </div>
          </div>

          {/* Список товаров */}
          <div className="admin-card">
            {productLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-500">Загрузка товаров...</div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📦</span>
                <h3 className="text-lg font-medium admin-text mb-2">Товары не найдены</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || selectedCategory !== "Все" ? 
                    "Попробуйте изменить фильтры поиска" : 
                    "Добавьте первый товар в магазин"
                  }
                </p>
                {!searchQuery && selectedCategory === "Все" && (
                  <button
                    onClick={handleAddProduct}
                    className="admin-button-primary"
                  >
                    Добавить товар
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`border rounded-lg p-4 transition-all hover:shadow-lg ${
                      product.isActive ? 'border-gray-200' : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    {/* Изображение товара */}
                    <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-4xl">📦</span>
                      )}
                    </div>

                    {/* Информация о товаре */}
                    <div className="space-y-2">
                      <h3 className={`font-semibold text-lg ${!product.isActive ? 'text-gray-500' : 'admin-text'}`}>
                        {product.name}
                      </h3>
                      
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold admin-text">
                          {product.price} ₽
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          product.stockQuantity > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stockQuantity} шт
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{product.category.name}</span>
                        <span className={`px-2 py-1 rounded-full ${
                          product.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.isActive ? 'Активен' : 'Неактивен'}
                        </span>
                      </div>
                    </div>

                    {/* Действия */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleToggleProduct(product.id)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          product.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {product.isActive ? 'Деактивировать' : 'Активировать'}
                      </button>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Редактировать"
                        >
                          <span className="text-lg">✏️</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Удалить"
                        >
                          <span className="text-lg">🗑️</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={productModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        editProduct={editingProduct}
        categories={categories}
      />
    </div>
  );
} 