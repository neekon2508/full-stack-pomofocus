package backend.common.interceptor;

import java.util.Locale;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.util.ObjectUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.support.RequestContextUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

/***
 * @author neekon2508
 * @since 2026.03.12
 */
@Slf4j
@Getter
@Setter
public class LocaleInterceptor implements HandlerInterceptor{

    public static final String DEFAULT_PARAM_NAME = "locale";

    private String paramName = DEFAULT_PARAM_NAME;

    private String[] httpMethods;

    private boolean ignoreInvalidLocale = false;


    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

		String newLocale = request.getParameter(getParamName());
        if (newLocale != null) {
            if(newLocale.equals("en"))
                LocaleContextHolder.setLocale(new Locale("en", "US"));
            else if (newLocale.equals("vi"))
                LocaleContextHolder.setLocale(new Locale("vi", "VN"));
            if (checkHttpMethod(request.getMethod())) {
                LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);
                if (localeResolver == null)
                    throw new IllegalStateException("No LocaleResolver found: not in a DispatcherServlet request?");
            }
        }
        return true;

	}

    private boolean checkHttpMethod(String currentMethod) {
        String[] configuredMethods = getHttpMethods();
        if (ObjectUtils.isEmpty(configuredMethods)) return true;
        for (String configuredMethod : configuredMethods)
            if(configuredMethod.equalsIgnoreCase(currentMethod))
                return true;
        return false;
    }
    
}
