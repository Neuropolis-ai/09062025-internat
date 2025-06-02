import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Animated } from 'react-native'
import { useNavigation } from '@react-navigation/native'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read'
  typing?: boolean
}

interface QuickAction {
  id: string
  title: string
  icon: string
  query: string
}

const quickActions: QuickAction[] = [
  { id: '1', title: 'Расписание', icon: '📅', query: 'Покажи мое расписание на сегодня' },
  { id: '2', title: 'Оценки', icon: '📊', query: 'Какие у меня последние оценки?' },
  { id: '3', title: 'Баланс', icon: '💰', query: 'Сколько у меня лицейских баллов?' },
  { id: '4', title: 'События', icon: '🎉', query: 'Какие события запланированы?' },
]

const aiResponses = [
  'Привет! Я твой AI-помощник лицея. Чем могу помочь?',
  'Конечно! Давайте разберем этот вопрос подробнее.',
  'Отличный вопрос! Вот что я нашел по этой теме...',
  'Понял, сейчас найду для вас эту информацию.',
  'У вас сегодня 6 уроков: математика, физика, химия, русский язык, история и английский.',
  'Ваш текущий баланс: 2,450 лицейских баллов. Отличная работа!',
  'На этой неделе запланированы: концерт (пятница), спортивные соревнования (суббота).',
]

export const ChatScreen: React.FC = () => {
  const navigation = useNavigation()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Добро пожаловать в Нейрочат! 🤖 Я ваш персональный AI-помощник лицея. Могу помочь с расписанием, оценками, событиями и ответить на любые вопросы о лицее.',
      sender: 'ai',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      status: 'read'
    }
  ])
  
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isAITyping, setIsAITyping] = useState(false)
  const flatListRef = useRef<FlatList<Message>>(null)
  const typingAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isAITyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start()
    } else {
      typingAnimation.setValue(0)
    }
  }, [isAITyping, typingAnimation])

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    
    // Симуляция отправки
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
      ))
    }, 500)

    // Симуляция AI ответа
    setIsAITyping(true)
    
    setTimeout(() => {
      setIsAITyping(false)
      const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      
      if (aiResponse) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date(),
          status: 'read'
        }
        
        setMessages(prev => [...prev, aiMessage])
      }
    }, 1500 + Math.random() * 1000)
  }

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.query)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user'
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.aiMessageContainer
      ]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>🤖</Text>
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.aiBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userText : styles.aiText
          ]}>
            {item.text}
          </Text>
          
          <View style={styles.messageFooter}>
            <Text style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.aiTimestamp
            ]}>
              {formatTime(item.timestamp)}
            </Text>
            
            {isUser && (
              <View style={styles.statusContainer}>
                {item.status === 'sending' && <Text style={styles.statusIcon}>⏳</Text>}
                {item.status === 'sent' && <Text style={styles.statusIcon}>✓</Text>}
                {item.status === 'delivered' && <Text style={styles.statusIcon}>✓✓</Text>}
                {item.status === 'read' && <Text style={[styles.statusIcon, styles.readStatus]}>✓✓</Text>}
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }

  const renderTypingIndicator = () => {
    if (!isAITyping) return null
    
    return (
      <View style={[styles.messageContainer, styles.aiMessageContainer]}>
        <View style={styles.aiAvatar}>
          <Text style={styles.aiAvatarText}>🤖</Text>
        </View>
        
        <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
          <View style={styles.typingIndicator}>
            <Animated.View style={[
              styles.typingDot,
              { opacity: typingAnimation }
            ]} />
            <Animated.View style={[
              styles.typingDot,
              { opacity: typingAnimation, transform: [{ scale: typingAnimation }] }
            ]} />
            <Animated.View style={[
              styles.typingDot,
              { opacity: typingAnimation }
            ]} />
          </View>
          <Text style={styles.typingText}>печатает...</Text>
        </View>
      </View>
    )
  }

  const renderQuickAction = ({ item }: { item: QuickAction }) => (
    <TouchableOpacity 
      style={styles.quickActionButton}
      onPress={() => handleQuickAction(item)}
    >
      <Text style={styles.quickActionIcon}>{item.icon}</Text>
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
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
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Нейрочат</Text>
          <Text style={styles.headerSubtitle}>AI-помощник лицея</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <FlatList
          data={quickActions}
          renderItem={renderQuickAction}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsList}
        />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={renderTypingIndicator}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton}>
            <Text style={styles.attachIcon}>📎</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.messageInput}
            onPress={() => {
              // В реальном приложении здесь будет TextInput
              const responses = [
                'Привет! Как дела?',
                'Покажи мое расписание',
                'Какие у меня оценки?',
                'Спасибо за помощь!',
                'Что нового в лицее?'
              ]
              const randomResponse = responses[Math.floor(Math.random() * responses.length)]
              if (randomResponse) {
                setInputText(randomResponse)
              }
            }}
          >
            <Text style={[
              styles.inputText,
              !inputText && styles.placeholder
            ]}>
              {inputText || 'Напишите сообщение...'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.voiceButton}>
            <Text style={styles.voiceIcon}>🎤</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              inputText && styles.sendButtonActive
            ]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerButtonIcon: {
    fontSize: 16,
  },
  quickActionsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  quickActionsList: {
    paddingHorizontal: 16,
  },
  quickActionButton: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickActionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  quickActionText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B2439',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiAvatarText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#8B2439',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  typingBubble: {
    paddingVertical: 16,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#333333',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  timestamp: {
    fontSize: 11,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiTimestamp: {
    color: '#999999',
  },
  statusContainer: {
    marginLeft: 8,
  },
  statusIcon: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  readStatus: {
    color: '#4CAF50',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B2439',
    marginRight: 4,
  },
  typingText: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  attachIcon: {
    fontSize: 16,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F8F8',
    marginRight: 8,
  },
  inputText: {
    fontSize: 15,
    color: '#333333',
  },
  placeholder: {
    color: '#999999',
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  voiceIcon: {
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#8B2439',
  },
  sendIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  backIcon: {
    fontSize: 16,
  },
})

export default ChatScreen 