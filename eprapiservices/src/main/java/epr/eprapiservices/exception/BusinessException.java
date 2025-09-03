package epr.eprapiservices.exception;

/**
 * Custom exception for business logic errors in the EPR Vault application.
 */
public class BusinessException extends RuntimeException {
    
    private final String errorCode;

    public BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public BusinessException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
