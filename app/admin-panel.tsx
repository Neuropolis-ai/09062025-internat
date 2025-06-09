import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Header } from './components/Header';

const { width } = Dimensions.get('window');

interface AdminModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: number;
}

interface AdminPanelProps {
  onLogout?: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const adminModules: AdminModule[] = [
    {
      id: 'users',
      title: 'Управление пользователями',
      description: 'Добавление, редактирование и удаление пользователей',
      icon: '👥',
      badge: 5,
    },
    {
      id: 'content',
      title: 'Управление контентом',
      description: 'Редактирование материалов и новостей',
      icon: '📝',
      badge: 2,
    },
    {
      id: 'notifications',
      title: 'Уведомления',
      description: 'Отправка уведомлений и сообщений',
      icon: '🔔',
      badge: 12,
    },
    {
      id: 'analytics',
      title: 'Аналитика',
      description: 'Статистика и отчеты по использованию',
      icon: '📊',
    },
    {
      id: 'settings',
      title: 'Настройки системы',
      description: 'Конфигурация приложения и параметры',
      icon: '⚙️',
    },
    {
      id: 'backup',
      title: 'Резервное копирование',
      description: 'Создание и восстановление резервных копий',
      icon: '💾',
    },
  ];

  const handleModulePress = (moduleId: string, title: string) => {
    setSelectedModule(moduleId);
    Alert.alert(
      'Переход в модуль',
      `Открыть модуль "${title}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Открыть', onPress: () => console.log(`Открытие модуля: ${moduleId}`) },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Выход из системы',
      'Вы уверены, что хотите выйти из админ-панели?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive', 
          onPress: () => {
            if (onLogout) {
              onLogout();
            } else {
              console.log('Выход из системы');
            }
          }
        },
      ]
    );
  };

  const renderModuleCard = (module: AdminModule) => (
    <TouchableOpacity
      key={module.id}
      style={[
        styles.moduleCard,
        selectedModule === module.id && styles.moduleCardSelected,
      ]}
      onPress={() => handleModulePress(module.id, module.title)}
      activeOpacity={0.7}
    >
      <View style={styles.moduleHeader}>
        <View style={styles.moduleIconContainer}>
          <Text style={styles.moduleIcon}>{module.icon}</Text>
          {module.badge && (
            <View style={styles.moduleBadge}>
              <Text style={styles.moduleBadgeText}>{module.badge}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.moduleContent}>
        <Text style={styles.moduleTitle}>{module.title}</Text>
        <Text style={styles.moduleDescription}>{module.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Админ-панель"
        showNotificationButton={true}
        showBackButton={false}
        notificationCount={19}
      />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Добро пожаловать в</Text>
          <Text style={styles.adminTitle}>Админ-панель</Text>
          <Text style={styles.subtitle}>Лицей-интернат "Подмосковный"</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1,247</Text>
            <Text style={styles.statLabel}>Пользователей</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>Активных</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Новых</Text>
          </View>
        </View>

        <View style={styles.modulesContainer}>
          <Text style={styles.sectionTitle}>Модули управления</Text>
          
          <View style={styles.modulesGrid}>
            {adminModules.map(renderModuleCard)}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Выйти из системы</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  adminTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  modulesContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 16,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: width > 768 ? '48%' : '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  moduleCardSelected: {
    borderColor: '#8B2439',
    borderWidth: 2,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleIconContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleIcon: {
    fontSize: 24,
  },
  moduleBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  moduleBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B2439',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Адаптивные стили для планшетов
const tabletStyles = StyleSheet.create({
  modulesGrid: {
    justifyContent: 'flex-start',
  },
  moduleCard: {
    width: width > 1024 ? '32%' : '48%',
    marginRight: width > 1024 ? '2%' : '4%',
  },
});

// Применяем адаптивные стили для больших экранов
if (width > 768) {
  Object.assign(styles.modulesGrid, tabletStyles.modulesGrid);
  Object.assign(styles.moduleCard, tabletStyles.moduleCard);
} 