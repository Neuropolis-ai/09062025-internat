import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  helpful: number
  expanded?: boolean
}

const mockFAQs: FAQ[] = [
  {
    id: '1',
    question: 'Как проверить баланс лицейских баллов?',
    answer: 'Откройте модуль "Банк" на главной странице. Ваш текущий баланс отображается в верхней части экрана. Также можете посмотреть историю операций и детализацию по заработанным баллам.',
    category: 'Банк',
    tags: ['баланс', 'баллы', 'счет'],
    helpful: 45
  },
  {
    id: '2',
    question: 'Как узнать свои оценки и рейтинг?',
    answer: 'Перейдите в модуль "Успеваемость". Здесь вы найдете все свои оценки по предметам, средний балл, место в рейтинге класса и лицея, а также прогресс по достижениям.',
    category: 'Учеба',
    tags: ['оценки', 'рейтинг', 'успеваемость'],
    helpful: 38
  },
  {
    id: '3',
    question: 'Где найти расписание уроков?',
    answer: 'Расписание доступно на главной странице в виде карточки "Сегодня" или через модуль "Расписание". Можно посмотреть как на текущий день, так и на всю неделю.',
    category: 'Расписание',
    tags: ['расписание', 'уроки', 'время'],
    helpful: 52
  },
  {
    id: '4',
    question: 'Как купить товары в L-Shop?',
    answer: 'Откройте модуль L-Shop, выберите нужные товары, добавьте их в корзину и оформите заказ. Оплата производится лицейскими баллами. После подтверждения заказа можете забрать товары в указанном месте.',
    category: 'L-Shop',
    tags: ['покупки', 'магазин', 'заказ'],
    helpful: 29
  },
  {
    id: '5',
    question: 'Как участвовать в аукционе?',
    answer: 'В модуле "Аукцион" выберите интересующий лот и нажмите "Сделать ставку". Введите сумму больше текущей ставки. Следите за временем до окончания торгов. Если ваша ставка останется наивысшей, вы выиграете лот.',
    category: 'Аукцион',
    tags: ['аукцион', 'ставки', 'торги'],
    helpful: 22
  },
  {
    id: '6',
    question: 'Как связаться с Нейрочатом?',
    answer: 'Нажмите на иконку чата в правом нижнем углу или откройте модуль "Нейрочат". AI-помощник ответит на ваши вопросы о лицее, поможет с расписанием и оценками.',
    category: 'Чат',
    tags: ['нейрочат', 'помощь', 'ai'],
    helpful: 31
  },
  {
    id: '7',
    question: 'Что делать если забыл пароль?',
    answer: 'На экране входа нажмите "Забыли пароль?". Введите ваш email или номер студенческого билета. На почту придет ссылка для восстановления пароля.',
    category: 'Аккаунт',
    tags: ['пароль', 'восстановление', 'вход'],
    helpful: 18
  },
  {
    id: '8',
    question: 'Как работает система республики?',
    answer: 'Модуль "Республика" показывает структуру самоуправления лицея: правительство, парламент, суд. Здесь можно узнать о текущих проектах, голосованиях и принять участие в общественной жизни.',
    category: 'Республика',
    tags: ['самоуправление', 'голосование', 'проекты'],
    helpful: 26
  }
]

const categories = [
  { id: 'all', name: 'Все', icon: '📚' },
  { id: 'Банк', name: 'Банк', icon: '🏦' },
  { id: 'Учеба', name: 'Учеба', icon: '📊' },
  { id: 'L-Shop', name: 'L-Shop', icon: '🛒' },
  { id: 'Аукцион', name: 'Аукцион', icon: '🏆' },
  { id: 'Чат', name: 'Чат', icon: '🤖' },
  { id: 'Аккаунт', name: 'Аккаунт', icon: '👤' },
]

export const FAQScreen: React.FC = () => {
  const navigation = useNavigation()
  const [faqs, setFaqs] = useState(mockFAQs)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (id: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, expanded: !faq.expanded } : faq
    ))
  }

  const markHelpful = (id: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, helpful: faq.helpful + 1 } : faq
    ))
  }

  const renderFAQ = (faq: FAQ) => (
    <View key={faq.id} style={styles.faqCard}>
      <TouchableOpacity 
        style={styles.faqHeader}
        onPress={() => toggleFAQ(faq.id)}
      >
        <View style={styles.faqTitleContainer}>
          <Text style={styles.faqQuestion}>{faq.question}</Text>
          <View style={styles.faqMeta}>
            <Text style={styles.faqCategory}>{faq.category}</Text>
            <Text style={styles.faqHelpful}>👍 {faq.helpful}</Text>
          </View>
        </View>
        <Text style={[
          styles.expandIcon,
          faq.expanded && styles.expandIconRotated
        ]}>
          ▼
        </Text>
      </TouchableOpacity>
      
      {faq.expanded && (
        <View style={styles.faqContent}>
          <Text style={styles.faqAnswer}>{faq.answer}</Text>
          
          <View style={styles.faqActions}>
            <TouchableOpacity 
              style={styles.helpfulButton}
              onPress={() => markHelpful(faq.id)}
            >
              <Text style={styles.helpfulIcon}>👍</Text>
              <Text style={styles.helpfulText}>Полезно</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareIcon}>📤</Text>
              <Text style={styles.shareText}>Поделиться</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
          <Text style={styles.headerTitle}>Часто задаваемые вопросы</Text>
          <Text style={styles.headerSubtitle}>Найдите ответы на популярные вопросы</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск по вопросам..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999999"
          />
          {searchQuery !== '' && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.activeCategoryButton
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.activeCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* FAQ List */}
      <ScrollView style={styles.faqList}>
        {searchQuery && (
          <View style={styles.searchResults}>
            <Text style={styles.searchResultsText}>
              Найдено {filteredFAQs.length} результатов для "{searchQuery}"
            </Text>
          </View>
        )}
        
        {filteredFAQs.map(renderFAQ)}
        
        {filteredFAQs.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🤔</Text>
            <Text style={styles.emptyTitle}>Ничего не найдено</Text>
            <Text style={styles.emptyMessage}>
              {searchQuery 
                ? 'Попробуйте изменить поисковый запрос или выбрать другую категорию'
                : 'В выбранной категории пока нет вопросов'
              }
            </Text>
          </View>
        )}

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Не нашли ответ?</Text>
          <Text style={styles.helpMessage}>
            Обратитесь к Нейрочату или свяжитесь с администрацией лицея
          </Text>
          
          <View style={styles.helpButtons}>
            <TouchableOpacity style={styles.chatButton}>
              <Text style={styles.chatButtonIcon}>🤖</Text>
              <Text style={styles.chatButtonText}>Спросить AI</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonIcon}>📞</Text>
              <Text style={styles.contactButtonText}>Связаться</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#666666',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 14,
    color: '#999999',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeCategoryButton: {
    backgroundColor: '#8B2439',
    borderColor: '#8B2439',
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  faqList: {
    flex: 1,
  },
  searchResults: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E3F2FD',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  searchResultsText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  faqTitleContainer: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    lineHeight: 22,
  },
  faqMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqCategory: {
    fontSize: 12,
    color: '#8B2439',
    fontWeight: '500',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  faqHelpful: {
    fontSize: 12,
    color: '#666666',
  },
  expandIcon: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 12,
    transform: [{ rotate: '0deg' }],
  },
  expandIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  faqContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  faqAnswer: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 16,
  },
  faqActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
    marginRight: 8,
  },
  helpfulIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  helpfulText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
    marginLeft: 8,
  },
  shareIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  shareText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  helpSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  helpMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  helpButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B2439',
    borderRadius: 12,
    paddingVertical: 12,
    marginRight: 8,
  },
  chatButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingVertical: 12,
    marginLeft: 8,
  },
  contactButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  contactButtonText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    fontSize: 14,
    color: '#333333',
  },
  headerContent: {
    flex: 1,
  },
})

export default FAQScreen 