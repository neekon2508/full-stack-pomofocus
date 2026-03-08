package backend.common.exception;

import java.io.Serial;

import backend.common.constant.StatusCodeConstants;
import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException{

    @Serial
    private static final long serialVersionUID = 1L;
    private final String message;
    private final String statusCode;

    public BusinessException(String message, String statuscode) {
        this.message = message;
        this.statusCode = statuscode;
    }

    public BusinessException(String message) {
        this(message, StatusCodeConstants.FAIL);
    }

    public BusinessException(String message, Throwable cause) {
        this(message, StatusCodeConstants.FAIL, cause);
    }

    public BusinessException(String message, String statusCode, Throwable cause) {
        super(cause);
        this.message = message;
        this.statusCode = statusCode;
    }
}
