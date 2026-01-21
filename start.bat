@echo off
echo ========================================
echo ChatGuardian - Quick Start Script
echo ========================================
echo.

echo Checking prerequisites...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python not found. Please install Python 3.11+ from https://www.python.org/
    pause
    exit /b 1
)

echo [OK] Prerequisites found!
echo.

echo ========================================
echo Choose setup option:
echo 1. Docker (Recommended - Easiest)
echo 2. Manual Setup (More control)
echo ========================================
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" goto docker_setup
if "%choice%"=="2" goto manual_setup
echo Invalid choice!
pause
exit /b 1

:docker_setup
echo.
echo Starting Docker setup...
where docker >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker not found. Please install Docker Desktop from https://www.docker.com/
    pause
    exit /b 1
)

echo Starting all services with Docker Compose...
docker-compose up -d

echo.
echo [SUCCESS] Backend services started!
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.

goto mobile_setup

:manual_setup
echo.
echo Starting manual setup...
echo.
echo Setting up backend...
cd backend

if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing Python dependencies...
pip install -r requirements.txt

if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo [WARNING] Please edit backend\.env with your API keys!
)

echo.
echo Starting backend server...
start cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"

cd ..

:mobile_setup
echo.
echo ========================================
echo Setting up mobile app...
echo ========================================
cd mobile

if not exist node_modules (
    echo Installing mobile app dependencies...
    call npm install
)

echo.
echo Starting Expo development server...
start cmd /k "cd mobile && npm start"

echo.
echo ========================================
echo [SUCCESS] ChatGuardian is starting!
echo ========================================
echo.
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Mobile App: Check the Expo DevTools window
echo.
echo Next steps:
echo 1. Open Expo Go app on your Android phone
echo 2. Scan the QR code from Expo DevTools
echo 3. Start using ChatGuardian!
echo.
echo Press any key to exit...
pause >nul
