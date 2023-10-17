import React, { useContext, useState } from 'react'
import { WebSocketContext } from '../contexts/WebSocketContext'
import { SubscriptionComponent } from '../components/SubscriptionComponent'

export const HomeView = () => {

    const { connected, loading, connect, disconnect, subscriptions } = useContext(WebSocketContext)


    const [topicToSubscribe, setTopicToSubscribe] = useState('')
    const [topics, setTopics] = useState<string[]>([])

    const validateTopic = (topic: string) => {
        const regex = /^\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+$/g
        return regex.test(topic)
    }

    const addSubscription = (topic: string) => {

        if (!validateTopic(topic)) {
            alert('El topic debe tener el formato /topic/message')
            return
        }

        if (topics.find(t => t === topic)) {
            alert('Ya está suscrito a ' + topic)
            return
        }

        setTopics([...topics, topic])
    }

    return (
        <div>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div>
                    <button
                        onClick={connected ? disconnect : connect}
                    >
                        {connected ? 'Desconectar' : 'Conectar'}
                    </button>
                    <b> ¿Conectado?</b> { loading ? 'Cargando...' : connected ? 'Si' : 'No'}

                </div>
                <div>
                    <input type="text" id="topic" placeholder="/topic/message" value={topicToSubscribe} onChange={(e) => setTopicToSubscribe(e.target.value)} />
                    <button onClick={() => addSubscription(topicToSubscribe)}>Suscribirse</button>
                </div>
            </div>
            <hr />

            {
                connected && (<>
                    <b>Subscripciones:</b>
                    {
                        subscriptions.length <= 0
                            ? <i> No hay suscripciones</i>
                            : subscriptions.map((subscription) => <SubscriptionComponent subscription={subscription} />)
                    }
                </>)
            }
        </div>
    )
}
