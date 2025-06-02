import React, { useState } from 'react'
import { ScrollView, View, Alert } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Typography, Heading, Paragraph, Label, Caption } from '../components/ui/Typography'

export const RepublicScreen: React.FC = () => {
  const { styles } = useStyles(stylesheet)

  const handleAction = (action: string): void => {
    Alert.alert('Действие', `Выполняем: ${action}`)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerSection}>
        <Heading level={1} color="primary">
          🏛️ Лицейская республика
        </Heading>
        <Paragraph color="muted">
          Система самоуправления лицея
        </Paragraph>
      </View>

      <Card variant="elevated" style={styles.card}>
        <Card.Body>
          <Typography variant="h3" color="primary" align="center">
            Добро пожаловать в Республику!
          </Typography>
          <Paragraph align="center" color="muted">
            Здесь будет система самоуправления
          </Paragraph>
          <Button
            variant="primary"
            size="medium"
            onPress={() => handleAction('Участвовать в самоуправлении')}
          >
            Принять участие
          </Button>
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
  headerSection: {
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
  },
  card: {
    marginBottom: theme.spacing.xl,
  },
})) 