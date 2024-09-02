class ErrorHandler extends Error {
    public statusCode: number; // Use 'number' instead of 'Number'
  
    constructor(message: string, statusCode: number) { // Use 'string' and 'number' for types
      super(message);
      this.statusCode = statusCode;
  
      // Capture stack trace (optional but useful for debugging)
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export default ErrorHandler;
  