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
}

const menuItems: MenuItem[] = [
  { name: 'Ученики', href: '/students', icon: '👥' },
  { name: 'Лицейский банк', href: '/bank', icon: '🏦' },
  { name: 'L-shop', href: '/shop', icon: '🛍️' },
  { name: 'Аукцион', href: '/auction', icon: '🎯' },
  { name: 'Госзаказы', href: '/contracts', icon: '🏛️' },
  { name: 'Уведомления', href: '/notifications', icon: '🔔' },
  { name: 'Правила', href: '/rules', icon: '📋' },
  { name: 'FAQ', href: '/faq', icon: '❓' },
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
        fixed top-0 left-0 h-full w-64 admin-card z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `} style={{ backgroundColor: 'var(--background-white)' }}>
        
        {/* Заголовок sidebar */}
        <div className="flex items-center justify-between p-4 admin-border" style={{ borderBottom: '1px solid var(--divider)' }}>
          <h2 className="text-lg font-semibold text-gray-900">Навигация</h2>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <span className="text-gray-500">✕</span>
          </button>
        </div>

        {/* Меню навигации */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                  ${isActive 
                    ? 'text-white' 
                    : 'text-gray-700'
                  }
                `}
                style={{
                  backgroundColor: isActive ? 'var(--primary-burgundy)' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(139, 36, 57, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Футер sidebar */}
        <div className="p-4 admin-border" style={{ borderTop: '1px solid var(--divider)' }}>
          <div className="text-xs admin-text-secondary text-center">
            <p>Админ-панель</p>
            <p style={{ color: 'var(--primary-burgundy)' }}>Лицей-интернат "Подмосковный"</p>
          </div>
        </div>
      </div>
    </>
  );
} 