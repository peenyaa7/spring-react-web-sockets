import { WebSocketProvider } from "./contexts/WebSocketProvider"

export const AppState = ({ children }: any) => {
	return (
		<WebSocketProvider>
			{ children }
		</WebSocketProvider>
	)
}