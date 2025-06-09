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

export default function HomeScreen() {
  const router = useRouter();

  const handleModulePress = (module: string) => {
    // Навигация по модулям
    switch (module) {
      case 'bank':
        router.push('/(tabs)/bank');
        break;
      case 'grades':
        // TODO: Создать экран успеваемости
        console.log('Переход к успеваемости');
        break;
      case 'contracts':
        // TODO: Создать экран госзаказов
        console.log('Переход к госзаказам');
        break;
      case 'republic':
        // TODO: Создать экран республики
        console.log('Переход к республике');
        break;
      case 'terms':
        // TODO: Создать экран условий
        console.log('Переход к условиям');
        break;
      default:
        console.log(`Переход к модулю: ${module}`);
    }
  };

  const handleNotificationsPress = () => {
    // TODO: Переход к уведомлениям
    console.log('Переход к уведомлениям');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B2439" />
      
      {/* Шапка согласно ТЗ */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Лицей-интернат "Подмосковный"</Text>
        <TouchableOpacity 
          style={styles.notificationButton} 
          onPress={handleNotificationsPress}
        >
          <Ionicons name="notifications" size={24} color="#FFFFFF" />
          {/* Индикатор непрочитанных сообщений */}
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Информационный блок ученика согласно ТЗ */}
        <View style={styles.studentBlock}>
          {/* Фото ученика - круглый виджет */}
          <View style={styles.studentPhoto}>
            <Text style={styles.studentPhotoText}>👤</Text>
          </View>
          
          {/* ФИ ученика - жирным шрифтом */}
          <Text style={styles.studentName}>Александр Иванов</Text>
          
          {/* Класс и номер коттеджа */}
          <Text style={styles.studentInfo}>8Б, коттедж №3</Text>
        </View>

        {/* Блок с основными разделами согласно ТЗ */}
        <View style={styles.modulesSection}>
          <Text style={styles.sectionTitle}>Основные разделы</Text>
          
          <View style={styles.modulesList}>
            {/* Лицейский банк */}
            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => handleModulePress('bank')}
            >
              <View style={styles.moduleIcon}>
                <Ionicons name="card" size={28} color="#8B2439" />
              </View>
              <View style={styles.moduleContent}>
                <Text style={styles.moduleTitle}>Лицейский банк</Text>
                <Text style={styles.moduleDescription}>Доступ к виртуальному кошельку</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>

            {/* Успеваемость */}
            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => handleModulePress('grades')}
            >
              <View style={styles.moduleIcon}>
                <Ionicons name="school" size={28} color="#8B2439" />
              </View>
              <View style={styles.moduleContent}>
                <Text style={styles.moduleTitle}>Успеваемость</Text>
                <Text style={styles.moduleDescription}>Отображение рейтинга и достижений</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>

            {/* Госзаказы */}
            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => handleModulePress('contracts')}
            >
              <View style={styles.moduleIcon}>
                <Ionicons name="document-text" size={28} color="#8B2439" />
              </View>
              <View style={styles.moduleContent}>
                <Text style={styles.moduleTitle}>Госзаказы</Text>
                <Text style={styles.moduleDescription}>Список доступных контрактов и заявок</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>

            {/* Республика */}
            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => handleModulePress('republic')}
            >
              <View style={styles.moduleIcon}>
                <Ionicons name="flag" size={28} color="#8B2439" />
              </View>
              <View style={styles.moduleContent}>
                <Text style={styles.moduleTitle}>Республика</Text>
                <Text style={styles.moduleDescription}>Социальная и административная активность</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>

            {/* Условия и соглашения */}
            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => handleModulePress('terms')}
            >
              <View style={styles.moduleIcon}>
                <Ionicons name="document" size={28} color="#8B2439" />
              </View>
              <View style={styles.moduleContent}>
                <Text style={styles.moduleTitle}>Условия и соглашения</Text>
                <Text style={styles.moduleDescription}>Документы и регламенты</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Отступ для нижнего меню убран - управляется системой табов */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  
  // Шапка
  header: {
    backgroundColor: '#8B2439',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50, // Учет статус бара
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

  // Контент
  content: {
    flex: 1,
  },

  // Информационный блок ученика
  studentBlock: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  studentPhoto: {
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
  studentPhotoText: {
    fontSize: 36,
  },
  studentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 4,
  },
  studentInfo: {
    fontSize: 16,
    color: '#666666',
  },

  // Блок модулей
  modulesSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 40, // Увеличенный отступ снизу для системы табов
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  moduleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
}); 