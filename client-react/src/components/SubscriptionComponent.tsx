import React, { useContext, useEffect, useState } from 'react'
import { WebSocketSubscription } from '../interfaces/WebSocketSubscription';
import { WebSocketContext } from '../contexts/WebSocketContext';
import { WebSocketMessage } from '../interfaces/WebSocketMessage';

interface Props {
    subscription: WebSocketSubscription;
}

export const SubscriptionComponent = ({ subscription }: Props) => {

    const { subscriptions } = useContext(WebSocketContext)

    const [messages, setMessages] = useState<WebSocketMessage[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');

    useEffect(() => {
        if (!isSubscribed(topic)) {
            subscribe(topic, (message) => {
                const newMessage: WebSocketMessage = {
                    date: new Date(),
                    message: message,
                }
                
                //console.log('Adding message to topic ' + topic, newMessage, messages)
                setMessages((messages) => [...messages, newMessage])
            })
        }
    }, [])

    return (<>

        <div style={{
            display: 'flex',
            flexDirection: 'column',
            scrollBehavior: 'smooth',
            border: '1px solid #ccc',
            height: '400px',
        
        }}>

            {/* Titulo */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 10px',
            }}>
                <h2>{topic}</h2>
                <button onClick={() => {
                    unsubscribe(topic);
                    onUnsubscribe(topic);
                }}>Desubscribirse</button>
            </div>

            {/* Mensajes */}
            <div style={{
                flex: 1,
                height: '100%',
                overflow: 'auto',
                padding: '0 10px',
            }}>
                <ul>
                    {
                        messages.map((m) => <li>{m.date.toLocaleString()} - {m.message}</li>)
                    }
                </ul>
            </div>

            {/* Envio */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 10px',
            }}>
                <input type="text" id="message" placeholder="Mensaje" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
                <button onClick={() => publish(topic, inputMessage)}>Publicar</button>
            </div>

        </div>
    </>)
}
