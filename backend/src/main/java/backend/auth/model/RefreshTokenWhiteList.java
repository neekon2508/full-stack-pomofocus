package backend.auth.model;

import org.springframework.data.redis.core.RedisHash;

import lombok.experimental.SuperBuilder;

@RedisHash(value = "rt_blacklist")
@SuperBuilder
public class RefreshTokenWhiteList extends BaseToken {

}
