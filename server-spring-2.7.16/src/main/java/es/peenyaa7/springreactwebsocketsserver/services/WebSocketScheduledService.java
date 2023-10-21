package es.peenyaa7.springreactwebsocketsserver.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@EnableScheduling
public class WebSocketScheduledService {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Scheduled(fixedDelay = 5000)
    public void sendMessage() {
        final String message = "Hello from scheduled service!";
        System.out.println("Sending message: " + message + " to /topic/scheduled");
        simpMessagingTemplate.convertAndSend("/topic/scheduled", message);
    }

}
