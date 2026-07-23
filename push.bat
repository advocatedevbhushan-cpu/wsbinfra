@echo off
cd /d "%~dp0"

:: Check git identity
git config user.email >nul 2>&1
if %errorlevel% neq 0 (
    echo Git identity not found. Enter your GitHub details:
    set /p gitusername= "Name: "
    set /p gitemail= "Email: "
    git config user.name "%gitusername%"
    git config user.email "%gitemail%"
)

echo Adding all changes...
git add -A
if %errorlevel% neq 0 ( echo Failed to add changes & pause & exit /b %errorlevel% )

echo Enter commit message:
set /p msg=
if "%msg%"=="" set "msg=Update website"
git commit -m "%msg%"
if %errorlevel% neq 0 ( echo Nothing to commit or commit failed & pause & exit /b %errorlevel% )

echo Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 ( echo Push failed & pause & exit /b %errorlevel% )
echo Done!
pause
