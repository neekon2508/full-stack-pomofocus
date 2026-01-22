package backend.common.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class InterceptorConfig implements WebMvcConfigurer{

    @Value("${interceptor.authentication.exclude-paths}")
    private List<String> authenticationExcludePaths;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        List<String> urlPatterns = Arrays.asList("/**");
    }
}
