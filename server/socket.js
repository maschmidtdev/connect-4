const { Server } = require('socket.io');
// const { getGames } = require('../db');
// const games = (async () => {
//     console.log('async');
//     let games = await getGames();
//     for (var game of games) {
//         game.gamestate = JSON.parse(game.gamestate);
//     }
//     console.log('games', games);
//     return games;
// })();

var io;
function startSocketServer(http) {
    io = new Server(http, {
        cors: {
            origin: 'http://localhost:8080',
            methods: ['GET', 'POST'],
            transports: ['websocket', 'polling'],
            credentials: true,
        },
        allowEIO3: true,
    });

    io.sockets.on('connection', (socket) => {
        console.log('New WS connection', socket.id);
        socket.emit('connected');

        socket.on('disconnect', function() {
            console.log('device disconnected:', socket.id);
        });

        socket.on('modal', ({ message, command }) => {
            socket.emit('modal', { message, command });
        });

        // Join a room
        socket.on('join_room', (game_id) => {
            socket.join(game_id.toString());
            socket.to(game_id.toString()).emit('user_joined', game_id);
        });

        socket.on('place_tile', function() {
            console.log('place tile:');
        });
    });

    return io;
}

module.exports = {
    startSocketServer,
};
