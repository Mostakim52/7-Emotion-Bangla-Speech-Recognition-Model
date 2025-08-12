from flask import Flask, request, jsonify
import requests
import json
from flask_cors import CORS
import threading
import time
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration for the LLM 
API_KEY = "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"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "<YOUR_SITE_URL>",
    "X-Title": "<YOUR_SITE_NAME>"
}

saved_emotion = None

# Text generation function with retries and exponential backoff
def generate_text_with_retries(prompt, timeout=15, max_retries=3):
    for attempt in range(max_retries):
        try:
            print(f"Attempt {attempt + 1} of {max_retries} to generate text...")
            
            # Add a small delay before retrying (except for the first attempt)
            if attempt > 0:
                # Exponential backoff with jitter to avoid thundering herd
                delay = min(2 ** attempt + random.uniform(0, 1), 10)
                print(f"Waiting {delay:.2f} seconds before retrying...")
                time.sleep(delay)
            
            response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers=HEADERS,
                data=json.dumps({
                    "model": "deepseek/deepseek-chat-v3-0324:free",
                    "messages": [{"role": "user", "content": prompt}]
                }),
                timeout=(5, 10)  # 5 seconds to connect, 10 seconds to read
            )
            
            if response.status_code == 200:
                print("Successfully received response")
                return response.json()['choices'][0]['message']['content'], None
            elif response.status_code == 500:
                print(f"Server error (500) on attempt {attempt + 1}")
                if attempt < max_retries - 1:
                    print("Retrying due to server error...")
                    continue
                else:
                    return None, f"Server error after {max_retries} attempts"
            elif response.status_code == 429:
                print("Rate limited (429)")
                return None, "Rate limited by the API"
            elif response.status_code == 401:
                print("Authentication error (401)")
                return None, "Authentication failed"
            elif response.status_code == 403:
                print("Forbidden (403)")
                return None, "Access forbidden"
            else:
                print(f"API Error: {response.status_code} - {response.text}")
                if attempt < max_retries - 1:
                    print("Retrying due to API error...")
                    continue
                else:
                    return None, f"API Error: {response.status_code}"
        except requests.exceptions.Timeout:
            print(f"Timeout on attempt {attempt + 1}")
            if attempt < max_retries - 1:
                print("Retrying due to timeout...")
                continue
            else:
                return None, "Request timed out after multiple attempts"
        except requests.exceptions.RequestException as e:
            print(f"Request exception on attempt {attempt + 1}: {str(e)}")
            if attempt < max_retries - 1:
                print("Retrying due to request exception...")
                continue
            else:
                return None, f"Request exception: {str(e)}"
    
    return None, "Max retries exceeded"

@app.route('/generate', methods=['POST'])
def generate_response():
    data = request.json
    user_message = data.get('message', '')
    emotion = data.get('emotion', '')
    print("Received data:", data)
    print("Emotion detected:", emotion)
    
    global saved_emotion
    saved_emotion = emotion
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    
    # Create a prompt that includes the user's message and detected emotion
    if emotion:
        prompt = f"Answer in Bangla. ব্যবহারকারী বলেছেন: '{user_message}'। ব্যবহারকারীর আবেগ সনাক্ত হয়েছে: {emotion}। এই আবেগ বিবেচনা করে ব্যবহারকারীর প্রতি সহানুভূতিশীল এবং সহায়ক প্রতিক্রিয়া দিন।"
        print("Prompt with emotion:", prompt)
    else:
        prompt = f"ব্যবহারকারী বলেছেন: '{user_message}'। ব্যবহারকারীর প্রতি সহানুভূতিশীল এবং সহায়ক প্রতিক্রিয়া দিন।"
    
    print("Generated prompt:", prompt)
    
    # Try to generate text with retries
    response_text, error = generate_text_with_retries(prompt, timeout=15, max_retries=3)
    
    if response_text:
        emotion_prefix = f"(Emotion: {saved_emotion})\n\n"
        response_text = emotion_prefix + response_text
        print("Generated response:", response_text)
        return jsonify({"response": response_text})
    else:
        print("Error generating response:", error)
        return jsonify({"error": f"Failed to generate response: {error}"}), 500

# Add a health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', 
            port=7000,
            ssl_context=('cert/cert.crt', 
                         'cert/cert.key'),
            debug=True)