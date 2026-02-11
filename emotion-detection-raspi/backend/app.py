from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
import torch
import traceback
from model import load_model, extract_features, predict_emotion

app = Flask(__name__)
CORS(app)

# Update emotions to match the training data
EMOTIONS = [
    "Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"
]

# Load the model
model = load_model('bangla_emotion_model.pth')
model.eval()

@app.route('/detect-emotion', methods=['POST'])
def detect_emotion():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
        
    audio_file = request.files['audio']
    input_path = 'temp_input.webm'
    output_path = 'temp_output.wav'
    audio_file.save(input_path)
    
    try:
        # Convert webm to wav
        subprocess.run(['ffmpeg', '-y', '-i', input_path, output_path], check=True)
        
        # Extract features
        features = extract_features(output_path)
        if features is None:
            return jsonify({'error': 'Feature extraction failed'}), 500
        
        # Predict emotion
        prediction = predict_emotion(model, features)
        
        # Clean up files
        # os.remove(input_path)
        # os.remove(output_path)
        
        return jsonify({'emotion': prediction})
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', 
            port=5000, 
            ssl_context=('cert/cert.crt', 
                         'cert/cert.key'),
            debug=True)
