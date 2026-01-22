package backend.common.filter;

import java.io.IOException;
import java.net.URL;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@Order(1)
public class SessionCookieFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String origin = httpRequest.getHeader("Origin");
        boolean isCorsRequest = origin != null && !origin.isEmpty() &&
            !origin.startsWith("http://localhost") &&
            !origin.matches("http://127\\.0\\.0\\.1.*");

        //request go to another filter then Controller
        chain.doFilter(request, response);

        //Response go back to this filter 
        //true: if having session, get it, otherwise creating new session
        //false: if having session, get it, otherwise return null
        HttpSession session = httpRequest.getSession(false);
        if (session != null && isCorsRequest) {
            try {
                URL originUrl = new URL(origin);
                String cookieDomain = extractCookieDomain(originUrl.getHost());

                Cookie existingCookie = null;
                Cookie[] cookies = httpRequest.getCookies();
                if (cookies != null) {
                    for (Cookie cookie : cookies) {
                        if ("JSESSIONID".equals(cookie.getName())) {
                            existingCookie = cookie;
                            break;
                        }
                    }
                }

                if (existingCookie != null) {
                    Cookie newCookie = new Cookie("JSESSIONID", existingCookie.getValue());
                    if (cookieDomain != null) {
                        newCookie.setDomain(cookieDomain);
                    }
                    newCookie.setPath("/");
                    newCookie.setHttpOnly(true);
                    newCookie.setSecure(false); 
                    newCookie.setMaxAge(-1);

                    try {
                        StringBuilder cookieValue = new StringBuilder();
                        cookieValue.append(newCookie.getName()).append("=").append(newCookie.getValue());
                        cookieValue.append("; Path=").append(newCookie.getPath());
                        if (cookieDomain != null) {
                            cookieValue.append("; Domain=").append(cookieDomain);
                        }
                        cookieValue.append("; HttpOnly");
                        cookieValue.append("; SameSite=Lax");

                        httpResponse.setHeader("Set-Cookie", cookieValue.toString());
                        log.debug("Session cookie reset with domain: {}, SameSite=Lax", cookieDomain);
                    } catch (Exception e) {
                        httpResponse.addCookie(newCookie);
                        log.debug("Session cookie added with domain: {}", cookieDomain);
                    }
                }
            } catch (Exception e) {
                log.debug("Failed to process session cookie for Origin: {}", origin, e);
            }
        }
    }

    private String extractCookieDomain(String host) {
        if (host == null || host.isEmpty()) {
            return null;
        }

        if (host.equals("localhost") || host.startsWith("127.0.0.1") || host.matches("^\\d+\\.\\d+\\.\\d+\\.\\d+$")) {
            return null;
        }

        if (host.contains(".")) {
            String[] parts = host.split("\\.");
            if (parts.length >= 2) {
                return "." + parts[parts.length - 2] + "." + parts[parts.length - 1];
            }
        }

        return null;
    }
}
