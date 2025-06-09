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
    padding: 8,
    width: 40, // Фиксированная ширина
    alignItems: 'center',
  },
  notificationEmoji: {
    fontSize: 22, // Унифицированный размер колокольчика
    color: '#FFFFFF',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 