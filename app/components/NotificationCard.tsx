import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface NotificationCardProps {
  notification: {
    id: string;
    title: string;
    message: string;
    date: string;
    time: string;
    type: 'system' | 'personal' | 'admin';
    isRead: boolean;
  };
  onPress: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onPress }) => {
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

  return (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !notification.isRead && styles.unreadCard
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.typeIcon}>
            {getNotificationTypeIcon(notification.type)}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[
            styles.notificationTitle,
            !notification.isRead && styles.unreadTitle
          ]}>
            {notification.title}
          </Text>
          <Text style={styles.notificationDate}>
            {notification.date} • {notification.time}
          </Text>
        </View>
        {!notification.isRead && (
          <View style={styles.unreadIndicator} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#8B2439',
    backgroundColor: '#FAFAFA',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeIcon: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
    lineHeight: 20,
  },
  unreadTitle: {
    color: '#8B2439',
    fontWeight: 'bold',
  },
  notificationDate: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '400',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
    marginLeft: 8,
  },
}); 