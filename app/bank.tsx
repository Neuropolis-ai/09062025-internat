import React from 'react'
import { ScrollView, View, Alert, TouchableOpacity, StyleSheet, Text, SafeAreaView } from 'react-native'

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
  // Мок данные согласно ТЗ
  const innl = '459183'
  const checkingAccountNumber = '40817810570000123456'
  const creditAccountNumber = '40817810570000654321'
  const checkingBalance = 2450 // L-Coin
  const creditLimit = 1000 // L-Coin
  const creditUsed = 250 // L-Coin
  const creditAvailable = creditLimit - creditUsed
  const notificationCount = 3
  
  const recentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      amount: 200,
      description: 'Начисление за участие в олимпиаде',
      date: '15.01.2025',
      time: '14:30',
      note: 'Региональная олимпиада по математике'
    },
    {
      id: '2',
      type: 'expense',
      amount: 150,
      description: 'Списание за покупку в L-shop',
      date: '14.01.2025',
      time: '16:45',
      note: 'Покупка канцелярских товаров'
    },
    {
      id: '3',
      type: 'income',
      amount: 100,
      description: 'Начисление за дежурство',
      date: '13.01.2025',
      time: '18:00',
    },
    {
      id: '4',
      type: 'expense',
      amount: 75,
      description: 'Списание за услуги столовой',
      date: '12.01.2025',
      time: '12:30',
      note: 'Обед'
    },
    {
      id: '5',
      type: 'income',
      amount: 300,
      description: 'Начисление стипендии',
      date: '10.01.2025',
      time: '09:00',
      note: 'Месячная стипендия за отличную учебу'
    }
  ]

  const handleNotificationPress = (): void => {
    Alert.alert('Уведомления', `У вас ${notificationCount} новых уведомлений`)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Шапка (Header) */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Лицейский банк
          </Text>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
            <View style={styles.notificationIcon}>
              <Text style={styles.notificationEmoji}>🔔</Text>
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {notificationCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Блок идентификации ученика */}
        <View style={styles.identificationSection}>
          <Text style={styles.innlText}>
            ИННЛ: {innl}
          </Text>
        </View>

        {/* Блок расчётного счёта */}
        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <Text style={styles.accountTitle}>
              Расчётный счёт № {checkingAccountNumber.slice(-8)}
            </Text>
          </View>
          <View style={styles.balanceSection}>
            <Text style={styles.balanceAmount}>
              {checkingBalance.toLocaleString()} L-Coin
            </Text>
          </View>
        </View>

        {/* Блок кредитного счёта */}
        <View style={styles.creditCard}>
          <View style={styles.accountHeader}>
            <View style={styles.creditHeaderRow}>
              <Text style={styles.accountTitle}>
                Кредитный счёт № {creditAccountNumber.slice(-8)}
              </Text>
              <TouchableOpacity style={styles.warningIcon}>
                <Text style={styles.warningEmoji}>⚠️</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.creditDetails}>
            <View style={styles.creditItem}>
              <Text style={styles.creditLabel}>Доступно:</Text>
              <Text style={styles.creditAvailable}>
                {creditAvailable.toLocaleString()} L-Coin
              </Text>
            </View>
            <View style={styles.creditItem}>
              <Text style={styles.creditLabel}>Использовано:</Text>
              <Text style={styles.creditUsed}>
                {creditUsed.toLocaleString()} L-Coin
              </Text>
            </View>
          </View>
        </View>

        {/* История операций */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>
            История операций
          </Text>
          
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionRow}>
                <View style={styles.transactionInfo}>
                  <View style={styles.transactionHeader}>
                    <Text 
                      style={[
                        styles.transactionType,
                        { color: transaction.type === 'income' ? '#4D8061' : '#E74C3C' }
                      ]}
                    >
                      {transaction.type === 'income' ? 'Начисление' : 'Списание'}
                    </Text>
                    <Text 
                      style={[
                        styles.transactionAmount,
                        { color: transaction.type === 'income' ? '#4D8061' : '#E74C3C' }
                      ]}
                    >
                      {transaction.type === 'income' ? '+' : '-'}{transaction.amount} L-Coin
                    </Text>
                  </View>
                  
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  
                  <View style={styles.transactionMeta}>
                    <Text style={styles.transactionDate}>{transaction.date} в {transaction.time}</Text>
                  </View>
                  
                  {transaction.note && (
                    <View style={styles.transactionNote}>
                      <Text style={styles.transactionNoteText}>Примечание: {transaction.note}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
          
          <View style={styles.showMoreContainer}>
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => Alert.alert('История', 'Показать полную историю операций')}
            >
              <Text style={styles.showMoreText}>Показать все операции</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    paddingBottom: 64,
  },
  
  // Шапка
  header: {
    backgroundColor: '#8B2439',
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  notificationButton: {
    position: 'absolute',
    right: 24,
    top: 40,
  },
  notificationIcon: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationEmoji: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Идентификация
  identificationSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  innlText: {
    fontSize: 16,
    color: '#666666',
  },
  
  // Счета
  accountCard: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  creditCard: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#FAFAFA',
    borderColor: '#F1C40F',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  accountHeader: {
    marginBottom: 16,
  },
  accountTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B2439',
  },
  creditHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  warningIcon: {
    padding: 4,
  },
  warningEmoji: {
    fontSize: 20,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B2439',
  },
  creditDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  creditItem: {
    flex: 1,
    alignItems: 'center',
  },
  creditLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  creditAvailable: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4D8061',
  },
  creditUsed: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  
  // История операций
  historySection: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B2439',
    marginBottom: 16,
  },
  transactionCard: {
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionRow: {
    flexDirection: 'row',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  transactionDescription: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  transactionMeta: {
    marginTop: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666666',
  },
  transactionNote: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  transactionNoteText: {
    fontSize: 12,
    color: '#666666',
  },
  showMoreContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  showMoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  showMoreText: {
    fontSize: 16,
    color: '#8B2439',
    textDecorationLine: 'underline',
  },
}) 