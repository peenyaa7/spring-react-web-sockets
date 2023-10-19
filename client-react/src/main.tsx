import ReactDOM from 'react-dom/client'
import { AppState } from './AppState.tsx'
import { HomeView } from './views/HomeView/HomeView.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    //<React.StrictMode>
        <AppState>
            <HomeView />
        </AppState>
    //</React.StrictMode>,
)
