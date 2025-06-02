import React, { useState } from 'react'
import { ScrollView, View, Alert } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Typography, Heading, Paragraph, Label, Caption } from '../components/ui/Typography'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  date: string
  category: string
}

export const BankScreen: React.FC = () => {
  const { styles } = useStyles(stylesheet)
  const [transferAmount, setTransferAmount] = useState('')
  const [recipientId, setRecipientId] = useState('')
  
  // Мок данные
  const balance = 2450
  const savings = 1200
  const monthlyIncome = 850
  
  const recentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'income',
      amount: 200,
      description: 'Стипендия за отличную учебу',
      date: '2025-01-15',
      category: 'Образование'
    },
    {
      id: '2',
      type: 'expense',
      amount: 150,
      description: 'Покупка в L-shop',
      date: '2025-01-14',
      category: 'Покупки'
    },
    {
      id: '3',
      type: 'income',
      amount: 100,
      description: 'Участие в мероприятии',
      date: '2025-01-13',
      category: 'Активности'
    }
  ]

  const handleQuickAction = (action: string): void => {
    Alert.alert('Действие', `Выполняем: ${action}`)
  }

  const handleTransfer = (): void => {
    if (!transferAmount || !recipientId) {
      Alert.alert('Ошибка', 'Заполните все поля для перевода')
      return
    }
    Alert.alert('Перевод', `Переводим ${transferAmount} баллов пользователю ${recipientId}`)
    setTransferAmount('')
    setRecipientId('')
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Заголовок */}
      <View style={styles.headerSection}>
        <Heading level={1} color="primary">
          💳 Лицейский банк
        </Heading>
        <Paragraph color="muted">
          Управляйте своими лицейскими баллами
        </Paragraph>
      </View>

      {/* Основной баланс */}
      <Card variant="elevated" style={styles.balanceCard}>
        <Card.Body>
          <View style={styles.balanceHeader}>
            <Typography variant="h1" color="primary">
              {balance.toLocaleString()}
            </Typography>
            <Caption color="muted">Лицейских баллов</Caption>
          </View>
          
          <View style={styles.balanceDetails}>
            <View style={styles.balanceItem}>
              <Typography variant="h4" color="secondary">
                {savings.toLocaleString()}
              </Typography>
              <Caption>Накопления</Caption>
            </View>
            
            <View style={styles.balanceItem}>
              <Typography variant="h4" color="primary">
                +{monthlyIncome}
              </Typography>
              <Caption>За этот месяц</Caption>
            </View>
          </View>
        </Card.Body>
      </Card>

      {/* Быстрые действия */}
      <View style={styles.quickActionsSection}>
        <Heading level={3}>⚡ Быстрые действия</Heading>
        
        <View style={styles.quickActionsGrid}>
          <Button
            variant="secondary"
            size="medium"
            onPress={() => handleQuickAction('Пополнить счет')}
            style={styles.quickActionButton}
          >
            💰 Пополнить
          </Button>
          
          <Button
            variant="secondary"
            size="medium"
            onPress={() => handleQuickAction('Оплатить в столовой')}
            style={styles.quickActionButton}
          >
            🍽️ Столовая
          </Button>
          
          <Button
            variant="secondary"
            size="medium"
            onPress={() => handleQuickAction('QR-код для оплаты')}
            style={styles.quickActionButton}
          >
            📱 QR-код
          </Button>
          
          <Button
            variant="secondary"
            size="medium"
            onPress={() => handleQuickAction('История операций')}
            style={styles.quickActionButton}
          >
            📋 История
          </Button>
        </View>
      </View>

      {/* Перевод средств */}
      <Card variant="outlined" style={styles.transferCard}>
        <Card.Header>
          <Heading level={4}>💸 Перевод баллов</Heading>
        </Card.Header>
        
        <Card.Body>
          <View style={styles.transferForm}>
            <Input
              label="Получатель"
              placeholder="ID или email получателя"
              variant="outlined"
              value={recipientId}
              onChangeText={setRecipientId}
            />
            
            <Input
              label="Сумма"
              placeholder="Количество баллов"
              variant="outlined"
              value={transferAmount}
              onChangeText={setTransferAmount}
              keyboardType="numeric"
            />
            
            <Button
              variant="primary"
              size="medium"
              onPress={handleTransfer}
            >
              Перевести
            </Button>
          </View>
        </Card.Body>
      </Card>

      {/* Последние транзакции */}
      <View style={styles.transactionsSection}>
        <Heading level={3}>📊 Последние операции</Heading>
        
        {recentTransactions.map((transaction) => (
          <Card key={transaction.id} variant="standard" style={styles.transactionCard}>
            <Card.Body>
              <View style={styles.transactionRow}>
                <View style={styles.transactionInfo}>
                  <Label color="default">{transaction.description}</Label>
                  <Caption color="muted">{transaction.category} • {transaction.date}</Caption>
                </View>
                
                <View style={styles.transactionAmount}>
                  <Typography 
                    variant="body" 
                    color={transaction.type === 'income' ? 'secondary' : 'error'}
                    weight="bold"
                  >
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
                  </Typography>
                </View>
              </View>
            </Card.Body>
          </Card>
        ))}
        
        <Button
          variant="ghost"
          size="medium"
          onPress={() => handleQuickAction('Показать все транзакции')}
        >
          Показать все операции
        </Button>
      </View>

      {/* Статистика */}
      <Card variant="elevated" style={styles.statsCard}>
        <Card.Header>
          <Heading level={4}>📈 Статистика</Heading>
        </Card.Header>
        
        <Card.Body>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Typography variant="h3" color="primary" align="center">
                12
              </Typography>
              <Caption align="center">Место в рейтинге</Caption>
            </View>
            
            <View style={styles.statItem}>
              <Typography variant="h3" color="secondary" align="center">
                85%
              </Typography>
              <Caption align="center">Активность</Caption>
            </View>
            
            <View style={styles.statItem}>
              <Typography variant="h3" color="primary" align="center">
                24
              </Typography>
              <Caption align="center">Операций в месяц</Caption>
            </View>
          </View>
        </Card.Body>
      </Card>
    </ScrollView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.ultraLight,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  
  // Заголовок
  headerSection: {
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  
  // Баланс
  balanceCard: {
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
  },
  balanceHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  balanceItem: {
    alignItems: 'center',
  },
  
  // Быстрые действия
  quickActionsSection: {
    marginBottom: theme.spacing.xl,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
  },
  
  // Перевод
  transferCard: {
    marginBottom: theme.spacing.xl,
  },
  transferForm: {
    gap: theme.spacing.md,
  },
  
  // Транзакции
  transactionsSection: {
    marginBottom: theme.spacing.xl,
  },
  transactionCard: {
    marginVertical: theme.spacing.sm,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  
  // Статистика
  statsCard: {
    marginBottom: theme.spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
})) 