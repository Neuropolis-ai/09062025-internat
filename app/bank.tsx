import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  title: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface Balance {
  type: 'main' | 'credit';
  title: string;
  amount: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
}

export default function BankScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'income' | 'expense'>('all');

  const balances: Balance[] = [
    {
      type: 'main',
      title: 'Расчетный счет',
      amount: 1250,
      icon: 'card',
      color: '#007AFF',
      bgColor: '#E3F2FD',
    },
    {
      type: 'credit',
      title: 'Кредитный счет',
      amount: 500,
      icon: 'card-outline',
      color: '#34C759',
      bgColor: '#E8F5E8',
    },
  ];

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'income',
      title: 'Выполнение контракта',
      description: 'Уборка территории',
      amount: 200,
      date: '2025-01-15T10:30:00Z',
      category: 'Работа',
    },
    {
      id: '2',
      type: 'expense',
      title: 'Покупка в L-shop',
      description: 'Школьные принадлежности',
      amount: -150,
      date: '2025-01-14T15:20:00Z',
      category: 'Покупки',
    },
    {
      id: '3',
      type: 'income',
      title: 'Стипендия',
      description: 'Месячная стипендия',
      amount: 800,
      date: '2025-01-10T09:00:00Z',
      category: 'Стипендия',
    },
    {
      id: '4',
      type: 'expense',
      title: 'Ставка на аукционе',
      description: 'Лот: Книга по программированию',
      amount: -300,
      date: '2025-01-08T14:45:00Z',
      category: 'Аукцион',
    },
    {
      id: '5',
      type: 'transfer',
      title: 'Перевод другу',
      description: 'Иванову Петру',
      amount: -100,
      date: '2025-01-05T11:15:00Z',
      category: 'Переводы',
    },
  ]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Имитация обновления данных
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const getTransactionIcon = (type: string, category: string) => {
    switch (type) {
      case 'income':
        return category === 'Стипендия' ? 'school' : 'trending-up';
      case 'expense':
        return category === 'Покупки' ? 'bag' : category === 'Аукцион' ? 'hammer' : 'trending-down';
      case 'transfer':
        return 'swap-horizontal';
      default:
        return 'help-circle';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'income':
        return '#34C759';
      case 'expense':
        return '#FF3B30';
      case 'transfer':
        return '#FF9500';
      default:
        return '#666666';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Сегодня, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Вчера, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    return transaction.type === selectedFilter;
  });

  const BalanceCard = ({ balance }: { balance: Balance }) => (
    <View style={[styles.balanceCard, { backgroundColor: balance.bgColor }]}>
      <View style={styles.balanceHeader}>
        <View style={[styles.balanceIcon, { backgroundColor: balance.color }]}>
          <Ionicons name={balance.icon} size={24} color="#FFFFFF" />
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={balance.color} />
        </TouchableOpacity>
      </View>
      <Text style={styles.balanceTitle}>{balance.title}</Text>
      <Text style={[styles.balanceAmount, { color: balance.color }]}>
        {balance.amount.toLocaleString()} L-Coin
      </Text>
    </View>
  );

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <TouchableOpacity 
      style={styles.transactionCard}
      onPress={() => Alert.alert('Детали', `Операция: ${transaction.title}`)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.transactionIcon, 
        { backgroundColor: getTransactionColor(transaction.type) + '20' }
      ]}>
        <Ionicons 
          name={getTransactionIcon(transaction.type, transaction.category)} 
          size={20} 
          color={getTransactionColor(transaction.type)} 
        />
      </View>
      <View style={styles.transactionContent}>
        <Text style={styles.transactionTitle}>{transaction.title}</Text>
        <Text style={styles.transactionDescription}>{transaction.description}</Text>
        <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.transactionAmountText,
          { color: getTransactionColor(transaction.type) }
        ]}>
          {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
        </Text>
        <Text style={styles.transactionCurrency}>L-Coin</Text>
      </View>
    </TouchableOpacity>
  );

  const FilterButton = ({ 
    title, 
    value, 
    isSelected 
  }: { 
    title: string; 
    value: 'all' | 'income' | 'expense'; 
    isSelected: boolean 
  }) => (
    <TouchableOpacity
      style={[styles.filterButton, isSelected && styles.filterButtonActive]}
      onPress={() => setSelectedFilter(value)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.filterButtonText,
        isSelected && styles.filterButtonTextActive
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Лицейский банк</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Balance Cards */}
        <View style={styles.balancesContainer}>
          {balances.map((balance, index) => (
            <BalanceCard key={index} balance={balance} />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="arrow-up" size={20} color="#34C759" />
            <Text style={styles.quickActionText}>Пополнить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="arrow-down" size={20} color="#FF3B30" />
            <Text style={styles.quickActionText}>Перевести</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="card" size={20} color="#007AFF" />
            <Text style={styles.quickActionText}>Заказать карту</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>История операций</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Все</Text>
            </TouchableOpacity>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <FilterButton 
              title="Все" 
              value="all" 
              isSelected={selectedFilter === 'all'} 
            />
            <FilterButton 
              title="Доходы" 
              value="income" 
              isSelected={selectedFilter === 'income'} 
            />
            <FilterButton 
              title="Расходы" 
              value="expense" 
              isSelected={selectedFilter === 'expense'} 
            />
          </View>

          {/* Transactions List */}
          <View style={styles.transactionsList}>
            {filteredTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerButton: {
    padding: 4,
  },
  balancesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  balanceCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButton: {
    padding: 4,
  },
  balanceTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
  },
  transactionsSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  viewAllText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  transactionsList: {
    paddingHorizontal: 20,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999999',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionCurrency: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
}); 