@echo off
cd /d "%~dp0"
start "Harrow Preview" cmd /k py "%~dp0serve_preview.py" --open
if not defined NGROK_AUTHTOKEN (
    set /p NGROK_AUTHTOKEN=Enter ngrok auth token for public link (leave blank to skip): 
)
if defined NGROK_AUTHTOKEN (
    start "Harrow Public" cmd /k py "%~dp0serve_public.py" --open --authtoken "%NGROK_AUTHTOKEN%"
) else (
    echo No ngrok auth token provided. Public tunnel not started.
    pause
)
exit /b
