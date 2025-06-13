const { chromium } = require('playwright');

async function testStudentsDetailedFlow() {
    console.log('🚀 Запуск детального тестирования страницы студентов...\n');
    
    const browser = await chromium.launch({ 
        headless: false, 
        slowMo: 1000 // Замедление для наблюдения
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // 1. Начальная загрузка
        console.log('📍 Переход на главную страницу...');
        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: 'screenshots/detailed-01-homepage.png' });
        
        // Проверяем, есть ли форма входа
        const loginForm = await page.$('form').catch(() => null);
        if (loginForm) {
            console.log('🔐 Форма входа найдена, пытаемся войти...');
            
            // Попробуем найти демо-кнопку
            const demoButton = await page.$('button:has-text("Демо"), button:has-text("Demo")').catch(() => null);
            if (demoButton) {
                console.log('🎯 Нажимаем кнопку демо-входа...');
                await demoButton.click();
                await page.waitForTimeout(2000);
            } else {
                // Попробуем ввести тестовые данные
                console.log('📝 Вводим тестовые данные для входа...');
                await page.fill('input[type="email"], input[name="email"]', 'admin@test.com');
                await page.fill('input[type="password"], input[name="password"]', 'password');
                await page.click('button[type="submit"], button:has-text("Войти")');
                await page.waitForTimeout(2000);
            }
        }
        
        // 2. Переход на страницу студентов
        console.log('\n📍 Переход на страницу студентов...');
        await page.goto('http://localhost:3000/students');
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'screenshots/detailed-02-students-page.png' });
        
        // Детальная проверка страницы
        console.log('\n🔍 Детальная проверка страницы студентов...');
        
        // Проверяем URL
        const currentUrl = page.url();
        console.log('🌐 Текущий URL:', currentUrl);
        
        // Проверяем title страницы
        const title = await page.title();
        console.log('📄 Title страницы:', title);
        
        // Проверяем наличие основных элементов
        const elements = {
            sidebar: await page.$('.sidebar, nav, aside').catch(() => null),
            header: await page.$('header, .header').catch(() => null),
            mainContent: await page.$('main, .main, .content').catch(() => null),
            table: await page.$('table').catch(() => null),
            addButton: await page.$('button:has-text("Добавить")').catch(() => null)
        };
        
        console.log('🏗️ Найденные элементы структуры:');
        Object.entries(elements).forEach(([key, element]) => {
            console.log(`   ${element ? '✅' : '❌'} ${key}`);
        });
        
        // Если таблица найдена, детально изучаем её
        if (elements.table) {
            console.log('\n📊 Анализ таблицы студентов...');
            
            // Заголовки
            const headers = await page.$$eval('th', ths => 
                ths.map(th => th.textContent?.trim()).filter(Boolean)
            ).catch(() => []);
            console.log('📋 Заголовки колонок:', headers);
            
            // Строки данных
            const rows = await page.$$('tbody tr').catch(() => []);
            console.log(`👥 Количество строк студентов: ${rows.length}`);
            
            if (rows.length > 0) {
                // Берем первую строку и анализируем её содержимое
                const firstRowData = await page.$$eval('tbody tr:first-child td', tds => 
                    tds.map(td => td.textContent?.trim()).filter(Boolean)
                ).catch(() => []);
                console.log('📝 Данные первой строки:', firstRowData);
                
                // Тестируем клик по первой строке
                console.log('\n🖱️ Тестирование клика по строке студента...');
                await rows[0].click();
                await page.waitForTimeout(2000);
                
                // Проверяем модальные окна
                const modals = await page.$$('.modal, [role="dialog"], .fixed').catch(() => []);
                console.log(`🪟 Найдено модальных окон: ${modals.length}`);
                
                if (modals.length > 0) {
                    await page.screenshot({ path: 'screenshots/detailed-03-student-details.png' });
                    
                    // Анализируем содержимое модала
                    const modalContent = await page.textContent('.modal, [role="dialog"], .fixed').catch(() => '');
                    console.log('📑 Содержимое модала найдено:', modalContent.slice(0, 200) + '...');
                    
                    // Ищем кнопки в модале
                    const modalButtons = await page.$$eval('.modal button, [role="dialog"] button, .fixed button', 
                        buttons => buttons.map(btn => btn.textContent?.trim()).filter(Boolean)
                    ).catch(() => []);
                    console.log('🔘 Кнопки в модале:', modalButtons);
                    
                    // Закрываем модал
                    const closeBtn = await page.$('button:has-text("Закрыть"), button:has-text("×"), .close').catch(() => null);
                    if (closeBtn) {
                        await closeBtn.click();
                        console.log('✅ Модал закрыт');
                    }
                }
            }
        } else {
            console.log('⚠️ Таблица не найдена. Проверяем другие элементы...');
            
            // Проверяем, есть ли сообщения об ошибках или загрузке
            const errorMsg = await page.textContent('.error, .alert-error, [role="alert"]').catch(() => null);
            const loadingMsg = await page.textContent('.loading, .spinner').catch(() => null);
            
            if (errorMsg) console.log('❌ Сообщение об ошибке:', errorMsg);
            if (loadingMsg) console.log('⏳ Сообщение о загрузке:', loadingMsg);
        }
        
        // 3. Тестирование добавления студента
        if (elements.addButton) {
            console.log('\n➕ Тестирование модала добавления студента...');
            await elements.addButton.click();
            await page.waitForTimeout(2000);
            await page.screenshot({ path: 'screenshots/detailed-04-add-modal.png' });
            
            // Заполняем форму тестовыми данными
            const testData = {
                firstName: 'Тестовый',
                lastName: 'Студент',
                middleName: 'Иванович',
                email: `test.${Date.now()}@lyceum.test`
            };
            
            console.log('📝 Заполнение формы тестовыми данными...');
            for (const [field, value] of Object.entries(testData)) {
                const input = await page.$(`input[name="${field}"]`).catch(() => null);
                if (input) {
                    await input.fill(value);
                    console.log(`   ✅ ${field}: ${value}`);
                }
            }
            
            // Выбираем класс и коттедж
            const classSelect = await page.$('select[name="class"]').catch(() => null);
            if (classSelect) {
                await classSelect.selectOption('10А');
                console.log('   ✅ Класс: 10А');
            }
            
            const cottageSelect = await page.$('select[name="cottage"]').catch(() => null);
            if (cottageSelect) {
                await cottageSelect.selectOption('Альфа');
                console.log('   ✅ Коттедж: Альфа');
            }
            
            // Проверяем чекбоксы для должностей
            const positionCheckboxes = await page.$$('input[type="checkbox"]').catch(() => []);
            if (positionCheckboxes.length > 0) {
                console.log(`   📋 Найдено чекбоксов: ${positionCheckboxes.length}`);
                // Выбираем первый чекбокс
                await positionCheckboxes[0].check();
                console.log('   ✅ Выбрана первая должность');
            }
            
            await page.screenshot({ path: 'screenshots/detailed-05-form-filled.png' });
            
            // НЕ отправляем форму, только закрываем
            const cancelBtn = await page.$('button:has-text("Отмен")').catch(() => null);
            if (cancelBtn) {
                await cancelBtn.click();
                console.log('✅ Форма отменена (тестовые данные не сохранены)');
            }
        }
        
        // 4. Проверка консоли и производительности
        console.log('\n🔍 Финальная проверка...');
        
        // Консольные сообщения
        const consoleLogs = [];
        page.on('console', msg => {
            consoleLogs.push(`${msg.type()}: ${msg.text()}`);
        });
        
        await page.waitForTimeout(3000);
        
        if (consoleLogs.length > 0) {
            console.log('📜 Сообщения консоли:');
            consoleLogs.slice(-5).forEach(log => console.log(`   ${log}`));
        }
        
        // Проверка производительности
        const performance = await page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            return {
                loadTime: Math.round(navigation.loadEventEnd - navigation.navigationStart),
                domReady: Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart)
            };
        });
        
        console.log('⚡ Производительность:');
        console.log(`   📊 Время загрузки: ${performance.loadTime}ms`);
        console.log(`   🏗️ DOM готов: ${performance.domReady}ms`);
        
    } catch (error) {
        console.error('❌ Ошибка во время тестирования:', error.message);
        await page.screenshot({ path: 'screenshots/detailed-error.png' });
    } finally {
        await browser.close();
    }
    
    console.log('\n🎉 Детальное тестирование завершено!');
    console.log('📸 Все скриншоты сохранены в папке screenshots/');
}

// Создание папки для скриншотов
const fs = require('fs');
if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
}

// Запуск детального тестирования
testStudentsDetailedFlow().catch(console.error); 