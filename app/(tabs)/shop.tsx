import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from '../components/Header';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function ShopScreen() {
  const router = useRouter();
  const [userBalance] = useState(150); // Текущий баланс пользователя в L-Coin
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Пример товаров для магазина
  const products: Product[] = [
    {
      id: '1',
      name: 'Блокнот Лицея',
      description: 'Стильный блокнот с логотипом лицея для заметок',
      price: 25,
      image: '📓',
      category: 'канцелярия',
    },
    {
      id: '2',
      name: 'Футболка Лицея',
      description: 'Комфортная футболка с фирменным дизайном',
      price: 75,
      image: '👕',
      category: 'одежда',
    },
    {
      id: '3',
      name: 'Кружка с логотипом',
      description: 'Керамическая кружка для чая и кофе',
      price: 40,
      image: '☕',
      category: 'посуда',
    },
    {
      id: '4',
      name: 'Набор ручек',
      description: 'Качественные ручки для учебы в комплекте',
      price: 15,
      image: '🖊️',
      category: 'канцелярия',
    },
    {
      id: '5',
      name: 'Рюкзак Лицея',
      description: 'Прочный рюкзак для книг и учебных материалов',
      price: 120,
      image: '🎒',
      category: 'одежда',
    },
    {
      id: '6',
      name: 'Значок Лицея',
      description: 'Металлический значок с эмблемой лицея',
      price: 20,
      image: '🏅',
      category: 'аксессуары',
    },
  ];

  const handleNotificationPress = () => {
    router.push('/(tabs)/notifications');
  };

  const handleBuyPress = (product: Product) => {
    setSelectedProduct(product);
    setIsConfirmModalVisible(true);
  };

  const handleConfirmPurchase = () => {
    if (selectedProduct) {
      if (userBalance >= selectedProduct.price) {
        setIsConfirmModalVisible(false);
        setPurchaseSuccess(true);
        
        // Показать уведомление об успешной покупке
        setTimeout(() => {
          setPurchaseSuccess(false);
          setSelectedProduct(null);
        }, 2000);
      } else {
        Alert.alert(
          'Недостаточно средств',
          'У вас недостаточно L-Coin для покупки этого товара.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const handleCancelPurchase = () => {
    setIsConfirmModalVisible(false);
    setSelectedProduct(null);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Text style={styles.productImage}>{item.image}</Text>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>🔸 {item.price} L-Coin</Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.buyButton,
            userBalance < item.price && styles.buyButtonDisabled
          ]}
          onPress={() => handleBuyPress(item)}
          disabled={userBalance < item.price}
        >
          <Text style={[
            styles.buyButtonText,
            userBalance < item.price && styles.buyButtonTextDisabled
          ]}>
            {userBalance >= item.price ? 'Купить' : 'Недостаточно средств'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Хедер */}
      <Header 
        title="L-shop" 
        notificationCount={2}
        onNotificationPress={handleNotificationPress}
        showBackButton={false}
        showNotificationButton={true}
      />

      {/* Баланс пользователя */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Ваш баланс:</Text>
        <Text style={styles.balanceAmount}>🔸 {userBalance} L-Coin</Text>
      </View>

      {/* Список товаров */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        numColumns={1}
      />

      {/* Модальное окно подтверждения покупки */}
      <Modal
        visible={isConfirmModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelPurchase}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                <View style={styles.modalProductContainer}>
                  <Text style={styles.modalProductImage}>{selectedProduct.image}</Text>
                  <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                </View>
                
                <Text style={styles.modalText}>
                  Вы уверены, что хотите купить этот товар за {selectedProduct.price} L-Coin?
                </Text>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={handleCancelPurchase}
                  >
                    <Text style={styles.cancelButtonText}>Отменить</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleConfirmPurchase}
                  >
                    <Text style={styles.confirmButtonText}>Подтвердить</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Уведомление об успешной покупке */}
      <Modal
        visible={purchaseSuccess}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.successOverlay}>
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
            <Text style={styles.successText}>
              Товар успешно приобретен!
            </Text>
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
  
  // Баланс
  balanceContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 18,
    color: '#8B2439',
    fontWeight: 'bold',
  },

  // Список товаров
  productsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  productImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#F8F8F8',
  },
  productImage: {
    fontSize: 60,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  priceContainer: {
    marginBottom: 16,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B2439',
  },
  buyButton: {
    backgroundColor: '#8B2439',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buyButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyButtonTextDisabled: {
    color: '#666666',
  },

  // Модальное окно
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    margin: 40,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 280,
  },
  modalProductContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalProductImage: {
    fontSize: 50,
    marginBottom: 10,
  },
  modalProductName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B2439',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#E5E5EA',
  },
  confirmButton: {
    backgroundColor: '#8B2439',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Уведомление об успехе
  successOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  successBanner: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 100,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  successText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 12,
  },
}); 