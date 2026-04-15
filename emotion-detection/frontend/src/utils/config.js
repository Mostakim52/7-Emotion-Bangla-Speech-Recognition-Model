const trimTrailingSlashes = (url) => url.replace(/\/+$/, '');

const API_BASE_URL = trimTrailingSlashes(
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
);

const GENERATE_BASE_URL = trimTrailingSlashes(
  import.meta.env.VITE_GENERATE_API_BASE_URL || API_BASE_URL
);

export const ENDPOINTS = {
  INCREMENTAL_TRAIN: `${API_BASE_URL}/incremental-train`,
  DETECT_EMOTION: `${API_BASE_URL}/detect-emotion`,
  SWITCH_MODEL: `${API_BASE_URL}/switch-model`,
  GENERATE: `${GENERATE_BASE_URL}/generate`,
};
