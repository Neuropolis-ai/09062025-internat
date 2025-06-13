const { chromium } = require('playwright');

// Тест функционала страницы студентов
async function testStudentsPage() {
    console.log('🧪 Запуск тестирования страницы студентов...\n');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // 1. Переход на главную страницу
        console.log('📍 Переход на localhost:3000...');
        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: 'screenshots/01-homepage.png' });
        console.log('✅ Главная страница загружена');
        
        // 2. Попытка перейти на страницу студентов напрямую
        console.log('\n📍 Переход на страницу студентов...');
        await page.goto('http://localhost:3000/students');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'screenshots/02-students-page.png' });
        
        // 3. Проверка наличия элементов на странице
        console.log('\n🔍 Проверка элементов страницы студентов...');
        
        // Проверяем заголовок
        const title = await page.textContent('h1, h2, h3').catch(() => null);
        if (title && title.includes('Ученики')) {
            console.log('✅ Заголовок "Ученики" найден');
        } else {
            console.log('⚠️ Заголовок "Ученики" не найден');
        }
        
        // Проверяем таблицу студентов
        const table = await page.$('table').catch(() => null);
        if (table) {
            console.log('✅ Таблица студентов найдена');
            
            // Проверяем заголовки колонок
            const headers = await page.$$eval('th', ths => 
                ths.map(th => th.textContent.trim())
            ).catch(() => []);
            console.log('📊 Заголовки таблицы:', headers);
            
            // Проверяем наличие нужных колонок
            const expectedHeaders = ['Фамилия Имя', 'Email', 'Класс', 'Коттедж', 'Токены', 'Должности', 'Статус'];
            const foundHeaders = expectedHeaders.filter(header => 
                headers.some(h => h.includes(header.split(' ')[0]))
            );
            console.log('✅ Найденные колонки:', foundHeaders);
            
            // Подсчет строк данных
            const rows = await page.$$('tbody tr').catch(() => []);
            console.log(`📈 Количество студентов в таблице: ${rows.length}`);
            
            // Если есть студенты, тестируем клик на первую строку
            if (rows.length > 0) {
                console.log('\n🖱️ Тестирование клика на студента...');
                await rows[0].click();
                await page.waitForTimeout(1000);
                
                // Проверяем модальное окно
                const modal = await page.$('.modal, [role="dialog"], .fixed').catch(() => null);
                if (modal) {
                    console.log('✅ Модальное окно деталей студента открылось');
                    await page.screenshot({ path: 'screenshots/03-student-details-modal.png' });
                    
                    // Закрываем модал
                    const closeButton = await page.$('button:has-text("Закрыть"), .close, [aria-label="Close"]').catch(() => null);
                    if (closeButton) {
                        await closeButton.click();
                        console.log('✅ Модал закрыт');
                    }
                } else {
                    console.log('⚠️ Модальное окно не открылось');
                }
            }
        } else {
            console.log('⚠️ Таблица студентов не найдена');
        }
        
        // 4. Тестирование кнопки "Добавить ученика"
        console.log('\n➕ Тестирование добавления студента...');
        const addButton = await page.$('button:has-text("Добавить")').catch(() => null);
        if (addButton) {
            await addButton.click();
            await page.waitForTimeout(1000);
            
            const addModal = await page.$('.modal, [role="dialog"], .fixed').catch(() => null);
            if (addModal) {
                console.log('✅ Модал добавления студента открылся');
                await page.screenshot({ path: 'screenshots/04-add-student-modal.png' });
                
                // Проверяем поля формы
                const formFields = await page.$$eval('input, select', inputs => 
                    inputs.map(input => ({
                        type: input.type,
                        name: input.name || input.id,
                        placeholder: input.placeholder
                    }))
                ).catch(() => []);
                console.log('📝 Поля формы:', formFields);
                
                // Закрываем модал
                const cancelButton = await page.$('button:has-text("Отмен")').catch(() => null);
                if (cancelButton) {
                    await cancelButton.click();
                    console.log('✅ Модал добавления закрыт');
                }
            } else {
                console.log('⚠️ Модал добавления не открылся');
            }
        } else {
            console.log('⚠️ Кнопка "Добавить ученика" не найдена');
        }
        
        // 5. Проверка консольных ошибок
        console.log('\n🔍 Проверка консольных ошибок...');
        const consoleLogs = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleLogs.push(msg.text());
            }
        });
        
        await page.waitForTimeout(2000);
        
        if (consoleLogs.length > 0) {
            console.log('⚠️ Найденные ошибки в консоли:');
            consoleLogs.forEach(log => console.log('   -', log));
        } else {
            console.log('✅ Ошибок в консоли не найдено');
        }
        
    } catch (error) {
        console.error('❌ Ошибка во время тестирования:', error.message);
        await page.screenshot({ path: 'screenshots/error.png' });
    } finally {
        await browser.close();
    }
    
    console.log('\n🎉 Тестирование завершено!');
    console.log('📸 Скриншоты сохранены в папке screenshots/');
}

// Создание папки для скриншотов
const fs = require('fs');
if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
}

// Запуск тестирования
testStudentsPage().catch(console.error); 