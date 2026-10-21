@echo off
echo ============================================================
echo Starting Financial Statement Comparison Tool...
echo ============================================================

set "PATH=C:\Users\bosen\AppData\Local\Programs\nodejs;%PATH%"

start "Financial Tool - FastAPI Backend" cmd /k "cd backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
start "Financial Tool - Vite Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Servers started!
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:8000 (Docs: http://localhost:8000/docs)
echo ============================================================
