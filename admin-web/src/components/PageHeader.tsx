'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  onMenuToggle: () => void;
}

export default function PageHeader({ title, subtitle, onMenuToggle }: PageHeaderProps) {
  return (
    <header className="shadow-sm border-b" style={{ 
      backgroundColor: 'var(--primary-burgundy)',
      borderBottomColor: 'var(--divider)'
    }}>
      <div className="px-6 lg:px-8">
        <div className="flex items-center py-8">
          {/* Кнопка меню для мобильных устройств */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-3 text-white hover:bg-white/20 mr-6 transition-colors"
          >
            <span className="text-xl">☰</span>
          </button>
          
          {/* Заголовок и подзаголовок */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white leading-tight">{title}</h1>
            <p className="text-white/90 font-medium mt-1 text-base">{subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
} 