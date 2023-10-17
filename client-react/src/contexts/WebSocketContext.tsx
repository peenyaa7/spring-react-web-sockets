import { createContext } from "react";
import { WebSocketSubscription } from "../interfaces/WebSocketSubscription";

// Definimos que información va a exponer el contexto
export interface WebSocketContextProps {
    connected: boolean;
    loading: boolean;
    subscriptions: WebSocketSubscription[];
    connect: () => void;
    disconnect: () => void;
    subscribe: ( topic: string, callback: (message: string) => void ) => void;
    unsubscribe: ( topic: string ) => void;
    publish: ( topic: string, message: string ) => void;
    isSubscribed: ( topic: string ) => boolean;
    onNewMessage: ( topic: string, message: string ) => void;
}

// Creamos el contexto con la información anterior
export const WebSocketContext = createContext( {} as WebSocketContextProps );