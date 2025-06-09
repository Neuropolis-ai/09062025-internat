import React from 'react'
import { ScrollView, View, Alert, TouchableOpacity, StyleSheet } from 'react-native'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Typography, Heading, Label, Caption } from '../components/ui/Typography'
import { theme } from '../styles/unistyles'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
  time: string
  note?: string
}

export const BankScreen: React.FC = () => {
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Шапка (Header) */}
      <View style={styles.header}>
        <Heading level={2} color="white" align="center">
          Лицейский банк
        </Heading>
        <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
          <View style={styles.notificationIcon}>
            <Typography variant="body" color="white">🔔</Typography>
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Typography variant="caption" color="white" weight="bold">
                  {notificationCount}
                </Typography>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Блок идентификации ученика */}
      <View style={styles.identificationSection}>
        <Typography variant="body" color="muted">
          ИННЛ: {innl}
        </Typography>
      </View>

      {/* Блок расчётного счёта */}
      <Card variant="elevated" style={styles.accountCard}>
        <Card.Body>
          <View style={styles.accountHeader}>
            <Heading level={4} color="primary">
              Расчётный счёт № {checkingAccountNumber.slice(-8)}
            </Heading>
          </View>
          <View style={styles.balanceSection}>
            <Typography variant="h1" color="primary" weight="bold">
              {checkingBalance.toLocaleString()} L-Coin
            </Typography>
          </View>
        </Card.Body>
      </Card>

      {/* Блок кредитного счёта */}
      <Card variant="outlined" style={styles.creditCard}>
        <Card.Body>
          <View style={styles.accountHeader}>
            <View style={styles.creditHeaderRow}>
              <Heading level={4} color="primary">
                Кредитный счёт № {creditAccountNumber.slice(-8)}
              </Heading>
              <TouchableOpacity style={styles.warningIcon}>
                <Typography variant="body" color="error">⚠️</Typography>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.creditDetails}>
            <View style={styles.creditItem}>
              <Label color="muted">Доступно:</Label>
              <Typography variant="h4" color="secondary" weight="bold">
                {creditAvailable.toLocaleString()} L-Coin
              </Typography>
            </View>
            <View style={styles.creditItem}>
              <Label color="muted">Использовано:</Label>
              <Typography variant="h4" color="error" weight="bold">
                {creditUsed.toLocaleString()} L-Coin
              </Typography>
            </View>
          </View>
        </Card.Body>
      </Card>

      {/* История операций */}
      <View style={styles.historySection}>
        <Heading level={3} color="primary">
          История операций
        </Heading>
        
        {recentTransactions.map((transaction) => (
          <Card key={transaction.id} variant="standard" style={styles.transactionCard}>
            <Card.Body>
              <View style={styles.transactionRow}>
                <View style={styles.transactionInfo}>
                  <View style={styles.transactionHeader}>
                    <Typography 
                      variant="body" 
                      color={transaction.type === 'income' ? 'secondary' : 'error'}
                      weight="bold"
                    >
                      {transaction.type === 'income' ? 'Начисление' : 'Списание'}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      color={transaction.type === 'income' ? 'secondary' : 'error'}
                      weight="bold"
                    >
                      {transaction.type === 'income' ? '+' : '-'}{transaction.amount} L-Coin
                    </Typography>
                  </View>
                  
                  <Label color="default">{transaction.description}</Label>
                  
                  <View style={styles.transactionMeta}>
                    <Caption color="muted">{transaction.date} в {transaction.time}</Caption>
                  </View>
                  
                  {transaction.note && (
                    <View style={styles.transactionNote}>
                      <Caption color="muted">Примечание: {transaction.note}</Caption>
                    </View>
                  )}
                </View>
              </View>
            </Card.Body>
          </Card>
        ))}
        
        <View style={styles.showMoreContainer}>
          <Button
            variant="ghost"
            size="medium"
            onPress={() => Alert.alert('История', 'Показать полную историю операций')}
          >
            Показать все операции
          </Button>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.ultraLight,
  },
  content: {
    paddingBottom: theme.spacing.xxxl,
  },
  
  // Шапка
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.xl + 40, // Учитываем статус бар
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationButton: {
    position: 'absolute',
    right: theme.spacing.lg,
    top: theme.spacing.xl + 40,
  },
  notificationIcon: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  
  // Идентификация
  identificationSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  
  // Счета
  accountCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.white,
  },
  creditCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.ultraLight,
    borderColor: theme.colors.warning,
    borderWidth: 1,
  },
  accountHeader: {
    marginBottom: theme.spacing.md,
  },
  creditHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  warningIcon: {
    padding: theme.spacing.xs,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  creditDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.md,
  },
  creditItem: {
    flex: 1,
    alignItems: 'center',
  },
  
  // История операций
  historySection: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  transactionCard: {
    marginVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
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
    marginBottom: theme.spacing.xs,
  },
  transactionMeta: {
    marginTop: theme.spacing.xs,
  },
  transactionNote: {
    marginTop: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  showMoreContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
}) 