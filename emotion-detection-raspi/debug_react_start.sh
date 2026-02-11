#!/bin/bash

APP_DIR="/home/pi/Desktop/emotion-detection"
SCREEN_NAME="react_debug"

cd "$APP_DIR" || exit 1

# Kill existing session
screen -S "$SCREEN_NAME" -X quit 2>/dev/null || true

# Create screen with detailed logging
screen -dmS "$SCREEN_NAME" bash -c "
    exec > >(tee -a /home/pi/react_debug.log) 2>&1
    echo '=== React Debug Session - $(date) ==='
    cd '$APP_DIR'
    echo 'Current directory: $(pwd)'
    echo 'Node version: $(node --version)'
    echo 'NPM version: $(npm --version)'
    echo 'Checking package.json...'
    ls -la package.json
    echo 'Contents of package.json scripts:'
    cat package.json | grep -A 10 scripts
    
    # Set environment variables
    export HOST=0.0.0.0
    export PORT=3000
    export NODE_ENV=development
    export CI=false
    
    echo 'Environment variables set:'
    echo 'HOST: \$HOST'
    echo 'PORT: \$PORT'
    echo 'NODE_ENV: \$NODE_ENV'
    
    echo 'Attempting npm start...'
    npm start
    
    echo 'npm start exited with code: \$?'
    echo 'Session will stay open for 60 seconds for debugging...'
    sleep 60
"

echo "Debug screen created. Connect with: screen -r $SCREEN_NAME"
