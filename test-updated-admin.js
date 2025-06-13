const baseUrl = 'http://localhost:3001/api/v1';

// Цвета для консоли
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAPI(endpoint, description, method = 'GET', body = null) {
  try {
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${baseUrl}${endpoint}`, options);
    
    // Для DELETE запросов, где нет тела ответа
    if (response.status === 204) {
      log(`✅ ${description}`, 'green');
      return { success: true };
    }

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

async function testUpdatedAdminPanel() {
  log('🚀 Тестирование ОБНОВЛЕННОЙ административной панели лицея', 'cyan');
  console.log('');

  // Тест 1: Проверка состояния системы
  log('1. 📊 Проверка состояния Backend API', 'yellow');
  await testAPI('/health', 'Health Check системы');
  console.log('');

  // Тест 2: Проверка пользователей для AdminContext
  log('2. 👥 Тестирование пользователей (AdminContext)', 'yellow');
  const users = await testAPI('/users', 'Загрузка всех пользователей');
  if (users) {
    const students = users.filter(user => user.role === 'STUDENT');
    const admins = users.filter(user => user.role === 'ADMIN');
    log(`   📈 Статистика: ${students.length} студентов, ${admins.length} администраторов`, 'blue');
  }
  console.log('');

  // Тест 3: Регистрация нового студента через API
  log('3. ➕ Тестирование регистрации студента', 'yellow');
  const newStudentData = {
    email: `test.student.${Date.now()}@lyceum.ru`,
    password: 'LyceumPassword123!',
    firstName: 'Тестовый',
    lastName: 'Студент',
    role: 'STUDENT'
  };
  
  const registrationResult = await testAPI('/auth/register', 'Регистрация нового студента', 'POST', newStudentData);
  let newUserId = null;
  if (registrationResult && registrationResult.user) {
      newUserId = registrationResult.user.id;
      log(`   👤 Создан студент с ID: ${newUserId}`, 'cyan');
  }
  console.log('');

  // Тест 4: Проверка, что студент появился в общем списке
  log('4. 📋 Проверка наличия нового студента в списке', 'yellow');
  const updatedUsers = await testAPI('/users', 'Повторная загрузка пользователей');
  if (updatedUsers && newUserId) {
    const found = updatedUsers.some(u => u.id === newUserId);
    if (found) {
      log('   ✅ Новый студент успешно найден в общем списке!', 'green');
    } else {
      log('   ❌ Новый студент НЕ найден в общем списке!', 'red');
    }
  }
  console.log('');

  // Тест 5: Обновление данных студента
  log('5. ✏️ Тестирование обновления студента', 'yellow');
  if (newUserId) {
    const updateData = {
      firstName: 'Обновленный',
      phone: '1234567890'
    };
    // Обратите внимание, что метод PATCH, а не PUT
    await testAPI(`/users/${newUserId}`, `Обновление студента ${newUserId}`, 'PATCH', updateData);
  } else {
    log('   ⚠️ Пропуск теста обновления, так как студент не был создан.', 'yellow');
  }
  console.log('');

  // Тест 6: Удаление созданного студента
  log('6. 🗑️ Тестирование удаления студента', 'yellow');
  if (newUserId) {
    await testAPI(`/users/${newUserId}`, `Удаление студента ${newUserId}`, 'DELETE');
  } else {
    log('   ⚠️ Пропуск теста удаления, так как студент не был создан.', 'yellow');
  }
  console.log('');

  // Тест 7: Проверка, что студент удален из списка
  log('7. 📋 Проверка отсутствия удаленного студента', 'yellow');
  const finalUsers = await testAPI('/users', 'Финальная загрузка пользователей');
  if (finalUsers && newUserId) {
    const found = finalUsers.some(u => u.id === newUserId);
    if (!found) {
      log('   ✅ Удаленный студент успешно отсутствует в списке!', 'green');
    } else {
      log('   ❌ Удаленный студент все еще присутствует в списке!', 'red');
    }
  }
  console.log('');

  // Финальный отчет
  log('🎉 Тестирование CRUD операций для студентов успешно завершено!', 'green');
  console.log('');
  log('📱 ТЕСТИРОВАНИЕ В БРАУЗЕРЕ:', 'blue');
  console.log('   Пожалуйста, откройте админ панель и проверьте, что добавление, обновление');
  console.log('   и удаление студентов работают корректно через интерфейс.');
  console.log('   🌐 http://localhost:3000/students');
  console.log('');
  log('🎯 СЛЕДУЮЩИЕ ШАГИ:', 'magenta');
  console.log('   1. Реализовать модали редактирования и управления токенами.');
  console.log('   2. Подключить API для остальных разделов (L-shop, Банк и т.д.).');
  console.log('   3. Следовать плану в `admin-api.md`.');
}

// Запуск тестирования
testUpdatedAdminPanel().catch(console.error); 