'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  name: string;
  href: string;
  icon: string;
  color?: string;
}

const menuItems: MenuItem[] = [
  { name: 'Ученики', href: '/students', icon: '👥', color: '#3b82f6' },
  { name: 'Лицейский банк', href: '/bank', icon: '🏦', color: '#10b981' },
  { name: 'L-shop', href: '/shop', icon: '🛍️', color: '#f59e0b' },
  { name: 'Аукцион', href: '/auction', icon: '🎯', color: '#ef4444' },
  { name: 'Госзаказы', href: '/contracts', icon: '🏛️', color: '#8b5cf6' },
  { name: 'Уведомления', href: '/notifications', icon: '🔔', color: '#f97316' },
  { name: 'Правила', href: '/rules', icon: '📋', color: '#06b6d4' },
  { name: 'FAQ', href: '/faq', icon: '❓', color: '#84cc16' },
];

export default function Sidebar({ isOpen = true, onClose = () => {} }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay для мобильных устройств */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen w-64 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        shadow-xl lg:shadow-none border-r
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `} style={{ 
        backgroundColor: 'var(--background-white)',
        borderRightColor: 'var(--divider)'
      }}>
        
        {/* Заголовок sidebar с градиентом */}
        <div className="relative px-6 py-8 border-b" style={{ 
          borderBottomColor: 'var(--divider)',
          background: 'linear-gradient(135deg, var(--primary-burgundy) 0%, #7A1F32 100%)'
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              {/* Логотип лицея */}
              <div className="w-10 h-10 flex items-center justify-center text-2xl bg-white/20 backdrop-blur-sm" style={{
                borderRadius: '8px'
              }}>
                🏫
              </div>
              
              {/* Название лицея */}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white leading-tight">
                  Лицей-интернат
                </h2>
                <p className="text-white/90 text-sm font-medium">
                  &ldquo;Подмосковный&rdquo;
                </p>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-white/20 transition-colors"
            >
              <span className="text-white text-lg">✕</span>
            </button>
          </div>
          
          {/* Декоративный элемент */}
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)'
          }}></div>
        </div>

        {/* Информация о системе */}
        <div className="px-6 py-4 border-b bg-gray-50" style={{ 
          borderBottomColor: 'var(--divider)'
        }}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center text-sm" style={{
              backgroundColor: 'var(--primary-burgundy)',
              color: 'white',
              borderRadius: '6px'
            }}>
              ⚙️
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                Административная панель
              </p>
              <p className="text-xs text-gray-500">
                Система управления
              </p>
            </div>
          </div>
        </div>

        {/* Меню навигации */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-4">
            Управление
          </p>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  group flex items-center px-4 py-3 text-sm font-medium transition-all duration-200
                  hover:bg-gray-50 relative
                  ${isActive 
                    ? 'text-white bg-gradient-to-r from-[var(--primary-burgundy)] to-[#7A1F32] shadow-md' 
                    : 'text-gray-700 hover:text-gray-900'
                  }
                `}
                style={{
                  borderRadius: isActive ? '8px' : '6px'
                }}
              >
                {/* Левая полоска для активного элемента */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white/30"></div>
                )}
                
                {/* Иконка */}
                <div className={`
                  w-8 h-8 flex items-center justify-center mr-3 text-lg transition-all duration-200
                  ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}
                `}>
                  {item.icon}
                </div>
                
                {/* Название */}
                <span className="truncate font-medium">{item.name}</span>
                
                {/* Активный индикатор */}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white/60" style={{ borderRadius: '50%' }}></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Футер sidebar */}
        <div className="px-6 py-4 border-t bg-gray-50" style={{ 
          borderTopColor: 'var(--divider)'
        }}>
          <div className="text-center">
            <div className="text-xs text-gray-500 space-y-1">
              <p className="font-semibold">Версия 1.0.0</p>
              <p>© 2024 Лицей-интернат</p>
              <p className="text-[10px] text-gray-400">Все права защищены</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 