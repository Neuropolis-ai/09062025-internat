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
import { Header } from './components/Header';

export default function PravilaScreen() {
  const router = useRouter();

  // Количество непрочитанных уведомлений
  const unreadNotificationsCount = 3;

  const handleBackPress = () => {
    router.back();
  };

  const handleNotificationsPress = () => {
    router.push('/(tabs)/notifications');
  };

  const handleDocumentPress = (documentId: string) => {
    // В будущем здесь будет логика открытия документа
    console.log(`Открытие документа: ${documentId}`);
  };

  // Список документов согласно ТЗ
  const documents = [
    {
      id: 'internal-rules',
      title: 'Правила внутреннего распорядка',
      type: 'PDF',
      date: '15.01.2025',
      icon: 'document-text',
    },
    {
      id: 'app-agreement',
      title: 'Соглашение об использовании приложения',
      type: 'PDF',
      date: '10.01.2025',
      icon: 'shield-checkmark',
    },
    {
      id: 'conduct-rules',
      title: 'Правила поведения учащихся',
      type: 'PDF',
      date: '08.01.2025',
      icon: 'people',
    },
    {
      id: 'dormitory-rules',
      title: 'Правила проживания в коттеджах',
      type: 'PDF',
      date: '05.01.2025',
      icon: 'home',
    },
    {
      id: 'safety-rules',
      title: 'Инструкция по технике безопасности',
      type: 'PDF',
      date: '03.01.2025',
      icon: 'warning',
    },
    {
      id: 'digital-rules',
      title: 'Правила использования цифровых ресурсов',
      type: 'PDF',
      date: '01.01.2025',
      icon: 'laptop',
    },
    {
      id: 'privacy-policy',
      title: 'Политика конфиденциальности',
      type: 'PDF',
      date: '28.12.2024',
      icon: 'lock-closed',
    },
    {
      id: 'academic-regulations',
      title: 'Академические регламенты',
      type: 'PDF',
      date: '25.12.2024',
      icon: 'school',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B2439" />
      
      {/* Шапка с кнопкой назад */}
      <Header 
        title="Правила" 
        notificationCount={unreadNotificationsCount}
        onNotificationPress={handleNotificationsPress}
        onBackPress={handleBackPress}
        showBackButton={true}
        showNotificationButton={true}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Список документов */}
        <View style={styles.documentsSection}>
          <Text style={styles.sectionTitle}>Официальные документы</Text>
          
          <View style={styles.documentsList}>
            {documents.map((document) => (
              <TouchableOpacity 
                key={document.id}
                style={styles.documentCard}
                onPress={() => handleDocumentPress(document.id)}
              >
                {/* Иконка файла */}
                <View style={styles.documentIcon}>
                  <Ionicons name={document.icon as any} size={24} color="#8B2439" />
                </View>
                
                {/* Контент документа */}
                <View style={styles.documentContent}>
                  <Text style={styles.documentTitle}>{document.title}</Text>
                  <View style={styles.documentMeta}>
                    <Text style={styles.documentType}>{document.type}</Text>
                    <Text style={styles.documentDate}>{document.date}</Text>
                  </View>
                </View>
                
                {/* Стрелка */}
                <View style={styles.documentAction}>
                  <Ionicons name="chevron-forward" size={20} color="#666666" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Информационный блок */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoIconContainer}>
              <Ionicons name="information-circle" size={24} color="#8B2439" />
            </View>
            <Text style={styles.infoText}>
              Все документы доступны для просмотра и скачивания. При возникновении вопросов обращайтесь к администрации лицея.
            </Text>
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
  content: {
    flex: 1,
  },
  
  // Секция документов
  documentsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 16,
  },
  documentsList: {
    gap: 12,
  },
  
  // Карточка документа
  documentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  // Иконка документа
  documentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  
  // Контент документа
  documentContent: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B2439',
    marginBottom: 4,
    lineHeight: 22,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  documentType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B2439',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  documentDate: {
    fontSize: 12,
    color: '#666666',
  },
  
  // Действие с документом
  documentAction: {
    marginLeft: 12,
  },
  
  // Информационная секция
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  
  // Отступ для нижнего меню
  bottomSpacer: {
    height: 100,
  },
}); 