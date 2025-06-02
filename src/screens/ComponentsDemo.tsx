import React, { useState } from 'react'
import { ScrollView, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Typography, Heading, Paragraph, Label, Caption } from '../components/ui/Typography'

export const ComponentsDemo: React.FC = () => {
  const { styles } = useStyles(stylesheet)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleButtonPress = (): void => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Typography Section */}
      <View style={styles.section}>
        <Heading level={2} color="primary">
          🎨 Дизайн-система компонентов
        </Heading>
        <Paragraph color="muted">
          Демонстрация современных UI компонентов для лицейского приложения
        </Paragraph>
      </View>

      {/* Typography Examples */}
      <Card variant="elevated" style={styles.componentCard}>
        <Card.Header>
          <Heading level={3}>📝 Типографика</Heading>
        </Card.Header>
        <Card.Body>
          <View style={styles.typographySection}>
            <Typography variant="h1">Заголовок H1</Typography>
            <Typography variant="h2" color="primary">Заголовок H2</Typography>
            <Typography variant="h3">Заголовок H3</Typography>
            <Typography variant="body">Основной текст для чтения</Typography>
            <Typography variant="bodySmall" color="muted">Маленький текст</Typography>
            <Typography variant="caption">Подпись или примечание</Typography>
          </View>
        </Card.Body>
      </Card>

      {/* Button Examples */}
      <Card variant="elevated" style={styles.componentCard}>
        <Card.Header>
          <Heading level={3}>🔘 Кнопки</Heading>
        </Card.Header>
        <Card.Body>
          <View style={styles.buttonSection}>
            <View style={styles.buttonRow}>
              <Button 
                variant="primary" 
                size="large" 
                onPress={handleButtonPress}
                loading={loading}
              >
                Основная кнопка
              </Button>
            </View>
            
            <View style={styles.buttonRow}>
              <Button 
                variant="secondary" 
                size="medium" 
                onPress={() => {}}
              >
                Вторичная
              </Button>
              <Button 
                variant="ghost" 
                size="medium" 
                onPress={() => {}}
              >
                Прозрачная
              </Button>
            </View>
            
            <View style={styles.buttonRow}>
              <Button 
                variant="primary" 
                size="small" 
                onPress={() => {}}
              >
                Маленькая
              </Button>
              <Button 
                variant="primary" 
                size="small" 
                disabled 
                onPress={() => {}}
              >
                Отключена
              </Button>
            </View>
          </View>
        </Card.Body>
      </Card>

      {/* Input Examples */}
      <Card variant="elevated" style={styles.componentCard}>
        <Card.Header>
          <Heading level={3}>✏️ Поля ввода</Heading>
        </Card.Header>
        <Card.Body>
          <View style={styles.inputSection}>
            <Input
              label="Email"
              placeholder="example@lyceum.ru"
              variant="outlined"
              value={inputValue}
              onChangeText={setInputValue}
              helperText="Введите ваш email"
            />
            
            <Input
              label="Пароль"
              placeholder="Введите пароль"
              variant="filled"
              secureTextEntry
              helperText="Минимум 8 символов"
            />
            
            <Input
              label="Поиск"
              placeholder="Поиск по лицею..."
              variant="outlined"
              size="small"
            />
            
            <Input
              label="Ошибка"
              placeholder="Поле с ошибкой"
              variant="outlined"
              error="Это поле обязательно для заполнения"
            />
            
            <Input
              label="Отключено"
              placeholder="Недоступное поле"
              variant="outlined"
              disabled
              value="Неизменяемое значение"
            />
          </View>
        </Card.Body>
      </Card>

      {/* Card Examples */}
      <Card variant="elevated" style={styles.componentCard}>
        <Card.Header>
          <Heading level={3}>🃏 Карточки</Heading>
        </Card.Header>
        <Card.Body>
          <View style={styles.cardSection}>
            {/* Standard Card */}
            <Card variant="standard">
              <Card.Header>
                <Label>Стандартная карточка</Label>
              </Card.Header>
              <Card.Body>
                <Paragraph>
                  Карточка с небольшой тенью и стандартным оформлением
                </Paragraph>
              </Card.Body>
            </Card>
            
            {/* Outlined Card */}
            <Card variant="outlined">
              <Card.Header>
                <Label>Карточка с рамкой</Label>
              </Card.Header>
              <Card.Body>
                <Paragraph>
                  Карточка с рамкой без тени
                </Paragraph>
              </Card.Body>
              <Card.Footer>
                <Button variant="ghost" size="small" onPress={() => {}}>
                  Действие
                </Button>
              </Card.Footer>
            </Card>
            
            {/* Interactive Card */}
            <Card 
              variant="elevated" 
              onPress={() => alert('Карточка нажата!')}
            >
              <Card.Body>
                <Label color="primary">Интерактивная карточка</Label>
                <Caption>Нажмите, чтобы взаимодействовать</Caption>
              </Card.Body>
            </Card>
          </View>
        </Card.Body>
      </Card>

      {/* Color Palette */}
      <Card variant="elevated" style={styles.componentCard}>
        <Card.Header>
          <Heading level={3}>🎨 Цветовая палитра</Heading>
        </Card.Header>
        <Card.Body>
          <View style={styles.colorSection}>
            <View style={[styles.colorBox, styles.primaryColor]}>
              <Typography variant="bodySmall" color="white" weight="bold">
                Primary
              </Typography>
              <Typography variant="caption" color="white">
                #8B2439
              </Typography>
            </View>
            
            <View style={[styles.colorBox, styles.secondaryColor]}>
              <Typography variant="bodySmall" color="white" weight="bold">
                Secondary
              </Typography>
              <Typography variant="caption" color="white">
                #4D8061
              </Typography>
            </View>
            
            <View style={[styles.colorBox, styles.accentColor]}>
              <Typography variant="bodySmall" color="white" weight="bold">
                Accent
              </Typography>
              <Typography variant="caption" color="white">
                #E67E22
              </Typography>
            </View>
          </View>
        </Card.Body>
      </Card>

      <View style={styles.footer}>
        <Caption align="center">
          💎 Дизайн-система создана с использованием современных технологий 2025
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
    paddingBottom: theme.spacing.xxxl,
  },
  
  section: {
    marginBottom: theme.spacing.xl,
  },
  
  componentCard: {
    marginBottom: theme.spacing.lg,
  },
  
  // Typography section
  typographySection: {
    gap: theme.spacing.md,
  },
  
  // Button section
  buttonSection: {
    gap: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
  },
  
  // Input section
  inputSection: {
    gap: theme.spacing.md,
  },
  
  // Card section
  cardSection: {
    gap: theme.spacing.lg,
  },
  
  // Color section
  colorSection: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
  },
  colorBox: {
    flex: 1,
    minWidth: 100,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  primaryColor: {
    backgroundColor: theme.colors.primary,
  },
  secondaryColor: {
    backgroundColor: theme.colors.secondary,
  },
  accentColor: {
    backgroundColor: theme.colors.accent,
  },
  
  footer: {
    marginTop: theme.spacing.xxl,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
})) 