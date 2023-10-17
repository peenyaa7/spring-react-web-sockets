package es.peenyaa7.springreactwebsocketsserver.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {

        /**
         * Habilitamos el endpoint /ws para que los clientes se conecten a él.
         * El método withSockJS() permite que el endpoint sea accesible por clientes que no soportan WebSockets.
         */

		registry
            .addEndpoint("/ws")
            .setAllowedOriginPatterns("*")
            .withSockJS();
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {

        /**
         * Habilitamos el prefijo /app para que todos los mensajes que se envíen a través
         * de este prefijo sean enrutados al método anotado con @MessageMapping.
         */
        config.setApplicationDestinationPrefixes("/app"); 

        /**
         * Habilitamos un simple broker en memoria para que los clientes puedan suscribirse a los mensajes.
         */
		config.enableSimpleBroker("/topic", "/queue"); 
	}
}
