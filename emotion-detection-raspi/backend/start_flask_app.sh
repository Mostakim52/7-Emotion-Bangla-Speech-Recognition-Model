#!/bin/bash

# Flask App Auto-Start Script
# Activates virtual environment and runs Flask app in screen session

# Configuration
APP_DIR="/home/pi/Desktop/emotion-detection/backend"
VENV_DIR="$APP_DIR/flask_audio_env"
APP_FILE="app.py"
SCREEN_NAME="flask_app"
USER="pi"
LOG_FILE="/home/pi/flask_app_startup.log"

# Logging function
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log_message "Starting Flask app startup script..."

# Wait for system to fully boot (important for WiFi/network)
sleep 30
log_message "Boot wait completed, starting Flask app setup..."

# Change to pi user if running as root
if [ "$EUID" -eq 0 ]; then
    log_message "Running as root, switching to user: $USER"
    sudo -u "$USER" -H bash << EOF
    cd "$APP_DIR" || exit 1
    
    # Check if virtual environment exists
    if [ ! -d "$VENV_DIR" ]; then
        echo "Virtual environment not found at: $VENV_DIR" >> "$LOG_FILE"
        exit 1
    fi
    
    # Check if Flask app exists
    if [ ! -f "$APP_FILE" ]; then
        echo "Flask app not found at: $APP_DIR/$APP_FILE" >> "$LOG_FILE"
        exit 1
    fi
    
    # Kill any existing screen session with same name
    screen -S "$SCREEN_NAME" -X quit 2>/dev/null || true
    
    # Start new screen session with Flask app
    screen -dmS "$SCREEN_NAME" bash -c "
        source '$VENV_DIR/bin/activate' && 
        echo 'Virtual environment activated' && 
        echo 'Starting Flask application...' && 
        python '$APP_FILE' 2>&1 | tee -a /home/pi/flask_app.log
    "
    
    echo "Flask app started in screen session: $SCREEN_NAME" >> "$LOG_FILE"
EOF
else
    # Running as pi user directly
    cd "$APP_DIR" || exit 1
    
    # Check if virtual environment exists
    if [ ! -d "$VENV_DIR" ]; then
        log_message "Virtual environment not found at: $VENV_DIR"
        exit 1
    fi
    
    # Check if Flask app exists
    if [ ! -f "$APP_FILE" ]; then
        log_message "Flask app not found at: $APP_DIR/$APP_FILE"
        exit 1
    fi
    
    # Kill any existing screen session with same name
    screen -S "$SCREEN_NAME" -X quit 2>/dev/null || true
    
    # Start new screen session with Flask app
    screen -dmS "$SCREEN_NAME" bash -c "
        source '$VENV_DIR/bin/activate' && 
        echo 'Virtual environment activated' && 
        echo 'Starting Flask application...' && 
        python '$APP_FILE' 2>&1 | tee -a /home/pi/flask_app.log
    "
    
    log_message "Flask app started in screen session: $SCREEN_NAME"
fi

log_message "Flask app startup script completed"
