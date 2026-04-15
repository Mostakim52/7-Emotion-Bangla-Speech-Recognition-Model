import os
import random
import time
from typing import Optional, Tuple

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)


def _as_bool(value: str, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _configured_cors(app_obj: Flask) -> None:
    cors_origins = os.getenv("CORS_ORIGINS", "*")
    if cors_origins.strip() == "*":
        CORS(app_obj)
        return

    origin_list = [o.strip() for o in cors_origins.split(",") if o.strip()]
    CORS(app_obj, resources={r"/*": {"origins": origin_list}})


def _active_api_key() -> Tuple[Optional[str], str]:
    """Return configured key and provider name.

    Priority is OpenRouter -> OpenAI -> DeepSeek.
    """
    if os.getenv("OPENROUTER_API_KEY"):
        return os.getenv("OPENROUTER_API_KEY"), "openrouter"
    if os.getenv("OPENAI_API_KEY"):
        return os.getenv("OPENAI_API_KEY"), "openai"
    if os.getenv("DEEPSEEK_API_KEY"):
        return os.getenv("DEEPSEEK_API_KEY"), "deepseek"
    return None, "none"


def _build_headers(api_key: str) -> dict:
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    # Optional OpenRouter metadata.
    site_url = os.getenv("OPENROUTER_SITE_URL", "")
    site_name = os.getenv("OPENROUTER_SITE_NAME", "")
    if site_url:
        headers["HTTP-Referer"] = site_url
    if site_name:
        headers["X-Title"] = site_name

    return headers


def _build_prompt(user_message: str, emotion: str) -> str:
    if emotion:
        return (
            "Answer in Bangla. "
            f"ব্যবহারকারী বলেছেন: '{user_message}'। "
            f"ব্যবহারকারীর আবেগ সনাক্ত হয়েছে: {emotion}। "
            "এই আবেগ বিবেচনা করে ব্যবহারকারীর প্রতি সহানুভূতিশীল এবং সহায়ক প্রতিক্রিয়া দিন।"
        )

    return (
        "Answer in Bangla. "
        f"ব্যবহারকারী বলেছেন: '{user_message}'। "
        "ব্যবহারকারীর প্রতি সহানুভূতিশীল এবং সহায়ক প্রতিক্রিয়া দিন।"
    )


def generate_text_with_retries(prompt: str, timeout: int = 15, max_retries: int = 3) -> Tuple[Optional[str], Optional[str]]:
    api_key, provider = _active_api_key()
    if not api_key:
        return None, "No API key configured (OPENROUTER_API_KEY / OPENAI_API_KEY / DEEPSEEK_API_KEY)."

    base_url = os.getenv("LLM_API_BASE_URL", "https://openrouter.ai/api/v1").rstrip("/")
    model = os.getenv("LLM_MODEL", "z-ai/glm-4.5-air:free")

    headers = _build_headers(api_key)
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
    }

    connect_timeout = max(3, min(timeout, 10))
    read_timeout = max(5, timeout)

    for attempt in range(max_retries):
        try:
            if attempt > 0:
                delay = min(2 ** attempt + random.uniform(0, 1), 10)
                app.logger.info("Retrying LLM call in %.2fs", delay)
                time.sleep(delay)

            response = requests.post(
                url=f"{base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=(connect_timeout, read_timeout),
            )

            if response.status_code == 200:
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                return content, None

            if response.status_code in {500, 502, 503, 504} and attempt < max_retries - 1:
                app.logger.warning("Provider %s temporary server error %s", provider, response.status_code)
                continue

            if response.status_code == 429:
                return None, "Rate limited by provider"
            if response.status_code == 401:
                return None, "Authentication failed (invalid API key)"
            if response.status_code == 403:
                return None, "Access forbidden for selected model"

            details = response.text[:300] if response.text else ""
            return None, f"Provider error {response.status_code}: {details}"

        except requests.exceptions.Timeout:
            if attempt < max_retries - 1:
                continue
            return None, "LLM request timed out"
        except requests.exceptions.RequestException as exc:
            if attempt < max_retries - 1:
                continue
            return None, f"Network error: {exc}"
        except Exception as exc:  # Defensive guard for unexpected response shapes.
            return None, f"Unexpected generation error: {exc}"

    return None, "Max retries exceeded"


@app.route("/generate", methods=["POST"])
def generate_response():
    data = request.get_json(silent=True) or {}
    user_message = (data.get("message") or "").strip()
    emotion = (data.get("emotion") or "").strip()

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    prompt = _build_prompt(user_message, emotion)
    response_text, error = generate_text_with_retries(prompt, timeout=15, max_retries=3)

    if response_text:
        if emotion:
            response_text = f"(Emotion: {emotion})\n\n{response_text}"
        return jsonify({"response": response_text})

    return jsonify({"error": f"Failed to generate response: {error}"}), 502


@app.route("/health", methods=["GET"])
def health_check():
    _, provider = _active_api_key()
    return jsonify(
        {
            "status": "healthy",
            "provider": provider,
            "model": os.getenv("LLM_MODEL", "z-ai/glm-4.5-air:free"),
            "api_base_url": os.getenv("LLM_API_BASE_URL", "https://openrouter.ai/api/v1"),
        }
    )


_configured_cors(app)


if __name__ == "__main__":
    host = os.getenv("LLM_HOST", "0.0.0.0")
    port = int(os.getenv("LLM_PORT", "7000"))
    debug = _as_bool(os.getenv("LLM_DEBUG", "false"))

    enable_ssl = _as_bool(os.getenv("LLM_ENABLE_SSL", "false"))
    cert_path = os.getenv("SSL_CERT_PATH", "cert/cert.crt")
    key_path = os.getenv("SSL_KEY_PATH", "cert/cert.key")

    ssl_context = None
    if enable_ssl and os.path.exists(cert_path) and os.path.exists(key_path):
        ssl_context = (cert_path, key_path)
    elif enable_ssl:
        app.logger.warning("LLM_ENABLE_SSL=true but cert/key not found; starting without SSL")

    app.run(host=host, port=port, ssl_context=ssl_context, debug=debug)
