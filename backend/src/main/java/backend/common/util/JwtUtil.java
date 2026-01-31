package backend.common.util;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@Getter
public class JwtUtil {

    @Value("${jwt.access-token-secret-key}")
    private String accessSecret;

    @Value("${jwt.refresh-token-secret-key}")
    private String refreshSecret;

    @Value("${jwt.access-token-expiration-time}")
    private long accessExp;

    @Value("${jwt.refresh-token-expiration-time}")
    private long refreshExp;

    public String generateAccessToken(String userId) {
        return generateToken(userId, accessExp * 1000, accessSecret);
    }

    public String generateRefreshToken(String userId) {
        return generateToken(userId, refreshExp * 1000, refreshSecret);
    }

    public boolean validateToken(String token, boolean isRefresh) {
        try {
            String secret = isRefresh ? refreshSecret : accessSecret;
            Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error(e.getMessage(), e);
            return false;
        }

    }

    private String generateToken(String username, long exp, String secret) {
        LocalDateTime expiry = LocalDateTime.now().plus(Duration.ofMillis(exp));
        Date expiryDate = Date.from(expiry.atZone(ZoneId.systemDefault()).toInstant());

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token, boolean isRefresh) {
        String secret = isRefresh ? refreshSecret : accessSecret;
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public long getReaminingTime(String token, boolean isRefresh) {
        try {
            String secret = isRefresh ? refreshSecret : accessSecret;
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return Math.max(0, (claims.getExpiration().getTime() - System.currentTimeMillis()) / 1000);
        } catch (Exception e) {
            return 0;
        }

    }
}
