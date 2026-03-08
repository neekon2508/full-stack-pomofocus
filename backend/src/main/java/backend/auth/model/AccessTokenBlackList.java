package backend.auth.model;

import org.springframework.data.redis.core.RedisHash;

import lombok.experimental.SuperBuilder;

@RedisHash(value = "at_blacklist")
@SuperBuilder
public class AccessTokenBlackList extends BaseToken {

}
