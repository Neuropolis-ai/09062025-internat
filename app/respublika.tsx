import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from './components/Header';

export default function RespublikaScreen() {
  const router = useRouter();

  // Количество непрочитанных уведомлений
  const unreadNotificationsCount = 3;

  const handleBackPress = () => {
    router.back();
  };

  const handleNotificationsPress = () => {
    router.push('/(tabs)/notifications');
  };

  // Данные о принадлежностях ученика
  const affiliations = [
    {
      id: 1,
      name: 'Финансовый комитет',
      icon: 'trending-up',
    },
    {
      id: 2,
      name: 'Спортивный совет',
      icon: 'fitness',
    },
    {
      id: 3,
      name: 'Культурный центр',
      icon: 'musical-notes',
    },
  ];

  // Данные о должностях
  const positions = [
    {
      id: 1,
      name: 'Министр культуры',
      icon: 'ribbon',
    },
    {
      id: 2,
      name: 'Староста класса',
      icon: 'people',
    },
  ];

  // Данные о достижениях
  const achievements = [
    {
      id: 1,
      name: 'Лучший оратор месяца',
      description: 'Январь 2025',
      icon: 'mic',
    },
    {
      id: 2,
      name: 'Организатор ярмарки',
      description: 'Новогодняя ярмарка',
      icon: 'storefront',
    },
    {
      id: 3,
      name: 'Лидер по активности',
      description: 'Декабрь 2024',
      icon: 'trophy',
    },
    {
      id: 4,
      name: 'Волонтер года',
      description: '2024 год',
      icon: 'heart',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B2439" />
      
      {/* Шапка с заголовком и уведомлениями */}
      <Header 
        title="Лицейская республика" 
        showBackButton={true}
        onBackPress={handleBackPress}
        onNotificationPress={handleNotificationsPress}
        notificationCount={unreadNotificationsCount}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Блок профиля ученика */}
        <View style={styles.profileBlock}>
          {/* Аватар ученика */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          
          {/* Имя и фамилия */}
          <Text style={styles.studentName}>Александр Иванов</Text>
          
          {/* Класс и коттедж */}
          <Text style={styles.studentInfo}>9А, коттедж №2</Text>
        </View>

        {/* Блок "Принадлежности" */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Моя принадлежность</Text>
          
          <View style={styles.cardsContainer}>
            {affiliations.map((affiliation) => (
              <TouchableOpacity key={affiliation.id} style={styles.card}>
                <View style={styles.cardIcon}>
                  <Ionicons 
                    name={affiliation.icon as any} 
                    size={24} 
                    color="#8B2439" 
                  />
                </View>
                <Text style={styles.cardTitle}>{affiliation.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Блок "Занимаемые должности" */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Мои должности</Text>
          
          <View style={styles.cardsContainer}>
            {positions.map((position) => (
              <TouchableOpacity key={position.id} style={styles.card}>
                <View style={styles.cardIcon}>
                  <Ionicons 
                    name={position.icon as any} 
                    size={24} 
                    color="#8B2439" 
                  />
                </View>
                <Text style={styles.cardTitle}>{position.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Блок "Достижения" */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Мои достижения</Text>
          
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <TouchableOpacity key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementIcon}>
                  <Ionicons 
                    name={achievement.icon as any} 
                    size={20} 
                    color="#8B2439" 
                  />
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>{achievement.name}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Отступ снизу */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
  },

  // Блок профиля ученика
  profileBlock: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#8B2439',
  },
  avatarText: {
    fontSize: 36,
  },
  studentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 4,
    textAlign: 'center',
  },
  studentInfo: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },

  // Секции
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 16,
  },

  // Контейнер для карточек принадлежностей и должностей
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: '30%',
    flex: 1,
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
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B2439',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Сетка достижений
  achievementsGrid: {
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B2439',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },

  // Отступ снизу
  bottomSpacing: {
    height: 20,
  },
}); 