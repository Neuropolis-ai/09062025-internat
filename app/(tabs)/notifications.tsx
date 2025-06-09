import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Header } from '../components/Header';
import { NotificationCard } from '../components/NotificationCard';
import { NotificationModal } from '../components/NotificationModal';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  time: string;
  type: 'system' | 'personal' | 'admin';
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Новое расписание',
    message: 'Обновлено расписание занятий на следующую неделю. Проверьте изменения в ваших предметах.',
    date: '15.01.2025',
    time: '09:30',
    type: 'system',
    isRead: false,
  },
  {
    id: '2',
    title: 'Личное сообщение от классного руководителя',
    message: 'Пожалуйста, подойдите после уроков для обсуждения вашей успеваемости по математике.',
    date: '14.01.2025',
    time: '14:20',
    type: 'personal',
    isRead: false,
  },
  {
    id: '3',
    title: 'Администрация лицея',
    message: 'Уважаемые ученики! Напоминаем о необходимости соблюдения дресс-кода в учебное время.',
    date: '13.01.2025',
    time: '16:45',
    type: 'admin',
    isRead: true,
  },
  {
    id: '4',
    title: 'Оценка выставлена',
    message: 'Вам выставлена оценка "5" по предмету "История России". Тема: "Смутное время"',
    date: '12.01.2025',
    time: '11:15',
    type: 'system',
    isRead: true,
  },
  {
    id: '5',
    title: 'Мероприятие',
    message: 'Приглашаем на научную конференцию "Молодые исследователи" 20 января в актовом зале.',
    date: '11.01.2025',
    time: '08:00',
    type: 'admin',
    isRead: false,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'system':
        return '🔔';
      case 'personal':
        return '👤';
      case 'admin':
        return '📢';
      default:
        return '📝';
    }
  };

  const renderNotificationCard = (notification: Notification) => (
    <NotificationCard 
      key={notification.id}
      notification={notification}
      onPress={() => handleNotificationPress(notification)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Уведомления" 
        showBackButton={true}
        showNotificationButton={false}
        onNotificationPress={() => {}}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.notificationsList}>
          {notifications.map(renderNotificationCard)}
        </View>
      </ScrollView>

      {/* Модальное окно для просмотра уведомления */}
      <NotificationModal 
        visible={modalVisible}
        notification={selectedNotification}
        onClose={() => setModalVisible(false)}
      />
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
  scrollContent: {
    paddingBottom: 20,
  },
  notificationsList: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
}); 