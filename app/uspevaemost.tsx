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
import { Header } from './components/Header';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-gifted-charts';

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

  // Данные для графика оценок (от 2.00 до 5.00)
  const gradeData = [
    { value: 4.2, label: 'Сен', dataPointText: '4.2' },
    { value: 4.4, label: 'Окт', dataPointText: '4.4' },
    { value: 4.6, label: 'Ноя', dataPointText: '4.6' },
    { value: 4.3, label: 'Дек', dataPointText: '4.3' },
    { value: 4.7, label: 'Янв', dataPointText: '4.7' },
    { value: 4.8, label: 'Фев', dataPointText: '4.8' },
  ];

  const currentGrade = 4.8;
  const maxGrade = 5.0;
  
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
        {/* Современный блок текущей оценки */}
        <View style={styles.modernCard}>
          <View style={styles.gradeHeader}>
            <View style={styles.gradeCircle}>
              <Text style={styles.gradeValue}>{currentGrade.toFixed(1)}</Text>
              <Text style={styles.gradeMaxValue}>/{maxGrade}</Text>
            </View>
            <View style={styles.gradeInfo}>
              <Text style={styles.gradeTitle}>Средний балл</Text>
              <Text style={[styles.motivationalText, { color: getGradeColor(currentGrade) }]}>
                {getMotivationalPhrase(currentGrade)}
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { 
                        width: `${((currentGrade - 3.5) / (maxGrade - 3.5)) * 100}%`,
                        backgroundColor: getGradeColor(currentGrade)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(((currentGrade - 3.5) / (maxGrade - 3.5)) * 100)}% от отличного результата
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Современный график динамики оценок */}
        <View style={styles.modernCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Динамика оценок</Text>
            <View style={styles.chartPeriod}>
              <Text style={styles.chartPeriodText}>Учебный год 2024/25</Text>
            </View>
          </View>
          
          <View style={styles.chartContainer}>
            <LineChart
              data={gradeData}
              width={width - 80}
              height={200}
              spacing={40}
              initialSpacing={20}
              endSpacing={20}
              
              // Настройки осей
              showVerticalLines
              verticalLinesColor="#E8E8E8"
              rulesColor="#E8E8E8"
              rulesType="solid"
              xAxisColor="#E8E8E8"
              yAxisColor="#E8E8E8"
              xAxisThickness={1}
              yAxisThickness={1}
              
              // Настройки Y-оси для компактного диапазона оценок от 3.5 до 5.0
              yAxisOffset={0}
              maxValue={5.0}
              mostNegativeValue={3.5}
              noOfSections={3}
              stepValue={0.5}
              yAxisLabelTexts={['3.5', '4.0', '4.5', '5.0']}
              yAxisTextStyle={styles.yAxisText}
              yAxisLabelPrefix=""
              yAxisLabelSuffix=""
              formatYLabel={(label) => parseFloat(label).toFixed(1)}
              
              // Настройки X-оси
              xAxisLabelTextStyle={styles.xAxisText}
              
              // Настройки линии
              color={getGradeColor(currentGrade)}
              thickness={3}
              curved
              curvature={0.2}
              
              // Настройки точек данных
              dataPointsColor={getGradeColor(currentGrade)}
              dataPointsRadius={6}
              dataPointsWidth={12}
              dataPointsHeight={12}
              hideDataPoints={false}
              
              // Отображение значений на точках с округлением до десятых
              showValuesAsDataPointsText
              textColor="#333"
              textFontSize={12}
              textShiftY={-15}
              
              // Анимация
              isAnimated
              animationDuration={1500}
              
              // Градиент под линией
              areaChart
              startFillColor={getGradeColor(currentGrade)}
              endFillColor={getGradeColor(currentGrade)}
              startOpacity={0.3}
              endOpacity={0.1}
              
              // Интерактивность
              pointerConfig={{
                pointerStripHeight: 160,
                pointerStripColor: '#8B2439',
                pointerStripWidth: 2,
                pointerColor: '#8B2439',
                radius: 8,
                pointerLabelComponent: (items: any) => {
                  return (
                    <View style={styles.pointerLabel}>
                      <Text style={styles.pointerLabelText}>
                        {items[0]?.value?.toFixed(1)}
                      </Text>
                      <Text style={styles.pointerLabelDate}>
                        {items[0]?.label}
                      </Text>
                    </View>
                  );
                },
              }}
            />
          </View>
          
          {/* Статистика */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>+0.6</Text>
              <Text style={styles.statLabel}>Рост за год</Text>
              <View style={[styles.statIndicator, { backgroundColor: '#4CAF50' }]} />
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.5</Text>
              <Text style={styles.statLabel}>Средняя за год</Text>
              <View style={[styles.statIndicator, { backgroundColor: '#2196F3' }]} />
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Лучший результат</Text>
              <View style={[styles.statIndicator, { backgroundColor: '#FF9800' }]} />
            </View>
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
                <TouchableOpacity style={styles.achievementViewButton}>
                  <Ionicons name="eye" size={16} color="#666666" />
                </TouchableOpacity>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
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
  gradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F8F4F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#8B2439',
    marginRight: 20,
  },
  gradeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B2439',
  },
  gradeMaxValue: {
    fontSize: 16,
    color: '#666666',
    marginTop: -5,
  },
  gradeInfo: {
    flex: 1,
  },
  gradeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  motivationalText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 6,
  },
  
  // График
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  chartPeriod: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  chartPeriodText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  yAxisText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  xAxisText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  pointerLabel: {
    backgroundColor: '#333333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: -40,
  },
  pointerLabelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pointerLabelDate: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
  },
  
  // Статистика
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
    position: 'relative',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  statIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 8,
    height: 8,
    borderRadius: 4,
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
  achievementViewButton: {
    padding: 8,
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
}); 