/**
 * Custom error class that carries an HTTP status code.
 * Use with `throw new ErrorWithStatus("message", 404)` to propagate
 * structured errors through Express's `next(error)` pipeline.
 */
class ErrorWithStatus extends Error {
    constructor(message, status = 500) {
        super(message);
        Error.captureStackTrace(this, this.constructor);

        this.name   = this.constructor.name;
        this.status = status;
    }

    statusCode() {
        return this.status;
    }
}

export default ErrorWithStatus;