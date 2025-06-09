import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Включаем LayoutAnimation для Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Фирменные цвета из brand.md
const COLORS = {
  burgundy: '#8B2439',
  white: '#FFFFFF',
  lightGray: '#F2F2F7',
  darkGray: '#666666',
  separator: '#E5E5EA',
  redNotification: '#FF4444',
  cardBackground: '#F8F8F8',
};

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'Как получить доступ к мобильному приложению лицея?',
    answer: 'Для получения доступа к приложению обратитесь к классному руководителю или в приемную комиссию. Вам будут предоставлены логин и пароль для входа в систему.',
  },
  {
    id: 2,
    question: 'Как просмотреть свою успеваемость и оценки?',
    answer: 'В главном меню приложения выберите раздел "Успеваемость". Здесь вы найдете информацию о текущих оценках, расписании и домашних заданиях.',
  },
  {
    id: 3,
    question: 'Что такое "Республика" в приложении?',
    answer: '"Республика" - это система самоуправления лицея, где учащиеся могут участвовать в управлении учебным процессом, принимать участие в голосованиях и мероприятиях.',
  },
  {
    id: 4,
    question: 'Как работает лицейский банк и валюта?',
    answer: 'Лицейский банк - это внутренняя система поощрений. За хорошую учебу и активность вы получаете внутреннюю валюту, которую можно потратить в лицейском магазине.',
  },
  {
    id: 5,
    question: 'Где найти правила проживания в лицее?',
    answer: 'Все правила и положения находятся в разделе "Правила". Там указаны режим дня, правила поведения и все необходимые требования для комфортного проживания.',
  },
  {
    id: 6,
    question: 'Как связаться с администрацией лицея?',
    answer: 'Вы можете использовать встроенный чат-бот для быстрых вопросов или обратиться к дежурному воспитателю. Контактная информация доступна в разделе "Контакты".',
  },
  {
    id: 7,
    question: 'Что делать, если забыл пароль от приложения?',
    answer: 'Обратитесь к своему классному руководителю или в IT-службу лицея. Они помогут восстановить доступ к вашему аккаунту.',
  },
  {
    id: 8,
    question: 'Как работают уведомления в приложении?',
    answer: 'Приложение отправляет уведомления о новых оценках, расписании, изменениях в режиме дня и важных объявлениях. Настройки уведомлений можно изменить в профиле.',
  },
  {
    id: 9,
    question: 'Как участвовать в мероприятиях лицея?',
    answer: 'Информация о мероприятиях публикуется в разделе "Объявления". Для участия следуйте инструкциям в объявлении или обратитесь к организаторам.',
  },
  {
    id: 10,
    question: 'Где посмотреть расписание занятий?',
    answer: 'Расписание доступно в разделе "Успеваемость" -> "Расписание". Здесь отображается актуальное расписание уроков, изменения и дополнительные занятия.',
  },
];

const FAQScreen: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([1])); // Первый вопрос открыт по умолчанию
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const rotationValues = useRef<{ [key: number]: Animated.Value }>({});
  const router = useRouter();

  // Инициализируем анимационные значения для иконок
  faqData.forEach(item => {
    if (!rotationValues.current[item.id]) {
      rotationValues.current[item.id] = new Animated.Value(item.id === 1 ? 1 : 0);
    }
  });

  const toggleExpand = (id: number) => {
    // Конфигурация анимации раскрытия
    LayoutAnimation.configureNext({
      duration: 300,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
    });

    const newExpandedItems = new Set(expandedItems);
    const isCurrentlyExpanded = newExpandedItems.has(id);
    
    if (isCurrentlyExpanded) {
      newExpandedItems.delete(id);
    } else {
      newExpandedItems.add(id);
    }
    
    // Анимация поворота иконки
    const rotationValue = rotationValues.current[id];
    if (rotationValue) {
      Animated.timing(rotationValue, {
        toValue: isCurrentlyExpanded ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    setExpandedItems(newExpandedItems);
  };

  const filteredFAQ = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSupport = () => {
    setIsQuestionModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsQuestionModalVisible(false);
    setQuestionText('');
    setUserEmail('');
  };

  const handleSubmitQuestion = async () => {
    if (!questionText.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите ваш вопрос');
      return;
    }

    setIsSubmitting(true);

    try {
      // Здесь будет логика отправки вопроса на сервер
      // Пока симулируем отправку
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        'Вопрос отправлен!',
        'Ваш вопрос успешно отправлен администрации. Ответ будет направлен в течение 24 часов.',
        [
          {
            text: 'ОК',
            onPress: handleCloseModal,
          },
        ]
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Произошла ошибка при отправке вопроса. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleBackPress = () => {
    router.back();
  };

  const renderFAQItem = (item: FAQItem) => {
    const isExpanded = expandedItems.has(item.id);
    const rotationValue = rotationValues.current[item.id];
    
    const rotateInterpolate = rotationValue ? rotationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    }) : '0deg';

    return (
      <View key={item.id} style={styles.faqItem}>
        <TouchableOpacity
          style={[styles.questionContainer, isExpanded && styles.questionContainerExpanded]}
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.questionText}>{item.question}</Text>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Ionicons
              name="chevron-down"
              size={24}
              color={COLORS.burgundy}
            />
          </Animated.View>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.answerContainer}>
            <Text style={styles.answerText}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color={COLORS.white} />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Поиск */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={COLORS.darkGray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск по ключевым словам..."
              placeholderTextColor={COLORS.darkGray}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color={COLORS.darkGray} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Результаты поиска */}
        {searchQuery.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultsText}>
              Найдено результатов: {filteredFAQ.length}
            </Text>
          </View>
        )}

        {/* Список FAQ */}
        <View style={styles.faqContainer}>
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map(renderFAQItem)
          ) : (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search" size={48} color={COLORS.darkGray} />
              <Text style={styles.noResultsTitle}>Ничего не найдено</Text>
              <Text style={styles.noResultsText}>
                Попробуйте изменить поисковый запрос или задайте вопрос в поддержку
              </Text>
            </View>
          )}
        </View>

        {/* Кнопка обратной связи */}
        <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
          <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.white} />
          <Text style={styles.contactButtonText}>Не нашли ответ? Задайте вопрос</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Модальное окно для отправки вопроса */}
      <Modal
        visible={isQuestionModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <KeyboardAvoidingView 
            style={styles.modalContent}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* Заголовок модального окна */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCloseModal} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color={COLORS.burgundy} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Задать вопрос</Text>
              <View style={styles.modalPlaceholder} />
            </View>

            <ScrollView style={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                <Text style={styles.modalDescription}>
                  Опишите ваш вопрос подробно. Администрация лицея ответит в течение 24 часов.
                </Text>

                {/* Поле для email (опционально) */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email для ответа (опционально)</Text>
                  <TextInput
                    style={styles.emailInput}
                    placeholder="your.email@example.com"
                    placeholderTextColor={COLORS.darkGray}
                    value={userEmail}
                    onChangeText={setUserEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Поле для вопроса */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Ваш вопрос *</Text>
                  <TextInput
                    style={styles.questionInput}
                    placeholder="Опишите ваш вопрос..."
                    placeholderTextColor={COLORS.darkGray}
                    value={questionText}
                    onChangeText={setQuestionText}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    maxLength={500}
                  />
                  <Text style={styles.characterCount}>
                    {questionText.length}/500 символов
                  </Text>
                </View>

                {/* Информация о конфиденциальности */}
                <View style={styles.privacyNotice}>
                  <Ionicons name="information-circle" size={20} color={COLORS.burgundy} />
                  <Text style={styles.privacyText}>
                    Ваш вопрос будет передан администрации лицея и обработан конфиденциально.
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Кнопки действий */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCloseModal}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
                onPress={handleSubmitQuestion}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Text style={styles.submitButtonText}>Отправка...</Text>
                ) : (
                  <>
                    <Ionicons name="send" size={18} color={COLORS.white} />
                    <Text style={styles.submitButtonText}>Отправить</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    backgroundColor: COLORS.burgundy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.redNotification,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    fontSize: 16,
    color: COLORS.darkGray,
    flex: 1,
  },
  clearButton: {
    marginLeft: 8,
  },
  searchResultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  searchResultsText: {
    fontSize: 14,
    color: COLORS.darkGray,
    fontStyle: 'italic',
  },
  faqContainer: {
    paddingHorizontal: 20,
  },
  faqItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.separator,
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  questionContainerExpanded: {
    backgroundColor: COLORS.cardBackground,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.burgundy,
    flex: 1,
    marginRight: 12,
    lineHeight: 22,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
  },
  answerText: {
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
    marginTop: 12,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.burgundy,
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: COLORS.burgundy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    backgroundColor: COLORS.burgundy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
  },
  modalPlaceholder: {
    width: 40,
    height: 40,
  },
  modalScrollContent: {
    flex: 1,
  },
  modalBody: {
    padding: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.burgundy,
    marginBottom: 8,
  },
  emailInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.separator,
    fontSize: 16,
    color: COLORS.darkGray,
  },
  questionInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.separator,
    fontSize: 16,
    color: COLORS.darkGray,
    minHeight: 120,
    maxHeight: 200,
  },
  characterCount: {
    fontSize: 12,
    color: COLORS.darkGray,
    textAlign: 'right',
    marginTop: 4,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  privacyText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.separator,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.burgundy,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.burgundy,
  },
  submitButton: {
    flex: 1,
    backgroundColor: COLORS.burgundy,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.darkGray,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 6,
  },
});

export default FAQScreen; 