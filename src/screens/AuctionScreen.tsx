import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'

interface AuctionItem {
  id: string
  title: string
  description: string
  image: string
  currentBid: number
  startingBid: number
  endTime: Date
  bidCount: number
  seller: string
  category: string
  status: 'active' | 'ended' | 'upcoming'
}

interface Bid {
  id: string
  amount: number
  bidder: string
  timestamp: Date
}

const mockAuctions: AuctionItem[] = [
  {
    id: '1',
    title: 'Редкая медаль лицея 1990г',
    description: 'Памятная медаль выпуска 1990 года в отличном состоянии',
    image: '🥇',
    currentBid: 2500,
    startingBid: 1000,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 часа
    bidCount: 12,
    seller: 'Выпускник_90',
    category: 'Памятные вещи',
    status: 'active'
  },
  {
    id: '2',
    title: 'Винтажная форма лицея',
    description: 'Оригинальная форма 80-х годов, размер M',
    image: '🎽',
    currentBid: 1800,
    startingBid: 800,
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 часов
    bidCount: 8,
    seller: 'Коллекционер',
    category: 'Одежда',
    status: 'active'
  },
  {
    id: '3',
    title: 'Автограф директора',
    description: 'Автограф легендарного директора на фотографии',
    image: '📸',
    currentBid: 3200,
    startingBid: 1500,
    endTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 час
    bidCount: 15,
    seller: 'Архивариус',
    category: 'Автографы',
    status: 'active'
  }
]

const mockBids: Record<string, Bid[]> = {
  '1': [
    { id: '1', amount: 2500, bidder: 'Студент_2025', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
    { id: '2', amount: 2300, bidder: 'Коллекционер_1', timestamp: new Date(Date.now() - 15 * 60 * 1000) },
    { id: '3', amount: 2000, bidder: 'Выпускник_95', timestamp: new Date(Date.now() - 30 * 60 * 1000) },
  ]
}

export const AuctionScreen: React.FC = () => {
  const navigation = useNavigation()
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null)
  const [bidAmount, setBidAmount] = useState<string>('')
  const [refreshing, setRefreshing] = useState(false)

  // Симуляция real-time обновлений
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshing(prev => !prev)
    }, 10000) // Обновляем каждые 10 секунд

    return () => clearInterval(interval)
  }, [])

  const formatTimeLeft = (endTime: Date): string => {
    const now = new Date()
    const diff = endTime.getTime() - now.getTime()
    
    if (diff <= 0) return 'Завершен'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}ч ${minutes}м`
    }
    return `${minutes}м`
  }

  const getMinBid = (auction: AuctionItem): number => {
    return auction.currentBid + 100
  }

  const placeBid = (auction: AuctionItem) => {
    const amount = parseInt(bidAmount)
    const minBid = getMinBid(auction)
    
    if (isNaN(amount) || amount < minBid) {
      Alert.alert('Ошибка', `Минимальная ставка: ${minBid} ₽`)
      return
    }

    Alert.alert(
      'Подтверждение',
      `Сделать ставку ${amount} ₽?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Подтвердить', 
          onPress: () => {
            Alert.alert('Успех!', 'Ваша ставка принята')
            setBidAmount('')
            setSelectedAuction(null)
          }
        }
      ]
    )
  }

  const renderAuctionCard = ({ item }: { item: AuctionItem }) => {
    const timeLeft = formatTimeLeft(item.endTime)
    const isEnding = item.endTime.getTime() - Date.now() < 60 * 60 * 1000 // Меньше часа
    
    return (
      <TouchableOpacity 
        style={styles.auctionCard}
        onPress={() => setSelectedAuction(item)}
      >
        <View style={styles.auctionImageContainer}>
          <Text style={styles.auctionImage}>{item.image}</Text>
          <View style={[styles.statusBadge, isEnding && styles.endingBadge]}>
            <Text style={styles.statusText}>{timeLeft}</Text>
          </View>
        </View>
        
        <View style={styles.auctionInfo}>
          <Text style={styles.auctionTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.auctionCategory}>{item.category}</Text>
          
          <View style={styles.bidInfo}>
            <View>
              <Text style={styles.bidLabel}>Текущая ставка</Text>
              <Text style={styles.currentBid}>{item.currentBid.toLocaleString()} ₽</Text>
            </View>
            <View style={styles.bidStats}>
              <Text style={styles.bidCount}>{item.bidCount} ставок</Text>
              <Text style={styles.seller}>от {item.seller}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderBidHistory = ({ item }: { item: Bid }) => (
    <View style={styles.bidHistoryItem}>
      <View style={styles.bidHistoryInfo}>
        <Text style={styles.bidHistoryAmount}>{item.amount.toLocaleString()} ₽</Text>
        <Text style={styles.bidHistoryBidder}>{item.bidder}</Text>
      </View>
      <Text style={styles.bidHistoryTime}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
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
          <Text style={styles.headerTitle}>Аукцион лицея</Text>
          <Text style={styles.headerSubtitle}>Торги и уникальные лоты</Text>
        </View>
        
        <TouchableOpacity style={styles.statsButton}>
          <Text style={styles.statsIcon}>📊</Text>
        </TouchableOpacity>
      </View>

      {selectedAuction ? (
        // Детальный вид аукциона
        <ScrollView style={styles.detailContainer}>
          <View style={styles.detailHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setSelectedAuction(null)}
            >
              <Text style={styles.backButtonText}>← Назад</Text>
            </TouchableOpacity>
            <Text style={styles.detailTitle}>Детали лота</Text>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailImageContainer}>
              <Text style={styles.detailImage}>{selectedAuction.image}</Text>
            </View>
            
            <Text style={styles.detailItemTitle}>{selectedAuction.title}</Text>
            <Text style={styles.detailDescription}>{selectedAuction.description}</Text>
            
            <View style={styles.detailBidInfo}>
              <View style={styles.detailBidRow}>
                <Text style={styles.detailBidLabel}>Текущая ставка:</Text>
                <Text style={styles.detailCurrentBid}>
                  {selectedAuction.currentBid.toLocaleString()} ₽
                </Text>
              </View>
              <View style={styles.detailBidRow}>
                <Text style={styles.detailBidLabel}>Минимальная ставка:</Text>
                <Text style={styles.detailMinBid}>
                  {getMinBid(selectedAuction).toLocaleString()} ₽
                </Text>
              </View>
              <View style={styles.detailBidRow}>
                <Text style={styles.detailBidLabel}>Осталось времени:</Text>
                <Text style={[
                  styles.detailTimeLeft,
                  selectedAuction.endTime.getTime() - Date.now() < 60 * 60 * 1000 && styles.urgentTime
                ]}>
                  {formatTimeLeft(selectedAuction.endTime)}
                </Text>
              </View>
            </View>
          </View>

          {/* Форма ставки */}
          <View style={styles.bidForm}>
            <Text style={styles.bidFormTitle}>Сделать ставку</Text>
            <View style={styles.bidInputContainer}>
              <Text style={styles.bidInputLabel}>Сумма (₽):</Text>
              <View style={styles.bidInputRow}>
                <Text 
                  style={styles.bidInput}
                  onPress={() => {
                    // В реальном приложении здесь будет TextInput
                    setBidAmount(getMinBid(selectedAuction).toString())
                  }}
                >
                  {bidAmount || `Мин. ${getMinBid(selectedAuction)}`}
                </Text>
                <TouchableOpacity 
                  style={styles.bidButton}
                  onPress={() => placeBid(selectedAuction)}
                >
                  <Text style={styles.bidButtonText}>Сделать ставку</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* История ставок */}
          <View style={styles.bidHistory}>
            <Text style={styles.bidHistoryTitle}>История ставок</Text>
            <FlatList
              data={mockBids[selectedAuction.id] || []}
              renderItem={renderBidHistory}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      ) : (
        // Список аукционов
        <>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Активных</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>35</Text>
              <Text style={styles.statLabel}>Ставок сегодня</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12.5k</Text>
              <Text style={styles.statLabel}>Оборот (₽)</Text>
            </View>
          </View>

          <FlatList
            data={mockAuctions}
            renderItem={renderAuctionCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.auctionsList}
            showsVerticalScrollIndicator={false}
          />
        </>
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
    fontSize: 20,
  },
  headerContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B2439',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666666',
  },
  statsButton: {
    padding: 8,
  },
  statsIcon: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B2439',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  auctionsList: {
    padding: 8,
  },
  auctionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  auctionImageContainer: {
    position: 'relative',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    paddingVertical: 24,
  },
  auctionImage: {
    fontSize: 48,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#27AE60',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  endingBadge: {
    backgroundColor: '#E74C3C',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  auctionInfo: {
    padding: 16,
  },
  auctionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  auctionCategory: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
  },
  bidInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bidLabel: {
    fontSize: 12,
    color: '#666666',
  },
  currentBid: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B2439',
  },
  bidStats: {
    alignItems: 'flex-end',
  },
  bidCount: {
    fontSize: 12,
    color: '#666666',
  },
  seller: {
    fontSize: 10,
    color: '#999999',
    marginTop: 2,
  },
  // Detail view styles
  detailContainer: {
    flex: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButtonText: {
    fontSize: 16,
    color: '#8B2439',
    fontWeight: '500',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailImageContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginBottom: 16,
  },
  detailImage: {
    fontSize: 64,
  },
  detailItemTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  detailDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  detailBidInfo: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 16,
  },
  detailBidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailBidLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailCurrentBid: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B2439',
  },
  detailMinBid: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  detailTimeLeft: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27AE60',
  },
  urgentTime: {
    color: '#E74C3C',
  },
  bidForm: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bidFormTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  bidInputContainer: {
    marginBottom: 16,
  },
  bidInputLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  bidInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 12,
    backgroundColor: '#F8F8F8',
  },
  bidButton: {
    backgroundColor: '#8B2439',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bidButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  bidHistory: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bidHistoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  bidHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  bidHistoryInfo: {
    flex: 1,
  },
  bidHistoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  bidHistoryBidder: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  bidHistoryTime: {
    fontSize: 12,
    color: '#999999',
  },
})

export default AuctionScreen 