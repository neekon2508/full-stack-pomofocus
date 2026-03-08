package backend.common.config;

import org.apache.catalina.Wrapper;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TomCatConfig {

    // Disable JSP files Process of Server Tomcat

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcaCustomizer() {
        return factory -> {
            factory.addContextCustomizers(context -> {
                try {
                    Wrapper jspServlet = (Wrapper) context.findChild("jsp");
                    if (jspServlet != null)
                        context.removeChild(jspServlet);
                    String[] jspMappings = context.findServletMappings();
                    if (jspMappings != null)
                        for (String mapping : jspMappings)
                            if (mapping.endsWith(".jsp") || mapping.endsWith(".jspx"))
                                context.removeServletMapping(mapping);
                } catch (Exception e) {

                }
            });
        };
    }
}
