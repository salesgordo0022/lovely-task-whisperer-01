// Production-safe logging utility
const isDev = import.meta.env.DEV;

export const logger = {
  info: (message: string, data?: any) => {
    if (isDev) {
      console.log(`[INFO] ${message}`, data || '');
    }
  },
  
  warn: (message: string, data?: any) => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  },
  
  error: (message: string, error?: any) => {
    if (isDev) {
      console.error(`[ERROR] ${message}`, error || '');
    }
  },
  
  debug: (message: string, data?: any) => {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }
};

// Helper for API response logging
export const logApiResponse = (endpoint: string, success: boolean, data?: any) => {
  if (success) {
    logger.info(`API Success: ${endpoint}`);
  } else {
    logger.error(`API Error: ${endpoint}`, data);
  }
};
