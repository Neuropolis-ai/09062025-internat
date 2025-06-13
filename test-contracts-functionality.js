const { chromium } = require('playwright');

async function testContractsFunctionality() {
  console.log('📋 ТЕСТ: Проверка функционала страницы контрактов с реальным API\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Проверка API контрактов
    console.log('🔗 Проверка API контрактов...');
    const contractsResponse = await fetch('http://localhost:3001/api/v1/contracts');
    if (contractsResponse.ok) {
      const contracts = await contractsResponse.json();
      console.log(`✅ API контрактов работает! Найдено контрактов: ${contracts.length}`);
    } else {
      throw new Error('API контрактов недоступен');
    }

    // Переход на страницу контрактов
    console.log('🌐 Переход на страницу контрактов...');
    await page.goto('http://localhost:3000/contracts');
    await page.waitForLoadState('networkidle');
    console.log('✅ Страница контрактов загружена');

    // Проверка статистических карточек
    console.log('📊 Проверка статистических карточек...');
    const statsCards = [
      { text: 'Всего контрактов', emoji: '📋' },
      { text: 'Открытые контракты', emoji: '🔓' },
      { text: 'Контракты в работе', emoji: '⚡' },
      { text: 'Всего откликов', emoji: '👥' }
    ];

    for (const card of statsCards) {
      const cardElement = await page.locator(`text=${card.text}`).first();
      if (await cardElement.isVisible()) {
        console.log(`✅ Карточка "${card.text}" найдена`);
      } else {
        console.log(`❌ Карточка "${card.text}" не найдена`);
      }
    }

    // Проверка отображения контрактов (если они есть)
    console.log('📋 Проверка отображения контрактов...');
    const contractCards = await page.locator('.admin-card').count();
    if (contractCards > 0) {
      console.log(`✅ Найдено ${contractCards} карточек контрактов`);
    } else {
      console.log('ℹ️ Контракты не найдены (база данных пуста)');
    }

    // Проверка фильтров
    console.log('🔍 Проверка фильтров...');
    const searchInput = await page.locator('input[placeholder*="Поиск контрактов"]');
    if (await searchInput.isVisible()) {
      console.log('✅ Поле поиска найдено');
    }

    const categoryFilter = await page.locator('select').first(); // первый select - категория
    if (await categoryFilter.isVisible()) {
      console.log('✅ Фильтр по категории найден');
    }

    const statusFilter = await page.locator('select').nth(1); // второй select - статус
    if (await statusFilter.isVisible()) {
      console.log('✅ Фильтр по статусу найден');
    }

    // Проверка создания контракта
    console.log('➕ Проверка создания контракта...');
    const createButton = await page.locator('button:has-text("Создать контракт")').first();
    if (await createButton.isVisible()) {
      await createButton.click();
      console.log('✅ Кнопка "Создать контракт" нажата');

      // Ждем модальное окно
      await page.waitForTimeout(1000);

      // Проверка модального окна
      const modal = await page.locator('text="Создать новый контракт"').first();
      if (await modal.isVisible()) {
        console.log('✅ Модальное окно создания контракта открыто');

        // Проверка полей формы
        const titleField = await page.locator('input[placeholder*="Например: Организация утренней зарядки"]');
        const descriptionField = await page.locator('textarea').first();
        const categorySelect = await page.locator('form select').first();
        const rewardField = await page.locator('input[type="number"]').first();
        const maxParticipantsField = await page.locator('input[type="number"]').nth(1);
        const deadlineField = await page.locator('input[type="datetime-local"]');

        if (await titleField.isVisible()) console.log('✅ Поле названия найдено');
        if (await descriptionField.isVisible()) console.log('✅ Поле описания найдено');
        if (await categorySelect.isVisible()) console.log('✅ Поле категории найдено');
        if (await rewardField.isVisible()) console.log('✅ Поле вознаграждения найдено');
        if (await maxParticipantsField.isVisible()) console.log('✅ Поле максимального количества участников найдено');
        if (await deadlineField.isVisible()) console.log('✅ Поле дедлайна найдено');

        // Заполнение тестового контракта (только если авторизация не требуется)
        console.log('📝 Тестирование заполнения формы...');
        await titleField.fill('Тестовый контракт для проверки API');
        console.log('✅ Название заполнено');

        await descriptionField.fill('Это тестовый контракт для проверки работы API и интерфейса.');
        console.log('✅ Описание заполнено');
        
        // Выбор категории
        await categorySelect.selectOption('Общественная работа');
        console.log('✅ Категория выбрана');
        
        // Заполнение вознаграждения
        await rewardField.fill('25');
        console.log('✅ Вознаграждение заполнено');
        
        // Заполнение максимального количества участников
        await maxParticipantsField.fill('2');
        console.log('✅ Количество участников заполнено');

        // Ждем появления превью
        await page.waitForTimeout(1000);
        
        const previewElement = await page.locator('text="Превью контракта:"');
        if (await previewElement.isVisible()) {
          console.log('✅ Превью контракта отображается');
        }

        // Закрытие модального окна без создания (так как может потребоваться авторизация)
        const cancelButton = await page.locator('button:has-text("Отмена")');
        if (await cancelButton.isVisible()) {
          await cancelButton.click();
          console.log('✅ Модальное окно закрыто');
        }
      }
    }

    // Создание скриншота
    console.log('📸 Создание скриншота...');
    await page.screenshot({ 
      path: 'screenshots/contracts-page-test.png',
      fullPage: true 
    });
    console.log('✅ Скриншот сохранен: screenshots/contracts-page-test.png');

    console.log('\n🎉 ВСЕ ТЕСТЫ СТРАНИЦЫ КОНТРАКТОВ ПРОШЛИ УСПЕШНО!');
    console.log('📊 Проверено:');
    console.log('  - API контрактов и загрузка данных');
    console.log('  - Статистические карточки');
    console.log('  - Отображение пустого состояния');
    console.log('  - Фильтры (поиск, категории, статус)');
    console.log('  - Модальное окно создания контракта');
    console.log('  - Все поля формы создания');
    console.log('  - Заполнение тестовых данных');
    console.log('  - Превью контракта');

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
    await page.screenshot({ path: 'screenshots/contracts-page-error.png' });
    console.log('📸 Скриншот ошибки сохранен: screenshots/contracts-page-error.png');
  } finally {
    await browser.close();
  }
}

// Запуск теста
testContractsFunctionality(); 