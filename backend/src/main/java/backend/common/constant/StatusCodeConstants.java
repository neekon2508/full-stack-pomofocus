package backend.common.constant;

import lombok.experimental.UtilityClass;

@UtilityClass
public class StatusCodeConstants {

    public static final String SUCCESS = "SUCCESS";
    public static final String FAIL = "FAIL";

    public static final String APPROVAL_EXCEPTION = "APPROVAL_EXCEPTION";
    public static final String MANDATORY_PARAM_ERROR = "MANDATORY_PARAM_ERROR";
    public static final String PARAMETER_VALUE_ERROR = "PARAMETER_VALUE_ERROR";
    public static final String DUPLICATED_VALUE_ERROR = "DUPLICATED_VALUE_ERROR";
    public static final String EXPECTATION_FAILED = "EXPECTATION_FAILED";
    public static final String INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";

    //Common
    public static final String DUPLICATE_KEY_EXCEPTION = "DUPLICATE_KEY_EXCEPTION";

    //Session
    public static final String USER_NOT_FOUND = "USER_NOT_FOUND";
    public static final String CONTINUOUS_LOGIN_FAILURE = "CONTINUOUS_LOGIN_FAILURE";
    public static final String LOGIN_LOCKED = "LOGIN_LOCKED";
    public static final String SESSION_EXPIRE = "SESSION_EXPIRE";
    public static final String NOT_AUTHORIZED_EXCEPTION = "NOT_AUTHORIZED_EXCEPTION";
    public static final String HAUSYS_LOGIN_NOT_ALLOWED = "HAUSYS_LOGIN_NOT_ALLOWED";
    public static final String NO_ROLE_ASSIGNED = "NO_ROLE_ASSIGNED";

    //Role
    public static final String DELETION_IMPOSSIBLE = "DELETION_IMPOSSIBLE";

    //Bbs
    public static final String NOT_EXIST_EXCEPTION = "NOT_EXIST_EXCEPTION";

    //FileUpload
    public static final String FILE_UPLOAD_FAILED = "FILE_UPLOAD_FAILED";
    public static final String FILE_DOWNLOAD_FAILED = "FILE_DOWNLOAD_FAILED";

    //TranslatedMessage
    public static final String MESSAGE_DEPLOY_FAILED = "MESSAGE_DEPLOY_FAILED";
    public static final String MESSAGE_READ_FAILED = "MESSAGE_READ_FAILED";

    //XSS
    public static final String XSS_FORBIDDEN_STRING_INCLUDE = "XSS_FORBIDDEN_STRING_INCLUDE";
}
