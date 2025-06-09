import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from '../components/Header';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  isNew?: boolean;
  fullDescription?: string;
  minBid?: number;
}

interface Contract {
  id: string;
  title: string;
  price: number;
  status: 'active' | 'completed' | 'pending';
}

export default function ZakupkiScreen() {
  const router = useRouter();
  // Количество непрочитанных уведомлений
  const unreadNotificationsCount = 3;
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bid, setBid] = useState('');
  const [comment, setComment] = useState('');

  // Моковые данные для доски контрактов
  const availableTasks: Task[] = [
    {
      id: '1',
      title: 'Организация утренней зарядки',
      description: 'Физическая активность',
      category: 'Спорт',
      price: 15,
      isNew: true,
      fullDescription: 'Проведение утренней зарядки для младших классов. Необходимо подготовить комплекс упражнений и провести занятие в течение недели.',
      minBid: 10,
    },
    {
      id: '2',
      title: 'Помощь в библиотеке',
      description: 'Работа с книгами',
      category: 'Образование',
      price: 20,
      fullDescription: 'Помощь библиотекарю в каталогизации новых поступлений, расстановке книг и подготовке выставки.',
      minBid: 15,
    },
    {
      id: '3',
      title: 'Оформление стенда',
      description: 'Творческая работа',
      category: 'Творчество',
      price: 25,
      isNew: true,
      fullDescription: 'Создание информационного стенда к предстоящему празднику. Требуется креативный подход и аккуратность.',
      minBid: 20,
    },
    {
      id: '4',
      title: 'Дежурство в столовой',
      description: 'Помощь персоналу',
      category: 'Общественная работа',
      price: 12,
      fullDescription: 'Помощь в сервировке столов, уборке после приема пищи, поддержание порядка в обеденном зале.',
      minBid: 8,
    },
  ];

  // Моковые данные для личных контрактов
  const myContracts: Contract[] = [
    {
      id: '1',
      title: 'Уборка классной комнаты',
      price: 18,
      status: 'active',
    },
    {
      id: '2',
      title: 'Помощь в лаборатории',
      price: 22,
      status: 'pending',
    },
  ];

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setBid(task.minBid?.toString() || '');
    setComment('');
    setModalVisible(true);
  };

  const handleSubmitBid = () => {
    if (!selectedTask) return;
    
    const bidAmount = parseInt(bid);
    if (bidAmount < (selectedTask.minBid || 0)) {
      Alert.alert('Ошибка', `Минимальная ставка: ${selectedTask.minBid} L-Coin`);
      return;
    }
    
    if (!comment.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, добавьте комментарий');
      return;
    }

    Alert.alert(
      'Отклик отправлен!',
      `Ваш отклик на задание "${selectedTask.title}" отправлен. Ставка: ${bid} L-Coin`,
      [
        {
          text: 'OK',
          onPress: () => {
            setModalVisible(false);
            setSelectedTask(null);
          },
        },
      ]
    );
  };

  const handleNotificationPress = () => {
    router.push('/(tabs)/notifications');
  };

  const handleBackPress = () => {
    router.back();
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => openTaskDetails(task)}
      activeOpacity={0.7}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        {task.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>новое</Text>
          </View>
        )}
      </View>
      <Text style={styles.taskCategory}>{task.category}</Text>
      <Text style={styles.taskDescription}>{task.description}</Text>
      <View style={styles.taskPrice}>
        <Text style={styles.priceText}>+{task.price} L-Coin</Text>
      </View>
    </TouchableOpacity>
  );

  const ContractCard = ({ contract }: { contract: Contract }) => (
    <View style={styles.contractCard}>
      <View style={styles.contractHeader}>
        <Text style={styles.contractTitle}>{contract.title}</Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Ionicons name="information-circle-outline" size={20} color="#8B2439" />
        </TouchableOpacity>
      </View>
      <View style={styles.contractFooter}>
        <Text style={styles.contractPrice}>{contract.price} L-Coin</Text>
        <View style={[styles.statusBadge, 
          contract.status === 'active' && styles.statusActive,
          contract.status === 'pending' && styles.statusPending
        ]}>
          <Text style={styles.statusText}>
            {contract.status === 'active' ? 'Активный' : 'В ожидании'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Унифицированный хедер */}
      <Header 
        title="Госзакупки" 
        notificationCount={unreadNotificationsCount}
        onNotificationPress={handleNotificationPress}
        onBackPress={handleBackPress}
        showBackButton={true}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Доска контрактов */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Доска контрактов</Text>
          {availableTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </View>

        {/* Мои контракты */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Мои контракты</Text>
          {myContracts.length > 0 ? (
            myContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>У вас пока нет активных контрактов</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Модальное окно деталей задания */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedTask?.title}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalDescription}>
                {selectedTask?.fullDescription}
              </Text>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>
                  Ставка (мин. {selectedTask?.minBid} L-Coin)
                </Text>
                <TextInput
                  style={styles.input}
                  value={bid}
                  onChangeText={setBid}
                  keyboardType="numeric"
                  placeholder={`Минимум ${selectedTask?.minBid}`}
                />
              </View>

              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Комментарий исполнителя</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  numberOfLines={4}
                  placeholder="Расскажите о своем опыте и подходе к выполнению задания..."
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitBid}
              >
                <Text style={styles.submitButtonText}>Откликнуться</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B2439',
    flex: 1,
  },
  newBadge: {
    backgroundColor: '#FF4444',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskCategory: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  taskPrice: {
    alignSelf: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B2439',
  },
  contractCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contractTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B2439',
    flex: 1,
  },
  detailsButton: {
    marginLeft: 8,
  },
  contractFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contractPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B2439',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#E8F5E8',
  },
  statusPending: {
    backgroundColor: '#FFF3CD',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B2439',
    flex: 1,
  },
  closeButton: {
    marginLeft: 16,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B2439',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  textArea: {
    height: 100,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  submitButton: {
    backgroundColor: '#8B2439',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 