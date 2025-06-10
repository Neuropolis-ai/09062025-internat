'use client';

import React, { useState } from 'react';

// Простая навигация
const Navigation = ({ 
  currentPage, 
  onPageChange 
}: { 
  currentPage: string; 
  onPageChange: (page: string) => void;
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Дашборд', icon: '📊' },
    { id: 'students', label: 'Ученики', icon: '🎓' },
    { id: 'teachers', label: 'Учителя', icon: '👨‍🏫' },
    { id: 'news', label: 'Новости', icon: '📰' },
    { id: 'events', label: 'Мероприятия', icon: '📅' },
    { id: 'grades', label: 'Оценки', icon: '📝' },
  ];

  return (
    <nav style={{
      backgroundColor: '#8B2439',
      padding: '1rem',
      color: 'white',
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      <h1 style={{ margin: 0, marginRight: '2rem' }}>
        Админ-панель Лицея-интерната «Подмосковный»
      </h1>
      {menuItems.map(item => (
        <button
          key={item.id}
          onClick={() => onPageChange(item.id)}
          style={{
            background: currentPage === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
};

// Дашборд
const Dashboard = () => (
  <div style={{ padding: '2rem' }}>
    <h2 style={{ color: '#8B2439', marginBottom: '2rem' }}>
      Добро пожаловать в админ-панель
    </h2>
    
    {/* Статистические карточки */}
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '12px',
        border: '1px solid #E5E5EA',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎓</div>
        <h3 style={{ color: '#8B2439', margin: '0 0 0.5rem 0' }}>247</h3>
        <p style={{ color: '#666', margin: 0 }}>Всего учеников</p>
      </div>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '12px',
        border: '1px solid #E5E5EA',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👨‍🏫</div>
        <h3 style={{ color: '#8B2439', margin: '0 0 0.5rem 0' }}>28</h3>
        <p style={{ color: '#666', margin: 0 }}>Учителей</p>
      </div>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '12px',
        border: '1px solid #E5E5EA',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📰</div>
        <h3 style={{ color: '#8B2439', margin: '0 0 0.5rem 0' }}>12</h3>
        <p style={{ color: '#666', margin: 0 }}>Активных новостей</p>
      </div>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '12px',
        border: '1px solid #E5E5EA',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
        <h3 style={{ color: '#8B2439', margin: '0 0 0.5rem 0' }}>5</h3>
        <p style={{ color: '#666', margin: 0 }}>Предстоящих событий</p>
      </div>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '12px',
        border: '1px solid #E5E5EA',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
        <h3 style={{ color: '#8B2439', margin: '0 0 0.5rem 0' }}>4.2</h3>
        <p style={{ color: '#666', margin: 0 }}>Средний балл</p>
      </div>
    </div>

    {/* Быстрые действия */}
    <div style={{ 
      backgroundColor: 'white', 
      padding: '1.5rem', 
      borderRadius: '12px',
      border: '1px solid #E5E5EA'
    }}>
      <h3 style={{ color: '#8B2439', marginBottom: '1rem' }}>Быстрые действия</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <button style={{
          padding: '1rem',
          backgroundColor: '#F8F8F8',
          border: '1px solid #E5E5EA',
          borderRadius: '8px',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.2s'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎓</div>
          <strong style={{ color: '#8B2439' }}>Добавить ученика</strong>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Зарегистрировать нового ученика в системе
          </p>
        </button>
        
        <button style={{
          padding: '1rem',
          backgroundColor: '#F8F8F8',
          border: '1px solid #E5E5EA',
          borderRadius: '8px',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.2s'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📰</div>
          <strong style={{ color: '#8B2439' }}>Создать новость</strong>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Опубликовать новость для учеников и родителей
          </p>
        </button>
        
        <button style={{
          padding: '1rem',
          backgroundColor: '#F8F8F8',
          border: '1px solid #E5E5EA',
          borderRadius: '8px',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.2s'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📅</div>
          <strong style={{ color: '#8B2439' }}>Запланировать мероприятие</strong>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Добавить новое мероприятие в календарь
          </p>
        </button>
        
        <button style={{
          padding: '1rem',
          backgroundColor: '#F8F8F8',
          border: '1px solid #E5E5EA',
          borderRadius: '8px',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.2s'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
          <strong style={{ color: '#8B2439' }}>Просмотреть отчеты</strong>
          <p style={{ color: '#666', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Аналитика и статистика по успеваемости
          </p>
        </button>
      </div>
    </div>
  </div>
);

// Простые компоненты страниц
const StudentsPage = () => (
  <div style={{ padding: '2rem' }}>
    <h2 style={{ color: '#8B2439', marginBottom: '1rem' }}>Управление учениками</h2>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '1.5rem', 
      borderRadius: '8px',
      border: '1px solid #E5E5EA'
    }}>
      <h3>Список учеников</h3>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#F8F8F8', 
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Алексей Иванов</strong> - 10А класс
            <br />
            <small style={{ color: '#666' }}>alex@lyceum.ru</small>
          </div>
          <button style={{ 
            padding: '0.25rem 0.5rem', 
            backgroundColor: '#8B2439', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Редактировать
          </button>
        </div>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#F8F8F8', 
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Екатерина Смирнова</strong> - 11Б класс
            <br />
            <small style={{ color: '#666' }}>kate@lyceum.ru</small>
          </div>
          <button style={{ 
            padding: '0.25rem 0.5rem', 
            backgroundColor: '#8B2439', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Редактировать
          </button>
        </div>
      </div>
      <button style={{
        marginTop: '1rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#8B2439',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem'
      }}>
        + Добавить ученика
      </button>
    </div>
  </div>
);

const TeachersPage = () => (
  <div style={{ padding: '2rem' }}>
    <h2 style={{ color: '#8B2439', marginBottom: '1rem' }}>Управление учителями</h2>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '1.5rem', 
      borderRadius: '8px',
      border: '1px solid #E5E5EA'
    }}>
      <h3>Список учителей</h3>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#F8F8F8', 
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Мария Сидорова</strong> - Математика
            <br />
            <small style={{ color: '#666' }}>maria@lyceum.ru • Стаж: 15 лет</small>
          </div>
          <button style={{ 
            padding: '0.25rem 0.5rem', 
            backgroundColor: '#8B2439', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Редактировать
          </button>
        </div>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#F8F8F8', 
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Дмитрий Козлов</strong> - Физика
            <br />
            <small style={{ color: '#666' }}>dmitry@lyceum.ru • Стаж: 8 лет</small>
          </div>
          <button style={{ 
            padding: '0.25rem 0.5rem', 
            backgroundColor: '#8B2439', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Редактировать
          </button>
        </div>
      </div>
      <button style={{
        marginTop: '1rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#8B2439',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem'
      }}>
        + Добавить учителя
      </button>
    </div>
  </div>
);

const NewsPage = () => (
  <div style={{ padding: '2rem' }}>
    <h2 style={{ color: '#8B2439', marginBottom: '1rem' }}>Управление новостями</h2>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '1.5rem', 
      borderRadius: '8px',
      border: '1px solid #E5E5EA'
    }}>
      <h3>Последние новости</h3>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#F8F8F8', 
          borderRadius: '6px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <strong>Новый учебный год в лицее</strong>
              <p style={{ margin: '0.5rem 0', color: '#666' }}>
                Поздравляем всех с началом нового учебного года! Желаем успехов в учебе.
              </p>
              <small style={{ color: '#666' }}>Опубликовано: 01.09.2024</small>
            </div>
            <button style={{ 
              padding: '0.25rem 0.5rem', 
              backgroundColor: '#8B2439', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Редактировать
            </button>
          </div>
        </div>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#F8F8F8', 
          borderRadius: '6px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <strong>Олимпиада по математике</strong>
              <p style={{ margin: '0.5rem 0', color: '#666' }}>
                Приглашаем учеников 9-11 классов принять участие в школьной олимпиаде по математике.
              </p>
              <small style={{ color: '#666' }}>Опубликовано: 15.10.2024</small>
            </div>
            <button style={{ 
              padding: '0.25rem 0.5rem', 
              backgroundColor: '#8B2439', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Редактировать
            </button>
          </div>
        </div>
      </div>
      <button style={{
        marginTop: '1rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#8B2439',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem'
      }}>
        + Создать новость
      </button>
    </div>
  </div>
);

const EventsPage = () => (
  <div style={{ padding: '2rem' }}>
    <h2 style={{ color: '#8B2439', marginBottom: '1rem' }}>Управление мероприятиями</h2>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '1.5rem', 
      borderRadius: '8px',
      border: '1px solid #E5E5EA'
    }}>
      <h3>Предстоящие мероприятия</h3>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#F8F8F8', 
          borderRadius: '6px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <strong>День знаний</strong>
              <p style={{ margin: '0.5rem 0', color: '#666' }}>
                Торжественная линейка, посвященная началу учебного года
              </p>
              <small style={{ color: '#666' }}>📅 01.09.2024 в 10:00 • 📍 Актовый зал</small>
            </div>
            <button style={{ 
              padding: '0.25rem 0.5rem', 
              backgroundColor: '#8B2439', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Редактировать
            </button>
          </div>
        </div>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#F8F8F8', 
          borderRadius: '6px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <strong>Родительское собрание</strong>
              <p style={{ margin: '0.5rem 0', color: '#666' }}>
                Общее собрание родителей учеников 10-11 классов
              </p>
              <small style={{ color: '#666' }}>📅 15.09.2024 в 18:00 • 📍 Конференц-зал</small>
            </div>
            <button style={{ 
              padding: '0.25rem 0.5rem', 
              backgroundColor: '#8B2439', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Редактировать
            </button>
          </div>
        </div>
      </div>
      <button style={{
        marginTop: '1rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#8B2439',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem'
      }}>
        + Создать мероприятие
      </button>
    </div>
  </div>
);

const GradesPage = () => (
  <div style={{ padding: '2rem' }}>
    <h2 style={{ color: '#8B2439', marginBottom: '1rem' }}>Управление оценками</h2>
    <div style={{ 
      backgroundColor: 'white', 
      padding: '1.5rem', 
      borderRadius: '8px',
      border: '1px solid #E5E5EA'
    }}>
      <h3>Последние оценки</h3>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#F8F8F8', 
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Алексей Иванов</strong> - Математика
            <br />
            <small style={{ color: '#666' }}>Контрольная работа • 01.10.2024 • Учитель: Мария Сидорова</small>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              5
            </span>
            <button style={{ 
              padding: '0.25rem 0.5rem', 
              backgroundColor: '#8B2439', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Редактировать
            </button>
          </div>
        </div>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#F8F8F8', 
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Екатерина Смирнова</strong> - Физика
            <br />
            <small style={{ color: '#666' }}>Лабораторная работа • 02.10.2024 • Учитель: Дмитрий Козлов</small>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ 
              backgroundColor: '#2196F3', 
              color: 'white', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              4
            </span>
            <button style={{ 
              padding: '0.25rem 0.5rem', 
              backgroundColor: '#8B2439', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Редактировать
            </button>
          </div>
        </div>
      </div>
      <button style={{
        marginTop: '1rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#8B2439',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem'
      }}>
        + Добавить оценку
      </button>
    </div>
  </div>
);

export default function AdminApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentsPage />;
      case 'teachers':
        return <TeachersPage />;
      case 'news':
        return <NewsPage />;
      case 'events':
        return <EventsPage />;
      case 'grades':
        return <GradesPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F2F2F7',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
    </div>
  );
} 