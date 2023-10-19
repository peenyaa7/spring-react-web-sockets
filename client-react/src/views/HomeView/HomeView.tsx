import { useContext, useState } from 'react'
import { WebSocketContext } from '../../contexts/WebSocketContext'
import { SubscriptionComponent } from '../../components/SubscriptionComponent'
import './HomeView.css'

interface TopicId { // Para poder identificar las subscripciones en el array
    id: number;
    topic: string;
}

export const HomeView = () => {

    const { socketState, connect, disconnect } = useContext(WebSocketContext)

    const [topicToSubscribe, setTopicToSubscribe] = useState('')
    const [topicsToSubscribe, setTopicsToSubscribe] = useState<TopicId[]>([])

    const validateTopic = (topic: string) => {
        const regex = /^\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+$/g
        return regex.test(topic)
    }

    const addSubscription = (topic: string) => {

        if (!validateTopic(topic)) {
            alert('El topic debe tener el formato /topic/message')
            return
        }

        const randomId = Math.floor(Math.random() * 1000000)
        setTopicsToSubscribe((topics) => [...topics, { id: randomId, topic: topic }])
    }

    return (<>
    
        <header>
            <nav>
                <div id='nav-title'>
                    <h2>WebSocket (React + Spring Boot)</h2>
                    <div
                        className={`connection-dot ${socketState.connected ? 'connection-connected-dot' : 'connection-disconnected-dot'}`}
                        title={socketState.connected ? 'Conectado' : 'Desconectado'}
                    />
                </div>
                <div>
                    <button onClick={socketState.connected ? disconnect : connect}>
                        {socketState.connected ? 'Desconectar' : 'Conectar'}
                    </button>
                </div>
            </nav>
        </header>
        <main>

            {/* Help Box */}
            <div id='help-box'>
                {
                    socketState.connected ? (<>
                        <div>
                            <label htmlFor="topic">¡Subscríbete a un nuevo topic!: </label>
                            <input type="text" id="topic" placeholder="/topic/..." value={topicToSubscribe} onChange={(e) => setTopicToSubscribe(e.target.value)} />
                            <button onClick={() => addSubscription(topicToSubscribe)} style={{ marginLeft: 10 }}>Suscribirse</button>
                        </div>
                        <small>¡Tip!: Prueba a suscribirte a <em>/topic/message</em></small>
                    </>) : (<>
                        <p>Para empezar, conecta el WebSocket (botón de arriba)</p>
                    </>)
                }
            </div>

            {/* Visor de subscripciones */}
            {
                socketState.connected && (<>
                    <div id='sub-viewer-container'>
                        <b>Subscripciones{topicsToSubscribe.length > 0 && ` (${topicsToSubscribe.length})`}:</b>
                        <div id='sub-viewer-grid'>
                            {
                                topicsToSubscribe.length <= 0
                                    ? <i> No hay suscripciones</i>
                                    : topicsToSubscribe.map((topicId) => <SubscriptionComponent key={topicId.id} topic={topicId.topic} onRemove={() => setTopicsToSubscribe(topicsToSubscribe.filter(t => t.id !== topicId.id))} />)
                            }
                            
                        </div>

                    </div>
                </>)
            }

        </main>
        <footer>
            <p>Desarrollado por <a href="https://github.com/peenyaa7">peenyaa7</a></p>
        </footer>
            
    </>
    )
}
