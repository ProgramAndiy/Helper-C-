@echo off
title Helper C# - Share via ngrok
echo ===================================================
echo   Helper C# - Share Local Server via ngrok
echo ===================================================
echo.
echo Перед першим запуском переконайтеся, що ви зареєструвалися на ngrok.com
echo та додали ваш токен авторизації у консолі за допомогою команди:
echo   ngrok config add-authtoken ВАШ_ТОКЕН
echo.
echo Запуск тимчасового публічного тунелю для порту 5173...
echo.

ngrok http 5173

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ПОМИЛКА] Не вдалося запустити ngrok. 
    echo Перевірте, чи встановлено ngrok на вашому комп'ютері та додано до змінних оточення PATH.
    echo Завантажити утиліту можна з: https://ngrok.com/download
    echo.
)
pause
