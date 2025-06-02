import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'

interface RuleSection {
  id: string
  title: string
  icon: string
  content: string[]
  important?: boolean
  lastUpdated?: string
}

const ruleSections: RuleSection[] = [
  {
    id: 'general',
    title: 'Общие положения',
    icon: '📋',
    content: [
      'Лицей-интернат "Подмосковный" является образовательным учреждением с круглосуточным пребыванием учащихся.',
      'Все учащиеся обязаны соблюдать правила внутреннего распорядка, уважать права и достоинство других участников образовательного процесса.',
      'Ответственность за соблюдение правил несут как учащиеся, так и их родители (законные представители).',
      'Незнание правил не освобождает от ответственности за их нарушение.'
    ],
    important: false,
    lastUpdated: '2024-01-15'
  },
  {
    id: 'study',
    title: 'Учебная деятельность',
    icon: '📚',
    content: [
      'Посещение всех учебных занятий является обязательным. Пропуски допускаются только по уважительным причинам.',
      'Учащиеся должны приходить на уроки подготовленными, с выполненными домашними заданиями.',
      'На уроках необходимо соблюдать дисциплину, не нарушать ход занятий посторонними разговорами.',
      'Использование мобильных телефонов во время уроков запрещено, кроме случаев, предусмотренных учебным процессом.',
      'При невозможности посещения занятий необходимо уведомить классного руководителя заранее.'
    ],
    important: true,
    lastUpdated: '2024-02-01'
  },
  {
    id: 'behavior',
    title: 'Поведение и дисциплина',
    icon: '🤝',
    content: [
      'Учащиеся должны проявлять уважение к старшим, быть вежливыми со всеми участниками образовательного процесса.',
      'Запрещены любые формы физического и психологического насилия, унижения человеческого достоинства.',
      'Использование ненормативной лексики на территории лицея недопустимо.',
      'Учащиеся должны бережно относиться к имуществу лицея, поддерживать чистоту и порядок.',
      'Курение, употребление алкоголя и наркотических веществ строго запрещено.'
    ],
    important: true,
    lastUpdated: '2024-01-20'
  },
  {
    id: 'dormitory',
    title: 'Правила общежития',
    icon: '🏠',
    content: [
      'Соблюдение режима дня является обязательным для всех проживающих в общежитии.',
      'Отбой в будние дни в 22:30, в выходные - в 23:00. Подъем в 7:00.',
      'Посещение комнат противоположного пола запрещено.',
      'Каждый учащийся отвечает за чистоту и порядок в своей комнате и местах общего пользования.',
      'Приготовление пищи разрешено только в специально отведенных местах.',
      'Вынос мебели и оборудования из комнат запрещен.'
    ],
    important: false,
    lastUpdated: '2024-01-10'
  },
  {
    id: 'digital',
    title: 'Цифровая этика',
    icon: '💻',
    content: [
      'Использование мобильного приложения лицея должно осуществляться в соответствии с его назначением.',
      'Запрещено распространение ложной информации, спам, оскорбления в цифровых сервисах лицея.',
      'Учащиеся обязаны бережно относиться к своим учетным данным, не передавать их третьим лицам.',
      'При обнаружении технических проблем необходимо обращаться в службу поддержки.',
      'Использование системы для целей, не связанных с образовательным процессом, не допускается.'
    ],
    important: true,
    lastUpdated: '2024-02-10'
  },
  {
    id: 'republic',
    title: 'Лицейская республика',
    icon: '🏛️',
    content: [
      'Все учащиеся имеют право участвовать в деятельности лицейской республики.',
      'Выборы в органы самоуправления проводятся на демократической основе.',
      'Решения органов самоуправления обязательны для исполнения всеми учащимися.',
      'Каждый имеет право выдвигать инициативы и участвовать в их обсуждении.',
      'Деятельность республики направлена на развитие лицея и улучшение условий обучения.'
    ],
    important: false,
    lastUpdated: '2024-01-25'
  },
  {
    id: 'violations',
    title: 'Нарушения и ответственность',
    icon: '⚠️',
    content: [
      'За нарушение правил могут применяться следующие меры: замечание, выговор, отчисление.',
      'Серьезные нарушения рассматриваются педагогическим советом с участием родителей.',
      'При систематических нарушениях может быть поставлен вопрос о переводе в другое учебное заведение.',
      'Учащиеся и родители имеют право на обжалование принятых мер в установленном порядке.',
      'Восстановление нарушенных прав осуществляется в соответствии с законодательством РФ.'
    ],
    important: true,
    lastUpdated: '2024-02-05'
  }
]

export const RulesScreen: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>('general')
  const [readSections, setReadSections] = useState<Set<string>>(new Set())
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleSectionRead = (sectionId: string) => {
    setReadSections(prev => new Set([...prev, sectionId]))
  }

  const handleAcceptRules = () => {
    setShowConfirmation(true)
    // В реальном приложении здесь была бы отправка на сервер
    setTimeout(() => setShowConfirmation(false), 2000)
  }

  const getCurrentSection = () => {
    return ruleSections.find(section => section.id === selectedSection) || ruleSections[0]
  }

  const allSectionsRead = ruleSections.every(section => readSections.has(section.id))

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Правила лицея</Text>
        <Text style={styles.headerSubtitle}>
          Изучите все разделы для успешного обучения
        </Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { width: `${(readSections.size / ruleSections.length) * 100}%` }
            ]} />
          </View>
          <Text style={styles.progressText}>
            {readSections.size} из {ruleSections.length} разделов прочитано
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Navigation */}
        <View style={styles.navigation}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.navigationList}
          >
            {ruleSections.map(section => (
              <TouchableOpacity
                key={section.id}
                style={[
                  styles.navButton,
                  selectedSection === section.id && styles.activeNavButton,
                  readSections.has(section.id) && styles.readNavButton
                ]}
                onPress={() => setSelectedSection(section.id)}
              >
                <View style={styles.navButtonContent}>
                  <Text style={[
                    styles.navIcon,
                    selectedSection === section.id && styles.activeNavIcon
                  ]}>
                    {section.icon}
                  </Text>
                  
                  <Text style={[
                    styles.navText,
                    selectedSection === section.id && styles.activeNavText
                  ]}>
                    {section.title}
                  </Text>
                  
                  {section.important && (
                    <View style={styles.importantBadge}>
                      <Text style={styles.importantText}>!</Text>
                    </View>
                  )}
                  
                  {readSections.has(section.id) && (
                    <View style={styles.readBadge}>
                      <Text style={styles.readIcon}>✓</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section Content */}
        <ScrollView style={styles.sectionContent}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionIcon}>{getCurrentSection().icon}</Text>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{getCurrentSection().title}</Text>
                {getCurrentSection().important && (
                  <View style={styles.importantLabel}>
                    <Text style={styles.importantLabelText}>Важно</Text>
                  </View>
                )}
              </View>
            </View>
            
            {getCurrentSection().lastUpdated && (
              <Text style={styles.lastUpdated}>
                Обновлено: {new Date(getCurrentSection().lastUpdated!).toLocaleDateString('ru-RU')}
              </Text>
            )}
          </View>

          <View style={styles.contentList}>
            {getCurrentSection().content.map((item, index) => (
              <View key={index} style={styles.contentItem}>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bulletText}>{index + 1}</Text>
                </View>
                <Text style={styles.contentText}>{item}</Text>
              </View>
            ))}
          </View>

          {!readSections.has(selectedSection) && (
            <TouchableOpacity 
              style={styles.markReadButton}
              onPress={() => handleSectionRead(selectedSection)}
            >
              <Text style={styles.markReadIcon}>✓</Text>
              <Text style={styles.markReadText}>Отметить как прочитанное</Text>
            </TouchableOpacity>
          )}

          {readSections.has(selectedSection) && (
            <View style={styles.readConfirmation}>
              <Text style={styles.readConfirmationIcon}>✅</Text>
              <Text style={styles.readConfirmationText}>Раздел прочитан</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Accept Rules Button */}
      {allSectionsRead && (
        <View style={styles.acceptContainer}>
          <TouchableOpacity 
            style={styles.acceptButton}
            onPress={handleAcceptRules}
          >
            <Text style={styles.acceptButtonText}>
              Я ознакомился со всеми правилами и обязуюсь их соблюдать
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <View style={styles.confirmationOverlay}>
          <View style={styles.confirmationModal}>
            <Text style={styles.confirmationIcon}>✅</Text>
            <Text style={styles.confirmationTitle}>Отлично!</Text>
            <Text style={styles.confirmationMessage}>
              Вы успешно ознакомились со всеми правилами лицея
            </Text>
          </View>
        </View>
      )}
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
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B2439',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  navigation: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  navigationList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navButton: {
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F8F8',
    minWidth: 120,
  },
  activeNavButton: {
    backgroundColor: '#8B2439',
    borderColor: '#8B2439',
  },
  readNavButton: {
    borderColor: '#4CAF50',
    backgroundColor: '#F0F8F0',
  },
  navButtonContent: {
    padding: 12,
    alignItems: 'center',
    position: 'relative',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  activeNavIcon: {
    color: '#FFFFFF',
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
  },
  activeNavText: {
    color: '#FFFFFF',
  },
  importantBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  importantText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  readBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readIcon: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  sectionContent: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginRight: 12,
  },
  importantLabel: {
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  importantLabelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999999',
  },
  contentList: {
    padding: 16,
  },
  contentItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8B2439',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  bulletText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  contentText: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  markReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B2439',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  markReadIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  },
  markReadText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  readConfirmation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F8F0',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  readConfirmationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  readConfirmationText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  acceptContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  confirmationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 32,
  },
  confirmationIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  confirmationMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
})

export default RulesScreen 