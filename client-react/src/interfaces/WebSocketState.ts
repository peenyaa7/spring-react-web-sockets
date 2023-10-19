import { WebSocketSubscription } from "./WebSocketSubscription";

export interface WebSocketState {
    connected: boolean;
    subscriptions: WebSocketSubscription[];
}