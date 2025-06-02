import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  badge?: string
  rating: number
}

interface CartItem extends Product {
  quantity: number
}

const mockProducts: Product[] = [
  { id: '1', name: 'Лицейская футболка', price: 1200, image: '👕', category: 'Одежда', rating: 4.8 },
  { id: '2', name: 'Блокнот с логотипом', price: 350, image: '📔', category: 'Канцелярия', badge: 'Хит', rating: 4.9 },
  { id: '3', name: 'Кружка лицея', price: 800, image: '☕', category: 'Посуда', rating: 4.7 },
  { id: '4', name: 'Значок выпускника', price: 450, image: '🎖️', category: 'Аксессуары', badge: 'Новинка', rating: 5.0 },
  { id: '5', name: 'Лицейская толстовка', price: 2500, image: '🧥', category: 'Одежда', rating: 4.6 },
  { id: '6', name: 'Ручка премиум', price: 600, image: '🖊️', category: 'Канцелярия', rating: 4.8 },
]

export const ShopScreen: React.FC = () => {
  const navigation = useNavigation()
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('Все')
  const [cartVisible, setCartVisible] = useState(false)

  const categories = ['Все', 'Одежда', 'Канцелярия', 'Посуда', 'Аксессуары']

  const filteredProducts = selectedCategory === 'Все' 
    ? mockProducts 
    : mockProducts.filter(p => p.category === selectedCategory)

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      ))
    }
  }

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Text style={styles.productImage}>{item.image}</Text>
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
        <Text style={styles.productPrice}>{item.price} ₽</Text>
        
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addToCartText}>В корзину</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Text style={styles.cartItemImage}>{item.image}</Text>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>{item.price} ₽</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>L-Shop</Text>
          <Text style={styles.headerSubtitle}>Магазин лицея</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.cartButton} onPress={() => setCartVisible(!cartVisible)}>
            <Text style={styles.cartIcon}>🛒</Text>
            {cartItemsCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        style={styles.categoriesContainer}
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Cart Slide-out */}
      {cartVisible && (
        <View style={styles.cartOverlay}>
          <View style={styles.cartSlideOut}>
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}>Корзина</Text>
              <TouchableOpacity onPress={() => setCartVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {cart.length === 0 ? (
              <View style={styles.emptyCart}>
                <Text style={styles.emptyCartText}>Корзина пуста</Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={cart}
                  renderItem={renderCartItem}
                  keyExtractor={(item) => item.id}
                  style={styles.cartList}
                />
                
                <View style={styles.cartFooter}>
                  <Text style={styles.cartTotal}>Итого: {cartTotal} ₽</Text>
                  <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutButtonText}>Оформить заказ</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B2439',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  categoryButtonActive: {
    backgroundColor: '#8B2439',
  },
  categoryText: {
    color: '#666666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  productsContainer: {
    padding: 8,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImageContainer: {
    position: 'relative',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    paddingVertical: 20,
  },
  productImage: {
    fontSize: 48,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#E67E22',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    color: '#666666',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B2439',
    marginBottom: 12,
  },
  addToCartButton: {
    backgroundColor: '#8B2439',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  cartOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  cartSlideOut: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  closeButton: {
    fontSize: 20,
    color: '#666666',
  },
  emptyCart: {
    padding: 40,
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 16,
    color: '#666666',
  },
  cartList: {
    maxHeight: 300,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cartItemImage: {
    fontSize: 24,
    marginRight: 12,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  cartItemPrice: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  cartFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12,
  },
  checkoutButton: {
    backgroundColor: '#8B2439',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default ShopScreen 