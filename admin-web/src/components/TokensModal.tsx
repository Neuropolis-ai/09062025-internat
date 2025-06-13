'use client';

import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import { useAdmin } from '../contexts/AdminContext';

interface TokensModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any | null;
}

export default function TokensModal({ isOpen, onClose, student }: TokensModalProps) {
  const { updateUser, loading } = useAdmin();
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    setAmount(0);
    setError('');
  }, [student, isOpen]);

  if (!student) return null;

  const currentTokens = student.profileData?.tokens || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(amount)) {
      setError('Введите корректное число');
      return;
    }
    const newBalance = currentTokens + amount;
    if (newBalance < 0) {
      setError('Недостаточно токенов для списания');
      return;
    }
    try {
      await updateUser(student.id, {
        profileData: {
          ...student.profileData,
          tokens: newBalance
        }
      });
      onClose();
    } catch (err) {
      setError('Ошибка при обновлении токенов');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Управление токенами: ${student.firstName} ${student.lastName}`} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="mb-2 text-sm text-gray-700">Текущий баланс: <b>{currentTokens}</b> токенов</div>
          <input
            type="number"
            className="admin-input w-full"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            placeholder="Введите + или - для изменения баланса"
          />
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="admin-button-secondary">Отмена</button>
          <button type="submit" className="admin-button-primary" disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 