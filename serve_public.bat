@echo off
cd /d "%~dp0"
if not defined NGROK_AUTHTOKEN (
    set /p NGROK_AUTHTOKEN=Enter ngrok auth token: 
)
if defined NGROK_AUTHTOKEN (
    py "%~dp0serve_public.py" --open --authtoken "%NGROK_AUTHTOKEN%"
) else (
    echo No ngrok auth token provided. Public tunnel will not start.
    pause
)
