import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface QuickAccessItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  onPress: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
}

export default function DashboardScreen() {
  const [balance, setBalance] = useState(1250);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Новое задание',
      message: 'Проверьте домашнее задание по математике',
      time: '10 мин назад',
      type: 'info',
    },
    {
      id: '2',
      title: 'Пополнение баланса',
      message: 'На ваш счет зачислено 200 L-Coin',
      time: '1 час назад',
      type: 'success',
    },
    {
      id: '3',
      title: 'Новый контракт',
      message: 'Доступен контракт "Уборка территории"',
      time: '2 часа назад',
      type: 'info',
    },
  ]);

  const quickAccessItems: QuickAccessItem[] = [
    {
      id: 'bank',
      title: 'Лицейский банк',
      icon: 'card',
      color: '#007AFF',
      bgColor: '#E3F2FD',
      onPress: () => Alert.alert('Переход', 'Лицейский банк'),
    },
    {
      id: 'grades',
      title: 'Успеваемость',
      icon: 'school',
      color: '#34C759',
      bgColor: '#E8F5E8',
      onPress: () => Alert.alert('Переход', 'Успеваемость'),
    },
    {
      id: 'contracts',
      title: 'Госзаказы',
      icon: 'briefcase',
      color: '#FF9500',
      bgColor: '#FFF3E0',
      onPress: () => Alert.alert('Переход', 'Госзаказы'),
    },
    {
      id: 'republic',
      title: 'Лицейская республика',
      icon: 'people',
      color: '#AF52DE',
      bgColor: '#F3E5F5',
      onPress: () => Alert.alert('Переход', 'Лицейская республика'),
    },
    {
      id: 'shop',
      title: 'L-shop',
      icon: 'storefront',
      color: '#FF2D92',
      bgColor: '#FCE4EC',
      onPress: () => Alert.alert('Переход', 'L-shop'),
    },
    {
      id: 'auction',
      title: 'Аукцион',
      icon: 'hammer',
      color: '#FF3B30',
      bgColor: '#FFEBEE',
      onPress: () => Alert.alert('Переход', 'Аукцион'),
    },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Имитация обновления данных
    setTimeout(() => {
      setBalance(Math.floor(Math.random() * 2000) + 1000);
      setRefreshing(false);
    }, 1000);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#34C759';
      case 'warning':
        return '#FF9500';
      default:
        return '#007AFF';
    }
  };

  const SkeletonCard = () => (
    <View style={[styles.card, styles.skeletonCard]}>
      <View style={styles.skeletonIcon} />
      <View style={styles.skeletonText} />
    </View>
  );

  const QuickAccessCard = ({ item }: { item: QuickAccessItem }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: item.bgColor }]}
      onPress={item.onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <View style={styles.notificationCard}>
      <View style={styles.notificationIcon}>
        <Ionicons
          name={getNotificationIcon(notification.type)}
          size={20}
          color={getNotificationColor(notification.type)}
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
        <Text style={styles.notificationTime}>{notification.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Добро пожаловать!</Text>
            <Text style={styles.studentName}>Иван Петров</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={40} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Баланс L-Coin</Text>
            <Ionicons name="wallet" size={24} color="#007AFF" />
          </View>
          <Text style={styles.balanceAmount}>{balance.toLocaleString()}</Text>
          <Text style={styles.balanceSubtext}>Доступно для использования</Text>
        </View>

        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Быстрый доступ</Text>
          <View style={styles.grid}>
            {refreshing
              ? Array(6).fill(0).map((_, index) => <SkeletonCard key={index} />)
              : quickAccessItems.map((item) => (
                  <QuickAccessCard key={item.id} item={item} />
                ))
            }
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Последние уведомления</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Все</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.notificationsContainer}>
            {notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#666666',
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 14,
    color: '#999999',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 120,
  },
  skeletonCard: {
    backgroundColor: '#F0F0F0',
  },
  skeletonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
    marginBottom: 12,
  },
  skeletonText: {
    width: '80%',
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 18,
  },
  notificationsContainer: {
    paddingHorizontal: 20,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999999',
  },
}); 