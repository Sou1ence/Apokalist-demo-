@echo off
ECHO Starting Apokalist...

cd /d "%~dp0"

ECHO Starting the application...
start /b java -jar target/apokalist-0.0.1-SNAPSHOT.jar

ECHO Waiting 5 seconds before opening browser...
timeout /t 10 /nobreak

ECHO Opening browser...
start http://localhost:8081

IF %ERRORLEVEL% NEQ 0 (
    ECHO Failed to open browser
    pause
    exit /b 1
)

pause
