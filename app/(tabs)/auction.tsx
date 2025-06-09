import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Modal, 
  TextInput, 
  Alert,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { Header } from '../components/Header';

// Интерфейсы
interface AuctionItem {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  minIncrement: number;
  image: string;
  userParticipating: boolean;
}

interface BidModalProps {
  visible: boolean;
  item: AuctionItem;
  onClose: () => void;
  onConfirm: (amount: number, comment?: string) => void;
}

// Типы для фильтрации
type FilterType = 'active' | 'participating';

// Компонент вкладок
const FilterTabs: React.FC<{ 
  activeFilter: FilterType; 
  onFilterChange: (filter: FilterType) => void;
  participatingCount: number;
}> = ({ activeFilter, onFilterChange, participatingCount }) => {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeFilter === 'active' && styles.activeTab]}
        onPress={() => onFilterChange('active')}
      >
        <Text style={[styles.tabText, activeFilter === 'active' && styles.activeTabText]}>
          Активные
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeFilter === 'participating' && styles.activeTab]}
        onPress={() => onFilterChange('participating')}
      >
        <Text style={[styles.tabText, activeFilter === 'participating' && styles.activeTabText]}>
          Участвую
        </Text>
        {participatingCount > 0 && (
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{participatingCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

// Компонент модального окна для ставки
const BidModal: React.FC<BidModalProps> = ({ visible, item, onClose, onConfirm }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const minBid = item.currentBid + item.minIncrement;

  const handleConfirm = () => {
    const amount = parseInt(bidAmount);
    
    if (!bidAmount || isNaN(amount)) {
      setError('Введите сумму ставки');
      return;
    }
    
    if (amount < minBid) {
      setError(`Минимальная ставка: ${minBid} L-Coin`);
      return;
    }

    onConfirm(amount, comment);
    setBidAmount('');
    setComment('');
    setError('');
  };

  const handleClose = () => {
    setBidAmount('');
    setComment('');
    setError('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalItemContainer}>
              <View style={styles.modalItemIcon}>
                <Text style={styles.modalItemEmoji}>{item.image}</Text>
              </View>
              <Text style={styles.modalItemTitle}>{item.title}</Text>
            </View>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>Ваша ставка</Text>
            <TextInput
              style={[styles.modalInput, error ? styles.modalInputError : null]}
              value={bidAmount}
              onChangeText={(text) => {
                setBidAmount(text);
                setError('');
              }}
              placeholder={`Минимум ${minBid} L-Coin`}
              keyboardType="numeric"
              placeholderTextColor="#666666"
            />
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <Text style={styles.hintText}>
              Минимальный шаг ставки: {item.minIncrement} L-Coin
            </Text>

            <Text style={styles.modalLabel}>Комментарий (необязательно)</Text>
            <TextInput
              style={styles.modalInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Добавить комментарий"
              multiline={true}
              numberOfLines={3}
              placeholderTextColor="#666666"
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Отменить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Подтвердить ставку</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Компонент карточки лота
const AuctionCard: React.FC<{ item: AuctionItem; onBid: () => void }> = ({ item, onBid }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.itemIcon}>
          <Text style={styles.itemEmoji}>{item.image}</Text>
        </View>
        
        <View style={styles.itemInfo}>
          <View style={styles.itemHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
              {item.userParticipating && (
                <View style={styles.participatingBadge}>
                  <Text style={styles.participatingText}>Участвуешь</Text>
                </View>
              )}
            </View>
          </View>
          
          <Text style={styles.itemDescription}>{item.description}</Text>
          
          <View style={styles.bidInfo}>
            <Text style={styles.currentBidLabel}>Последняя ставка</Text>
            <Text style={styles.currentBidAmount}>{item.currentBid} L-Coin</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.bidButton} onPress={onBid}>
        <Text style={styles.bidButtonText}>Сделать ставку</Text>
      </TouchableOpacity>
    </View>
  );
};

// Основной компонент страницы аукциона
export default function AuctionScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('active');
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>([
    {
      id: '1',
      title: 'Экскурсия в музей истории и современного искусства',
      description: 'Увлекательная экскурсия в исторический музей с гидом',
      currentBid: 45,
      minIncrement: 5,
      image: '🏛️',
      userParticipating: false,
    },
    {
      id: '2',
      title: 'Мастер-класс по программированию на Python для начинающих',
      description: 'Изучение основ Python с опытным преподавателем',
      currentBid: 75,
      minIncrement: 10,
      image: '💻',
      userParticipating: true,
    },
    {
      id: '3',
      title: 'Спортивное мероприятие',
      description: 'Участие в турнире по настольному теннису',
      currentBid: 30,
      minIncrement: 5,
      image: '🏓',
      userParticipating: false,
    },
    {
      id: '4',
      title: 'Творческая мастерская по созданию арт-объектов и скульптур',
      description: 'Создание арт-объектов под руководством художника',
      currentBid: 60,
      minIncrement: 10,
      image: '🎨',
      userParticipating: false,
    },
    {
      id: '5',
      title: 'Кулинарный мастер-класс от шеф-повара ресторана',
      description: 'Приготовление традиционных блюд с шеф-поваром',
      currentBid: 85,
      minIncrement: 15,
      image: '👨‍🍳',
      userParticipating: true,
    },
  ]);

  // Фильтрация аукционов
  const filteredItems = auctionItems.filter(item => {
    if (activeFilter === 'participating') {
      return item.userParticipating;
    }
    return true; // Показываем все активные аукционы
  });

  // Подсчет участвующих аукционов
  const participatingCount = auctionItems.filter(item => item.userParticipating).length;

  const handleBidPress = (item: AuctionItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleBidConfirm = (amount: number, comment?: string) => {
    if (selectedItem) {
      // Обновляем данные лота
      setAuctionItems(items => 
        items.map(item => 
          item.id === selectedItem.id 
            ? { ...item, currentBid: amount, userParticipating: true }
            : item
        )
      );

      Alert.alert(
        'Ставка принята!', 
        `Ваша ставка ${amount} L-Coin на "${selectedItem.title}" успешно размещена.`,
        [{ text: 'OK' }]
      );

      setModalVisible(false);
      setSelectedItem(null);
    }
  };

  const handleNotificationPress = () => {
    Alert.alert('Уведомления', 'Здесь будут отображаться уведомления о торгах');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#8B2439"
        translucent={false}
      />
      
      <Header 
        title="Аукцион"
        notificationCount={2}
        onNotificationPress={handleNotificationPress}
        showNotificationButton={true}
      />
      
      <FilterTabs 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        participatingCount={participatingCount}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsList}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <AuctionCard 
                key={item.id} 
                item={item} 
                onBid={() => handleBidPress(item)} 
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyTitle}>
                {activeFilter === 'participating' ? 'Вы пока не участвуете в аукционах' : 'Нет активных аукционов'}
              </Text>
              <Text style={styles.emptyDescription}>
                {activeFilter === 'participating' 
                  ? 'Перейдите на вкладку "Активные" чтобы начать участвовать в торгах'
                  : 'Новые аукционы появятся скоро. Следите за обновлениями!'
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {selectedItem && (
        <BidModal
          visible={modalVisible}
          item={selectedItem}
          onClose={() => setModalVisible(false)}
          onConfirm={handleBidConfirm}
        />
      )}
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
  
  // Стили вкладок
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomColor: '#8B2439',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#8B2439',
    fontWeight: '600',
  },
  tabBadge: {
    backgroundColor: '#22C55E',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  
  itemsList: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  itemIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemEmoji: {
    fontSize: 28,
  },
  itemInfo: {
    flex: 1,
  },
  itemHeader: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B2439',
    lineHeight: 22,
  },
  participatingBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  participatingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  bidInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentBidLabel: {
    fontSize: 14,
    color: '#666666',
  },
  currentBidAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B2439',
  },
  bidButton: {
    backgroundColor: '#8B2439',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bidButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Пустое состояние
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B2439',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Стили модального окна
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: '#F2F2F7',
    padding: 20,
    alignItems: 'center',
  },
  modalItemContainer: {
    alignItems: 'center',
  },
  modalItemIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalItemEmoji: {
    fontSize: 40,
  },
  modalItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B2439',
    textAlign: 'center',
  },
  modalContent: {
    padding: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B2439',
    marginBottom: 8,
    marginTop: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  modalInputError: {
    borderColor: '#FF4444',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    marginBottom: 8,
  },
  hintText: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E5EA',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#8B2439',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 