import React from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NavigationProp } from '@react-navigation/native'
import { theme } from '../styles/unistyles'

type RootStackParamList = {
  HomeMain: undefined
  Chat: undefined
  Notifications: undefined
  FAQ: undefined
  Rules: undefined
  Shop: undefined
  Auction: undefined
  Bank: undefined
  Grades: undefined
  Republic: undefined
  Contracts: undefined
  Terms: undefined
}

type HomeNavigationProp = NavigationProp<RootStackParamList>

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>()

  const handleModulePress = (module: keyof RootStackParamList): void => {
    navigation.navigate(module)
  }

  const getCurrentGreeting = (): string => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Доброе утро'
    if (hour < 17) return 'Добрый день'
    return 'Добрый вечер'
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Шапка с названием лицея */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Лицей-интернат "Подмосковный"</Text>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Информационный блок ученика */}
      <View style={styles.studentBlock}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>👤</Text>
        </View>
        <Text style={styles.studentName}>Александр Иванов</Text>
        <Text style={styles.studentInfo}>8Б, коттедж №3</Text>
      </View>

      {/* Быстрая статистика */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>2,450</Text>
          <Text style={styles.statLabel}>L-Coin</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Средний балл</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Место в рейтинге</Text>
        </View>
      </View>

      {/* Основные разделы согласно ТЗ */}
      <View style={styles.modulesSection}>
        <Text style={styles.sectionTitle}>📚 Основные разделы</Text>
        
        <View style={styles.moduleList}>
          {/* Лицейский банк */}
          <TouchableOpacity 
            style={styles.moduleCard}
            onPress={() => navigation.navigate('Bank')}
          >
            <Text style={styles.moduleIcon}>💳</Text>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>Лицейский банк</Text>
              <Text style={styles.moduleDescription}>Управление виртуальным кошельком</Text>
            </View>
            <Text style={styles.moduleArrow}>›</Text>
          </TouchableOpacity>

          {/* Успеваемость */}
          <TouchableOpacity 
            style={styles.moduleCard}
            onPress={() => navigation.navigate('Grades')}
          >
            <Text style={styles.moduleIcon}>📊</Text>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>Успеваемость</Text>
              <Text style={styles.moduleDescription}>Рейтинг и достижения</Text>
            </View>
            <Text style={styles.moduleArrow}>›</Text>
          </TouchableOpacity>

          {/* Госзаказы */}
          <TouchableOpacity 
            style={styles.moduleCard}
            onPress={() => navigation.navigate('FAQ')}
          >
            <Text style={styles.moduleIcon}>📋</Text>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>Госзаказы</Text>
              <Text style={styles.moduleDescription}>Доступные контракты и заявки</Text>
            </View>
            <Text style={styles.moduleArrow}>›</Text>
          </TouchableOpacity>

          {/* Республика */}
          <TouchableOpacity 
            style={styles.moduleCard}
            onPress={() => navigation.navigate('Republic')}
          >
            <Text style={styles.moduleIcon}>🏛️</Text>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>Республика</Text>
              <Text style={styles.moduleDescription}>Социальная и административная активность</Text>
            </View>
            <Text style={styles.moduleArrow}>›</Text>
          </TouchableOpacity>

          {/* Условия и соглашения */}
          <TouchableOpacity 
            style={styles.moduleCard}
            onPress={() => navigation.navigate('Rules')}
          >
            <Text style={styles.moduleIcon}>📄</Text>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleTitle}>Условия и соглашения</Text>
              <Text style={styles.moduleDescription}>Документы и регламенты</Text>
            </View>
            <Text style={styles.moduleArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.ultraLight,
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    color: theme.colors.white,
    flex: 1,
    textAlign: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: theme.spacing.sm,
  },
  notificationIcon: {
    fontSize: 24,
    color: theme.colors.white,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  studentBlock: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  avatar: {
    fontSize: 40,
  },
  studentName: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  studentInfo: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.gray,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  statNumber: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.gray,
    textAlign: 'center',
  },
  modulesSection: {
    marginHorizontal: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  moduleList: {
    gap: theme.spacing.sm,
  },
  moduleCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  moduleIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  moduleDescription: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.gray,
  },
  moduleArrow: {
    fontSize: 24,
    color: theme.colors.gray,
    marginLeft: theme.spacing.sm,
  },
}) 