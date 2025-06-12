import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...');

  // Создаем классы
  const class8A = await prisma.class.create({
    data: {
      name: '8А',
      academicYear: '2024-2025',
      gradeLevel: 8,
      capacity: 25,
    },
  });

  const class9B = await prisma.class.create({
    data: {
      name: '9Б',
      academicYear: '2024-2025', 
      gradeLevel: 9,
      capacity: 30,
    },
  });

  // Создаем коттеджи
  const cottage1 = await prisma.cottage.create({
    data: {
      name: 'Коттедж №1',
      number: 1,
      capacity: 50,
      description: 'Основной коттедж для учеников 8-9 классов',
    },
  });

  const cottage2 = await prisma.cottage.create({
    data: {
      name: 'Коттедж №2',
      number: 2,
      capacity: 45,
      description: 'Коттедж для старшеклассников',
    },
  });

  // Создаем администратора
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@lyceum.ru',
      passwordHash: adminPassword,
      firstName: 'Администратор',
      lastName: 'Системы',
      innl: 'ADMIN001',
      role: 'ADMIN',
      classId: class8A.id,
      cottageId: cottage1.id,
      emailVerified: true,
    },
  });

  // Создаем тестового ученика
  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.create({
    data: {
      email: 'student@lyceum.ru',
      passwordHash: studentPassword,
      firstName: 'Иван',
      lastName: 'Петров',
      innl: 'STU001',
      role: 'STUDENT',
      classId: class8A.id,
      cottageId: cottage1.id,
      emailVerified: true,
      birthDate: new Date('2008-05-15'),
      phone: '+7 (123) 456-78-90',
    },
  });

  // Создаем счета
  const adminAccount = await prisma.account.create({
    data: {
      userId: admin.id,
      accountNumber: 'ADMIN-001-2024',
      accountType: 'CHECKING',
      balance: 10000.00,
    },
  });

  const studentAccount = await prisma.account.create({
    data: {
      userId: student.id,
      accountNumber: 'STU-001-2024',
      accountType: 'CHECKING',
      balance: 1000.00,
    },
  });

  // Создаем категории товаров
  const categoryFood = await prisma.productCategory.create({
    data: {
      name: 'Еда и напитки',
      description: 'Продукты питания и напитки',
      sortOrder: 1,
    },
  });

  const categorySchool = await prisma.productCategory.create({
    data: {
      name: 'Школьные принадлежности',
      description: 'Канцелярия и учебные материалы',
      sortOrder: 2,
    },
  });

  // Создаем товары
  const product1 = await prisma.product.create({
    data: {
      name: 'Шоколадный батончик',
      description: 'Вкусный молочный шоколад',
      price: 50.00,
      categoryId: categoryFood.id,
      stockQuantity: 100,
      createdBy: admin.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Ручка синяя',
      description: 'Шариковая ручка с синими чернилами',
      price: 25.00,
      categoryId: categorySchool.id,
      stockQuantity: 50,
      createdBy: admin.id,
    },
  });

  // Создаем достижения
  const achievement1 = await prisma.achievement.create({
    data: {
      name: 'Первая покупка',
      description: 'Совершил первую покупку в L-shop',
      category: 'ТОРГОВЛЯ',
      points: 10,
    },
  });

  const achievement2 = await prisma.achievement.create({
    data: {
      name: 'Активный участник аукционов',
      description: 'Сделал 5 ставок на аукционах',
      category: 'АУКЦИОНЫ',
      points: 25,
    },
  });

  // Создаем должности
  const position1 = await prisma.position.create({
    data: {
      name: 'Президент',
      description: 'Глава лицейской республики',
      level: 5,
    },
  });

  const position2 = await prisma.position.create({
    data: {
      name: 'Министр образования',
      description: 'Ответственный за образовательные вопросы',
      level: 4,
    },
  });

  // Создаем принадлежности/организации
  const belonging1 = await prisma.belonging.create({
    data: {
      name: 'Совет лицеистов',
      description: 'Орган самоуправления лицея',
    },
  });

  const belonging2 = await prisma.belonging.create({
    data: {
      name: 'Клуб программистов',
      description: 'Клуб для изучения программирования',
    },
  });

  // Создаем уведомления
  await prisma.notification.create({
    data: {
      title: 'Добро пожаловать!',
      content: 'Добро пожаловать в систему Лицей-интернат "Подмосковный"',
      type: 'GENERAL',
      isGlobal: true,
    },
  });

  // Создаем FAQ
  await prisma.fAQ.create({
    data: {
      question: 'Как пополнить баланс L-coin?',
      answer: 'Обратитесь к администратору для пополнения баланса вашего лицейского счета.',
      category: 'ФИНАНСЫ',
    },
  });

  await prisma.fAQ.create({
    data: {
      question: 'Как участвовать в аукционах?',
      answer: 'Зайдите в раздел "Аукционы", выберите интересующий лот и сделайте ставку.',
      category: 'АУКЦИОНЫ',
    },
  });

  console.log('✅ База данных заполнена тестовыми данными!');
  console.log(`👨‍💼 Администратор: admin@lyceum.ru / admin123`);
  console.log(`🎓 Ученик: student@lyceum.ru / student123`);
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 