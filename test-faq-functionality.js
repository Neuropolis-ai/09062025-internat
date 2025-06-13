const { chromium } = require('playwright');

async function testFAQFunctionality() {
  console.log('🚀 Начинаем тестирование FAQ функциональности...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Проверка Backend API
    console.log('📡 Тестирование Backend API...');
    
    // Проверка статистики FAQ
    const statsResponse = await page.request.get('http://localhost:3001/api/v1/faq/stats');
    if (statsResponse.ok()) {
      const stats = await statsResponse.json();
      console.log('✅ FAQ Stats API работает:', stats);
    } else {
      console.log('❌ FAQ Stats API не работает:', statsResponse.status());
    }

    // Проверка получения всех FAQ
    const faqsResponse = await page.request.get('http://localhost:3001/api/v1/faq');
    let faqs = [];
    if (faqsResponse.ok()) {
      faqs = await faqsResponse.json();
      console.log(`✅ FAQ List API работает. Найдено: ${faqs.length} вопросов`);
    } else {
      console.log('❌ FAQ List API не работает:', faqsResponse.status());
    }

    // Создание тестового FAQ
    const testFaq = {
      question: "Как пользоваться системой FAQ?",
      answer: "Система FAQ позволяет создавать, редактировать и удалять часто задаваемые вопросы. Вы можете фильтровать вопросы по категориям и искать по тексту.",
      category: "technical",
      sortOrder: 1,
      isActive: true
    };

    console.log('\n📝 Создание тестового FAQ...');
    const createResponse = await page.request.post('http://localhost:3001/api/v1/faq', {
      data: testFaq
    });

    let createdFaq = null;
    if (createResponse.ok()) {
      createdFaq = await createResponse.json();
      console.log('✅ FAQ создан:', createdFaq.question);
    } else {
      console.log('❌ Ошибка создания FAQ:', createResponse.status());
    }

    // 2. Тестирование Frontend
    console.log('\n🌐 Тестирование Frontend...');
    
    // Переходим на страницу FAQ
    await page.goto('http://localhost:3000/faq');
    await page.waitForLoadState('networkidle');

    // Проверяем загрузку страницы
    const pageTitle = await page.textContent('h1');
    if (pageTitle?.includes('Часто задаваемые вопросы')) {
      console.log('✅ FAQ страница загружена');
    } else {
      console.log('❌ FAQ страница не загружена');
    }

    // Проверяем статистические карточки
    const statsCards = await page.locator('.admin-card').count();
    console.log(`✅ Найдено статистических карточек: ${statsCards}`);

    // Проверяем наличие поиска и фильтров
    const searchInput = page.locator('[placeholder*="Поиск"]');
    const categorySelect = page.locator('select').first();
    
    if (await searchInput.count() > 0) {
      console.log('✅ Поле поиска найдено');
    }
    
    if (await categorySelect.count() > 0) {
      console.log('✅ Фильтр категорий найден');
    }

    // Проверяем кнопку добавления FAQ
    const addButton = page.locator('button:has-text("Добавить вопрос")');
    if (await addButton.count() > 0) {
      console.log('✅ Кнопка добавления FAQ найдена');
      
      // Тестируем открытие модального окна
      await addButton.first().click();
      await page.waitForTimeout(1000);
      
      const modal = page.locator('.fixed.inset-0');
      if (await modal.count() > 0) {
        console.log('✅ Модальное окно создания открывается');
        
        // Закрываем модальное окно
        await page.locator('button:has-text("Отмена")').click();
        await page.waitForTimeout(500);
      }
    }

    // Проверяем отображение FAQ в списке
    const faqItems = await page.locator('[style*="border-color"]').count();
    console.log(`✅ Отображено FAQ в списке: ${faqItems}`);

    // Тестирование поиска
    if (await searchInput.count() > 0) {
      console.log('\n🔍 Тестирование поиска...');
      await searchInput.fill('система');
      await page.waitForTimeout(1000);
      
      const filteredItems = await page.locator('[style*="border-color"]').count();
      console.log(`✅ После поиска "система" найдено: ${filteredItems} результатов`);
      
      // Очищаем поиск
      await searchInput.fill('');
      await page.waitForTimeout(500);
    }

    // Тестирование фильтрации по категориям
    if (await categorySelect.count() > 0) {
      console.log('\n📂 Тестирование фильтрации...');
      await categorySelect.selectOption('Технические вопросы');
      await page.waitForTimeout(1000);
      
      const technicalItems = await page.locator('[style*="border-color"]').count();
      console.log(`✅ После фильтра "Технические вопросы" найдено: ${technicalItems} результатов`);
      
      // Сбрасываем фильтр
      await categorySelect.selectOption('Все');
      await page.waitForTimeout(500);
    }

    // 3. Очистка тестовых данных
    if (createdFaq && createdFaq.id) {
      console.log('\n🧹 Очистка тестовых данных...');
      const deleteResponse = await page.request.delete(`http://localhost:3001/api/v1/faq/${createdFaq.id}`);
      
      if (deleteResponse.ok()) {
        console.log('✅ Тестовый FAQ удален');
      } else {
        console.log('❌ Ошибка удаления тестового FAQ');
      }
    }

    // Финальный скриншот
    await page.screenshot({ 
      path: 'screenshots/faq-page-test.png', 
      fullPage: true 
    });
    console.log('📸 Скриншот сохранен: screenshots/faq-page-test.png');

    console.log('\n✅ Тестирование FAQ завершено успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
  } finally {
    await browser.close();
  }
}

// Вспомогательная функция для создания тестовых данных
async function createTestFAQs() {
  console.log('📋 Создание тестовых FAQ...\n');
  
  const testFAQs = [
    {
      question: "Как войти в систему лицея?",
      answer: "Для входа в систему используйте ваш логин LINN и пароль, выданный администрацией. При первом входе рекомендуется сменить пароль.",
      category: "technical",
      sortOrder: 1,
      isActive: true
    },
    {
      question: "Как пополнить L-Coin баланс?",
      answer: "L-Coin начисляются автоматически за учебные достижения, участие в мероприятиях и выполнение заданий. Дополнительную информацию можно получить у классного руководителя.",
      category: "finance",
      sortOrder: 2,
      isActive: true
    },
    {
      question: "Правила проживания в общежитии",
      answer: "Основные правила: соблюдение тишины с 22:00 до 07:00, поддержание чистоты, запрет курения и алкоголя, обязательное участие в дежурствах.",
      category: "dormitory",
      sortOrder: 3,
      isActive: true
    },
    {
      question: "Как подать заявку на академический отпуск?",
      answer: "Подайте заявление на имя директора, приложите справку о состоянии здоровья (если применимо), получите согласие родителей и пройдите собеседование с заместителем директора.",
      category: "academic",
      sortOrder: 4,
      isActive: true
    },
    {
      question: "Расписание работы столовой",
      answer: "Столовая работает: завтрак 07:30-08:30, обед 12:00-14:00, ужин 18:00-19:30. В выходные: завтрак 08:00-09:00, обед 13:00-14:30, ужин 18:30-19:30.",
      category: "general",
      sortOrder: 5,
      isActive: true
    }
  ];

  for (let i = 0; i < testFAQs.length; i++) {
    try {
      const response = await fetch('http://localhost:3001/api/v1/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testFAQs[i])
      });

      if (response.ok) {
        const faq = await response.json();
        console.log(`✅ FAQ ${i + 1} создан: ${faq.question}`);
      } else {
        console.log(`❌ Ошибка создания FAQ ${i + 1}:`, response.status);
      }
    } catch (error) {
      console.log(`❌ Ошибка создания FAQ ${i + 1}:`, error.message);
    }
  }
}

// Запуск функций
if (require.main === module) {
  if (process.argv[2] === 'create-test-data') {
    createTestFAQs().then(() => {
      console.log('\n✅ Создание тестовых данных завершено!');
    });
  } else {
    testFAQFunctionality();
  }
}

module.exports = { testFAQFunctionality, createTestFAQs }; 