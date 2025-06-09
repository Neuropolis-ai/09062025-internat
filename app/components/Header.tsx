import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface HeaderProps {
  title: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onBackPress?: () => void;
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  notificationCount = 3, 
  onNotificationPress,
  onBackPress,
  showBackButton = false
}) => {
  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      console.log('Переход к уведомлениям');
    }
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      console.log('Назад');
    }
  };

  return (
    <View style={styles.header}>
      {/* Кнопка назад */}
      {showBackButton ? (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.leftSpacer} />
      )}
      
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
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  leftSpacer: {
    width: 40,
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
    padding: 10,
    width: 40,
    alignItems: 'center',
  },
  notificationEmoji: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF4444',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#8B2439',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
}); 