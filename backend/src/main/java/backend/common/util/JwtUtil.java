package backend.common.util;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtUtil {

    private final String accessSecret = "access-secret-key-access-secret-key";
    private final String refreshSecret = "refresh-secret-key-refresh-secret-key";

    private final long accessExp = 15 * 60 * 1000;
    private final long refreshExp = 7 * 24 * 60 * 60 * 1000;

    public String generateAccessToken(String userId) {
        return generateToken(userId, accessExp, accessSecret);
    }

    public String generateRefreshToken(String userId) {
        return generateToken(userId, refreshExp, refreshSecret);
    }

    public boolean validateToken(String token, boolean isRefresh) {
        try {
            String secret = isRefresh  ? refreshSecret : accessSecret;
            Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error(e.getMessage(),e);
            return false;
        }

    }

    private String generateToken(String userId, long exp, String secret) {
        LocalDateTime expiry = LocalDateTime.now().plus(Duration.ofMillis(exp));
        Date expiryDate = Date.from(expiry.atZone(ZoneId.systemDefault()).toInstant());
        
        return Jwts.builder()
                   .setSubject(userId)
                   .setIssuedAt(new Date())
                   .setExpiration(expiryDate)
                   .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
                   .compact();
    }

    public String extractUserId(String token, boolean isRefresh) {
        String secret = isRefresh ? refreshSecret : accessSecret;
        return Jwts.parserBuilder()
                   .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                   .build()
                   .parseClaimsJws(token)
                   .getBody()
                   .getSubject();
    }

    public long getFreshExp() {
        return refreshExp;
    }


}
