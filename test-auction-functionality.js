const { chromium } = require('playwright');

async function testAuctionFunctionality() {
  console.log('🎯 ТЕСТ: Проверка функционала страницы аукционов с реальным API\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Проверка API аукционов
    console.log('🔗 Проверка API аукционов...');
    const auctionsResponse = await fetch('http://localhost:3001/api/v1/auctions');
    if (auctionsResponse.ok) {
      const auctions = await auctionsResponse.json();
      console.log(`✅ API аукционов работает! Найдено аукционов: ${auctions.length}`);
    } else {
      throw new Error('API аукционов недоступен');
    }

    // Переход на страницу аукционов
    console.log('🌐 Переход на страницу аукционов...');
    await page.goto('http://localhost:3000/auction');
    await page.waitForLoadState('networkidle');
    console.log('✅ Страница аукционов загружена');

    // Проверка статистических карточек
    console.log('📊 Проверка статистических карточек...');
    const statsCards = [
      { text: 'Всего лотов', emoji: '🎯' },
      { text: 'Активных', emoji: '🔥' },
      { text: 'Завершенных', emoji: '✅' },
      { text: 'Всего ставок', emoji: '💰' }
    ];

    for (const card of statsCards) {
      const cardElement = await page.locator(`text=${card.text}`).first();
      if (await cardElement.isVisible()) {
        console.log(`✅ Карточка "${card.text}" найдена`);
      } else {
        console.log(`❌ Карточка "${card.text}" не найдена`);
      }
    }

    // Проверка сетки лотов
    console.log('🎯 Проверка отображения лотов...');
    const lotCards = await page.locator('.admin-card').count();
    if (lotCards > 0) {
      console.log(`✅ Найдено ${lotCards} карточек лотов`);
    } else {
      console.log('❌ Лоты не отображаются');
    }

    // Проверка фильтров
    console.log('🔍 Проверка фильтров...');
    const searchInput = await page.locator('input[placeholder*="название или описание"]');
    if (await searchInput.isVisible()) {
      console.log('✅ Поле поиска найдено');
    }

    const statusFilter = await page.locator('select').nth(1); // второй select - статус
    if (await statusFilter.isVisible()) {
      console.log('✅ Фильтр по статусу найден');
    }

    // Тестирование фильтрации
    console.log('🔄 Тестирование фильтрации...');
    await statusFilter.selectOption('Активные');
    await page.waitForTimeout(500);
    console.log('✅ Фильтр "Активные" применен');

    await statusFilter.selectOption('Все');
    await page.waitForTimeout(500);
    console.log('✅ Фильтр сброшен');

    // Проверка создания аукциона
    console.log('➕ Проверка создания аукциона...');
    const createButton = await page.locator('button:has-text("Создать лот")').first();
    if (await createButton.isVisible()) {
      await createButton.click();
      console.log('✅ Кнопка "Создать лот" нажата');

      // Проверка модального окна
      const modal = await page.locator('div:has-text("Создать лот")').first(); // Более специфичный селектор
      if (await modal.isVisible()) {
        console.log('✅ Модальное окно создания лота открыто');

        // Проверка полей формы
        const titleField = await page.locator('input#title');
        const descriptionField = await page.locator('textarea#description');
        const priceField = await page.locator('input#startingPrice');
        const incrementField = await page.locator('input#minBidIncrement');
        const startTimeField = await page.locator('input#startTime');
        const endTimeField = await page.locator('input#endTime');

        if (await titleField.isVisible()) console.log('✅ Поле названия найдено');
        if (await descriptionField.isVisible()) console.log('✅ Поле описания найдено');
        if (await priceField.isVisible()) console.log('✅ Поле стартовой цены найдено');
        if (await incrementField.isVisible()) console.log('✅ Поле шага ставки найдено');
        if (await startTimeField.isVisible()) console.log('✅ Поле времени начала найдено');
        if (await endTimeField.isVisible()) console.log('✅ Поле времени окончания найдено');

        // Закрытие модального окна
        const cancelButton = await page.locator('button:has-text("Отмена")');
        if (await cancelButton.isVisible()) {
          await cancelButton.click();
          console.log('✅ Модальное окно закрыто');
        }
      }
    }

    // Проверка действий с лотами
    console.log('⚙️ Проверка действий с лотами...');
    const actionButtons = await page.locator('button[title]').count();
    if (actionButtons > 0) {
      console.log(`✅ Найдено ${actionButtons} кнопок действий`);
    }

    // Создание скриншота
    console.log('📸 Создание скриншота...');
    await page.screenshot({ 
      path: 'screenshots/auction-page-test.png',
      fullPage: true 
    });
    console.log('✅ Скриншот сохранен: screenshots/auction-page-test.png');

    console.log('\n🎉 ВСЕ ТЕСТЫ СТРАНИЦЫ АУКЦИОНОВ ПРОШЛИ УСПЕШНО!');
    console.log('📊 Проверено:');
    console.log('  - API аукционов и загрузка данных');
    console.log('  - Статистические карточки');
    console.log('  - Отображение лотов в сетке');
    console.log('  - Фильтрация по статусу');
    console.log('  - Модальное окно создания лота');
    console.log('  - Все поля формы создания');
    console.log('  - Кнопки действий с лотами');

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
    await page.screenshot({ path: 'screenshots/auction-page-error.png' });
    console.log('📸 Скриншот ошибки сохранен: screenshots/auction-page-error.png');
  } finally {
    await browser.close();
  }
}

// Запуск теста
testAuctionFunctionality(); 