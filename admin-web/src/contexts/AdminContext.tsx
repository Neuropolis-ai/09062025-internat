'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  profileData?: {
    className?: string;
    cottage?: string;
    tokens?: number;
  };
  isActive: boolean;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  categoryId?: string;
  imageUrl?: string;
  isActive: boolean;
}

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

interface AdminContextType {
  // Users
  users: User[];
  students: User[];
  loading: boolean;
  error: string | null;
  loadUsers: () => Promise<void>;
  createUser: (userData: any) => Promise<void>;
  updateUser: (id: string, userData: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // Products
  products: Product[];
  loadProducts: () => Promise<void>;
  createProduct: (productData: any) => Promise<void>;
  updateProduct: (id: string, productData: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // FAQ
  faqs: FAQ[];
  faqStats: any;
  loadFaqs: (params?: { category?: string; search?: string; isActive?: boolean }) => Promise<void>;
  createFaq: (faqData: any) => Promise<void>;
  updateFaq: (id: string, faqData: any) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  loadFaqStats: () => Promise<void>;
  
  // System
  healthData: any;
  checkHealth: () => Promise<void>;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  
  // FAQ state
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [faqStats, setFaqStats] = useState<any>(null);
  
  // System state
  const [healthData, setHealthData] = useState<any>(null);
  
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Computed values
  const students = users.filter(user => user.role === 'STUDENT');

  // Auto-load data on mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Users functions
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getUsers();
      setUsers(data as User[]);
    } catch (err) {
      console.error('Ошибка загрузки пользователей:', err);
      setError('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Подготавливаем данные для API
      const apiUserData = {
        email: userData.email,
        passwordHash: 'LyceumPassword123!', // Default password hash
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'STUDENT',
      };
      
      // Используем правильный endpoint для создания пользователя
      const newUser = await apiClient.createUser(apiUserData);
      
      // Обновляем список пользователей
      await loadUsers();
      
      console.log('Пользователь успешно создан:', newUser);
    } catch (err) {
      console.error('Ошибка создания пользователя:', err);
      setError('Ошибка создания пользователя: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: any) => {
    try {
      setLoading(true);
      const updatedUser = await apiClient.updateUser(id, userData);
      setUsers(prev => prev.map(user => (user.id === id ? { ...user, ...updatedUser } : user)));
    } catch (err) {
      console.error('Ошибка обновления пользователя:', err);
      setError('Ошибка обновления пользователя');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      await apiClient.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error('Ошибка удаления пользователя:', err);
      setError('Ошибка удаления пользователя');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Products functions
  const loadProducts = async () => {
    try {
      const data = await apiClient.getProducts();
      setProducts(data as Product[]);
    } catch (err) {
      console.error('Ошибка загрузки продуктов:', err);
    }
  };

  const createProduct = async (productData: any) => {
    try {
      setLoading(true);
      const newProduct = await apiClient.createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
    } catch (err) {
      console.error('Ошибка создания продукта:', err);
      setError('Ошибка создания продукта');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: any) => {
    try {
      setLoading(true);
      const updatedProduct = await apiClient.updateProduct(id, productData);
      setProducts(prev => prev.map(p => (p.id === id ? updatedProduct : p)));
    } catch (err) {
      console.error('Ошибка обновления продукта:', err);
      setError('Ошибка обновления продукта');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      await apiClient.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Ошибка удаления продукта:', err);
      setError('Ошибка удаления продукта');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // FAQ functions
  const loadFaqs = async (params?: { category?: string; search?: string; isActive?: boolean }) => {
    try {
      const data = await apiClient.getFaqs(params);
      setFaqs(data as FAQ[]);
    } catch (err) {
      console.error('Ошибка загрузки вопросов:', err);
    }
  };

  const createFaq = async (faqData: any) => {
    try {
      setLoading(true);
      const newFaq = await apiClient.createFaq(faqData);
      setFaqs(prev => [...prev, newFaq]);
    } catch (err) {
      console.error('Ошибка создания вопроса:', err);
      setError('Ошибка создания вопроса');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFaq = async (id: string, faqData: any) => {
    try {
      setLoading(true);
      const updatedFaq = await apiClient.updateFaq(id, faqData);
      setFaqs(prev => prev.map(faq => (faq.id === id ? updatedFaq : faq)));
    } catch (err) {
      console.error('Ошибка обновления вопроса:', err);
      setError('Ошибка обновления вопроса');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFaq = async (id: string) => {
    try {
      setLoading(true);
      await apiClient.deleteFaq(id);
      setFaqs(prev => prev.filter(faq => faq.id !== id));
    } catch (err) {
      console.error('Ошибка удаления вопроса:', err);
      setError('Ошибка удаления вопроса');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadFaqStats = async () => {
    try {
      const data = await apiClient.getFaqStats();
      setFaqStats(data);
    } catch (err) {
      console.error('Ошибка загрузки статистики вопросов:', err);
    }
  };

  // System functions
  const checkHealth = async () => {
    try {
      const data = await apiClient.getHealth();
      setHealthData(data);
    } catch (err) {
      console.error('Ошибка проверки здоровья системы:', err);
    }
  };

  const value: AdminContextType = {
    // Users
    users,
    students,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    
    // Products
    products,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    
    // FAQ
    faqs,
    faqStats,
    loadFaqs,
    createFaq,
    updateFaq,
    deleteFaq,
    loadFaqStats,
    
    // System
    healthData,
    checkHealth,
    
    // UI State
    sidebarOpen,
    setSidebarOpen,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin должен использоваться внутри AdminProvider');
  }
  return context;
} 