@echo off
echo ======================================
echo AI Hiring Platform - Quick Start
echo ======================================
echo.

echo Starting Backend on port 8001...
start "Backend Server" cmd /k "cd /d C:\Users\varun\Documents\AI-Hiring-Platform\backend && venv\Scripts\python manage.py runserver 0.0.0.0:8001"

timeout /t 5 /nobreak

echo Starting Frontend on port 5173...
start "Frontend Server" cmd /k "cd /d C:\Users\varun\Documents\AI-Hiring-Platform\frontend && npm run dev"

timeout /t 5 /nobreak

echo.
echo ======================================
echo READY! Open your browser:
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8001
echo.
echo ======================================
echo.
echo Press any key to exit (servers keep running)
pause >nul