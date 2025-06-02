const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// HTML страница с демо приложения
const htmlTemplate = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Лицей-интернат "Подмосковный" - Демо</title>
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
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .phone-container {
            width: 375px;
            height: 812px;
            background: #000;
            border-radius: 40px;
            padding: 10px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            position: relative;
            overflow: hidden;
        }
        
        .screen {
            width: 100%;
            height: 100%;
            background: #F5F5F5;
            border-radius: 30px;
            overflow: hidden;
            position: relative;
        }
        
        .status-bar {
            height: 44px;
            background: #8B2439;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            color: white;
            font-size: 14px;
            font-weight: 600;
        }
        
        .content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            height: calc(100% - 44px - 80px);
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .logo {
            font-size: 48px;
            margin-bottom: 10px;
        }
        
        .title {
            font-size: 24px;
            font-weight: 700;
            color: #8B2439;
            margin-bottom: 5px;
        }
        
        .subtitle {
            font-size: 14px;
            color: #666;
        }
        
        .modules-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 30px;
        }
        
        .module-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        
        .module-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .module-card.new::after {
            content: 'NEW';
            position: absolute;
            top: 8px;
            right: 8px;
            background: #E67E22;
            color: white;
            font-size: 10px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 8px;
        }
        
        .module-icon {
            font-size: 32px;
            margin-bottom: 12px;
        }
        
        .module-name {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
        }
        
        .module-desc {
            font-size: 11px;
            color: #666;
            line-height: 1.3;
        }
        
        .stats {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .stats-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-value {
            font-size: 20px;
            font-weight: 700;
            color: #8B2439;
            margin-bottom: 4px;
        }
        
        .stat-label {
            font-size: 11px;
            color: #666;
        }
        
        .bottom-nav {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 80px;
            background: white;
            border-top: 1px solid #eee;
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 10px 0;
        }
        
        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
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
        
        .chat-fab {
            position: absolute;
            bottom: 100px;
            right: 20px;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #8B2439, #A64B5F);
            border-radius: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(139, 36, 57, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .chat-fab:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(139, 36, 57, 0.4);
        }
        
        .demo-info {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            padding: 15px;
            margin-top: 20px;
            border-left: 4px solid #8B2439;
        }
        
        .demo-info h3 {
            color: #8B2439;
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .demo-info p {
            font-size: 12px;
            color: #666;
            line-height: 1.4;
        }
        
        .update-badge {
            position: absolute;
            top: -2px;
            right: -2px;
            background: #E74C3C;
            color: white;
            border-radius: 10px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 600;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .new {
            animation: pulse 2s infinite;
        }
        
        .feature-list {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
        }
        
        .feature-list h3 {
            color: #8B2439;
            font-size: 16px;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .feature-item:last-child {
            border-bottom: none;
        }
        
        .feature-icon {
            font-size: 18px;
            margin-right: 12px;
            width: 24px;
        }
        
        .feature-text {
            font-size: 13px;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="phone-container">
        <div class="screen">
            <!-- Status Bar -->
            <div class="status-bar">
                <span>9:41</span>
                <span>📶 💿 🔋</span>
            </div>
            
            <!-- Content -->
            <div class="content">
                <!-- Header -->
                <div class="header">
                    <div class="logo">🏛️</div>
                    <div class="title">Лицей-интернат</div>
                    <div class="subtitle">"Подмосковный"</div>
                </div>
                
                <!-- Stats -->
                <div class="stats">
                    <div class="stats-title">📊 Общая статистика</div>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value">4.8</div>
                            <div class="stat-label">Средний балл</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">2,450</div>
                            <div class="stat-label">Баллы</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">15</div>
                            <div class="stat-label">Место в рейтинге</div>
                        </div>
                    </div>
                </div>
                
                <!-- Modules Grid -->
                <div class="modules-grid">
                    <div class="module-card">
                        <div class="module-icon">🏦</div>
                        <div class="module-name">Банк</div>
                        <div class="module-desc">Баланс и транзакции</div>
                    </div>
                    
                    <div class="module-card">
                        <div class="module-icon">📊</div>
                        <div class="module-name">Успеваемость</div>
                        <div class="module-desc">Оценки и достижения</div>
                    </div>
                    
                    <div class="module-card">
                        <div class="module-icon">🏛️</div>
                        <div class="module-name">Республика</div>
                        <div class="module-desc">Самоуправление</div>
                    </div>
                    
                    <div class="module-card new">
                        <div class="module-icon">🛒</div>
                        <div class="module-name">L-Shop</div>
                        <div class="module-desc">Интернет-магазин</div>
                    </div>
                    
                    <div class="module-card new">
                        <div class="module-icon">🏆</div>
                        <div class="module-name">Аукцион</div>
                        <div class="module-desc">Live торги</div>
                    </div>
                    
                    <div class="module-card">
                        <div class="module-icon">🤖</div>
                        <div class="module-name">Нейрочат</div>
                        <div class="module-desc">AI помощник</div>
                        <div class="update-badge">3</div>
                    </div>
                </div>
                
                <!-- New Features -->
                <div class="feature-list">
                    <h3>✨ Новые возможности</h3>
                    <div class="feature-item">
                        <div class="feature-icon">🛒</div>
                        <div class="feature-text">L-Shop: Полноценный интернет-магазин с корзиной</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🏆</div>
                        <div class="feature-text">Аукцион: Live торги с real-time обновлениями</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">📱</div>
                        <div class="feature-text">Современная навигация с анимациями</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🎨</div>
                        <div class="feature-text">Обновленный дизайн всех компонентов</div>
                    </div>
                </div>
                
                <!-- Demo Info -->
                <div class="demo-info">
                    <h3>🚀 Демонстрация готова!</h3>
                    <p>Все основные модули работают. Созданы современные компоненты навигации, интерактивные экраны и полноценные функции. Проект готов для презентации!</p>
                </div>
            </div>
            
            <!-- Bottom Navigation -->
            <div class="bottom-nav">
                <div class="nav-item active">
                    <div class="nav-icon">🏠</div>
                    <div class="nav-label">Главная</div>
                </div>
                <div class="nav-item">
                    <div class="nav-icon">🏦</div>
                    <div class="nav-label">Банк</div>
                </div>
                <div class="nav-item">
                    <div class="nav-icon">📊</div>
                    <div class="nav-label">Оценки</div>
                </div>
                <div class="nav-item">
                    <div class="nav-icon">🛒</div>
                    <div class="nav-label">Shop</div>
                    <div class="update-badge">!</div>
                </div>
                <div class="nav-item">
                    <div class="nav-icon">⚙️</div>
                    <div class="nav-label">Еще</div>
                </div>
            </div>
            
            <!-- Floating Chat Button -->
            <div class="chat-fab">🤖</div>
        </div>
    </div>
    
    <script>
        // Добавляем интерактивность
        document.querySelectorAll('.module-card, .nav-item').forEach(item => {
            item.addEventListener('click', function() {
                // Симуляция навигации
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
        
        // Эффект пульсации для новых элементов
        setInterval(() => {
            document.querySelectorAll('.new').forEach(el => {
                el.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    el.style.transform = '';
                }, 300);
            });
        }, 3000);
        
        // Обновление времени в статус баре
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
        
        console.log('🏛️ Демонстрация лицея запущена!');
        console.log('📱 Новые экраны: L-Shop, Аукцион');
        console.log('🎨 Обновленные компоненты навигации');
    </script>
</body>
</html>
`;

// Маршрут для демо
app.get('/', (req, res) => {
    res.send(htmlTemplate);
});

// API для проверки статуса
app.get('/api/status', (req, res) => {
    const status = {
        status: 'OK',
        message: 'Демонстрация работает',
        timestamp: new Date().toISOString(),
        modules: [
            { name: 'Лицейский банк', status: 'active' },
            { name: 'Успеваемость', status: 'active' },
            { name: 'Республика', status: 'active' },
            { name: 'L-Shop', status: 'active', new: true },
            { name: 'Аукцион', status: 'active', new: true },
            { name: 'Нейрочат', status: 'active' },
        ],
        features: [
            'Современная навигация с анимациями',
            'Header и BottomTabBar компоненты',
            'Интернет-магазин с корзиной',
            'Live аукцион с real-time торгами',
            'Полный набор UI компонентов'
        ],
        progress: {
            phase1: '100%',
            phase2: '100%', 
            phase3: '80%',
            overall: '85%'
        }
    }
    
    res.json(status)
});

app.listen(PORT, () => {
    console.log(`🚀 Демонстрация приложения лицея запущена!`);
    console.log(`📱 Откройте в браузере: http://localhost:${PORT}`);
    console.log(`✨ Статус: http://localhost:${PORT}/api/status`);
    console.log(`\n🏫 Лицей-интернат "Подмосковный" - Мобильное приложение`);
}); 