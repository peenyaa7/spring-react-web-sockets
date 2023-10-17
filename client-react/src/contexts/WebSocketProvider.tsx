import { useEffect, useState } from "react";
import { WebSocketContext } from "./WebSocketContext";
import { Client, over } from "stompjs";
import { WS_URL } from "../constants/WebSocketConstants";
import { WebSocketSubscription } from "../interfaces/WebSocketSubscription";
import SockJS from 'sockjs-client';

export const WebSocketProvider = ({ children }: any) => {

    const [socket, setSocket] = useState<Client>({} as Client)
    const [loading, setLoading] = useState<boolean>(false);
    const [subscriptions, setSubscriptions] = useState<WebSocketSubscription[]>([])

    useEffect(() => {
        console.log('SocketContext: subscriptions', subscriptions);
    }, [socket.subscriptions])

	const connect = () => {
        setLoading(true);
        const sock = new SockJS(WS_URL);
        const stompClient = over(sock);
        if (stompClient) {

            setSocket(stompClient);

            stompClient.connect({}, () => {
                console.log('SocketContext: Conectado a ' + WS_URL);
                setLoading(false);
            }, (error: any) => {
                console.log('SocketContext: Error: ' + error);
                setSubscriptions([]);
                setLoading(false);
            });
            
            sock.onclose = () => {
                console.log('SocketContext: Desconectado (inesperado)');
                setSubscriptions([]);
                setLoading(false);
            }

            stompClient.debug = () => { }; // Deshabilitamos los logs de stompjs            

        } else {
            console.warn('SocketContext: No se ha podido conectar a ' + WS_URL);
        }

    }

    const disconnect = () => {
        if (socket) {

            // Unsubscribe from all topics
            subscriptions.forEach(sub => socket.unsubscribe(sub.subId));

            socket.disconnect(() => {
                console.log('SocketContext: Desconectado (solicitado)');
                setSubscriptions([]);
                setLoading(false);
            });
        }
    }

    const subscribe = ( topic: string, callback: (message: string) => void ): string | null => {
        if (socket) {

            if (subscriptions.find(s => s.topic === topic)) {
                console.log('SocketContext: Ya está suscrito a ' + topic);
                return null;
            }

            const sub = socket.subscribe(topic, (message) => {
                callback(message.body);
            });
            setSubscriptions([...subscriptions, { subId: sub.id, topic: topic }]);
            return sub.id;
        }
        return null;
    }

    const unsubscribe = ( subId: string ) => {
        if (socket) {
            const sub = subscriptions.find(s => s.subId === subId);
            if (sub) {
                socket.unsubscribe(sub.subId);
                setSubscriptions(subscriptions.filter(s => s.subId !== subId));
            }
        }
    }

    const publish = ( topic: string, message: string ) => {
        if (socket) {
            socket.send(topic, {}, message);
        }
    }

    const isSubscribed = ( topic: string ) => {
        return subscriptions.find(s => s.topic === topic) !== undefined;
    }

    const onNewMessage = ( topic: string, message: string ) => {
        console.log('SocketContext: Nuevo mensaje en ' + topic, message);
        // TODO: Implementar watcher
    }

	return (
		// El 'value' es la información que exponemos a cualquier hijo
		<WebSocketContext.Provider value={{
			connected: socket.connected,
            loading: loading,
            subscriptions: subscriptions,
            connect: connect,
            disconnect: disconnect,
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            publish: publish,
            isSubscribed: isSubscribed,
            onNewMessage: onNewMessage,
		}}>
			{ children }
		</WebSocketContext.Provider>
	)
}