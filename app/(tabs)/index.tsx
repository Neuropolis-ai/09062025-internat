import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ModernBrandedDashboard() {
  const [balance, setBalance] = useState(1250);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [bounceAnim] = useState(new Animated.Value(1));
  const [sparkleAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Элегантная пульсация
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.08,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    bounce.start();

    // Мягкое сверкание
    const sparkle = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    sparkle.start();

    // Медленное вращение
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 12000,
        useNativeDriver: true,
      })
    );
    rotate.start();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setBalance(Math.floor(Math.random() * 2000) + 1000);
      setRefreshing(false);
    }, 1000);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = 'Иван';
    if (hour < 6) return `Спокойной ночи, ${name} 🌙`;
    if (hour < 12) return `Доброе утро, ${name} ☀️`;
    if (hour < 17) return `Добрый день, ${name} 🌞`;
    if (hour < 22) return `Добрый вечер, ${name} 🌅`;
    return `Спокойной ночи, ${name} 🌙`;
  };

  const getMotivationalMessage = () => {
    const messages = [
      'Отличные результаты! 🎯',
      'Продолжай в том же духе! ⭐',
      'Впереди новые достижения! 🚀',
      'Ты на правильном пути! 💫',
      'Превосходная работа! 🌟',
      'Гордимся тобой! 🏆'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -15],
    extrapolate: 'clamp',
  });

  const cardScale = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [1, 0.98, 0.96],
    extrapolate: 'clamp',
  });

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B2439" />
      
      {/* Стильный фирменный header */}
      <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
        {/* Элегантные акценты */}
        <Animated.View style={[
          styles.accentBackground,
          {
            opacity: sparkleAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.3],
            })
          }
        ]}>
          <Text style={[styles.accentEmoji, { top: 15, left: 30 }]}>✨</Text>
          <Text style={[styles.accentEmoji, { top: 45, right: 40 }]}>⭐</Text>
          <Text style={[styles.accentEmoji, { top: 75, left: 60 }]}>💎</Text>
        </Animated.View>
        
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.motivationalMessage}>{getMotivationalMessage()}</Text>
            <View style={styles.locationBadge}>
              <Ionicons name="school" size={14} color="#FFFFFF" />
              <Text style={styles.locationText}>8Б класс • Коттедж №3</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.profileContainer} activeOpacity={0.9}>
            <View style={styles.profileWrapper}>
              <View style={styles.profileAvatar}>
                <Text style={styles.avatarText}>ИП</Text>
              </View>
              <View style={styles.statusIndicator}>
                <Ionicons name="checkmark-circle" size={16} color="#4D8061" />
              </View>
            </View>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Стильная карточка баланса с фирменными цветами */}
        <Animated.View style={[styles.balanceCard, { transform: [{ scale: bounceAnim }] }]}>
          <View style={styles.brandedGradient}>
            <View style={styles.balanceContent}>
              <View style={styles.balanceLeft}>
                <View style={styles.balanceLabelContainer}>
                  <Ionicons name="diamond" size={18} color="#FFD700" />
                  <Text style={styles.balanceLabel}>Баланс L-Coin</Text>
                </View>
                <Text style={styles.balanceAmount}>{balance.toLocaleString()}</Text>
                <View style={styles.balanceMetrics}>
                  <View style={styles.balanceMetric}>
                    <Ionicons name="trending-up" size={14} color="#4D8061" />
                    <Text style={styles.balanceSubtext}>+120 за месяц</Text>
                  </View>
                  <View style={styles.balanceMetric}>
                    <Ionicons name="flash" size={14} color="#E67E22" />
                    <Text style={styles.balanceSubtext}>Активен</Text>
                  </View>
                </View>
              </View>
              <Animated.View style={[
                styles.balanceIcon3D,
                { transform: [{ rotate: rotateInterpolation }] }
              ]}>
                <Ionicons name="diamond" size={42} color="#FFD700" />
              </Animated.View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#8B2439"
            colors={['#8B2439', '#4D8061', '#E67E22', '#2980B9']}
          />
        }
      >
        {/* Фирменные быстрые действия */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎯 Быстрые действия</Text>
            <View style={styles.aiIndicator}>
              <Ionicons name="sparkles" size={16} color="#8B2439" />
              <Text style={styles.aiText}>Smart</Text>
            </View>
          </View>
          
          <Animated.View style={{ transform: [{ scale: cardScale }] }}>
            <TouchableOpacity
              style={[styles.quickCard, styles.bankCard]}
              onPress={() => Alert.alert('Переход', '💰 Лицейский банк')}
              activeOpacity={0.85}
            >
              <View style={styles.cardContent}>
                <View style={styles.quickCardIconContainer}>
                  <View style={styles.iconGlow} />
                  <Ionicons name="card" size={28} color="#FFFFFF" />
                </View>
                <View style={styles.quickCardText}>
                  <Text style={styles.quickCardTitle}>Лицейский банк</Text>
                  <Text style={styles.quickCardSubtitle}>{balance.toLocaleString()} L-Coin 💎</Text>
                  <Text style={styles.quickCardHint}>💡 Рекомендуем пополнить счет</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.8)" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.cardGrid}>
            <TouchableOpacity
              style={[styles.quickCard, styles.gradesCard]}
              onPress={() => Alert.alert('Переход', '📚 Успеваемость')}
              activeOpacity={0.85}
            >
              <View style={styles.cardContent}>
                <View style={styles.quickCardIconContainer}>
                  <Ionicons name="school" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.quickCardText}>
                  <Text style={styles.quickCardTitle}>Оценки</Text>
                  <Text style={styles.quickCardSubtitle}>4.8 ⭐</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickCard, styles.contractsCard]}
              onPress={() => Alert.alert('Переход', '📋 Госзаказы')}
              activeOpacity={0.85}
            >
              <View style={styles.cardContent}>
                <View style={styles.quickCardIconContainer}>
                  <Ionicons name="briefcase" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.quickCardText}>
                  <Text style={styles.quickCardTitle}>Задания</Text>
                  <Text style={styles.quickCardSubtitle}>3 активных</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.quickCard, styles.republicCard]}
            onPress={() => Alert.alert('Переход', '🏛️ Лицейская республика')}
            activeOpacity={0.85}
          >
            <View style={styles.cardContent}>
              <View style={styles.quickCardIconContainer}>
                <Ionicons name="people" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.quickCardText}>
                <Text style={styles.quickCardTitle}>Лицейская республика</Text>
                <Text style={styles.quickCardSubtitle}>🏅 Министр спорта</Text>
                <Text style={styles.quickCardHint}>🎉 Новые интересные проекты!</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.8)" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Стильная статистика достижений */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Твои достижения</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <View style={[styles.statIcon, { backgroundColor: '#E8F5E8' }]}>
                  <Ionicons name="trending-up" size={24} color="#4D8061" />
                </View>
              </View>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Средний балл</Text>
              <View style={styles.progressBar}>
                <Animated.View style={[
                  styles.progressFill, 
                  { 
                    width: '96%', 
                    backgroundColor: '#4D8061',
                    transform: [{ scaleX: bounceAnim }]
                  }
                ]} />
              </View>
              <Text style={styles.progressEmoji}>🌟</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="trophy" size={24} color="#E67E22" />
                </View>
              </View>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Достижений</Text>
              <View style={styles.progressBar}>
                <Animated.View style={[
                  styles.progressFill, 
                  { 
                    width: '80%', 
                    backgroundColor: '#E67E22',
                    transform: [{ scaleX: bounceAnim }]
                  }
                ]} />
              </View>
              <Text style={styles.progressEmoji}>🏅</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="time" size={24} color="#2980B9" />
                </View>
              </View>
              <Text style={styles.statValue}>87%</Text>
              <Text style={styles.statLabel}>Посещаемость</Text>
              <View style={styles.progressBar}>
                <Animated.View style={[
                  styles.progressFill, 
                  { 
                    width: '87%', 
                    backgroundColor: '#2980B9',
                    transform: [{ scaleX: bounceAnim }]
                  }
                ]} />
              </View>
              <Text style={styles.progressEmoji}>📅</Text>
            </View>
          </View>
        </View>

        {/* Стильные уведомления */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📬 Важные новости</Text>
          
          <View style={styles.notificationCard}>
            <View style={[styles.notificationIcon, { backgroundColor: '#E8F5E8' }]}>
              <Ionicons name="star" size={24} color="#4D8061" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>Отличная неделя! 🌟</Text>
              <Text style={styles.notificationDetailText}>
                Все задания выполнены, средний балл улучшен на 0.2 балла. Так держать!
              </Text>
              <Text style={styles.notificationTime}>⏰ 2 часа назад</Text>
            </View>
          </View>
          
          <View style={styles.notificationCard}>
            <View style={[styles.notificationIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="gift" size={24} color="#E67E22" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>Бонус L-Coin! 💰</Text>
              <Text style={styles.notificationDetailText}>
                Начислено +50 L-Coin за активное участие в жизни лицейской республики
              </Text>
              <Text style={styles.notificationTime}>⏰ 1 день назад</Text>
            </View>
          </View>

          <View style={styles.notificationCard}>
            <View style={[styles.notificationIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="medal" size={24} color="#2980B9" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>Спортивный вызов! 🏃‍♂️</Text>
              <Text style={styles.notificationDetailText}>
                Завтра начинается лицейский марафон. Участвуй и получай призы!
              </Text>
              <Text style={styles.notificationTime}>⏰ 3 часа назад</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: '#8B2439',
    position: 'relative',
    overflow: 'hidden',
  },
  accentBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  accentEmoji: {
    position: 'absolute',
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 1,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  motivationalMessage: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    fontWeight: '600',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
  },
  profileContainer: {
    position: 'relative',
  },
  profileWrapper: {
    position: 'relative',
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#4D8061',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B2439',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    backgroundColor: '#E67E22',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#E67E22',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  notificationText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  balanceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 2,
    shadowColor: '#8B2439',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  brandedGradient: {
    backgroundColor: '#2980B9',
    padding: 22,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  balanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLeft: {
    flex: 1,
  },
  balanceLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  balanceMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  balanceMetric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginLeft: 6,
  },
  balanceIcon3D: {
    marginLeft: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2C3E50',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 36, 57, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 36, 57, 0.2)',
  },
  aiText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B2439',
    marginLeft: 4,
  },
  quickCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  bankCard: {
    backgroundColor: '#8B2439',
  },
  gradesCard: {
    backgroundColor: '#4D8061',
  },
  contractsCard: {
    backgroundColor: '#E67E22',
  },
  republicCard: {
    backgroundColor: '#2980B9',
  },
  cardContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quickCardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.3)',
    opacity: 0.6,
  },
  quickCardText: {
    flex: 1,
  },
  quickCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  quickCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  quickCardHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 3,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  statIconContainer: {
    marginBottom: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#7F8C8D',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 5,
    backgroundColor: '#ECF0F1',
    borderRadius: 2.5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  progressEmoji: {
    fontSize: 14,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#8B2439',
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 6,
  },
  notificationDetailText: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 20,
    marginBottom: 8,
    fontWeight: '500',
  },
  notificationTime: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '600',
  },
}); 