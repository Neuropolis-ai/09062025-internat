# Настройка файлового хранилища Timeweb S3

## Обзор

Система файлового хранилища интегрирована с [Timeweb Cloud S3](https://timeweb.cloud/services/s3-storage) - совместимым с Amazon S3 объектным хранилищем.

## Возможности

- ✅ Загрузка файлов через API
- ✅ Presigned URL для прямой загрузки
- ✅ Публичные и приватные файлы
- ✅ Категоризация файлов
- ✅ Автоматическое управление доступом
- ✅ Статистика использования

## Настройка Timeweb S3

### 1. Создание аккаунта Timeweb Cloud

1. Зарегистрируйтесь на [timeweb.cloud](https://timeweb.cloud)
2. Пополните баланс для использования S3 хранилища

### 2. Создание S3 бакета

1. В панели управления перейдите в раздел "S3 хранилище"
2. Создайте новый бакет:
   - Выберите тариф (минимум 10 ГБ за 79₽/мес)
   - Имя бакета: `lyceum-files` (или любое другое)
   - Регион: `ru-1`

### 3. Получение ключей доступа

1. В разделе S3 хранилища найдите ваш бакет
2. Перейдите в настройки бакета
3. Создайте пользователя S3 с правами доступа
4. Сохраните Access Key и Secret Key

### 4. Настройка переменных окружения

Добавьте в ваш `.env` файл:

```env
# Timeweb S3 Storage
S3_ACCESS_KEY="ваш_access_key"
S3_SECRET_KEY="ваш_secret_key"
S3_ENDPOINT="https://s3.timeweb.com"
S3_BUCKET_NAME="lyceum-files"
S3_REGION="ru-1"
S3_PUBLIC_URL="https://s3.timeweb.com/lyceum-files"
```

## API Endpoints

### Статус хранилища
```http
GET /api/v1/storage/status
```

### Загрузка файла
```http
POST /api/v1/storage/upload
Content-Type: multipart/form-data

{
  "file": [файл],
  "category": "documents",
  "visibility": "private",
  "description": "Описание файла"
}
```

### Создание Presigned URL
```http
POST /api/v1/storage/presigned-url

{
  "filename": "document.pdf",
  "contentType": "application/pdf",
  "category": "documents",
  "visibility": "private"
}
```

### Список файлов пользователя
```http
GET /api/v1/storage/files?category=documents
```

### Информация о файле
```http
GET /api/v1/storage/files/{fileId}
```

### Удаление файла
```http
DELETE /api/v1/storage/files/{fileId}
```

### Статистика
```http
GET /api/v1/storage/stats
```

### Категории
```http
GET /api/v1/storage/categories
```

## Безопасность

- Все файлы по умолчанию приватные
- Доступ к файлам через JWT аутентификацию
- Presigned URL действуют ограниченное время
- Автоматическая проверка прав доступа

## Ограничения

- Максимальный размер файла: 100 МБ
- Presigned URL действуют 15 минут
- Download URL действуют 1 час
- Поддерживаемые категории: `general`, `documents`, `images`, `videos`, `archives`

## Стоимость Timeweb S3

- **Минимальный тариф**: 10 ГБ - 79₽/мес
- **100 ГБ**: 349₽/мес  
- **250 ГБ**: 639₽/мес
- **500 ГБ**: 1119₽/мес
- **1000 ГБ**: 2079₣/мес

### Включено во все тарифы:
- Тройная репликация данных
- Безлимитный трафик (первые 100 ГБ бесплатно)
- S3-совместимый API
- 99.98% SLA

## Альтернативы

Если Timeweb недоступен, можно использовать:

1. **Yandex Object Storage**
2. **VK Cloud S3** 
3. **Amazon S3** (для международных проектов)

Просто измените `S3_ENDPOINT` в конфигурации.

## Тестирование

```bash
# Проверка статуса
curl -H "Authorization: Bearer YOUR_JWT" \
  http://localhost:3000/api/v1/storage/status

# Загрузка тестового файла
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT" \
  -F "file=@test.txt" \
  -F "category=documents" \
  http://localhost:3000/api/v1/storage/upload
```

## Troubleshooting

### Ошибка "S3 credentials not found"
- Проверьте переменные окружения `S3_ACCESS_KEY` и `S3_SECRET_KEY`
- Убедитесь что ключи корректные

### Ошибка доступа к бакету
- Проверьте права пользователя S3
- Убедитесь что бакет существует
- Проверьте `S3_BUCKET_NAME`

### Медленная загрузка
- Используйте Presigned URL для больших файлов
- Проверьте интернет-соединение к Timeweb 