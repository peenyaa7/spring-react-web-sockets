package es.peenyaa7.springreactwebsocketsserver.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    
    @MessageMapping("/message") // app/message
    @SendTo("/topic/message") // topic/message
    public String message(String message) {
        System.out.println("Message: " + message);
        return message;
    }

}
