package backend.common.filter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import backend.auth.repository.AccessTokenRepository;
import backend.auth.service.UserDetailsImpl;
import backend.common.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final AccessTokenRepository accessTokenRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();
        if (requestURI.startsWith("/swagger-ui") ||
                requestURI.startsWith("/api/swagger-ui") ||
                requestURI.startsWith("/v3/api-docs") ||
                requestURI.startsWith("/api/v3/api-docs") ||
                requestURI.startsWith("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            // 1. Check token format and signature
            if (jwtUtil.validateToken(token, false)) {
                // 2. Check BLACKLIST
                if (accessTokenRepository.existsById(token)) {
                    log.warn("Access denied: Token in blacklist");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
                Claims claims = jwtUtil.extractClaims(token, false);
                Long userId = claims.get("userId", Long.class);
                String username = claims.get("username", String.class);
                List<String> roles = jwtUtil.extractRoles(token);

                UserDetailsImpl userDetails = UserDetailsImpl.builder()
                                                    .userId(userId)
                                                    .username(username)
                                                    .roles(roles)
                                                    .build();
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, Collections.emptyList());
               
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else
                log.warn("Token expired or invalid");

        }
        filterChain.doFilter(request, response);

    }

}
