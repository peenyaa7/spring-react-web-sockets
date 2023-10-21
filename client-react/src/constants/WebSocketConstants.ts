
export const WS_PROTOCOL = 'http';
export const WS_HOST = window.location.hostname;
export const WS_PORT = 8080;
export const WS_PATH = '/ws';

// URI -> protocol://host:port/path?query#fragment
export const WS_URI = `${WS_PROTOCOL}://${WS_HOST}:${WS_PORT}${WS_PATH}`;
