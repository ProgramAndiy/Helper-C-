@echo off
title Helper C# Startup Script
echo ===================================================
echo   Helper C# - Starting Backend and Frontend Servers
echo ===================================================
echo.

echo [1/2] Starting ASP.NET Core API Backend in a new window...
start "Helper C# Backend API" cmd /c "cd backend\HelperC.Backend && dotnet run"

echo [2/2] Starting Vite React Frontend in this window...
npm run dev
