package backend.common.config;

import javax.sql.DataSource;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.zaxxer.hikari.HikariDataSource;

import lombok.RequiredArgsConstructor;

@Configuration
@MapperScan(
    basePackages = {"backend"},
    sqlSessionFactoryRef = "primarySessionFactory",
    annotationClass = Mapper.class
)
@RequiredArgsConstructor
// @ConditionalOnExpression("!T(org.springframework.util.StringUtils).isEmpty('${spring.datasource.primary.jdbc-url:}')")
public class DataSourceConfig {

    private final ApplicationContext applicationContext;

    @Value("${mybatis.mapper-locations.primary}")
    private String mapperLocations;

    @Value("${mybatis.type-aliases-package}")
    private String typeAliasesPackage;

    @Primary
    @Bean(name = "primaryDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.primary")
    public DataSource primaryDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Bean(name = "primarySessionFactory")
    @Primary
    public SqlSessionFactory primSessionFactory(@Qualifier("primaryDataSource") DataSource priDataSource) throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(priDataSource);
        sqlSessionFactoryBean.setConfigLocation(applicationContext.getResource("classpath:config/mybatis.xml"));
        sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources(mapperLocations));
        sqlSessionFactoryBean.setTypeAliasesPackage(typeAliasesPackage);

        return sqlSessionFactoryBean.getObject();
    }

    @Primary
    @Bean(name = "primarySessionTemplate")
    public SqlSessionTemplate prSessionTemplate(SqlSessionFactory primarySessionFactory) throws Exception {
        return new SqlSessionTemplate(primarySessionFactory);
    }
}
