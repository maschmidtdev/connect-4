import io from 'socket.io-client';

let socket =
    process.env.NODE_ENV === 'production' ? io() : io('http://localhost:3001');

console.log('Starting connection to Websocket Server');

socket.on('connected', () => {
    console.log('connected!');
});

socket.on('login', () => {
    console.log('login successful!');
});

export default socket;
