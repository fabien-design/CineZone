import { io } from 'socket.io-client';

// Single shared socket instance — lazy connect on first use
const socket = io(import.meta.env.VITE_API_URL, {
    autoConnect: false,
    withCredentials: true,
});

export default socket;
