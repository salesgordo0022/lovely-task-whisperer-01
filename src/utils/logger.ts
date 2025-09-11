// Production-safe logging utility
export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data || '');
    }
  },
  
  warn: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[WARN] ${message}`, data || '');
    }
  },
  
  error: (message: string, error?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${message}`, error || '');
    } else {
      // In production, could send to error tracking service
      // Example: Sentry.captureException(error);
    }
  },
  
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
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