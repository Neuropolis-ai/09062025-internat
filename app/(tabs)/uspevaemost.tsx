import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { Header } from '../components/Header';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  type: string;
  date: string;
}

export default function UspevamostScreen() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Диплом олимпиады по математике',
      type: 'pdf',
      date: '2024-03-15',
    },
    {
      id: '2', 
      title: 'Сертификат по физике',
      type: 'image',
      date: '2024-02-20',
    },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);

  // Данные для графика рейтинга (пример)
  const ratingData = [
    { month: 'Сен', rating: 85 },
    { month: 'Окт', rating: 88 },
    { month: 'Ноя', rating: 92 },
    { month: 'Дек', rating: 90 },
    { month: 'Янв', rating: 94 },
    { month: 'Фев', rating: 96 },
  ];

  const currentRating = 96;
  const maxRating = Math.max(...ratingData.map(d => d.rating));

  const handleUploadDocument = () => {
    Alert.alert(
      'Загрузка документа',
      'Выберите тип файла',
      [
        { text: 'PDF документ', onPress: () => uploadFile('pdf') },
        { text: 'Изображение', onPress: () => uploadFile('image') },
        { text: 'Отмена', style: 'cancel' },
      ]
    );
    setShowUploadModal(false);
  };

  const uploadFile = (type: string) => {
    // Имитация загрузки файла
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title: `Новый ${type === 'pdf' ? 'документ' : 'сертификат'}`,
      type,
      date: new Date().toISOString().split('T')[0] || '',
    };
    setAchievements([...achievements, newAchievement]);
    Alert.alert('Успешно!', 'Документ загружен');
  };

  const handleNotificationPress = () => {
    console.log('Переход к уведомлениям');
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Успеваемость" 
        notificationCount={3}
        onNotificationPress={handleNotificationPress}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Блок текущего рейтинга */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Мой рейтинг</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingValue}>{currentRating}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="trending-up" size={16} color="#FFFFFF" />
              <Text style={styles.ratingBadgeText}>+2</Text>
            </View>
          </View>
          <Text style={styles.ratingDescription}>
            Рейтинг формируется на основе оценок и активности в учебных мероприятиях
          </Text>
        </View>

        {/* Блок графика динамики */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Рейтинг за год</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {ratingData.map((data, index) => (
                <View key={index} style={styles.chartColumn}>
                  <View style={styles.chartBarContainer}>
                    <View 
                      style={[
                        styles.chartBar,
                        { 
                          height: (data.rating / maxRating) * 120,
                          backgroundColor: data.rating === currentRating ? '#8B2439' : '#E5E5EA'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.chartLabel}>{data.month}</Text>
                  <Text style={styles.chartValue}>{data.rating}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartYAxis}>
              <Text style={styles.chartAxisLabel}>100</Text>
              <Text style={styles.chartAxisLabel}>80</Text>
              <Text style={styles.chartAxisLabel}>60</Text>
              <Text style={styles.chartAxisLabel}>40</Text>
              <Text style={styles.chartAxisLabel}>20</Text>
            </View>
          </View>
        </View>

        {/* Блок олимпиад и достижений */}
        <View style={styles.card}>
          <View style={styles.achievementsHeader}>
            <Text style={styles.sectionTitle}>Мои олимпиады</Text>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => setShowUploadModal(true)}
            >
              <Ionicons name="add-circle" size={24} color="#8B2439" />
              <Text style={styles.uploadButtonText}>Загрузить</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementIcon}>
                  <Ionicons 
                    name={achievement.type === 'pdf' ? 'document' : 'image'} 
                    size={24} 
                    color="#8B2439" 
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDate}>
                    {new Date(achievement.date).toLocaleDateString('ru-RU')}
                  </Text>
                </View>
                <TouchableOpacity style={styles.achievementAction}>
                  <Ionicons name="eye" size={20} color="#666666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Дополнительный отступ внизу */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Модальное окно загрузки */}
      <Modal
        visible={showUploadModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Загрузить документ</Text>
            <Text style={styles.modalDescription}>
              Выберите файл с дипломом или сертификатом
            </Text>
            
            <TouchableOpacity style={styles.modalButton} onPress={handleUploadDocument}>
              <Ionicons name="cloud-upload" size={24} color="#FFFFFF" />
              <Text style={styles.modalButtonText}>Выбрать файл</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalCancelButton} 
              onPress={() => setShowUploadModal(false)}
            >
              <Text style={styles.modalCancelText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 16,
  },
  
  // Стили для блока рейтинга
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8B2439',
    marginRight: 12,
  },
  ratingBadge: {
    backgroundColor: '#8B2439',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  ratingDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },

  // Стили для графика
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  chart: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 40,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarContainer: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBar: {
    width: 24,
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
  },
  chartLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  chartValue: {
    fontSize: 11,
    color: '#8B2439',
    fontWeight: '600',
    marginTop: 2,
  },
  chartYAxis: {
    position: 'absolute',
    right: 0,
    height: 120,
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  chartAxisLabel: {
    fontSize: 10,
    color: '#666666',
  },

  // Стили для блока достижений
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#8B2439',
    fontWeight: '600',
    marginLeft: 6,
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B2439',
    marginBottom: 2,
  },
  achievementDate: {
    fontSize: 14,
    color: '#666666',
  },
  achievementAction: {
    padding: 8,
  },

  // Стили для модального окна
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#8B2439',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalCancelButton: {
    paddingVertical: 12,
  },
  modalCancelText: {
    color: '#666666',
    fontSize: 16,
  },
  bottomSpacer: {
    height: 20,
  },
}); 