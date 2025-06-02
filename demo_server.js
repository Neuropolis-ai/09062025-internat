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
        
        .demo-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .logo {
            font-size: 64px;
            margin-bottom: 20px;
            display: block;
        }
        
        .title {
            font-size: 28px;
            font-weight: bold;
            color: #8B2439;
            margin-bottom: 8px;
            line-height: 1.2;
        }
        
        .subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 40px;
        }
        
        .stats {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            gap: 20px;
        }
        
        .stat-card {
            background: #fff;
            padding: 20px;
            border-radius: 12px;
            flex: 1;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-2px);
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #8B2439;
            margin-bottom: 4px;
        }
        
        .stat-label {
            font-size: 12px;
            color: #666;
        }
        
        .modules {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 40px;
        }
        
        .module-button {
            background: #fff;
            border: none;
            padding: 20px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .module-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        
        .module-icon {
            font-size: 32px;
            margin-bottom: 8px;
            display: block;
        }
        
        .module-text {
            font-size: 14px;
            font-weight: 500;
            color: #8B2439;
        }
        
        .footer {
            font-size: 16px;
            color: #4D8061;
            font-weight: 500;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            background: #4CAF50;
            border-radius: 50%;
            margin-right: 8px;
            animation: blink 1.5s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
        }
        
        .demo-info {
            background: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 30px;
            color: #2E7D32;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="demo-container">
        <div class="demo-info">
            <span class="status-indicator"></span>
            Демонстрация работает успешно!
        </div>
        
        <span class="logo">🏫</span>
        <h1 class="title">Лицей-интернат "Подмосковный"</h1>
        <p class="subtitle">Мобильное приложение</p>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">2,450</div>
                <div class="stat-label">Лицейских баллов</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">4.8</div>
                <div class="stat-label">Средний балл</div>
            </div>
        </div>
        
        <div class="modules">
            <button class="module-button" onclick="showDemo('Лицейский банк')">
                <span class="module-icon">💳</span>
                <div class="module-text">Лицейский банк</div>
            </button>
            <button class="module-button" onclick="showDemo('Успеваемость')">
                <span class="module-icon">📊</span>
                <div class="module-text">Успеваемость</div>
            </button>
            <button class="module-button" onclick="showDemo('Республика')">
                <span class="module-icon">🏛️</span>
                <div class="module-text">Республика</div>
            </button>
            <button class="module-button" onclick="showDemo('Нейрочат')">
                <span class="module-icon">🤖</span>
                <div class="module-text">Нейрочат</div>
            </button>
        </div>
        
        <p class="footer">✨ Демонстрация работает!</p>
    </div>
    
    <script>
        function showDemo(moduleName) {
            alert(\`Модуль "\${moduleName}" успешно запущен!\\n\\nЭто демонстрация мобильного приложения лицея.\\n\\nВсе функции работают корректно.\`);
        }
        
        // Добавляем интерактивность
        document.querySelectorAll('.module-button').forEach(button => {
            button.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
        
        // Анимация загрузки
        window.addEventListener('load', () => {
            document.querySelector('.demo-container').style.animation = 'fadeInUp 0.8s ease';
        });
        
        // CSS анимация
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        \`;
        document.head.appendChild(style);
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
    res.json({
        status: 'OK',
        message: 'Демонстрация работает',
        timestamp: new Date().toISOString(),
        modules: [
            { name: 'Лицейский банк', status: 'active' },
            { name: 'Успеваемость', status: 'active' },
            { name: 'Республика', status: 'active' },
            { name: 'Нейрочат', status: 'active' }
        ]
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Демонстрация приложения лицея запущена!`);
    console.log(`📱 Откройте в браузере: http://localhost:${PORT}`);
    console.log(`✨ Статус: http://localhost:${PORT}/api/status`);
    console.log(`\n🏫 Лицей-интернат "Подмосковный" - Мобильное приложение`);
}); 