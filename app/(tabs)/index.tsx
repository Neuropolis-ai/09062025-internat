import React from 'react';
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
import { Header } from '../components/Header';

export default function HomeScreen() {
  const router = useRouter();

  // Количество непрочитанных уведомлений (в реальном приложении будет из состояния/API)
  const unreadNotificationsCount = 3;

  const handleModulePress = (module: string) => {
    // Навигация по модулям
    switch (module) {
      case 'bank':
        router.push('/bank');
        break;
      case 'grades':
        router.push('/uspevaemost');
        break;
      case 'contracts':
        router.push('/(tabs)/zakupki');
        break;
      case 'republic':
        router.push('/respublika');
        break;
      case 'terms':
        // Переход к странице правил
        router.push('/pravila');
        break;
      case 'faq':
        router.push('/faq');
        break;
      case 'neuro':
        router.push('/neuro');
        break;
      default:
        console.log(`Переход к модулю: ${module}`);
    }
  };

  const handleNotificationsPress = () => {
    router.push('/(tabs)/notifications');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B2439" />
      
      {/* Унифицированный хедер */}
      <Header 
        title='🏫 Лицей "Подмосковный"' 
        notificationCount={unreadNotificationsCount}
        onNotificationPress={handleNotificationsPress}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Информационный блок ученика с градиентом */}
        <View style={styles.studentBlock}>
          {/* Фото ученика - яркий круглый виджет */}
          <View style={styles.studentPhoto}>
            <Text style={styles.studentPhotoText}>🎓</Text>
          </View>
          
          {/* ФИ ученика - жирным шрифтом с приветствием */}
          <Text style={styles.welcomeText}>Привет, Александр! 👋</Text>
          <Text style={styles.studentName}>Александр Иванов</Text>
          
          {/* Класс и номер коттеджа с эмодзи */}
          <Text style={styles.studentInfo}>🏛️ 8Б класс • 🏠 коттедж №3</Text>
          
          {/* Мотивационная фраза */}
          <Text style={styles.motivationText}>✨ Сегодня отличный день для достижений! ✨</Text>
        </View>

        {/* Блок с основными разделами с веселыми иконками */}
        <View style={styles.modulesSection}>
          <Text style={styles.sectionTitle}>🚀 Основные разделы</Text>
          
          <View style={styles.modulesList}>
            {/* Лицейский банк */}
            <TouchableOpacity 
              style={[styles.moduleCard, styles.bankCard]}
              onPress={() => handleModulePress('bank')}
            >
              <View style={styles.moduleIcon}>
                <Text style={styles.moduleEmoji}>💳</Text>
              </View>
              <View style={styles.moduleContent}>
                <Text style={styles.moduleTitle}>Лицейский банк</Text>
                <Text style={styles.moduleDescription}>💰 Управляй своим кошельком и копи баллы!</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>

            {/* Успеваемость */}
            <TouchableOpacity 
              style={[styles.moduleCard, styles.gradesCard]}
              onPress={() => handleModulePress('grades')}
            >
              <View style={styles.moduleIcon}>
                <Text style={styles.moduleEmoji}>📊</Text>
              </View>
              <View style={styles.moduleContent}>
                <Text style={styles.moduleTitle}>Успеваемость</Text>
                <Text style={styles.moduleDescription}>⭐ Следи за рейтингом и покори топ!</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>

            {/* Госзаказы */}
            <TouchableOpacity 
              style={[styles.moduleCard, styles.contractsCard]}
              onPress={() => handleModulePress('contracts')}
            >
              <View style={styles.moduleIcon}>
                <Text style={styles.moduleEmoji}>📋</Text>
              </View>
              <View style={styles.moduleContent}>
                <Text style={styles.moduleTitle}>Госзаказы</Text>
                <Text style={styles.moduleDescription}>💼 Участвуй в проектах и зарабатывай опыт!</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>

            {/* Республика */}
            <TouchableOpacity 
              style={[styles.moduleCard, styles.republicCard]}
              onPress={() => handleModulePress('republic')}
            >
              <View style={styles.moduleIcon}>
                <Text style={styles.moduleEmoji}>🏛️</Text>
              </View>
              <View style={styles.moduleContent}>
                <Text style={styles.moduleTitle}>Республика</Text>
                <Text style={styles.moduleDescription}>🗳️ Будь активным гражданином лицея!</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>

            {/* Условия и соглашения */}
            <TouchableOpacity 
              style={[styles.moduleCard, styles.termsCard]}
              onPress={() => handleModulePress('terms')}
            >
              <View style={styles.moduleIcon}>
                <Text style={styles.moduleEmoji}>📄</Text>
              </View>
              <View style={styles.moduleContent}>
                <Text style={styles.moduleTitle}>Правила</Text>
                <Text style={styles.moduleDescription}>📖 Изучи правила игры в лицее!</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>

            {/* FAQ */}
            <TouchableOpacity 
              style={[styles.moduleCard, styles.faqCard]}
              onPress={() => handleModulePress('faq')}
            >
              <View style={styles.moduleIcon}>
                <Text style={styles.moduleEmoji}>❓</Text>
              </View>
              <View style={styles.moduleContent}>
                <Text style={styles.moduleTitle}>FAQ</Text>
                <Text style={styles.moduleDescription}>💡 Ответы на частые вопросы лицеистов!</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Отступ для нижнего меню */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },

  // Контент
  content: {
    flex: 1,
  },

  // Информационный блок ученика с градиентом
  studentBlock: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    position: 'relative',
  },
  studentPhoto: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#8B2439',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#FFD700',
    shadowColor: '#8B2439',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  studentPhotoText: {
    fontSize: 40,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B2439',
    marginBottom: 4,
  },
  studentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 8,
  },
  studentInfo: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  motivationText: {
    fontSize: 14,
    color: '#4D8061',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Блок модулей
  modulesSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 20,
  },
  modulesList: {
    gap: 12,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  // Цветные акценты для карточек
  bankCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
    backgroundColor: '#FFFEF7',
  },
  gradesCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    backgroundColor: '#F8FFF8',
  },
  contractsCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    backgroundColor: '#F7FAFF',
  },
  republicCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
    backgroundColor: '#FFF8F7',
  },
  termsCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
    backgroundColor: '#FDF7FF',
  },
  faqCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#E91E63',
    backgroundColor: '#FDF8FB',
  },
  moduleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#8B2439',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#FFE4E1',
  },
  moduleEmoji: {
    fontSize: 32,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B2439',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },

  // Отступ снизу
  bottomSpacer: {
    height: 20,
  },
}); 