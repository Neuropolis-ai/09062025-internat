import React, { useState } from 'react'
import { ScrollView, View, Alert } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Typography, Heading, Paragraph, Label, Caption } from '../components/ui/Typography'

interface Grade {
  id: string
  subject: string
  grade: number
  maxGrade: number
  date: string
  type: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  achieved: boolean
  date?: string
}

export const GradesScreen: React.FC = () => {
  const { styles } = useStyles(stylesheet)
  
  // Мок данные
  const currentGPA = 4.8
  const totalCredits = 145
  const ranking = 12
  
  const recentGrades: Grade[] = [
    {
      id: '1',
      subject: 'Математика',
      grade: 5,
      maxGrade: 5,
      date: '2025-01-15',
      type: 'Контрольная работа'
    },
    {
      id: '2',
      subject: 'Физика',
      grade: 4,
      maxGrade: 5,
      date: '2025-01-14',
      type: 'Лабораторная работа'
    },
    {
      id: '3',
      subject: 'Литература',
      grade: 5,
      maxGrade: 5,
      date: '2025-01-13',
      type: 'Сочинение'
    }
  ]
  
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Отличник',
      description: 'Средний балл выше 4.5',
      icon: '🌟',
      achieved: true,
      date: '2025-01-01'
    },
    {
      id: '2',
      title: 'Математический гений',
      description: '10 пятерок по математике подряд',
      icon: '🧮',
      achieved: true,
      date: '2025-01-10'
    },
    {
      id: '3',
      title: 'Исследователь',
      description: 'Участие в 5 научных проектах',
      icon: '🔬',
      achieved: false
    }
  ]

  const handleSubjectPress = (subject: string): void => {
    Alert.alert('Предмет', `Открываем детали по предмету: ${subject}`)
  }

  const handleUploadDiploma = (): void => {
    Alert.alert('Загрузка', 'Функция загрузки дипломов в разработке')
  }

  const getGradeColor = (grade: number, maxGrade: number): 'primary' | 'secondary' | 'error' | 'default' => {
    const percentage = (grade / maxGrade) * 100
    if (percentage >= 90) return 'primary'
    if (percentage >= 70) return 'secondary'
    if (percentage >= 50) return 'default'
    return 'error'
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Заголовок */}
      <View style={styles.headerSection}>
        <Heading level={1} color="primary">
          📊 Успеваемость
        </Heading>
        <Paragraph color="muted">
          Следите за своими академическими достижениями
        </Paragraph>
      </View>

      {/* Общая статистика */}
      <Card variant="elevated" style={styles.statsCard}>
        <Card.Body>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Typography variant="h2" color="primary" align="center">
                {currentGPA}
              </Typography>
              <Caption align="center">Средний балл</Caption>
            </View>
            
            <View style={styles.statItem}>
              <Typography variant="h2" color="secondary" align="center">
                {totalCredits}
              </Typography>
              <Caption align="center">Всего кредитов</Caption>
            </View>
            
            <View style={styles.statItem}>
              <Typography variant="h2" color="primary" align="center">
                #{ranking}
              </Typography>
              <Caption align="center">Место в рейтинге</Caption>
            </View>
          </View>
        </Card.Body>
      </Card>

      {/* Последние оценки */}
      <View style={styles.gradesSection}>
        <Heading level={3}>📋 Последние оценки</Heading>
        
        {recentGrades.map((grade) => (
          <Card 
            key={grade.id} 
            variant="standard" 
            style={styles.gradeCard}
            onPress={() => handleSubjectPress(grade.subject)}
          >
            <Card.Body>
              <View style={styles.gradeRow}>
                <View style={styles.gradeInfo}>
                  <Label color="default">{grade.subject}</Label>
                  <Caption color="muted">{grade.type} • {grade.date}</Caption>
                </View>
                
                <View style={styles.gradeValue}>
                  <Typography 
                    variant="h3" 
                    color={getGradeColor(grade.grade, grade.maxGrade)}
                    weight="bold"
                  >
                    {grade.grade}/{grade.maxGrade}
                  </Typography>
                </View>
              </View>
            </Card.Body>
          </Card>
        ))}
        
        <Button
          variant="ghost"
          size="medium"
          onPress={() => Alert.alert('История', 'Показываем все оценки')}
        >
          Показать все оценки
        </Button>
      </View>

      {/* Достижения */}
      <View style={styles.achievementsSection}>
        <Heading level={3}>🏆 Достижения</Heading>
        
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              variant={achievement.achieved ? "elevated" : "outlined"}
              style={[
                styles.achievementCard,
                !achievement.achieved && styles.achievementCardLocked
              ]}
            >
              <Card.Body>
                <Typography variant="h2" style={styles.achievementIcon}>
                  {achievement.achieved ? achievement.icon : '🔒'}
                </Typography>
                <Label 
                  color={achievement.achieved ? "primary" : "muted"}
                  align="center"
                >
                  {achievement.title}
                </Label>
                <Caption 
                  color="muted" 
                  align="center"
                >
                  {achievement.description}
                </Caption>
                {achievement.achieved && achievement.date && (
                  <Caption color="secondary" align="center">
                    Получено: {achievement.date}
                  </Caption>
                )}
              </Card.Body>
            </Card>
          ))}
        </View>
      </View>

      {/* Загрузка дипломов */}
      <Card variant="outlined" style={styles.uploadCard}>
        <Card.Header>
          <Heading level={4}>📜 Дипломы и сертификаты</Heading>
        </Card.Header>
        
        <Card.Body>
          <Paragraph color="muted">
            Загружайте ваши дипломы, сертификаты и грамоты для дополнительных баллов
          </Paragraph>
        </Card.Body>
        
        <Card.Footer>
          <Button
            variant="secondary"
            size="medium"
            onPress={handleUploadDiploma}
          >
            📤 Загрузить документ
          </Button>
        </Card.Footer>
      </Card>

      {/* Прогресс по предметам */}
      <Card variant="elevated" style={styles.progressCard}>
        <Card.Header>
          <Heading level={4}>📈 Прогресс по предметам</Heading>
        </Card.Header>
        
        <Card.Body>
          <View style={styles.subjectsList}>
            {['Математика', 'Физика', 'Химия', 'Литература', 'История'].map((subject) => (
              <View key={subject} style={styles.subjectRow}>
                <Label color="default">{subject}</Label>
                <View style={styles.progressBar}>
                  <View style={[
                    styles.progressFill, 
                    { width: `${Math.random() * 60 + 40}%` }
                  ]} />
                </View>
                <Caption color="muted">4.{Math.floor(Math.random() * 9)}</Caption>
              </View>
            ))}
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
  
  // Оценки
  gradesSection: {
    marginBottom: theme.spacing.xl,
  },
  gradeCard: {
    marginVertical: theme.spacing.sm,
  },
  gradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradeInfo: {
    flex: 1,
  },
  gradeValue: {
    alignItems: 'flex-end',
  },
  
  // Достижения
  achievementsSection: {
    marginBottom: theme.spacing.xl,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  achievementCard: {
    width: '47%',
    minHeight: 140,
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  // Загрузка
  uploadCard: {
    marginBottom: theme.spacing.xl,
  },
  
  // Прогресс
  progressCard: {
    marginBottom: theme.spacing.xl,
  },
  subjectsList: {
    gap: theme.spacing.md,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.sm,
  },
})) 