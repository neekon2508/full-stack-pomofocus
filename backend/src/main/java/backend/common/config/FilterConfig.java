package backend.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class FilterConfig implements WebMvcConfigurer{

    //Protect XSS 
}
