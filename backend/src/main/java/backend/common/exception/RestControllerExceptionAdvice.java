package backend.common.exception;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import backend.common.constant.CommonConstants;
import backend.common.constant.StatusCodeConstants;
import backend.common.model.CommonResponseVO;
import lombok.extern.slf4j.Slf4j;

import jakarta.validation.ConstraintViolationException;

@Slf4j
@RestControllerAdvice
public class RestControllerExceptionAdvice {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<CommonResponseVO<?>> customBusinessExceptionHandler(BusinessException e) {
        log.error("[customBusinessExceptionHandler]" + e.getMessage(), e);

        return new ResponseEntity<>(CommonResponseVO.builder()
                .successOrNot(CommonConstants.NO_FLAG)
                .statusCode(e.getStatusCode())
                .data("EXCEPTION")
                .build(), HttpStatus.OK);
    }

    @ExceptionHandler({
            ConstraintViolationException.class,
            MethodArgumentTypeMismatchException.class,
            HttpMessageNotReadableException.class
    })
    public ResponseEntity<CommonResponseVO<?>> constraintViolationExceptionHandler(Exception e) {
        log.warn("[constraintViolationExceptionHandler]" + e.getMessage());

        return new ResponseEntity<>(CommonResponseVO.builder()
                .successOrNot(CommonConstants.NO_FLAG)
                .statusCode(StatusCodeConstants.PARAMETER_VALUE_ERROR)
                .data("EXCEPTION")
                .build(), HttpStatus.OK);
    }

    @ExceptionHandler({
            MissingServletRequestParameterException.class,
    })
    public ResponseEntity<CommonResponseVO<?>> missingServletRequestParameterExceptionHandler(Exception e) {
        log.error("[missingServletRequestParameterExceptionHandler]" + e.getMessage(), e);

        return new ResponseEntity<>(CommonResponseVO.builder()
                .successOrNot(CommonConstants.NO_FLAG)
                .statusCode(StatusCodeConstants.MANDATORY_PARAM_ERROR)
                .build(), HttpStatus.OK);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CommonResponseVO<?>> parameterValidationExceptionHandler(MethodArgumentNotValidException e) {
        log.debug("[parameterValidationExceptionHandler] " + e.getMessage(), e);

        StringBuilder mandatoryParameterStringBuilder = new StringBuilder();
        List<FieldError> fieldErrors = e.getBindingResult().getFieldErrors();
        for (int i = 0; i < fieldErrors.size();) {

            mandatoryParameterStringBuilder.append(fieldErrors.get(i).getField());

            if (++i < fieldErrors.size())
                mandatoryParameterStringBuilder.append(",");
        }
        return new ResponseEntity<>(CommonResponseVO.builder()
                .successOrNot(CommonConstants.NO_FLAG)
                .statusCode(StatusCodeConstants.MANDATORY_PARAM_ERROR)
                .data(mandatoryParameterStringBuilder.toString())
                .build(), HttpStatus.OK);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponseVO<?>> customExceptionHandler(Exception e) {
        log.error("[customExceptionHandler]" + e.getMessage(), e);
        return new ResponseEntity<>(CommonResponseVO.builder()
                .successOrNot(CommonConstants.NO_FLAG)
                .statusCode(StatusCodeConstants.INTERNAL_SERVER_ERROR)
                .build(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
