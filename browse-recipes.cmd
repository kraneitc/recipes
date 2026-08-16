@echo off
setlocal

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0browse-recipes.ps1"

if errorlevel 1 (
  echo.
  echo The recipe preview could not be started. Review the message above.
  echo Press any key to close this window.
  pause >nul
)

