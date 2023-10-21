import { useReducer, useState } from "react";
import { WebSocketContext } from "./WebSocketContext";
import { Client, Message, over } from "stompjs";
import { WS_URI } from "../constants/WebSocketConstants";
import SockJS from 'sockjs-client';
import { WebSocketState } from "../interfaces/WebSocketState";
import { webSocketReducer } from "./WebSocketReducer";

const defaultWebSocketState: WebSocketState = {
    subscriptions: [],
    connected: false,
}

export const WebSocketProvider = ({ children }: any) => {

    const [socketState, dispatch] = useReducer(webSocketReducer, defaultWebSocketState);

    const [socket, setSocket] = useState<Client>({} as Client)
    const [loading, setLoading] = useState<boolean>(false);

	const connect = () => {
        setLoading(true);
        const sock = new SockJS(WS_URI);
        const stompClient = over(sock);
        if (stompClient) {

            setSocket(stompClient);

            stompClient.connect({}, () => {
                dispatch({ type: 'CONNECT' });
                setLoading(false);
            }, (error: any) => {
                console.log('SocketContext: Error: ' + error);
                dispatch({ type: 'CLEAR_SUBS' });
                dispatch({ type: 'DISCONNECT' });
                setLoading(false);
            });
            
            sock.onclose = () => {
                dispatch({ type: 'CLEAR_SUBS' });
                dispatch({ type: 'DISCONNECT' });
                setLoading(false);
            }

            stompClient.debug = () => { }; // Deshabilitamos los logs de stompjs            

        } else {
            console.warn('SocketContext: No se ha podido conectar a ' + WS_URI);
        }

    }

    const disconnect = () => {
        if (socket) {

            // Unsubscribe from all topics
            socketState.subscriptions.forEach(sub => {
                socket.unsubscribe(sub.subId)
            });
            dispatch({ type: 'CLEAR_SUBS' });

            socket.disconnect(() => {
                dispatch({ type: 'DISCONNECT' });
                setLoading(false);
            });
        }
    }

    const subscribe = ( topic: string, callback: (message: Message) => void ): string | null => {
        if (socket) {

            const sub = socket.subscribe(topic, (message) => {
                callback(message);
            });
            dispatch({ type: 'ADD_SUB', topic: topic, subId: sub.id });
            return sub.id;
        }
        return null;
    }

    const unsubscribe = ( subId: string ) => {
        if (socket) {
            socket.unsubscribe(subId);
            dispatch({ type: 'REMOVE_SUB', subId: subId });
        }
    }

    const publish = ( topic: string, message: string ) => {
        if (socket) {
            socket.send(topic, {}, message);
        }
    }

	return (
		// El 'value' es la información que exponemos a cualquier hijo
		<WebSocketContext.Provider value={{
			socketState: socketState,
            loading: loading,
            connect: connect,
            disconnect: disconnect,
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            publish: publish,
		}}>
			{ children }
		</WebSocketContext.Provider>
	)
}