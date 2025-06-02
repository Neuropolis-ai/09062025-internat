# Техническое задание по дизайну мобильного приложения "Лицей-интернат Подмосковный"

## 🎨 Общая концепция дизайна

### Философия дизайна 2025
Современный минимализм с элементами неоморфизма, микроанимации и адаптивная система дизайна с фокусом на пользовательский опыт. Образовательная среда, но с современным технологичным подходом.

### Ключевые принципы
- **Clarity First** - ясность превыше всего
- **Digital Wellness** - дизайн способствующий концентрации
- **Inclusive Design** - доступность для всех
- **Micro-interactions** - деликатные анимации
- **Adaptive UI** - адаптация под контекст использования

---

## 🎯 Цветовая палитра и брендинг

### Основная цветовая система

#### Фирменные цвета
- **Primary Burgundy**: `#8B2439` - Основной цвет бренда
  - Light: `#A64B5F` 
  - Dark: `#6B1B2B`
- **Secondary Green**: `#4D8061` - Природный, гармоничный
  - Light: `#70A085`
  - Dark: `#3A6349`
- **Accent Orange**: `#E67E22` - Энергия и действие
  - Light: `#F39C12`
  - Dark: `#D35400`
- **Tech Blue**: `#2980B9` - Технологичность
  - Light: `#3498DB`
  - Dark: `#21618C`

#### Нейтральная палитра (2025 тренды)
- **Pure Black**: `#000000` - Заголовки, акценты
- **Rich Dark**: `#1A1A1A` - Темная тема фон
- **Charcoal**: `#333333` - Основной текст
- **Medium Gray**: `#666666` - Вторичный текст
- **Light Gray**: `#F5F5F5` - Фоны блоков
- **Ultra Light**: `#FAFAFA` - Основной фон
- **Pure White**: `#FFFFFF` - Контент фон
- **Divider**: `#EEEEEE` - Разделители

#### Семантические цвета
- **Success**: `#27AE60` - Успех, достижения
- **Warning**: `#F1C40F` - Предупреждения
- **Error**: `#E74C3C` - Ошибки
- **Info**: `#3498DB` - Информация

### Градиенты (2025)
- **Primary Gradient**: `linear-gradient(135deg, #8B2439 0%, #A64B5F 100%)`
- **Success Gradient**: `linear-gradient(135deg, #4D8061 0%, #70A085 100%)`
- **Sunset Gradient**: `linear-gradient(135deg, #E67E22 0%, #F39C12 100%)`

---

## 📝 Типографическая система

### Шрифтовая иерархия (San Francisco/Roboto)

#### Заголовки
- **H1**: 32px, Weight: 700 (Bold), Line Height: 40px
- **H2**: 28px, Weight: 600 (SemiBold), Line Height: 36px  
- **H3**: 24px, Weight: 600 (SemiBold), Line Height: 32px
- **H4**: 20px, Weight: 500 (Medium), Line Height: 28px
- **H5**: 18px, Weight: 500 (Medium), Line Height: 24px

#### Основной текст
- **Body Large**: 18px, Weight: 400 (Regular), Line Height: 26px
- **Body**: 16px, Weight: 400 (Regular), Line Height: 24px
- **Body Small**: 14px, Weight: 400 (Regular), Line Height: 20px
- **Caption**: 12px, Weight: 400 (Regular), Line Height: 16px

#### Специальные стили
- **Button Text**: 16px, Weight: 500 (Medium), Letter Spacing: 0.5px
- **Label**: 14px, Weight: 500 (Medium), Letter Spacing: 0.3px
- **Overline**: 12px, Weight: 600 (SemiBold), Letter Spacing: 1px, Uppercase

---

## 🧩 Компоненты дизайн-системы

### Кнопки

#### Primary Button
- Background: `#8B2439`
- Text: `#FFFFFF`
- Border Radius: `12px`
- Padding: `16px 24px`
- Shadow: `0 4px 12px rgba(139, 36, 57, 0.25)`
- Hover: Background `#6B1B2B` + scale(1.02)
- Active: Background `#6B1B2B` + scale(0.98)

#### Secondary Button  
- Background: Transparent
- Border: `2px solid #8B2439`
- Text: `#8B2439`
- Same dimensions as Primary

#### Ghost Button
- Background: Transparent
- Text: `#8B2439`
- No border, subtle hover background

### Карточки

#### Standard Card
- Background: `#FFFFFF`
- Border Radius: `16px`
- Shadow: `0 4px 20px rgba(0, 0, 0, 0.08)`
- Padding: `20px`
- Border: `1px solid #F0F0F0`

#### Elevated Card
- Background: `#FFFFFF`
- Border Radius: `20px`
- Shadow: `0 8px 32px rgba(0, 0, 0, 0.12)`
- Padding: `24px`

### Поля ввода

#### Text Field
- Background: `#F8F9FA`
- Border: `1px solid #E9ECEF`
- Border Radius: `12px`
- Padding: `16px`
- Focus Border: `2px solid #8B2439`
- Placeholder: `#6C757D`

---

## 📱 Дизайн страниц

### 1. Экран авторизации

#### Концепция
Современный onboarding с элементами glassmorphism и плавными анимациями.

#### Элементы:
- **Фон**: Градиент от `#8B2439` к `#4D8061` с размытыми геометрическими формами
- **Центральная карточка**: Glassmorphism эффект, backdrop-blur
- **Лого**: Векторная версия с анимацией появления
- **Поля ввода**: Modern floating labels
- **Кнопка входа**: Primary button с ripple эффектом
- **Дополнительные действия**: Ghost buttons

#### Анимации:
- Появление карточки: slide-up + fade-in (600ms)
- Floating labels: smooth transition (200ms)
- Кнопка: hover scale + shadow enhancement

### 2. Главная страница

#### Концепция
Dashboard с адаптивными карточками и персонализированным приветствием.

#### Структура:
1. **Header (Sticky)**
   - Gradient background `#8B2439`
   - Название лицея (белый текст, H4)
   - Avatar пользователя (справа)
   - Notification badge с микроанимацией

2. **Профиль ученика**
   - Круглый аватар (60px) с status indicator
   - ФИО (H3, Bold)
   - Класс и коттедж (Body Small, secondary color)
   - Quick stats (рейтинг, баланс) - горизонтальные карточки

3. **Быстрые действия (Grid 2x3)**
   - Лицейский банк: Иконка кошелька + баланс
   - Успеваемость: График тренд + текущий рейтинг  
   - Госзаказы: Badge с количеством доступных
   - Республика: Должности и достижения
   - Правила: Документы и обновления
   - Еще: Expandable menu

4. **Bottom Navigation**
   - 4 основные вкладки с иконками
   - Активная вкладка: выделение цветом + micro bounce
   - Badge notifications на соответствующих вкладках

#### Анимации:
- Карточки: stagger animation при загрузке
- Hover эффекты: subtle scale + shadow
- Pull-to-refresh: кастомная анимация с лого

### 3. Лицейский банк

#### Концепция
Финтех-стиль с акцентом на безопасность и прозрачность.

#### Элементы:
1. **Header**
   - Заголовок "Лицейский банк"
   - ИННЛ номер (monospace font)
   - Settings gear (справа)

2. **Счета (Cards Stack)**
   - Расчетный счет: Primary card с балансом
   - Кредитный счет: Secondary card с warning states
   - Сберегательный счет: Tertiary card
   - 3D card flip анимация при переключении

3. **Быстрые операции**
   - Horizontal scroll pills
   - Перевод, Пополнение, История, Аналитика

4. **История транзакций**
   - Infinite scroll list
   - Группировка по датам
   - Swipe actions (подробности, повтор)
   - Иконки категорий операций

#### Микроанимации:
- Счетчик баланса: number rolling animation
- Новые транзакции: slide-in notification
- Category icons: subtle bounce on tap

### 4. Успеваемость

#### Концепция
Мотивирующий dashboard с элементами геймификации.

#### Элементы:
1. **Текущий рейтинг**
   - Circular progress indicator
   - Rank badge с позицией в классе
   - Trend indicator (↗️ рост, ↘️ спад)

2. **График динамики**
   - Интерактивный line chart
   - Touch gestures для zoom/pan
   - Highlight точек с подробностями
   - Сравнение с классом (optional)

3. **Достижения**
   - Horizontal scroll галерея
   - 3D badge анимации
   - Progress bars для незавершенных
   - Celebration animations для новых

4. **Загрузка дипломов**
   - Drag & drop зона
   - Предпросмотр файлов
   - Upload progress с процентами
   - Success/error states

#### Анимации:
- Progress bars: smooth fill animation
- Achievements: unlock celebration
- Chart: drawn line animation при загрузке

### 5. Лицейская республика

#### Концепция
Политическая платформа с элементами социальной сети.

#### Элементы:
1. **Профиль гражданина**
   - Аватар с рамкой статуса
   - Полное имя + nickname
   - Citizen ID и verification badge

2. **Принадлежности**
   - Tag cloud интерфейс
   - Color-coded категории
   - Expandable details по tap

3. **Должности**
   - Timeline вертикальный
   - Duration indicators
   - Responsibility badges
   - Achievement unlocks

4. **Активность**
   - Feed инициатив и голосований
   - Contribution metrics
   - Social engagement stats

### 6. Госзакупки

#### Концепция
Marketplace с bidding functionality.

#### Элементы:
1. **Контракты доска**
   - Masonry layout карточек
   - Filter pills (категория, срок, стоимость)
   - Search с autocomplete
   - Sort options dropdown

2. **Карточка контракта**
   - Заголовок + краткое описание
   - Цена range с L-Coin иконкой
   - Deadline countdown timer
   - Difficulty/complexity indicator
   - CTA button "Откликнуться"

3. **Модальное окно отклика**
   - Полное описание задания
   - Форма с валидацией
   - Attachments support
   - Bid submission с confirmation

4. **Мои контракты**
   - Status-based grouping
   - Progress tracking
   - Communication thread
   - Rating system после завершения

### 7. Уведомления

#### Концепция
Центр всех активностей с smart categorization.

#### Элементы:
1. **Категории (Tabs)**
   - Все, Учеба, Финансы, Система
   - Badge counts на каждой
   - Filter и mark all read

2. **Список уведомлений**
   - Grouped by date
   - Read/unread states
   - Priority indicators
   - Rich previews для important
   - Swipe actions (archive, снare)

3. **Детали уведомления**
   - Full-screen modal
   - Rich content support
   - Related actions buttons
   - Link to source context

### 8. L-shop

#### Концепция
Геймифицированный магазин с элементами AR.

#### Элементы:
1. **Витрина**
   - Grid layout адаптивный
   - Product cards с hover эффектами
   - Wishlist heart иконки
   - Quick view модальные окна

2. **Карточка товара**
   - Hero изображение с zoom
   - 360° view (если доступно)
   - Price в L-Coin с конвертером
   - Stock status indicator
   - Add to cart анимация

3. **Корзина**
   - Slide-out drawer
   - Quantity steppers
   - Price calculation real-time
   - Checkout flow упрощенный

### 9. Аукцион

#### Концепция
Live bidding с real-time обновлениями.

#### Элементы:
1. **Активные лоты**
   - Live status indicators
   - Current bid + next minimum
   - Time remaining countdown
   - Bid history expansion
   - Quick bid buttons

2. **Bid модальное окно**
   - Current price display
   - Bid amount input с валидацией
   - Auto-increment suggestions
   - Confirmation с countdown
   - Success/failure feedback

3. **Мои ставки**
   - Winning/losing status
   - Outbid notifications
   - History с timestamps
   - Won items collection

### 10. Нейрочат

#### Концепция
Современный AI chat интерфейс.

#### Элементы:
1. **Чат интерфейс**
   - Bubble design differentation
   - Typing indicators анимированные
   - Time stamps adaptive
   - Message status icons
   - Voice message support

2. **AI assistant persona**
   - Animated avatar
   - Personality responses
   - Context awareness
   - Educational focus
   - Quick suggestion chips

3. **Функциональность**
   - Voice-to-text
   - File attachments
   - Search по истории
   - Favorite messages
   - Export conversation

### 11. FAQ

#### Концепция
Smart help система с AI suggestions.

#### Элементы:
1. **Поиск**
   - Prominent search bar
   - Auto-complete suggestions
   - Recent searches
   - Popular topics highlighting

2. **Аккордеон**
   - Smooth expand/collapse
   - Rich content support
   - Related articles suggestions
   - Feedback системы (helpful?)

### 12. Правила

#### Концепция
Document library с smart organization.

#### Элементы:
1. **Категории документов**
   - Tabbed organization
   - Search functionality
   - Recent updates highlighting
   - Download tracking

2. **Документ viewer**
   - PDF/text rendering
   - Bookmark functionality
   - Annotation support
   - Sharing options

---

## 🎭 Темная тема

### Цветовая палитра Dark Mode
- **Background Primary**: `#0D1117`
- **Background Secondary**: `#161B22`
- **Background Tertiary**: `#21262D`
- **Text Primary**: `#F0F6FC`
- **Text Secondary**: `#8B949E`
- **Border**: `#30363D`

### Адаптация компонентов
- Сохранение accent цветов с повышенной контрастностью
- Elevation через borders, не shadows
- Особое внимание к accessibility

---

## 📐 Layout и Spacing System

### Grid System
- **Container**: 375px (mobile), margins 16px
- **Columns**: Flexible grid на CSS Grid
- **Breakpoints**: 375px, 768px, 1024px

### Spacing Scale (8px base)
- **xs**: 4px
- **sm**: 8px  
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px
- **xxxl**: 64px

---

## ⚡ Анимации и микроинтеракции

### Timing Functions
- **Easing**: cubic-bezier(0.4, 0.0, 0.2, 1)
- **Fast**: 150ms
- **Medium**: 300ms
- **Slow**: 500ms

### Ключевые анимации
1. **Page transitions**: slide + fade
2. **Modal appearance**: scale + fade
3. **Button interactions**: scale + ripple
4. **Loading states**: skeleton screens
5. **Success/error feedback**: bounce + color change

---

## 🔧 Технические требования

### Форматы экспорта
- **Icons**: SVG (24x24, 32x32)
- **Images**: WebP, PNG fallback
- **Fonts**: WOFF2, TTF fallback
- **Colors**: CSS Custom Properties

### Accessibility
- **Contrast ratio**: 4.5:1 minimum
- **Touch targets**: 44px minimum
- **Screen readers**: semantic markup
- **Keyboard navigation**: full support

### Performance
- **Image optimization**: responsive images
- **Animation**: prefer transforms and opacity
- **Bundle size**: критичные ресурсы < 100kb
- **Loading**: progressive enhancement

---

## 📋 Чек-лист реализации

### Phase 1: Core Setup
- [ ] Цветовая система в CSS variables
- [ ] Типографическая система
- [ ] Базовые компоненты (кнопки, карточки, поля)
- [ ] Grid и spacing system

### Phase 2: Key Screens  
- [ ] Авторизация
- [ ] Главная страница
- [ ] Лицейский банк
- [ ] Успеваемость

### Phase 3: Advanced Features
- [ ] Уведомления система
- [ ] L-shop и Аукцион
- [ ] Нейрочат
- [ ] Темная тема

### Phase 4: Polish & Optimization
- [ ] Микроанимации
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Cross-platform testing

---

*Дизайн-система создана с учетом современных трендов 2025 года, включая нейроморфизм, улучшенную типографику, адаптивные интерфейсы и focus на user experience в образовательной среде.* 