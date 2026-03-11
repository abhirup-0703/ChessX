package com.chessx.logic.infrastructure.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Responses sent BACK to the frontend will have this prefix
        config.enableSimpleBroker("/topic");
        
        // Messages sent FROM the frontend will have this prefix
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This is the endpoint Next.js will use to establish the initial connection
        registry.addEndpoint("/ws-game")
                .setAllowedOrigins("http://localhost:3000") // Allow Next.js
                .withSockJS(); // Fallback for older browsers
    }
}