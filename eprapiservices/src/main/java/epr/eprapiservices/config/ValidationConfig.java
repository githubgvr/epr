package epr.eprapiservices.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.validation.beanvalidation.MethodValidationPostProcessor;

/**
 * Configuration for validation in the EPR Vault application.
 * Enables method-level validation and configures validation factory.
 */
@Configuration
public class ValidationConfig {

    /**
     * Bean for method validation.
     * Enables @Validated annotation on service classes.
     */
    @Bean
    public MethodValidationPostProcessor methodValidationPostProcessor() {
        return new MethodValidationPostProcessor();
    }

    /**
     * Local validator factory bean for custom validation messages.
     */
    @Bean
    public LocalValidatorFactoryBean validator() {
        return new LocalValidatorFactoryBean();
    }
}
