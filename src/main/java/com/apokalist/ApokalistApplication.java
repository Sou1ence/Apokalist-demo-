package com.apokalist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Main class of this beautiful mess
 * Bootstraps the whole Spring Boot circus and enables CORS
 * so the frontend doesn’t throw a tantrum every time it makes a request.
 */
@SpringBootApplication
public class ApokalistApplication {

    /**
     * Entry point into the abyss
     */
    public static void main(String[] args) {
        SpringApplication.run(ApokalistApplication.class, args);
    }

    /**
     * CORS config that basically opens the gates of hell to everyone (in this case)
     * Yes, it's wide open. No, I dont care right now.
     *
     * @return WebMvcConfigurer with CORS unlocked for the whole damn world
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*") // let's not discriminate, shall we?
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");
            }
        };
    }
}
