package com.javarush.jira;

import com.javarush.jira.common.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
@EnableCaching
public class JiraRushApplication {
//TODO  vk and yandex deleted everywhere
    public static void main(String[] args) {
        SpringApplication.run(JiraRushApplication.class, args);
    }
}
