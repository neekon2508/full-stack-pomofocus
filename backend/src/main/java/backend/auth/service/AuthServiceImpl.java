package backend.auth.service;

import java.time.Duration;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import backend.auth.model.AccessTokenBlackList;
import backend.auth.model.LoginRequestVO;
import backend.auth.model.LoginResponseVO;
import backend.auth.model.RefreshTokenWhiteList;
import backend.auth.repository.AccessTokenRepository;
import backend.auth.repository.RefreshTokenRepository;
import backend.common.exception.BusinessException;
import backend.common.util.JwtUtil;
import backend.common.util.RequestUtil;
import backend.common.util.SecurityUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

        private final AuthenticationManager authenticationManager;
        private final JwtUtil jwtUtil;
        private final RequestUtil requestUtil;
        private final RefreshTokenRepository refreshTokenRepository;
        private final AccessTokenRepository accessTokenRepository;

        @Override
        public LoginResponseVO login(LoginRequestVO login, HttpServletResponse response) {
                String username = login.getUsername();
                String password = login.getPassword();

                UserDetailsImpl user = (UserDetailsImpl) authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password)).getPrincipal();

                return generateTokens(user, response);
        }

        @Override
        public LoginResponseVO refresh(HttpServletRequest request, HttpServletResponse response) {
                String accessToken = requestUtil.getAccessToken(request);
                String refreshCookie = requestUtil.getCookieValue(request, requestUtil.getRefreshCookie());
                Optional<RefreshTokenWhiteList> rt = refreshTokenRepository.findById(refreshCookie);
                if (rt.isEmpty())
                        throw new BusinessException("Khong tim thay Refresh Token");
                accessTokenRepository.save(
                                AccessTokenBlackList.builder()
                                                .id(accessToken)
                                                .token("REFRESH")
                                                .expiration(jwtUtil.getReaminingTime(accessToken, false))
                                                .build()
                                   );

                UserDetailsImpl user = SecurityUtil.getUserDetails();

                return generateTokens(user, response);

        }

        @Override
        public String logout(HttpServletRequest request) {
                String accessToken = requestUtil.getAccessToken(request);

                UserDetailsImpl user = SecurityUtil.getUserDetails();
                refreshTokenRepository.deleteById(user.getUsername());

                long remainTime = jwtUtil.getReaminingTime(accessToken, false);
                if (remainTime > 0) {
                        accessTokenRepository.save(
                                        AccessTokenBlackList.builder()
                                                        .id(accessToken)
                                                        .token("LOGOUT")
                                                        .expiration(remainTime)
                                                        .build());
                }
                log.warn("User {} logout successfully", user.getUsername());
                return "Log out";
        }

        private LoginResponseVO generateTokens(UserDetailsImpl user, HttpServletResponse response) {
                String accessToken = jwtUtil.generateAccessToken(user.getUserId(), 
                user.getUsername(), user.getFullname(), user.getEmail(), user.getRoles());
                String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
                refreshTokenRepository.save(RefreshTokenWhiteList.builder()
                                .id(user.getUsername())
                                .token(refreshToken)
                                .expiration(jwtUtil.getRefreshExp()).build());

                ResponseCookie cookie = ResponseCookie.from("POMOFOCUS_REFRESH-TOKEN", refreshToken)
                                .httpOnly(true)
                                .secure(true)
                                .path("/")
                                .maxAge(Duration.ofSeconds((jwtUtil.getRefreshExp())))
                                .sameSite("Lax")
                                .build();

                response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

                return LoginResponseVO.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken)
                                .build();

        }

}
