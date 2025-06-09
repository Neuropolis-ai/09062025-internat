import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-gifted-charts';
import { Header } from './components/Header';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  type: string;
  date: string;
}

export default function UspevamostScreen() {
  // Количество непрочитанных уведомлений
  const unreadNotificationsCount = 3;

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
  const [currentGrade] = useState(4.75);

  // Данные для полного учебного года (сентябрь - июнь)
  const gradeData = [
    { value: 4.1, label: 'Сен' },
    { value: 4.2, label: 'Окт' },
    { value: 4.4, label: 'Ноя' },
    { value: 4.3, label: 'Дек' },
    { value: 4.6, label: 'Янв' },
    { value: 4.7, label: 'Фев' },
    { value: 4.8, label: 'Мар' },
    { value: 4.5, label: 'Апр' },
    { value: 4.9, label: 'Май' },
    { value: 4.8, label: 'Июн' },
  ];

  // Мотивирующие фразы
  const motivationalPhrases = [
    "Великолепные результаты! 🌟",
    "Ты на пути к совершенству! 📈",
    "Продолжай в том же духе! 💪",
    "Выдающиеся достижения! 🎯"
  ];

  const getMotivationalPhrase = (grade: number) => {
    if (grade >= 4.7) return motivationalPhrases[0];
    if (grade >= 4.5) return motivationalPhrases[1];
    if (grade >= 4.0) return motivationalPhrases[2];
    return motivationalPhrases[3];
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 4.7) return '#4CAF50'; // Зеленый для отличных оценок
    if (grade >= 4.0) return '#2196F3'; // Синий для хороших оценок
    if (grade >= 3.5) return '#FF9800'; // Оранжевый для средних
    return '#F44336'; // Красный для низких
  };

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
    router.push('/(tabs)/notifications');
  };

  const handleBackPress = () => {
    router.replace('/');
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#8B2439" />
      <View style={styles.container}>
        <Header 
          title="Успеваемость" 
          notificationCount={unreadNotificationsCount}
          onNotificationPress={handleNotificationPress}
          onBackPress={handleBackPress}
          showBackButton={true}
        />
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Текущий рейтинг */}
          <View style={styles.ratingCard}>
            <View style={styles.ratingHeader}>
              <Ionicons name="trophy" size={28} color="#8B2439" />
              <Text style={styles.ratingTitle}>Текущий рейтинг</Text>
            </View>
            <Text style={styles.ratingValue}>{currentGrade.toFixed(2)}</Text>
            <Text style={styles.ratingLabel}>Средняя оценка</Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${((currentGrade - 2) / 3) * 100}%`,
                      backgroundColor: getGradeColor(currentGrade)
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {getMotivationalPhrase(currentGrade)}
              </Text>
            </View>
          </View>

          {/* График динамики с горизонтальным скроллом */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Динамика оценок</Text>
              <View style={styles.yearBadge}>
                <Text style={styles.chartSubtitle}>Учебный год 2024/25</Text>
              </View>
            </View>
            
            <View style={styles.chartContainer}>
              {/* Скроллируемый график */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={true}
                style={styles.chartScrollContainer}
              >
                <LineChart
                  data={gradeData}
                  width={gradeData.length * 35 + 40}
                  height={160}
                  spacing={35}
                  textShiftY={12}
                  textShiftX={-8}
                  textFontSize={10}
                  textColor="#666"
                  color="#4CAF50"
                  thickness={3}
                  startFillColor="rgba(76, 175, 80, 0.3)"
                  endFillColor="rgba(76, 175, 80, 0.05)"
                  startOpacity={0.9}
                  endOpacity={0.2}
                  initialSpacing={20}
                  noOfSections={3}
                  maxValue={5}
                  stepValue={1}
                  adjustToWidth={false}
                  hideYAxisText={false}
                  yAxisLabelWidth={25}
                  yAxisLabelSuffix=""
                  showFractionalValues={false}
                  roundToDigits={0}
                  mostNegativeValue={2}
                  yAxisColor="#E0E0E0"
                  xAxisColor="#E0E0E0"
                  yAxisThickness={1}
                  formatYLabel={(label) => {
                    const num = parseInt(label);
                    return num >= 2 && num <= 5 ? num.toString() : '';
                  }}
                  xAxisLabelTextStyle={{
                    color: '#666', 
                    fontSize: 10,
                  }}
                  yAxisTextStyle={{
                    color: '#666',
                    fontSize: 12,
                  }}
                  focusEnabled
                  showTextOnFocus
                  showStripOnFocus
                  stripColor="#8B2439"
                  stripOpacity={0.5}
                  stripWidth={2}
                  showDataPointOnFocus
                  dataPointsColor="#4CAF50"
                  dataPointsRadius={4}
                  hideDataPoints={false}
                />
              </ScrollView>
            </View>
          </View>

          {/* Современный блок достижений */}
          <View style={styles.modernCard}>
            <View style={styles.achievementsHeaderModern}>
              <View>
                <Text style={styles.achievementsTitle}>Достижения</Text>
                <Text style={styles.achievementsSubtitle}>
                  Дипломы и сертификаты
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.modernUploadButton}
                onPress={() => setShowUploadModal(true)}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => (
                <View key={achievement.id} style={styles.modernAchievementCard}>
                  <View style={styles.achievementIconContainer}>
                    <View style={styles.achievementIconCircle}>
                      <Ionicons 
                        name={achievement.type === 'pdf' ? 'document-text' : 'image'} 
                        size={20} 
                        color="#8B2439" 
                      />
                    </View>
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={styles.achievementTitleModern} numberOfLines={2}>
                      {achievement.title}
                    </Text>
                    <Text style={styles.achievementDateModern}>
                      {new Date(achievement.date).toLocaleDateString('ru-RU')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Современное модальное окно */}
        <Modal
          visible={showUploadModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowUploadModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modernModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitleModern}>Загрузить документ</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowUploadModal(false)}
                >
                  <Ionicons name="close" size={24} color="#666666" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.modalDescriptionModern}>
                Выберите тип файла для загрузки диплома или сертификата
              </Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalOptionButton}
                  onPress={() => uploadFile('pdf')}
                >
                  <Ionicons name="document-text" size={24} color="#8B2439" />
                  <Text style={styles.modalOptionText}>PDF документ</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modalOptionButton}
                  onPress={() => uploadFile('image')}
                >
                  <Ionicons name="image" size={24} color="#8B2439" />
                  <Text style={styles.modalOptionText}>Изображение</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B2439',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  // Современные карточки
  modernCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  
  // Блок оценки
  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 10,
  },
  ratingValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#666666',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 6,
  },
  
  // График
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  yearBadge: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  labelContainer: {
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderRadius: 4,
    marginTop: -20,
    marginLeft: -10,
  },
  labelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
  },
  
  // Достижения
  achievementsHeaderModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  achievementsSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  modernUploadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B2439',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B2439',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementsGrid: {
    gap: 12,
  },
  modernAchievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  achievementIconContainer: {
    marginRight: 16,
  },
  achievementIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitleModern: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  achievementDateModern: {
    fontSize: 14,
    color: '#666666',
  },
  
  // Модальное окно
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modernModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitleModern: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDescriptionModern: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 32,
  },
  modalButtons: {
    gap: 16,
  },
  modalOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  modalOptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 16,
  },
  
  bottomSpacer: {
    height: 40,
  },

  chartScrollContainer: {
    marginBottom: 25,
    width: '100%',
  },

  chartContainer: {
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
}); 