package backend.common.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import backend.annotation.ApiGroup;

@Configuration
public class SwaggerConfig {

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public")
                .pathsToMatch("/**")
                .build();
    }

    @Bean
    public GroupedOpenApi authenticationApi() {
        return GroupedOpenApi.builder()
                .group("Authentication API")
                .displayName("Authentication API")
                .addOpenApiMethodFilter(method -> hasApiGroup(method.getDeclaringClass(), "Authentication API"))
                .build();
    }

    private boolean hasApiGroup(Class<?> clazz, String groupName) {
        ApiGroup annotation = clazz.getAnnotation(ApiGroup.class);
        return annotation != null && annotation.value().equals(groupName);
    }
}
