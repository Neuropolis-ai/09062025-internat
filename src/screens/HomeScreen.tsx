import React from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { theme } from '../styles/unistyles'

export const HomeScreen: React.FC = () => {
  const handleModulePress = (moduleName: string): void => {
    Alert.alert('Модуль', `Открываем модуль: ${moduleName}`)
  }

  const getCurrentGreeting = (): string => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Доброе утро'
    if (hour < 17) return 'Добрый день'
    return 'Добрый вечер'
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Приветствие */}
      <View style={styles.greetingSection}>
        <Text style={styles.greeting}>
          {getCurrentGreeting()}, Александр! 👋
        </Text>
        <Text style={styles.subtitle}>
          Сегодня отличный день для новых достижений
        </Text>
      </View>

      {/* Быстрая статистика */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>2,450</Text>
          <Text style={styles.statLabel}>Лицейских баллов</Text>
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

      {/* Модули приложения */}
      <View style={styles.modulesSection}>
        <Text style={styles.sectionTitle}>🚀 Модули лицея</Text>
        
        <View style={styles.moduleGrid}>
          {/* Лицейский банк */}
          <TouchableOpacity 
            style={styles.moduleCard}
            onPress={() => handleModulePress('Лицейский банк')}
          >
            <Text style={styles.moduleIcon}>💳</Text>
            <Text style={styles.moduleTitle}>Лицейский банк</Text>
            <Text style={styles.moduleDescription}>Управление балансом и переводы</Text>
          </TouchableOpacity>

          {/* Успеваемость */}
          <TouchableOpacity 
            style={styles.moduleCard}
            onPress={() => handleModulePress('Успеваемость')}
          >
            <Text style={styles.moduleIcon}>📊</Text>
            <Text style={styles.moduleTitle}>Успеваемость</Text>
            <Text style={styles.moduleDescription}>Оценки и достижения</Text>
          </TouchableOpacity>

          {/* Республика */}
          <TouchableOpacity 
            style={styles.moduleCard}
            onPress={() => handleModulePress('Лицейская республика')}
          >
            <Text style={styles.moduleIcon}>🏛️</Text>
            <Text style={styles.moduleTitle}>Республика</Text>
            <Text style={styles.moduleDescription}>Самоуправление и активности</Text>
          </TouchableOpacity>

          {/* Госзакупки */}
          <TouchableOpacity 
            style={styles.moduleCard}
            onPress={() => handleModulePress('Госзакупки')}
          >
            <Text style={styles.moduleIcon}>📋</Text>
            <Text style={styles.moduleTitle}>Госзакупки</Text>
            <Text style={styles.moduleDescription}>Тендеры и контракты</Text>
          </TouchableOpacity>

          {/* L-shop */}
          <TouchableOpacity 
            style={styles.moduleCard}
            onPress={() => handleModulePress('L-shop')}
          >
            <Text style={styles.moduleIcon}>🛒</Text>
            <Text style={styles.moduleTitle}>L-shop</Text>
            <Text style={styles.moduleDescription}>Магазин лицея</Text>
          </TouchableOpacity>

          {/* Аукцион */}
          <TouchableOpacity 
            style={styles.moduleCard}
            onPress={() => handleModulePress('Аукцион')}
          >
            <Text style={styles.moduleIcon}>🔨</Text>
            <Text style={styles.moduleTitle}>Аукцион</Text>
            <Text style={styles.moduleDescription}>Торги и лоты</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Нейрочат */}
      <View style={styles.chatCard}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatIcon}>🤖</Text>
          <View>
            <Text style={styles.chatTitle}>Нейрочат ассистент</Text>
            <Text style={styles.chatSubtitle}>Умный помощник лицеиста</Text>
          </View>
        </View>
        <Text style={styles.chatDescription}>
          Есть вопросы? Спросите у ИИ-ассистента о расписании, правилах или любой другой информации.
        </Text>
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => handleModulePress('Нейрочат')}
        >
          <Text style={styles.chatButtonText}>Начать чат</Text>
        </TouchableOpacity>
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
    padding: theme.spacing.md,
  },
  greetingSection: {
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.gray,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
    color: theme.colors.charcoal,
    marginBottom: theme.spacing.md,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: '48%',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  moduleIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  moduleTitle: {
    fontSize: theme.typography.sizes.bodySmall,
    fontWeight: '500',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  moduleDescription: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.gray,
    textAlign: 'center',
  },
  chatCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  chatIcon: {
    fontSize: 32,
    marginRight: theme.spacing.sm,
  },
  chatTitle: {
    fontSize: theme.typography.sizes.bodySmall,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  chatSubtitle: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.gray,
  },
  chatDescription: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.gray,
    marginBottom: theme.spacing.md,
  },
  chatButton: {
    backgroundColor: theme.colors.lightGray,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  chatButtonText: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.primary,
    fontWeight: '500',
  },
}) 