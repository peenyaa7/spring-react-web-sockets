import { createContext } from "react";
import { Message } from "stompjs";
import { WebSocketState } from "../interfaces/WebSocketState";

// Definimos que información va a exponer el contexto
export interface WebSocketContextProps {
    socketState: WebSocketState;
    loading: boolean;
    connect: () => void;
    disconnect: () => void;
    subscribe: ( topic: string, callback: (message: Message) => void ) => string | null;
    unsubscribe: ( subId: string ) => void;
    publish: ( topic: string, message: string ) => void;
}

// Creamos el contexto con la información anterior
export const WebSocketContext = createContext( {} as WebSocketContextProps );