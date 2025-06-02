import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Typography, Heading, Paragraph, Caption } from '../components/ui/Typography'

export const AuthScreen: React.FC = () => {
  const { styles } = useStyles(stylesheet)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  const handleAuth = async (): Promise<void> => {
    setLoading(true)
    // Имитация API запроса
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
  }

  const toggleMode = (): void => {
    setIsLogin(!isLogin)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Логотип и приветствие */}
      <View style={styles.logoSection}>
        <Typography variant="h1" style={styles.logo}>
          🎓
        </Typography>
        <Heading level={2} color="primary" align="center">
          Лицей-интернат Подмосковный
        </Heading>
        <Caption align="center" color="muted">
          Современное образование • Инновации • Развитие
        </Caption>
      </View>

      {/* Форма авторизации */}
      <Card variant="elevated" style={styles.authCard}>
        <Card.Header>
          <Heading level={3} align="center">
            {isLogin ? '🔐 Вход в систему' : '📝 Регистрация'}
          </Heading>
        </Card.Header>
        
        <Card.Body>
          <View style={styles.formSection}>
            <Input
              label="Email или логин"
              placeholder="student@lyceum.ru"
              variant="outlined"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Input
              label="Пароль"
              placeholder="Введите пароль"
              variant="outlined"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            {!isLogin && (
              <Input
                label="Подтверждение пароля"
                placeholder="Повторите пароль"
                variant="outlined"
                secureTextEntry
              />
            )}
            
            <Button
              variant="primary"
              size="large"
              onPress={handleAuth}
              loading={loading}
              style={styles.authButton}
            >
              {isLogin ? 'Войти в лицей' : 'Создать аккаунт'}
            </Button>
            
            <Button
              variant="ghost"
              size="medium"
              onPress={toggleMode}
            >
              {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </Button>
          </View>
        </Card.Body>
      </Card>

      {/* Дополнительные опции */}
      <View style={styles.optionsSection}>
        <Button
          variant="secondary"
          size="medium"
          onPress={() => {}}
          style={styles.optionButton}
        >
          🔑 Забыли пароль?
        </Button>
        
        <Button
          variant="secondary"
          size="medium"
          onPress={() => {}}
          style={styles.optionButton}
        >
          📱 Войти через QR-код
        </Button>
        
        <Button
          variant="secondary"
          size="medium"
          onPress={() => {}}
          style={styles.optionButton}
        >
          👆 Биометрия (Face ID)
        </Button>
      </View>

      {/* Информация о лицее */}
      <Card variant="outlined" style={styles.infoCard}>
        <Card.Body>
          <Heading level={4} align="center" color="secondary">
            💎 О лицее
          </Heading>
          <Paragraph align="center" color="muted">
            Инновационное образовательное учреждение с современными технологиями, 
            развитой системой самоуправления и уникальной цифровой экосистемой.
          </Paragraph>
        </Card.Body>
      </Card>

      {/* Контакты */}
      <View style={styles.contactsSection}>
        <Caption align="center" color="muted">
          📞 Техподдержка: +7 (495) 123-45-67
        </Caption>
        <Caption align="center" color="muted">
          📧 support@lyceum-podmoskovye.ru
        </Caption>
        <Caption align="center" color="muted">
          🌐 www.lyceum-podmoskovye.ru
        </Caption>
      </View>
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
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxxl,
  },
  
  // Логотип
  logoSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  logo: {
    fontSize: 80,
    marginBottom: theme.spacing.md,
  },
  
  // Форма авторизации
  authCard: {
    marginBottom: theme.spacing.xl,
  },
  formSection: {
    gap: theme.spacing.lg,
  },
  authButton: {
    marginTop: theme.spacing.md,
  },
  
  // Дополнительные опции
  optionsSection: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  optionButton: {
    marginHorizontal: theme.spacing.sm,
  },
  
  // Информационная карточка
  infoCard: {
    marginBottom: theme.spacing.xl,
  },
  
  // Контакты
  contactsSection: {
    gap: theme.spacing.xs,
    marginTop: theme.spacing.lg,
  },
})) 