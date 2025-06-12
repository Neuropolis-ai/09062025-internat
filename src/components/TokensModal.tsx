'use client';

import React, { useState } from 'react';
import Modal from './ui/Modal';

interface Student {
  id: string;
  fullName: string;
  class: string;
  cottage: string;
  linn: string;
  accountTokens: number;
  creditTokens: number;
  achievements: string[];
  positions: string[];
  belongsTo: string;
  createdAt: string;
}

interface TokensModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (studentId: string, operation: 'add' | 'subtract', accountType: 'account' | 'credit', amount: number, comment: string) => void;
}

export default function TokensModal({ isOpen, onClose, student, onSave }: TokensModalProps) {
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [accountType, setAccountType] = useState<'account' | 'credit'>('account');
  const [amount, setAmount] = useState<number>(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!student) return;
    
    // Валидация
    if (amount <= 0) {
      alert('Введите корректную сумму токенов');
      return;
    }
    
    if (!comment.trim()) {
      alert('Введите комментарий к операции');
      return;
    }
    
    // Проверка на возможность списания
    if (operation === 'subtract') {
      const currentBalance = accountType === 'account' ? student.accountTokens : student.creditTokens;
      if (amount > currentBalance) {
        alert(`Недостаточно токенов для списания. Доступно: ${currentBalance} L-Coin`);
        return;
      }
    }

    onSave(student.id, operation, accountType, amount, comment);
    
    // Сброс формы
    setOperation('add');
    setAccountType('account');
    setAmount(0);
    setComment('');
    
    onClose();
  };

  const getOperationText = () => {
    return operation === 'add' ? 'Начислить' : 'Списать';
  };

  const getAccountTypeText = () => {
    return accountType === 'account' ? 'расчетного счета' : 'кредитного счета';
  };

  const getCurrentBalance = () => {
    if (!student) return 0;
    return accountType === 'account' ? student.accountTokens : student.creditTokens;
  };

  const getNewBalance = () => {
    const currentBalance = getCurrentBalance();
    if (operation === 'add') {
      return currentBalance + amount;
    } else {
      return Math.max(0, currentBalance - amount);
    }
  };

  if (!student) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={`Управление токенами: ${student.fullName}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Информация об ученике */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-gray)' }}>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Текущие балансы</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="admin-text-secondary">Расчетный счет:</span>
              <span className="font-medium text-gray-900">{student.accountTokens} L-Coin</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="admin-text-secondary">Кредитный счет:</span>
              <span className="font-medium text-gray-900">{student.creditTokens} L-Coin</span>
            </div>
          </div>
        </div>

        {/* Тип операции */}
        <div>
          <label className="block text-sm font-medium admin-text-secondary mb-3">
            Тип операции *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setOperation('add')}
              className={`p-4 rounded-lg border text-center transition-colors ${
                operation === 'add' 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-2">➕</div>
              <div className="font-medium">Начислить токены</div>
              <div className="text-sm admin-text-secondary">Добавить L-Coin на счет</div>
            </button>
            
            <button
              type="button"
              onClick={() => setOperation('subtract')}
              className={`p-4 rounded-lg border text-center transition-colors ${
                operation === 'subtract' 
                  ? 'border-red-500 bg-red-50 text-red-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-2">➖</div>
              <div className="font-medium">Списать токены</div>
              <div className="text-sm admin-text-secondary">Снять L-Coin со счета</div>
            </button>
          </div>
        </div>

        {/* Тип счета */}
        <div>
          <label className="block text-sm font-medium admin-text-secondary mb-2">
            Тип счета *
          </label>
          <select
            required
            className="admin-input w-full"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as 'account' | 'credit')}
          >
            <option value="account">💰 Расчетный счет ({student.accountTokens} L-Coin)</option>
            <option value="credit">🏦 Кредитный счет ({student.creditTokens} L-Coin)</option>
          </select>
        </div>

        {/* Сумма */}
        <div>
          <label className="block text-sm font-medium admin-text-secondary mb-2">
            Сумма токенов *
          </label>
          <input
            type="number"
            required
            min="1"
            step="1"
            className="admin-input w-full"
            placeholder="Введите количество токенов"
            value={amount || ''}
            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
          />
          
          {operation === 'subtract' && amount > getCurrentBalance() && (
            <p className="text-sm text-red-600 mt-1">
              ⚠️ Недостаточно токенов. Доступно: {getCurrentBalance()} L-Coin
            </p>
          )}
        </div>

        {/* Комментарий */}
        <div>
          <label className="block text-sm font-medium admin-text-secondary mb-2">
            Комментарий к операции *
          </label>
          <textarea
            required
            rows={3}
            className="admin-input w-full"
            placeholder="Укажите причину начисления/списания токенов..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Превью операции */}
        {amount > 0 && (
          <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Превью операции</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <p>
                <strong>{getOperationText()}</strong> {amount} L-Coin {operation === 'subtract' ? 'с' : 'на'} {getAccountTypeText()}
              </p>
              <p>
                Баланс изменится: {getCurrentBalance()} → {getNewBalance()} L-Coin
              </p>
              <p>
                <strong>Комментарий:</strong> {comment}
              </p>
            </div>
          </div>
        )}

        {/* Кнопки */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ 
              borderColor: 'var(--divider)',
              color: 'var(--text-secondary)'
            }}
          >
            Отмена
          </button>
          <button
            type="submit"
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              operation === 'add' 
                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
            }`}
          >
            {getOperationText()} токены
          </button>
        </div>
      </form>
    </Modal>
  );
} 