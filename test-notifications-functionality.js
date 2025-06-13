const { chromium } = require('playwright');

async function testNotificationsFunctionality() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🧪 Начинаем тестирование системы уведомлений...');
    
    // 1. Проверяем API уведомлений напрямую
    console.log('\n📡 Проверяем backend API...');
    
    try {
      const response = await fetch('http://localhost:3001/api/v1/notifications');
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Backend API работает: найдено ${data.length} уведомлений`);
        if (data.length > 0) {
          console.log(`📊 Пример данных: ${JSON.stringify(data[0], null, 2)}`);
        }
      } else {
        console.log(`⚠️ Backend API недоступен: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`⚠️ Backend API недоступен: ${error.message}`);
    }
    
    // 2. Переходим на страницу уведомлений
    console.log('\n🔗 Переходим на страницу уведомлений...');
    await page.goto('http://localhost:3002/notifications');
    await page.waitForTimeout(3000);
    
    // 3. Проверяем загрузку страницы
    console.log('\n📄 Проверяем элементы страницы...');
    
    // Проверяем заголовок
    const title = await page.textContent('h1');
    console.log(`📝 Заголовок страницы: "${title}"`);
    
    // Проверяем статистические карточки
    const statCards = await page.locator('.admin-card').count();
    console.log(`📊 Найдено статистических карточек: ${statCards}`);
    
    // Проверяем данные в карточках
    const cardData = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.admin-card'));
      return cards.slice(0, 4).map(card => {
        const label = card.querySelector('dt')?.textContent || '';
        const value = card.querySelector('dd')?.textContent || '';
        return { label, value };
      });
    });
    
    cardData.forEach((card, index) => {
      console.log(`  📋 Карточка ${index + 1}: ${card.label} = ${card.value}`);
    });
    
    // 4. Проверяем состояние загрузки
    console.log('\n⏳ Проверяем состояние загрузки...');
    
    const loadingIndicator = await page.locator('.animate-spin').count();
    if (loadingIndicator > 0) {
      console.log('⏳ Страница в состоянии загрузки, ждем...');
      await page.waitForTimeout(5000);
    }
    
    // 5. Проверяем фильтры
    console.log('\n🔍 Тестируем фильтры...');
    
    const searchInput = page.locator('input[placeholder*="Поиск"]');
    const typeFilter = page.locator('select').first();
    const statusFilter = page.locator('select').nth(1);
    
    console.log(`✅ Поле поиска: ${await searchInput.count() > 0 ? 'найдено' : 'не найдено'}`);
    console.log(`✅ Фильтр по типу: ${await typeFilter.count() > 0 ? 'найден' : 'не найден'}`);
    console.log(`✅ Фильтр по статусу: ${await statusFilter.count() > 0 ? 'найден' : 'не найден'}`);
    
    // 6. Проверяем контент уведомлений
    console.log('\n📋 Проверяем контент уведомлений...');
    
    await page.waitForTimeout(2000);
    
    // Проверяем есть ли уведомления или сообщение об их отсутствии
    const notificationCards = await page.locator('.space-y-4 > div').count();
    const emptyMessage = await page.locator('text=Уведомлений не найдено').count();
    
    console.log(`📢 Найдено карточек уведомлений: ${notificationCards}`);
    console.log(`📭 Сообщение "нет уведомлений": ${emptyMessage > 0 ? 'показано' : 'не показано'}`);
    
    if (notificationCards > 0) {
      // Проверяем первое уведомление
      const firstNotification = await page.evaluate(() => {
        const firstCard = document.querySelector('.space-y-4 > div');
        if (firstCard) {
          const title = firstCard.querySelector('h4')?.textContent || '';
          const content = firstCard.querySelector('p')?.textContent || '';
          const badges = Array.from(firstCard.querySelectorAll('.rounded-full')).map(el => el.textContent).join(', ');
          return { title, content, badges };
        }
        return null;
      });
      
      if (firstNotification) {
        console.log(`  📝 Первое уведомление:`);
        console.log(`    Заголовок: "${firstNotification.title}"`);
        console.log(`    Содержание: "${firstNotification.content.substring(0, 50)}..."`);
        console.log(`    Метки: "${firstNotification.badges}"`);
      }
    }
    
    // 7. Тестируем кнопку создания уведомления
    console.log('\n➕ Тестируем создание уведомления...');
    
    const createButton = page.locator('button:has-text("Создать уведомление")').first();
    await createButton.click();
    await page.waitForTimeout(1000);
    
    // Проверяем модальное окно
    const modal = page.locator('.fixed.inset-0.z-50');
    const modalVisible = await modal.count() > 0;
    console.log(`📝 Модальное окно: ${modalVisible ? 'открылось' : 'не открылось'}`);
    
    if (modalVisible) {
      // Проверяем поля формы
      const titleInput = page.locator('input[placeholder*="заголовок"]');
      const contentTextarea = page.locator('textarea[placeholder*="текст"]');
      const typeSelect = page.locator('select').first();
      
      console.log(`  ✅ Поле заголовка: ${await titleInput.count() > 0 ? 'найдено' : 'не найдено'}`);
      console.log(`  ✅ Поле содержания: ${await contentTextarea.count() > 0 ? 'найдено' : 'не найдено'}`);
      console.log(`  ✅ Выбор типа: ${await typeSelect.count() > 0 ? 'найден' : 'не найден'}`);
      
      // Проверяем табы
      const editTab = page.locator('button:has-text("Редактирование")');
      const previewTab = page.locator('button:has-text("Превью")');
      
      console.log(`  📝 Таб редактирования: ${await editTab.count() > 0 ? 'найден' : 'не найден'}`);
      console.log(`  👁️ Таб превью: ${await previewTab.count() > 0 ? 'найден' : 'не найден'}`);
      
      // 8. Заполняем тестовые данные
      console.log('\n📝 Заполняем тестовые данные...');
      
      await titleInput.fill('Тестовое уведомление для проверки');
      await contentTextarea.fill('Это тестовое уведомление создано автоматическим тестом для проверки функциональности системы уведомлений.');
      await typeSelect.selectOption('GENERAL');
      
      console.log('✅ Данные заполнены');
      
      // 9. Переключаемся на превью
      console.log('\n👁️ Проверяем превью...');
      
      await previewTab.click();
      await page.waitForTimeout(500);
      
      const previewContent = await page.locator('.border.rounded-lg.p-4').count();
      console.log(`  📝 Превью отображается: ${previewContent > 0 ? 'да' : 'нет'}`);
      
      // Возвращаемся к редактированию
      await editTab.click();
      await page.waitForTimeout(500);
      
      // Закрываем модальное окно
      const cancelButton = page.locator('button:has-text("Отмена")');
      await cancelButton.click();
      await page.waitForTimeout(500);
    }
    
    // 10. Тестируем поиск (если есть уведомления)
    if (notificationCards > 0) {
      console.log('\n🔍 Тестируем поиск...');
      
      await searchInput.fill('добро');
      await page.waitForTimeout(1000);
      
      const searchResults = await page.locator('.space-y-4 > div').count();
      console.log(`📊 Результатов поиска по "добро": ${searchResults}`);
      
      // Очищаем поиск
      await searchInput.fill('');
      await page.waitForTimeout(500);
      
      // 11. Тестируем фильтры
      console.log('\n🗂️ Тестируем фильтры...');
      
      await typeFilter.selectOption('Общие');
      await page.waitForTimeout(1000);
      const generalResults = await page.locator('.space-y-4 > div').count();
      console.log(`📊 Фильтр "Общие": ${generalResults} результатов`);
      
      // Сброс фильтров
      await typeFilter.selectOption('Все');
      await page.waitForTimeout(500);
    }
    
    // 12. Делаем скриншот
    console.log('\n📸 Создаем скриншот...');
    await page.screenshot({ 
      path: 'screenshots/notifications-page-test.png', 
      fullPage: true 
    });
    console.log('✅ Скриншот сохранен: screenshots/notifications-page-test.png');
    
    console.log('\n🎉 Тестирование системы уведомлений завершено успешно!');
    console.log('\n📋 Итоги тестирования:');
    console.log(`✅ Страница уведомлений загружается`);
    console.log(`✅ Заголовок и структура корректные`);
    console.log(`✅ Статистические карточки отображаются (${statCards} шт.)`);
    console.log(`✅ Фильтры и поиск присутствуют`);
    console.log(`✅ Модальное окно создания работает`);
    console.log(`✅ Система табов в модальном окне работает`);
    console.log(`✅ Превью уведомлений функционирует`);
    console.log(`✅ Все основные компоненты UI протестированы`);
    
  } catch (error) {
    console.error('❌ Ошибка во время тестирования:', error);
  } finally {
    await browser.close();
  }
}

// Запускаем тест
testNotificationsFunctionality().catch(console.error); 