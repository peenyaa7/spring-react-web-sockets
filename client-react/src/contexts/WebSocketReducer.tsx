import { WebSocketState } from "../interfaces/WebSocketState";

type WebSocketAction =
| { type: 'CONNECT' }
| { type: 'DISCONNECT' }
| { type: 'ADD_SUB', topic: string, subId: string }
| { type: 'REMOVE_SUB', subId: string }
| { type: 'CLEAR_SUBS' }

// Es importante que retorne SIEMPRE un User
export const webSocketReducer = (state: WebSocketState, action: WebSocketAction): WebSocketState => {
	
	switch (action.type) {
        case 'CONNECT':
            if (state.connected) {
                console.log('SocketContext: Ya está conectado');
                return state;
            } else {
                console.log('SocketContext: Conectado');
                return {
                    ...state,
                    connected: true
                }
            }
        case 'DISCONNECT':
            if (!state.connected) {
                console.log('SocketContext: Ya está desconectado');
                return state;
            } else {
                console.log('SocketContext: Desconectado');
                return {
                    ...state,
                    connected: false
                }
            }
		case 'ADD_SUB':
            const subToAdd = state.subscriptions.find(s => s.subId === action.subId);
            if (subToAdd) {
                console.log('SocketContext: Ya está suscrito a ' + action.topic);
                return state;
            } else {
                console.log('SocketContext: Suscrito a ' + action.topic + ' (' + action.subId + ')');
                return {
                    ...state,
                    subscriptions: [...state.subscriptions, { subId: action.subId, topic: action.topic }]
                }
            }

		case 'REMOVE_SUB':
            const subToRemove = state.subscriptions.find(s => s.subId === action.subId);
            if (!subToRemove) {
                console.log('SocketContext: No está suscrito a ' + action.subId);
                return state;
            } else {
                console.log('SocketContext: Desuscrito de ' + subToRemove.topic + ' (' + action.subId + ')');
                return {
                    ...state,
                    subscriptions: state.subscriptions.filter(s => s.subId !== action.subId)
                }
            }
        case 'CLEAR_SUBS':
            const subs = state.subscriptions;
            console.log('SocketContext: Desuscrito de ' + subs.length + ' topics:');
            console.table([...subs]);
            return {
                ...state,
                subscriptions: []
            }
		default:
			return state
	}

}