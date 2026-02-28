import { io } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';
export const socket = io(SOCKET_URL, { transports: ['websocket'] });
