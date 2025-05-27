@echo off
ECHO Starting Apokalist...

cd /d "%~dp0"

ECHO Im gonna try to open this SpringShit...
start /b java -jar target/apokalist-0.0.1-SNAPSHOT.jar

ECHO Delay that newer helps to open in first time...
timeout /t 10 /nobreak

ECHO browser...
start http://localhost:8081

IF %ERRORLEVEL% NEQ 0 (
    ECHO Browser is down
    pause
    exit /b 1
)

pause
