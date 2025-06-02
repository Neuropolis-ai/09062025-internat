import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement'
  timestamp: Date
  read: boolean
  priority: 'low' | 'normal' | 'high'
  category: string
  actionable?: boolean
  icon?: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Новая оценка по математике',
    message: 'Получена оценка "5" за контрольную работу',
    type: 'success',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    priority: 'normal',
    category: 'Учеба',
    icon: '📊'
  },
  {
    id: '2',
    title: 'Пополнение баланса',
    message: 'На ваш счет зачислено 500 лицейских баллов',
    type: 'success',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    priority: 'normal',
    category: 'Банк',
    icon: '💰'
  },
  {
    id: '3',
    title: 'Концерт в актовом зале',
    message: 'Завтра в 18:00 состоится концерт, посвященный Дню лицея',
    type: 'announcement',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    priority: 'high',
    category: 'События',
    icon: '🎭',
    actionable: true
  },
  {
    id: '4',
    title: 'Новое сообщение от преподавателя',
    message: 'Домашнее задание по физике изменено',
    type: 'info',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
    priority: 'normal',
    category: 'Учеба',
    icon: '📚'
  },
  {
    id: '5',
    title: 'Техническое обслуживание',
    message: 'Плановые работы в системе с 23:00 до 02:00',
    type: 'warning',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    priority: 'low',
    category: 'Система',
    icon: '⚙️'
  }
]

const filterOptions = [
  { id: 'all', label: 'Все', icon: '📋' },
  { id: 'unread', label: 'Непрочитанные', icon: '🔴' },
  { id: 'important', label: 'Важные', icon: '⭐' },
  { id: 'study', label: 'Учеба', icon: '📚' },
  { id: 'events', label: 'События', icon: '🎉' },
]

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredNotifications = notifications.filter(notification => {
    switch (activeFilter) {
      case 'unread':
        return !notification.read
      case 'important':
        return notification.priority === 'high' || notification.type === 'announcement'
      case 'study':
        return notification.category === 'Учеба'
      case 'events':
        return notification.category === 'События'
      default:
        return true
    }
  })

  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const now = new Date()
    const notificationDate = notification.timestamp
    const timeDiff = now.getTime() - notificationDate.getTime()
    
    let group = ''
    if (timeDiff < 24 * 60 * 60 * 1000) {
      group = 'Сегодня'
    } else if (timeDiff < 48 * 60 * 60 * 1000) {
      group = 'Вчера'
    } else if (timeDiff < 7 * 24 * 60 * 60 * 1000) {
      group = 'На этой неделе'
    } else {
      group = 'Ранее'
    }
    
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group]!.push(notification)
    return groups
  }, {} as Record<string, Notification[]>)

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '#4CAF50'
      case 'warning': return '#FF9800'
      case 'error': return '#F44336'
      case 'announcement': return '#8B2439'
      default: return '#2196F3'
    }
  }

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      case 'announcement': return '📢'
      default: return 'ℹ️'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60 * 1000) {
      return 'только что'
    } else if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes} мин назад`
    } else if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000))
      return `${hours} ч назад`
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric',
        month: 'short'
      })
    }
  }

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationCard,
        !notification.read && styles.unreadCard
      ]}
      onPress={() => markAsRead(notification.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIcon}>
          <Text style={styles.notificationEmoji}>
            {notification.icon || getTypeIcon(notification.type)}
          </Text>
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationTitleRow}>
            <Text style={[
              styles.notificationTitle,
              !notification.read && styles.unreadTitle
            ]}>
              {notification.title}
            </Text>
            {!notification.read && <View style={styles.unreadDot} />}
          </View>
          
          <Text style={styles.notificationMessage}>
            {notification.message}
          </Text>
          
          <View style={styles.notificationFooter}>
            <View style={styles.notificationMeta}>
              <Text style={styles.notificationTime}>
                {formatTime(notification.timestamp)}
              </Text>
              <View style={[
                styles.categoryBadge,
                { backgroundColor: getTypeColor(notification.type) + '20' }
              ]}>
                <Text style={[
                  styles.categoryText,
                  { color: getTypeColor(notification.type) }
                ]}>
                  {notification.category}
                </Text>
              </View>
            </View>
            
            {notification.actionable && (
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Подробнее</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Уведомления</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity 
              style={styles.markAllButton}
              onPress={markAllAsRead}
            >
              <Text style={styles.markAllButtonText}>Все прочитано</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        >
          {filterOptions.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                activeFilter === filter.id && styles.activeFilterButton
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text style={styles.filterIcon}>{filter.icon}</Text>
              <Text style={[
                styles.filterText,
                activeFilter === filter.id && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notifications */}
      <ScrollView style={styles.notificationsList}>
        {Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
          <View key={group} style={styles.notificationGroup}>
            <Text style={styles.groupTitle}>{group}</Text>
            {groupNotifications.map(renderNotification)}
          </View>
        ))}
        
        {filteredNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>Нет уведомлений</Text>
            <Text style={styles.emptyMessage}>
              {activeFilter === 'all' 
                ? 'У вас пока нет уведомлений'
                : 'Нет уведомлений в выбранной категории'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllButton: {
    backgroundColor: '#8B2439',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  markAllButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 16,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filtersList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeFilterButton: {
    backgroundColor: '#8B2439',
    borderColor: '#8B2439',
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  notificationsList: {
    flex: 1,
  },
  notificationGroup: {
    marginTop: 16,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B2439',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#8B2439',
    backgroundColor: '#FAFAFA',
  },
  notificationHeader: {
    flexDirection: 'row',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationEmoji: {
    fontSize: 18,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  unreadTitle: {
    color: '#8B2439',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E74C3C',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999999',
    marginRight: 12,
  },
  categoryBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#8B2439',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
})

export default NotificationsScreen 