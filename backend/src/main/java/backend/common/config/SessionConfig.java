package backend.common.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile({"default", "dev"})
@ConditionalOnProperty(name = "spring.session.store-type", havingValue = "none", matchIfMissing = true)
public class SessionConfig {
    
}
