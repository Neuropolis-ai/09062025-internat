import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Header } from './components/Header'
import { router } from 'expo-router'
import { Stack } from 'expo-router'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
  time: string
  note?: string
}

export default function BankScreen() {
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      amount: 500,
      description: 'Пополнение',
      date: '23.12.2024',
      time: '14:30',
      note: 'Пополнение от родителей'
    },
    {
      id: '2',
      type: 'expense',
      amount: 150,
      description: 'Покупка',
      date: '22.12.2024',
      time: '12:15',
      note: 'Канцелярские товары'
    },
    {
      id: '3',
      type: 'expense',
      amount: 200,
      description: 'Питание',
      date: '22.12.2024',
      time: '08:30',
      note: 'Завтрак в столовой'
    },
    {
      id: '4',
      type: 'income',
      amount: 1000,
      description: 'Стипендия',
      date: '20.12.2024',
      time: '10:00',
      note: 'Академическая стипендия'
    },
    {
      id: '5',
      type: 'expense',
      amount: 75,
      description: 'Транспорт',
      date: '19.12.2024',
      time: '16:45',
      note: 'Проезд на автобусе'
    }
  ]

  const currentAccountNumber = '1234'
  const creditAccountNumber = '5678'
  const currentBalance = 2450
  const creditLimit = 1000
  const creditUsed = 250
  const creditAvailable = creditLimit - creditUsed
  const innl = '459183'

  const handleNotificationPress = (): void => {
    console.log('Уведомления нажаты')
  }

  const handleBackPress = (): void => {
    router.replace('/');
  }

  const handleShowAllOperations = (): void => {
    console.log('Показать все операции')
  }

  const formatAmount = (amount: number): string => {
    return amount.toLocaleString('ru-RU')
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        {/* Унифицированный хедер */}
        <Header 
          title="Лицейский банк" 
          onNotificationPress={handleNotificationPress}
          onBackPress={handleBackPress}
          showBackButton={true}
        />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Блок идентификации студента */}
          <View style={styles.studentBlock}>
            <Text style={styles.innlLabel}>ИННЛ:</Text>
            <Text style={styles.innlNumber}>{innl}</Text>
          </View>

          {/* Текущий счёт - главная карточка с бордовым фоном */}
          <View style={styles.primaryAccountCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="card" size={24} color="#FFFFFF" />
              <View style={styles.cardTitleContainer}>
                <Text style={styles.primaryCardTitle}>Расчётный счёт</Text>
                <Text style={styles.primaryCardNumber}>№ {currentAccountNumber}</Text>
              </View>
            </View>
            <View style={styles.primaryBalanceContainer}>
              <Text style={styles.primaryBalanceLabel}>Доступно</Text>
              <Text style={styles.primaryBalanceAmount}>{formatAmount(currentBalance)} L-Coin</Text>
            </View>
          </View>

          {/* Кредитный счёт */}
          <View style={styles.creditCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="card-outline" size={24} color="#8B2439" />
              <View style={styles.cardTitleContainer}>
                <Text style={styles.creditCardTitle}>Кредитный счёт</Text>
                <Text style={styles.creditCardNumber}>№ {creditAccountNumber}</Text>
              </View>
              <Ionicons name="warning" size={20} color="#FF8C00" style={styles.warningIcon} />
            </View>
            <View style={styles.creditInfo}>
              <View style={styles.creditRow}>
                <Text style={styles.creditLabel}>Доступно:</Text>
                <Text style={styles.creditAvailable}>{formatAmount(creditAvailable)} L-Coin</Text>
              </View>
              <View style={styles.creditRow}>
                <Text style={styles.creditLabel}>Использовано:</Text>
                <Text style={styles.creditUsed}>{formatAmount(creditUsed)} L-Coin</Text>
              </View>
              <View style={styles.creditLimitContainer}>
                <Text style={styles.creditLimitLabel}>Лимит: {formatAmount(creditLimit)} L-Coin</Text>
              </View>
            </View>
          </View>

          {/* История операций */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>История операций</Text>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                  <View style={styles.transactionType}>
                    <Ionicons 
                      name={transaction.type === 'income' ? 'arrow-down-circle' : 'arrow-up-circle'} 
                      size={28} 
                      color={transaction.type === 'income' ? '#22C55E' : '#EF4444'} 
                    />
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionDescription}>{transaction.description}</Text>
                      <Text style={styles.transactionDateTime}>
                        {transaction.date} • {transaction.time}
                      </Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    { color: transaction.type === 'income' ? '#22C55E' : '#EF4444' }
                  ]}>
                    {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)} L-Coin
                  </Text>
                </View>
                {transaction.note && (
                  <Text style={styles.transactionNote}>{transaction.note}</Text>
                )}
              </View>
            ))}
            
            <TouchableOpacity style={styles.showAllButton} onPress={handleShowAllOperations}>
              <Text style={styles.showAllText}>Показать все операции</Text>
              <Ionicons name="chevron-forward" size={20} color="#8B2439" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },

  // Контент
  content: {
    flex: 1,
  },

  // Блок студента
  studentBlock: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  innlLabel: {
    fontSize: 16,
    color: '#666666',
    marginRight: 8,
  },
  innlNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B2439',
  },

  // Главная карточка - Расчётный счёт с бордовым фоном
  primaryAccountCard: {
    backgroundColor: '#8B2439',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'column',
    marginLeft: 12,
    flex: 1,
  },
  primaryCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  primaryCardNumber: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 2,
  },
  primaryBalanceContainer: {
    alignItems: 'flex-end',
  },
  primaryBalanceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  primaryBalanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Кредитная карточка
  creditCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  creditCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B2439',
  },
  creditCardNumber: {
    fontSize: 14,
    color: '#8B2439',
    opacity: 0.8,
    marginTop: 2,
  },
  warningIcon: {
    marginLeft: 8,
  },
  creditInfo: {
    marginTop: 16,
  },
  creditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  creditLabel: {
    fontSize: 16,
    color: '#666666',
  },
  creditAvailable: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22C55E',
  },
  creditUsed: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B2439',
  },
  creditLimitContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  creditLimitLabel: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },

  // История операций с улучшенным дизайном карточек
  historySection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 16,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  transactionType: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionDetails: {
    marginLeft: 12,
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  transactionDateTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  transactionNote: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    fontStyle: 'italic',
  },

  // Кнопка "Показать все"
  showAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  showAllText: {
    fontSize: 16,
    color: '#8B2439',
    fontWeight: '600',
    marginRight: 8,
  },
}) 