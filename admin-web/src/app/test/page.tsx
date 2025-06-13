'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';

interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface ApiProduct {
  id: string;
  name: string;
  price: string;
  description?: string;
}

export default function TestPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [usersData, setUsersData] = useState<ApiUser[]>([]);
  const [productsData, setProductsData] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTestData();
  }, []);

  const loadTestData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Параллельно загружаем все данные
      const [health, users, products] = await Promise.all([
        apiClient.getHealth(),
        apiClient.getUsers(),
        apiClient.getProducts()
      ]);

      setHealthData(health);
      setUsersData(users as ApiUser[]);
      setProductsData(products as ApiProduct[]);
    } catch (err) {
      console.error('Ошибка загрузки тестовых данных:', err);
      setError('Ошибка загрузки данных из API');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Загружаем тестовые данные...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4 text-4xl">⚠️</div>
          <p className="text-lg text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadTestData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  const students = usersData.filter(user => user.role === 'STUDENT');
  const admins = usersData.filter(user => user.role === 'ADMIN');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Тестирование API Лицея
          </h1>
          <p className="text-lg text-gray-600">
            Проверка подключения к Backend API
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Health Check */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <h3 className="ml-3 text-lg font-semibold">Состояние системы</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Статус:</strong> {healthData?.status}</p>
              <p><strong>База данных:</strong> {healthData?.database}</p>
              <p><strong>Время работы:</strong> {Math.round(healthData?.uptime || 0)}s</p>
              <p><strong>Среда:</strong> {healthData?.environment}</p>
            </div>
          </div>

          {/* Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">👥</span>
              </div>
              <h3 className="ml-3 text-lg font-semibold">Пользователи</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Всего:</strong> {usersData.length}</p>
              <p><strong>Студенты:</strong> {students.length}</p>
              <p><strong>Администраторы:</strong> {admins.length}</p>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Последние пользователи:</h4>
              <div className="space-y-1">
                {usersData.slice(0, 3).map((user) => (
                  <div key={user.id} className="text-xs bg-gray-50 p-2 rounded">
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-gray-500">{user.email} ({user.role})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🛍️</span>
              </div>
              <h3 className="ml-3 text-lg font-semibold">L-shop Товары</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Всего товаров:</strong> {productsData.length}</p>
              {productsData.length > 0 && (
                <p><strong>Средняя цена:</strong> {Math.round(productsData.reduce((sum, p) => sum + parseInt(p.price), 0) / productsData.length)} токенов</p>
              )}
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Товары:</h4>
              <div className="space-y-1">
                {productsData.slice(0, 3).map((product) => (
                  <div key={product.id} className="text-xs bg-gray-50 p-2 rounded">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-gray-500">{product.price} токенов</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints Status */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Статус API Endpoints</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm">Health ✓</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm">Users ✓</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm">Products ✓</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              <span className="text-sm">Protected APIs 🔐</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <div className="space-x-4">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🏠 Главная панель
            </a>
            <a
              href="/students"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              👥 Студенты
            </a>
            <a
              href="http://localhost:3001/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              📚 Swagger API
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 