import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const NeuroChat = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я ваш виртуальный ассистент лицея. Готов помочь вам с учебными вопросами, расписанием и другими вопросами. Как дела?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Автофокус на поле ввода при открытии чата
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  useEffect(() => {
    // Анимация печатания
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Прокрутка к низу после отправки сообщения
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Имитация ответа нейросети
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(userMessage.text),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500 + Math.random() * 1000);
  };

  const generateAIResponse = (userText: string): string => {
    // Простой алгоритм генерации ответов на основе ключевых слов
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('расписание') || lowerText.includes('урок')) {
      return 'Расписание уроков можно посмотреть в разделе "Расписание" в главном меню. Если у вас есть вопросы по конкретному предмету, я готов помочь!';
    }
    
    if (lowerText.includes('оценк') || lowerText.includes('успеваемость')) {
      return 'Ваши оценки и успеваемость доступны в разделе "Успеваемость". Хотите, чтобы я помог разобрать какой-то конкретный предмет?';
    }
    
    if (lowerText.includes('домашн') || lowerText.includes('задание')) {
      return 'Домашние задания обычно размещаются в электронном дневнике. Если нужна помощь с выполнением, расскажите подробнее о задаче!';
    }
    
    if (lowerText.includes('экзамен') || lowerText.includes('подготовк')) {
      return 'Для подготовки к экзаменам рекомендую составить план изучения материала. Могу помочь с советами по эффективному обучению!';
    }
    
    // Возвращаем случайный общий ответ
    const responses = [
      'Отличный вопрос! Давайте разберем это подробнее...',
      'Я понимаю вашу задачу. Вот что я могу посоветовать...',
      'Это интересная тема для изучения. Рекомендую начать с...',
      'Хороший подход к решению! Также стоит учесть...',
      'Позвольте мне помочь вам с этим вопросом...',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessage = (message: Message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      {!message.isUser && (
        <View style={styles.aiIcon}>
          <Ionicons name="hardware-chip" size={16} color="#FFFFFF" />
        </View>
      )}
      <View style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.aiBubble
      ]}>
        <Text style={[
          styles.messageText,
          message.isUser ? styles.userText : styles.aiText
        ]}>
          {message.text}
        </Text>
        <Text style={[
          styles.timeText,
          message.isUser ? styles.userTimeText : styles.aiTimeText
        ]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.aiMessage]}>
        <View style={styles.aiIcon}>
          <Ionicons name="hardware-chip" size={16} color="#FFFFFF" />
        </View>
        <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
          <View style={styles.typingContainer}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.typingDot,
                  {
                    opacity: typingAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                    transform: [{
                      translateY: typingAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -3],
                      }),
                    }],
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Нейрочат</Text>
        
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => Alert.alert('Уведомления', 'Пока нет новых уведомлений')}
        >
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Область чата */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          {messages.map(renderMessage)}
          {renderTypingIndicator()}
        </ScrollView>

        {/* Поле ввода */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Введите ваш вопрос..."
            placeholderTextColor="#666666"
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={sendMessage}
            disabled={inputText.trim() === ''}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? "#FFFFFF" : "#666666"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  
  // Шапка
  header: {
    backgroundColor: '#8B2439',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Чат
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B2439',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: '#8B2439',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  typingBubble: {
    paddingVertical: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#000000',
  },
  timeText: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  userTimeText: {
    color: '#FFFFFF',
    textAlign: 'right',
  },
  aiTimeText: {
    color: '#666666',
  },

  // Индикатор печатания
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666666',
    marginHorizontal: 2,
  },

  // Поле ввода
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#8B2439',
  },
  sendButtonInactive: {
    backgroundColor: '#E5E5EA',
  },
});

export default NeuroChat; 