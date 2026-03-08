package backend.common.interceptor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.security.core.GrantedAuthority;
import backend.api.service.SysApiService;
import backend.common.constant.CommonConstants;
import backend.common.constant.StatusCodeConstants;
import backend.common.model.CommonResponseVO;
import backend.common.util.ValidateUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class AuthorizationInterceptor implements HandlerInterceptor{

    private final SysApiService sysApiService;
    private final ObjectMapper objectMapper;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String uurl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getRequestURI();
        String apiUrl = request.getRequestURI();
        String httpMethodCode = request.getMethod();

        List<String> roleCodes = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        log.debug("User roles extracted from JWT: {}", roleCodes);

        if (ValidateUtil.isEmpty(roleCodes)
            || !sysApiService.checkAccessibleApiUrlByRoleCodes(apiUrl, httpMethodCode, roleCodes)) {
            log.error("Inaccessible Api, Access url is " + uurl);
            responseWriter(request, response, StatusCodeConstants.NOT_AUTHORIZED_EXCEPTION);
            return false;
        }
        return true;
    }

    private void responseWriter(HttpServletRequest request, HttpServletResponse response, String statusCode) throws Exception{
        CommonResponseVO<Object> responseBody = CommonResponseVO.builder()
                                                    .successOrNot(CommonConstants.NO_FLAG)
                                                    .statusCode(statusCode)
                                                    .data("Exception")
                                                    .build();
        String json = objectMapper.writeValueAsString(responseBody);

        String origin = request.getHeader("Origin");
        if (origin != null) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
        }

        response.setStatus(200); // 200으로 처리
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(json);
        response.getWriter().flush();
        response.getWriter().close();
    }
}
