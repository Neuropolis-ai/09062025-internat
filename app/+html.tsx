import React from 'react';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Лицей "Подмосковный"</title>
        <link rel="stylesheet" href="/static/css/custom.css" />
        <style>
          {`
            /* Убираем дополнительный заголовок над хедером */
            h1[role="heading"][aria-level="1"] {
              display: none !important;
              visibility: hidden !important;
              height: 0 !important;
              overflow: hidden !important;
            }
            
            /* Убираем системную навигацию браузера */
            .css-view-175oi2r[style*="height: 64px"] {
              display: none !important;
            }
            
            /* Убираем лишние wrapper элементы */
            .css-view-175oi2r:has(h1[role="heading"]) {
              display: none !important;
            }
            
            /* Фиксируем стили для мобильного дизайна */
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #F2F2F7;
            }
            
            /* Убираем отступы и рамки */
            * {
              box-sizing: border-box;
            }
            
            .css-view-175oi2r[style*="border-bottom-color: rgb(216, 216, 216)"] {
              display: none !important;
            }
          `}
        </style>
      </head>
      <body>{children}</body>
    </html>
  );
} 