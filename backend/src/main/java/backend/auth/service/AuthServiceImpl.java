package backend.auth.service;

import java.time.LocalDateTime;
import java.time.temporal.TemporalUnit;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import backend.auth.model.LoginRequestVO;
import backend.auth.model.LoginResponseVO;
import backend.auth.model.RefreshToken;
import backend.auth.repository.RefreshTokenRepository;
import backend.common.util.JwtUtil;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public LoginResponseVO login(LoginRequestVO login) {
        String userId = login.getUsername();
        String password = login.getPassword();

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userId, password));

        String accessToken = jwtUtil.generateAccessToken(userId);
        String refreshToken = jwtUtil.generateRefreshToken(userId);
        refreshTokenRepository.save(RefreshToken.builder()

                .userId(userId)
                .token(refreshToken)
                .expiryDate(LocalDateTime.now().plusSeconds(604800)).build());

        return LoginResponseVO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

}
