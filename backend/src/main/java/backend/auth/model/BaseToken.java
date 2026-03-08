package backend.auth.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.TimeToLive;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@SuperBuilder
public abstract class BaseToken {

    @Id
    private String id;

    private String token;

    @TimeToLive
    private Long expiration;
}
