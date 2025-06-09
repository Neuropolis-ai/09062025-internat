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
import { Header } from './components/Header';

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
            <Text style={styles.itemTitle}>{item.title}</Text>
            {item.userParticipating && (
              <View style={styles.participatingBadge}>
                <Text style={styles.participatingText}>Участвуешь</Text>
              </View>
            )}
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
  const [auctionItems, setAuctionItems] = useState<AuctionItem[]>([
    {
      id: '1',
      title: 'Экскурсия в музей',
      description: 'Увлекательная экскурсия в исторический музей с гидом',
      currentBid: 45,
      minIncrement: 5,
      image: '🏛️',
      userParticipating: false,
    },
    {
      id: '2',
      title: 'Мастер-класс по программированию',
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
      title: 'Творческая мастерская',
      description: 'Создание арт-объектов под руководством художника',
      currentBid: 60,
      minIncrement: 10,
      image: '🎨',
      userParticipating: false,
    },
    {
      id: '5',
      title: 'Кулинарный мастер-класс',
      description: 'Приготовление традиционных блюд с шеф-поваром',
      currentBid: 85,
      minIncrement: 15,
      image: '👨‍🍳',
      userParticipating: true,
    },
  ]);

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
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsList}>
          {auctionItems.map((item) => (
            <AuctionCard 
              key={item.id} 
              item={item} 
              onBid={() => handleBidPress(item)} 
            />
          ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B2439',
    flex: 1,
    marginRight: 8,
  },
  participatingBadge: {
    backgroundColor: '#8B2439',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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