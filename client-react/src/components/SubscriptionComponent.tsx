import { useContext, useEffect, useState } from 'react'
import { WebSocketContext } from '../contexts/WebSocketContext';
import { WebSocketMessage } from '../interfaces/WebSocketMessage';
import styles from './SubscriptionComponent.module.css'

interface Props {
    topic: string;
    onRemove: () => void;
}

export const SubscriptionComponent = ({ topic: topicToSubscribe, onRemove }: Props) => {

    const { subscribe, unsubscribe, publish } = useContext(WebSocketContext)

    const [messages, setMessages] = useState<WebSocketMessage[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [subId, setSubId] = useState<string | null>(null);

    useEffect(() => {
        const subId = subscribe(topicToSubscribe, (message) => {
            const newMessage: WebSocketMessage = {
                date: new Date(),
                message: `${message.body}`,
            }
            //console.log('Adding message to topic ' + topic, newMessage, messages)
            setMessages((messages) => [...messages, newMessage])
        })
        setSubId(subId);

        return () => {
            if (subId)
                unsubscribe(subId);
        }

    }, [])

    useEffect(() => {
        // Scroll to bottom when new message arrives
        const messagesDiv = document.getElementById('messages');
        if (messagesDiv) {
            if (messagesDiv.scrollHeight - messagesDiv.scrollTop < 500) {
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }
        }
    }, [messages])

    return (<>

        <div className={styles.rootContainer}>

            {/* Titulo */}
            <div className={styles.titleContainer}>
                <span>
                    <h2 className={styles.title}>{topicToSubscribe}</h2>
                    <small>Número de mensajes: {messages.length}</small>
                </span>
                <div className={styles.buttonContainer}>
                    <button onClick={() => subId && unsubscribe(subId)}>Desubscribirse</button>
                    <button onClick={onRemove}>Eliminar</button>
                </div>
            </div>


            {/* Mensajes */}
            <div id="messages" className={styles.messagesContainer}>
                {
                    messages.map((m) => {
                        return (
                            <div className={styles.messageContainer}>
                                <div className={styles.date}>
                                    <span>{m.date.toLocaleString()}</span>
                                </div>
                                <div>{m.message}</div>
                            </div>
                        )
                    })
                }

            </div>

            {/* Envio */}
            <div className={styles.senderContainer}>
                <input type="text" className={styles.senderInput} placeholder="Mensaje" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
                <button onClick={() => publish(topicToSubscribe, inputMessage)}>Publicar</button>
            </div>

        </div>
    </>)
}
