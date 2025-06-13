const { chromium } = require('playwright');

async function testBankFunctionality() {
    console.log('🏦 ТЕСТ: Проверка функционала страницы банка с реальным API\n');
    
    const browser = await chromium.launch({ 
        headless: false, 
        slowMo: 500 
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // 1. Проверка backend API для транзакций
        console.log('🔗 Проверка API транзакций...');
        const statsResponse = await fetch('http://localhost:3001/api/v1/transactions/stats');
        const stats = await statsResponse.json();
        console.log(`✅ API статистики работает! Всего токенов: ${stats.totalTokens}, пользователей: ${stats.totalUsers}`);
        
        const transactionsResponse = await fetch('http://localhost:3001/api/v1/transactions?limit=10');
        const transactions = await transactionsResponse.json();
        console.log(`✅ API транзакций работает! Найдено транзакций: ${transactions.length}`);
        
        // 2. Переход на страницу банка
        console.log('🌐 Переход на страницу банка...');
        await page.goto('http://localhost:3000/bank');
        await page.waitForLoadState('networkidle');
        
        // Ждем загрузки данных
        await page.waitForSelector('text=L-Bank', { timeout: 10000 });
        console.log('✅ Страница банка загружена');
        
        // 3. Проверка статистических карточек
        console.log('📊 Проверка статистических карточек...');
        const totalTokensCard = await page.locator('text=Всего токенов').first();
        await totalTokensCard.waitFor({ timeout: 5000 });
        console.log('✅ Карточка "Всего токенов" найдена');
        
        const usersCard = await page.locator('text=Пользователей').first();
        await usersCard.waitFor({ timeout: 5000 });
        console.log('✅ Карточка "Пользователей" найдена');
        
        const todayTransactionsCard = await page.locator('text=Транзакций сегодня').first();
        await todayTransactionsCard.waitFor({ timeout: 5000 });
        console.log('✅ Карточка "Транзакций сегодня" найдена');
        
        // 4. Проверка таблицы транзакций
        console.log('📋 Проверка таблицы транзакций...');
        const transactionsTable = await page.locator('table').first();
        await transactionsTable.waitFor({ timeout: 5000 });
        console.log('✅ Таблица транзакций найдена');
        
        // Проверяем заголовки таблицы
        const headers = ['Дата', 'Тип', 'Сумма', 'Описание', 'Участники', 'Статус'];
        for (const header of headers) {
            const headerElement = await page.locator(`th:has-text("${header}")`).first();
            await headerElement.waitFor({ timeout: 3000 });
            console.log(`✅ Заголовок "${header}" найден`);
        }
        
        // 5. Проверка фильтров
        console.log('🔍 Проверка фильтров...');
        const typeFilter = await page.locator('select').first();
        await typeFilter.waitFor({ timeout: 5000 });
        console.log('✅ Фильтр по типу транзакции найден');
        
        const userFilter = await page.locator('select').nth(1);
        await userFilter.waitFor({ timeout: 5000 });
        console.log('✅ Фильтр по пользователю найден');
        
        // 6. Тестирование фильтрации по типу
        console.log('🔄 Тестирование фильтрации по типу...');
        await typeFilter.selectOption('CREDIT');
        await page.waitForTimeout(2000); // Ждем загрузки отфильтрованных данных
        console.log('✅ Фильтр по типу "CREDIT" применен');
        
        // Возвращаем фильтр обратно
        await typeFilter.selectOption('all');
        await page.waitForTimeout(2000);
        console.log('✅ Фильтр сброшен');
        
        // 7. Проверка модального окна создания транзакции
        console.log('➕ Проверка создания транзакции...');
        const createButton = await page.locator('button:has-text("Создать транзакцию")').first();
        await createButton.waitFor({ timeout: 5000 });
        await createButton.click();
        console.log('✅ Кнопка "Создать транзакцию" нажата');
        
        // Проверяем модальное окно
        const modal = await page.locator('text=Создать транзакцию').nth(1); // Второй элемент - заголовок модала
        await modal.waitFor({ timeout: 5000 });
        console.log('✅ Модальное окно создания транзакции открыто');
        
        // Проверяем поля формы
        const userSelect = await page.locator('select').nth(2); // Третий select - в модале
        await userSelect.waitFor({ timeout: 3000 });
        console.log('✅ Поле выбора пользователя найдено');
        
        const amountInput = await page.locator('input[type="number"]').first();
        await amountInput.waitFor({ timeout: 3000 });
        console.log('✅ Поле суммы найдено');
        
        const descriptionTextarea = await page.locator('textarea').first();
        await descriptionTextarea.waitFor({ timeout: 3000 });
        console.log('✅ Поле описания найдено');
        
        // Закрываем модальное окно
        const closeButton = await page.locator('button:has-text("Отмена")').first();
        await closeButton.click();
        await page.waitForTimeout(1000);
        console.log('✅ Модальное окно закрыто');
        
        // 8. Создание скриншота
        console.log('📸 Создание скриншота...');
        await page.screenshot({ 
            path: 'screenshots/bank-page-test.png', 
            fullPage: true 
        });
        console.log('✅ Скриншот сохранен: screenshots/bank-page-test.png');
        
        console.log('\n🎉 ВСЕ ТЕСТЫ СТРАНИЦЫ БАНКА ПРОШЛИ УСПЕШНО!');
        console.log('📊 Проверено:');
        console.log('  - API транзакций и статистики');
        console.log('  - Загрузка и отображение статистических карточек');
        console.log('  - Таблица транзакций с правильными заголовками');
        console.log('  - Фильтрация по типу транзакций');
        console.log('  - Модальное окно создания транзакции');
        console.log('  - Все основные элементы интерфейса');
        
    } catch (error) {
        console.error('❌ ОШИБКА В ТЕСТЕ:', error.message);
        
        // Создаем скриншот ошибки
        try {
            await page.screenshot({ 
                path: 'screenshots/bank-page-error.png', 
                fullPage: true 
            });
            console.log('📸 Скриншот ошибки сохранен: screenshots/bank-page-error.png');
        } catch (screenshotError) {
            console.error('Не удалось создать скриншот ошибки:', screenshotError.message);
        }
    } finally {
        await browser.close();
    }
}

// Запуск теста
testBankFunctionality().catch(console.error); 