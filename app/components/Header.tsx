import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface HeaderProps {
  title: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  notificationCount = 3, 
  onNotificationPress 
}) => {
  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      console.log('Переход к уведомлениям');
    }
  };

  return (
    <View style={styles.header}>
      {/* Левый отступ для центрирования текста */}
      <View style={styles.leftSpacer} />
      
      <Text style={styles.headerTitle}>{title}</Text>
      
      <TouchableOpacity 
        style={styles.notificationButton} 
        onPress={handleNotificationPress}
      >
        <Text style={styles.notificationEmoji}>🔔</Text>
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationCount}>{notificationCount}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#8B2439',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
    height: 100, // Унифицированная высота хедера
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSpacer: {
    width: 40, // Ширина иконки справа для центрирования
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  notificationButton: {
    position: 'relative',
    padding: 10, // Увеличенный padding для лучшего позиционирования
    width: 40, // Фиксированная ширина
    alignItems: 'center',
  },
  notificationEmoji: {
    fontSize: 20, // Уменьшенный размер колокольчика
    color: '#FFFFFF',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2, // Сдвинуто выше
    right: 2, // Сдвинуто правее
    backgroundColor: '#FF4444',
    borderRadius: 9, // Немного меньший радиус
    minWidth: 18, // Уменьшенная ширина
    height: 18, // Уменьшенная высота
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // Белая обводка для лучшего контраста
    borderColor: '#8B2439',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 11, // Немного меньший шрифт
    fontWeight: 'bold',
  },
}); 