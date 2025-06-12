const express = require('express');
const app = express();
const PORT = 3000;

// HTML точно повторяющий оригинальный дизайн из app/(tabs)/index.tsx
const authenticHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Лицей-интернат "Подмосковный"</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .phone-container {
            width: 375px;
            height: 812px;
            background: #000;
            border-radius: 40px;
            padding: 4px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            position: relative;
        }
        
        .screen {
            width: 100%;
            height: 100%;
            background: #F2F2F7;
            border-radius: 36px;
            overflow: hidden;
            position: relative;
        }
        
        /* Статус бар iPhone */
        .status-bar {
            background: #000;
            height: 44px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            color: #FFFFFF;
            font-size: 14px;
            font-weight: 600;
        }
        
        /* Шапка */
        .header {
            background: #8B2439;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .header-title {
            font-size: 18px;
            font-weight: 600;
            color: #FFFFFF;
            text-align: center;
            flex: 1;
        }
        
        .notification-button {
            position: relative;
            padding: 8px;
            cursor: pointer;
        }
        
        .notification-badge {
            position: absolute;
            top: 4px;
            right: 4px;
            background: #FF4444;
            border-radius: 10px;
            min-width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 12px;
            font-weight: bold;
        }
        
        /* Контент */
        .content {
            height: calc(100% - 44px - 70px - 83px); /* статус бар + header + bottom nav */
            overflow-y: auto;
        }
        
        /* Информационный блок ученика */
        .student-block {
            background: #FFFFFF;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 1px solid #E5E5EA;
        }
        
        .student-photo {
            width: 80px;
            height: 80px;
            border-radius: 40px;
            background: #F2F2F7;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            border: 3px solid #8B2439;
            font-size: 36px;
        }
        
        .student-name {
            font-size: 22px;
            font-weight: bold;
            color: #8B2439;
            margin-bottom: 4px;
        }
        
        .student-info {
            font-size: 16px;
            color: #666666;
        }
        
        /* Блок модулей */
        .modules-section {
            background: #FFFFFF;
            margin-top: 10px;
            padding: 20px;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #8B2439;
            margin-bottom: 20px;
        }
        
        .modules-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .module-card {
            display: flex;
            align-items: center;
            padding: 16px;
            background: #F8F8F8;
            border-radius: 12px;
            border: 1px solid #E5E5EA;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .module-card:hover {
            background: #F0F0F0;
            transform: translateY(-1px);
        }
        
        .module-icon {
            width: 50px;
            height: 50px;
            border-radius: 25px;
            background: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            font-size: 28px;
            color: #8B2439;
        }
        
        .module-content {
            flex: 1;
        }
        
        .module-title {
            font-size: 16px;
            font-weight: 600;
            color: #8B2439;
            margin-bottom: 4px;
        }
        
        .module-description {
            font-size: 14px;
            color: #666666;
            line-height: 20px;
        }
        
        .chevron {
            color: #666666;
            font-size: 16px;
        }
        
        /* Нижняя навигация */
        .bottom-nav {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 83px;
            background: #FFFFFF;
            border-top: 1px solid #E5E5EA;
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding-bottom: 10px;
        }
        
        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            padding: 8px;
            transition: all 0.2s ease;
        }
        
        .nav-item.active {
            color: #8B2439;
        }
        
        .nav-icon {
            font-size: 24px;
            margin-bottom: 4px;
        }
        
        .nav-label {
            font-size: 10px;
            font-weight: 500;
        }
        
        /* Стили для экранов модулей */
        .screen-header {
            background: #FFFFFF;
            padding: 16px 20px;
            border-bottom: 1px solid #E5E5EA;
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .back-button {
            background: none;
            border: none;
            font-size: 18px;
            color: #8B2439;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: background 0.2s;
        }
        
        .back-button:hover {
            background: #F0F0F0;
        }
        
        .screen-header h2 {
            font-size: 20px;
            font-weight: bold;
            color: #8B2439;
        }
        
        .screen-content {
            padding: 20px;
            height: calc(100% - 70px);
            overflow-y: auto;
        }
        
        /* Стили для банка */
        .balance-card {
            background: linear-gradient(135deg, #8B2439, #A0374F);
            color: white;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            margin-bottom: 24px;
        }
        
        .balance-amount {
            font-size: 36px;
            font-weight: bold;
            margin: 12px 0 8px 0;
        }
        
        .transactions-section h4 {
            margin-bottom: 16px;
            color: #8B2439;
        }
        
        .transaction-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: #F8F8F8;
            border-radius: 8px;
            margin-bottom: 8px;
        }
        
        .transaction-amount {
            font-weight: bold;
            color: #FF4444;
        }
        
        .transaction-amount.positive {
            color: #00AA44;
        }
        
        /* Стили для успеваемости */
        .rating-card {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            margin-bottom: 24px;
        }
        
        .rating-position {
            font-size: 32px;
            font-weight: bold;
            margin: 12px 0 8px 0;
        }
        
        .grades-section h4 {
            margin-bottom: 16px;
            color: #8B2439;
        }
        
        .grade-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: #F8F8F8;
            border-radius: 8px;
            margin-bottom: 8px;
        }
        
        .grade {
            font-weight: bold;
            padding: 4px 12px;
            border-radius: 20px;
            color: white;
        }
        
        .grade.excellent {
            background: #00AA44;
        }
        
        .grade.good {
            background: #FF8800;
        }
        
        /* Стили для контрактов */
        .contract-item {
            background: #F8F8F8;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
            border-left: 4px solid #8B2439;
        }
        
        .contract-item h4 {
            margin-bottom: 8px;
            color: #8B2439;
        }
        
        .contract-status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 8px;
        }
        
        .contract-status.available {
            background: #E8F5E8;
            color: #00AA44;
        }
        
        .contract-status.taken {
            background: #FFF0F0;
            color: #FF4444;
        }
        
        /* Стили для республики */
        .republic-info {
            text-align: center;
            margin-bottom: 24px;
        }
        
        .republic-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: #F8F8F8;
            border-radius: 12px;
            margin-bottom: 12px;
        }
        
        .badge {
            background: #8B2439;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }
        
        /* Стили для магазина */
        .shop-category {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: #F8F8F8;
            border-radius: 12px;
            margin-bottom: 12px;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .shop-category:hover {
            background: #F0F0F0;
        }
        
        .item-count {
            color: #666;
            font-size: 14px;
        }
        
        .cart-info {
            background: #E8F5E8;
            padding: 16px;
            border-radius: 12px;
            margin-top: 24px;
            text-align: center;
        }
        
        /* Стили для аукциона */
        .auction-item {
            background: #FFF8E1;
            border: 2px solid #FFB300;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
        }
        
        .time-left {
            color: #FF4444;
            font-weight: bold;
            font-size: 14px;
        }
        
        .bid-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: #F8F8F8;
            border-radius: 8px;
            margin-bottom: 8px;
        }
        
        .bid-time {
            color: #666;
            font-size: 14px;
        }
        
        /* Стили для чата */
        .chat-messages {
            height: calc(100% - 100px);
            overflow-y: auto;
            margin-bottom: 16px;
        }
        
        .message {
            display: flex;
            align-items: flex-start;
            margin-bottom: 16px;
            gap: 12px;
        }
        
        .message.user {
            flex-direction: row-reverse;
        }
        
        .message-avatar {
            font-size: 24px;
            background: #F0F0F0;
            border-radius: 20px;
            padding: 8px;
            min-width: 40px;
            text-align: center;
        }
        
        .message-content {
            background: #F8F8F8;
            border-radius: 16px;
            padding: 12px 16px;
            max-width: 70%;
        }
        
        .message.user .message-content {
            background: #8B2439;
            color: white;
        }
        
        .chat-input {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        
        .chat-input input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #E5E5EA;
            border-radius: 24px;
            font-size: 16px;
            outline: none;
        }
        
        .chat-input button {
            background: #8B2439;
            border: none;
            border-radius: 24px;
            padding: 12px;
            font-size: 16px;
            cursor: pointer;
            color: white;
        }
    </style>
</head>
<body>
    <div class="phone-container">
        <div class="screen">
            <!-- Статус бар -->
            <div class="status-bar">
                <span>14:55</span>
                <span>🔴 📶 WiFi 📶 🔋</span>
            </div>
            
            <!-- Шапка -->
            <div class="header">
                <div class="header-title">Лицей-интернат "Подмосковный"</div>
                <div class="notification-button">
                    <span style="color: white; font-size: 24px;">🔔</span>
                    <div class="notification-badge">3</div>
                </div>
            </div>
            
            <!-- Контент -->
            <div class="content">
                <!-- Информационный блок ученика -->
                <div class="student-block">
                    <div class="student-photo">👤</div>
                    <div class="student-name">Александр Иванов</div>
                    <div class="student-info">8Б, коттедж №3</div>
                </div>
                
                <!-- Блок с основными разделами -->
                <div class="modules-section">
                    <div class="section-title">Основные разделы</div>
                    
                    <div class="modules-list">
                        <!-- Лицейский банк -->
                        <div class="module-card" onclick="showScreen('bank')">
                            <div class="module-icon">💳</div>
                            <div class="module-content">
                                <div class="module-title">Лицейский банк</div>
                                <div class="module-description">Доступ к виртуальному кошельку</div>
                            </div>
                            <div class="chevron">›</div>
                        </div>
                        
                        <!-- Успеваемость -->
                        <div class="module-card" onclick="showScreen('grades')">
                            <div class="module-icon">🎓</div>
                            <div class="module-content">
                                <div class="module-title">Успеваемость</div>
                                <div class="module-description">Отображение рейтинга и достижений</div>
                            </div>
                            <div class="chevron">›</div>
                        </div>
                        
                        <!-- Госзаказы -->
                        <div class="module-card" onclick="showScreen('contracts')">
                            <div class="module-icon">📄</div>
                            <div class="module-content">
                                <div class="module-title">Госзаказы</div>
                                <div class="module-description">Список доступных контрактов и заявок</div>
                            </div>
                            <div class="chevron">›</div>
                        </div>
                        
                        <!-- Республика -->
                        <div class="module-card" onclick="showScreen('republic')">
                            <div class="module-icon">🏛️</div>
                            <div class="module-content">
                                <div class="module-title">Республика</div>
                                <div class="module-description">Социальная и административная активность</div>
                            </div>
                            <div class="chevron">›</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Нижняя навигация -->
            <div class="bottom-nav">
                <div class="nav-item active" onclick="navigateToTab('home')">
                    <div class="nav-icon">🏠</div>
                    <div class="nav-label">Главная</div>
                </div>
                <div class="nav-item" onclick="navigateToTab('lshop')">
                    <div class="nav-icon">🛒</div>
                    <div class="nav-label">L-shop</div>
                </div>
                <div class="nav-item" onclick="navigateToTab('auction')">
                    <div class="nav-icon">🔨</div>
                    <div class="nav-label">Аукцион</div>
                </div>
                <div class="nav-item" onclick="navigateToTab('neuro')">
                    <div class="nav-icon">🤖</div>
                    <div class="nav-label">Нейрочат</div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Состояние приложения
        let currentScreen = 'home';
        
        // Функция переключения экранов
        function showScreen(screenName) {
            currentScreen = screenName;
            const content = document.querySelector('.content');
            
            switch(screenName) {
                case 'home':
                    content.innerHTML = getHomeScreen();
                    break;
                case 'bank':
                    content.innerHTML = getBankScreen();
                    break;
                case 'grades':
                    content.innerHTML = getGradesScreen();
                    break;
                case 'contracts':
                    content.innerHTML = getContractsScreen();
                    break;
                case 'republic':
                    content.innerHTML = getRepublicScreen();
                    break;
                case 'lshop':
                    content.innerHTML = getLShopScreen();
                    break;
                case 'auction':
                    content.innerHTML = getAuctionScreen();
                    break;
                case 'neuro':
                    content.innerHTML = getNeuroScreen();
                    break;
            }
            
            // Обновляем активный таб в нижней навигации
            updateBottomNav(screenName);
        }
        
        // Главный экран
        function getHomeScreen() {
            return `
                <!-- Информационный блок ученика -->
                <div class="student-block">
                    <div class="student-photo">👤</div>
                    <div class="student-name">Александр Иванов</div>
                    <div class="student-info">8Б, коттедж №3</div>
                </div>
                
                <!-- Блок с основными разделами -->
                <div class="modules-section">
                    <div class="section-title">Основные разделы</div>
                    
                    <div class="modules-list">
                        <!-- Лицейский банк -->
                        <div class="module-card" onclick="showScreen('bank')">
                            <div class="module-icon">💳</div>
                            <div class="module-content">
                                <div class="module-title">Лицейский банк</div>
                                <div class="module-description">Доступ к виртуальному кошельку</div>
                            </div>
                            <div class="chevron">›</div>
                        </div>
                        
                        <!-- Успеваемость -->
                        <div class="module-card" onclick="showScreen('grades')">
                            <div class="module-icon">🎓</div>
                            <div class="module-content">
                                <div class="module-title">Успеваемость</div>
                                <div class="module-description">Отображение рейтинга и достижений</div>
                            </div>
                            <div class="chevron">›</div>
                        </div>
                        
                        <!-- Госзаказы -->
                        <div class="module-card" onclick="showScreen('contracts')">
                            <div class="module-icon">📄</div>
                            <div class="module-content">
                                <div class="module-title">Госзаказы</div>
                                <div class="module-description">Список доступных контрактов и заявок</div>
                            </div>
                            <div class="chevron">›</div>
                        </div>
                        
                        <!-- Республика -->
                        <div class="module-card" onclick="showScreen('republic')">
                            <div class="module-icon">🏛️</div>
                            <div class="module-content">
                                <div class="module-title">Республика</div>
                                <div class="module-description">Социальная и административная активность</div>
                            </div>
                            <div class="chevron">›</div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Экран банка
        function getBankScreen() {
            return `
                <div class="screen-header">
                    <button onclick="showScreen('home')" class="back-button">‹ Назад</button>
                    <h2>Лицейский банк</h2>
                </div>
                <div class="screen-content">
                    <div class="balance-card">
                        <h3>💳 Баланс счета</h3>
                        <div class="balance-amount">2,450 ₽</div>
                        <p>Лицейских баллов</p>
                    </div>
                    
                    <div class="transactions-section">
                        <h4>📊 Последние операции</h4>
                        <div class="transaction-item">
                            <span>🍽️ Обед в столовой</span>
                            <span class="transaction-amount">-120 ₽</span>
                        </div>
                        <div class="transaction-item">
                            <span>📚 Покупка в магазине</span>
                            <span class="transaction-amount">-85 ₽</span>
                        </div>
                        <div class="transaction-item">
                            <span>🏆 Победа в олимпиаде</span>
                            <span class="transaction-amount positive">+500 ₽</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Экран успеваемости
        function getGradesScreen() {
            return `
                <div class="screen-header">
                    <button onclick="showScreen('home')" class="back-button">‹ Назад</button>
                    <h2>Успеваемость</h2>
                </div>
                <div class="screen-content">
                    <div class="rating-card">
                        <h3>📈 Рейтинг</h3>
                        <div class="rating-position">15 место</div>
                        <p>в классе из 28 учеников</p>
                    </div>
                    
                    <div class="grades-section">
                        <h4>📝 Средние оценки</h4>
                        <div class="grade-item">
                            <span>Математика</span>
                            <span class="grade excellent">5.0</span>
                        </div>
                        <div class="grade-item">
                            <span>Русский язык</span>
                            <span class="grade good">4.7</span>
                        </div>
                        <div class="grade-item">
                            <span>Физика</span>
                            <span class="grade good">4.5</span>
                        </div>
                        <div class="grade-item">
                            <span>История</span>
                            <span class="grade excellent">5.0</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Экран госзаказов
        function getContractsScreen() {
            return `
                <div class="screen-header">
                    <button onclick="showScreen('home')" class="back-button">‹ Назад</button>
                    <h2>Госзаказы</h2>
                </div>
                <div class="screen-content">
                    <div class="contracts-list">
                        <div class="contract-item">
                            <h4>🏗️ Благоустройство территории</h4>
                            <p>Озеленение школьного двора</p>
                            <span class="contract-status available">Доступен</span>
                        </div>
                        <div class="contract-item">
                            <h4>💻 IT-поддержка</h4>
                            <p>Настройка компьютерного класса</p>
                            <span class="contract-status taken">Занят</span>
                        </div>
                        <div class="contract-item">
                            <h4>📚 Библиотечные услуги</h4>
                            <p>Каталогизация новых книг</p>
                            <span class="contract-status available">Доступен</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Экран республики
        function getRepublicScreen() {
            return `
                <div class="screen-header">
                    <button onclick="showScreen('home')" class="back-button">‹ Назад</button>
                    <h2>Республика</h2>
                </div>
                <div class="screen-content">
                    <div class="republic-info">
                        <h3>🏛️ Ученическое самоуправление</h3>
                        <p>Участвуйте в жизни школьной республики</p>
                    </div>
                    
                    <div class="republic-sections">
                        <div class="republic-item">
                            <span>🗳️ Голосования</span>
                            <span class="badge">2 активных</span>
                        </div>
                        <div class="republic-item">
                            <span>👥 Комитеты</span>
                            <span class="badge">Культурный</span>
                        </div>
                        <div class="republic-item">
                            <span>📋 Инициативы</span>
                            <span class="badge">3 новых</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Экран L-Shop
        function getLShopScreen() {
            return `
                <div class="screen-header">
                    <button onclick="showScreen('home')" class="back-button">‹ Назад</button>
                    <h2>L-Shop</h2>
                </div>
                <div class="screen-content">
                    <div class="shop-categories">
                        <div class="shop-category">
                            <span>🍎 Продукты</span>
                            <span class="item-count">24 товара</span>
                        </div>
                        <div class="shop-category">
                            <span>📚 Канцелярия</span>
                            <span class="item-count">15 товаров</span>
                        </div>
                        <div class="shop-category">
                            <span>👕 Одежда</span>
                            <span class="item-count">8 товаров</span>
                        </div>
                    </div>
                    
                    <div class="cart-info">
                        <h4>🛒 Корзина</h4>
                        <p>У вас 2 товара на сумму 180 ₽</p>
                    </div>
                </div>
            `;
        }
        
        // Экран аукциона
        function getAuctionScreen() {
            return `
                <div class="screen-header">
                    <button onclick="showScreen('home')" class="back-button">‹ Назад</button>
                    <h2>Аукцион</h2>
                </div>
                <div class="screen-content">
                    <div class="auction-active">
                        <h3>🔥 Активные торги</h3>
                        <div class="auction-item">
                            <h4>📱 iPhone 13</h4>
                            <p>Текущая ставка: <strong>15,000 ₽</strong></p>
                            <span class="time-left">⏰ Осталось: 2ч 15м</span>
                        </div>
                    </div>
                    
                    <div class="auction-history">
                        <h4>📋 История ставок</h4>
                        <div class="bid-item">
                            <span>Андрей К. - 15,000 ₽</span>
                            <span class="bid-time">13:45</span>
                        </div>
                        <div class="bid-item">
                            <span>Мария С. - 14,500 ₽</span>
                            <span class="bid-time">13:30</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Экран нейрочата
        function getNeuroScreen() {
            return `
                <div class="screen-header">
                    <button onclick="showScreen('home')" class="back-button">‹ Назад</button>
                    <h2>Нейрочат</h2>
                </div>
                <div class="screen-content">
                    <div class="chat-messages">
                        <div class="message ai">
                            <span class="message-avatar">🤖</span>
                            <div class="message-content">
                                <p>Привет, Александр! Как дела с учебой?</p>
                            </div>
                        </div>
                        <div class="message user">
                            <div class="message-content">
                                <p>Привет! Все хорошо, готовлюсь к экзаменам.</p>
                            </div>
                            <span class="message-avatar">👤</span>
                        </div>
                        <div class="message ai">
                            <span class="message-avatar">🤖</span>
                            <div class="message-content">
                                <p>Отлично! По каким предметам нужна помощь?</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chat-input">
                        <input type="text" placeholder="Введите сообщение..." />
                        <button>📤</button>
                    </div>
                </div>
            `;
        }
        
        // Обновление нижней навигации
        function updateBottomNav(activeScreen) {
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => item.classList.remove('active'));
            
            // Устанавливаем активный таб
            const mapping = {
                'home': 0,
                'lshop': 1, 
                'auction': 2,
                'neuro': 3
            };
            
            if (mapping[activeScreen] !== undefined) {
                navItems[mapping[activeScreen]].classList.add('active');
            }
        }
        
        function handleModulePress(module) {
            alert('Переход к модулю: ' + module + '\\n\\nОригинальный главный экран работает!');
        }
        
        // Навигация по нижним табам
        function navigateToTab(tabName) {
            showScreen(tabName);
        }
        
        // Обновление времени
        function updateTime() {
            const now = new Date();
            const time = now.toLocaleTimeString('ru-RU', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            document.querySelector('.status-bar span').textContent = time;
        }
        
        updateTime();
        setInterval(updateTime, 60000);
        
        console.log('🏫 Полнофункциональный интерфейс лицея готов!');
    </script>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.send(authenticHtml);
});

app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Оригинальный главный экран работает',
        timestamp: new Date().toISOString(),
        student: {
            name: 'Александр Иванов',
            class: '8Б',
            cottage: 'коттедж №3'
        },
        modules: [
            { name: 'Лицейский банк', description: 'Доступ к виртуальному кошельку', icon: '💳' },
            { name: 'Успеваемость', description: 'Отображение рейтинга и достижений', icon: '🎓' },
            { name: 'Госзаказы', description: 'Список доступных контрактов и заявок', icon: '📄' },
            { name: 'Республика', description: 'Социальная и административная активность', icon: '🏛️' }
        ],
        navigation: ['Главная', 'L-shop', 'Аукцион', 'Нейрочат']
    });
});

app.listen(PORT, () => {
    console.log(`🏫 Оригинальный главный экран лицея запущен на порту ${PORT}`);
    console.log(`📱 Откройте: http://localhost:${PORT}`);
    console.log(`✨ Точная копия из app/(tabs)/index.tsx`);
    console.log(`👤 Профиль: Александр Иванов, 8Б, коттедж №3`);
}); 