package backend.auth.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import lombok.Builder;
import lombok.Data;

@Data
@RedisHash(value = "RefreshToken", timeToLive = 604800)
@Builder
public class RefreshToken {

    @Id
    private String userId;
    private String token;
    private LocalDateTime expiryDate;
}
