#!/bin/bash

# Simple React App Auto-Start Script (Node.js only)
APP_DIR="/home/pi/Desktop/emotion-detection"
SCREEN_NAME="react_app"
LOG_FILE="/home/pi/Desktop/emotion-detection/react_startup.log"

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log_message "Starting React app..."
sleep 30  # Wait for system boot

cd "$APP_DIR" || exit 1

# Kill existing screen session
screen -S "$SCREEN_NAME" -X quit 2>/dev/null || true

# Start React app in screen
screen -dmS "$SCREEN_NAME" bash -c "
    exec > >(tee -a /home/pi/react_app.log) 2>&1
    echo '=== React app starting - $(date) ==='
    cd '$APP_DIR'
    
    # Set React environment variables
    export HOST=0.0.0.0
    export PORT=3000
    
    echo 'Starting npm start...'
    npm start
"

log_message "React app started in screen session: $SCREEN_NAME"
