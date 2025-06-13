const baseUrl = 'http://localhost:3001/api/v1';

// Цвета для консоли
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAPI(endpoint, description) {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`);
    const data = await response.json();
    
    if (response.ok) {
      log(`✅ ${description}`, 'green');
      console.log('   ', JSON.stringify(data, null, 2).slice(0, 200) + '...');
      return data;
    } else {
      log(`❌ ${description} - ${response.status}`, 'red');
      console.log('   ', data);
      return null;
    }
  } catch (error) {
    log(`❌ ${description} - ${error.message}`, 'red');
    return null;
  }
}

async function testAdminPanel() {
  log('🚀 Начинаем тестирование административной панели лицея', 'blue');
  console.log('');

  // Тест 1: Проверка здоровья системы
  log('1. Проверка состояния системы', 'yellow');
  await testAPI('/health', 'Health Check');
  console.log('');

  // Тест 2: Получение пользователей
  log('2. Получение списка пользователей', 'yellow');
  const users = await testAPI('/users', 'Получение пользователей');
  if (users) {
    const students = users.filter(user => user.role === 'STUDENT');
    const admins = users.filter(user => user.role === 'ADMIN');
    log(`   Найдено: ${students.length} студентов, ${admins.length} администраторов`, 'blue');
  }
  console.log('');

  // Тест 3: Получение продуктов
  log('3. Получение списка продуктов (L-shop)', 'yellow');
  await testAPI('/products', 'Получение продуктов');
  console.log('');

  // Тест 4: Получение аукционов
  log('4. Получение списка аукционов', 'yellow');
  await testAPI('/auctions', 'Получение аукционов');
  console.log('');

  // Тест 5: Получение контрактов
  log('5. Получение списка контрактов', 'yellow');
  await testAPI('/contracts', 'Получение контрактов');
  console.log('');

  // Тест 6: Проверка статуса чата
  log('6. Проверка AI чата', 'yellow');
  await testAPI('/chat/status', 'Статус AI чата');
  console.log('');

  // Тест 7: Проверка хранилища файлов
  log('7. Проверка хранилища файлов', 'yellow');
  try {
    const response = await fetch(`${baseUrl}/storage/test`);
    if (response.status === 404) {
      log('✅ Storage endpoint доступен (404 ожидаемо)', 'green');
    } else {
      const data = await response.json();
      log('✅ Storage API работает', 'green');
      console.log('   ', data);
    }
  } catch (error) {
    log(`❌ Storage API - ${error.message}`, 'red');
  }
  console.log('');

  log('🎉 Тестирование завершено!', 'green');
  console.log('');
  log('📋 Инструкции по тестированию:', 'blue');
  console.log('1. Откройте http://localhost:3000 для админ панели');
  console.log('2. Войдите с данными: admin@lyceum.ru / admin123');
  console.log('3. Откройте http://localhost:3001/api/docs для Swagger документации');
  console.log('4. Проверьте различные разделы админ панели');
  console.log('5. Протестируйте создание, редактирование и удаление записей');
}

// Запуск тестирования
testAdminPanel().catch(console.error); 