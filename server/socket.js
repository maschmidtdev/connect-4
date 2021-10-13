const { Server } = require('socket.io');
const { placeTile } = require('./game');

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

        socket.on('place_tile', async (data) => {
            const { col, game_id, user_id } = data;
            // console.log('[server:socket:place_tile]');
            placeTile(col, game_id, user_id, () => {
                io.to(game_id.toString()).emit('game_update');
            });

            // // Get the current game
            // const game = await getGameById(game_id);
            // // Determine if its this player's turn or game is over, exit if no
            // if (game.turn !== user_id || game.winner) {
            //     return;
            // }

            // // Get the row and place tile
            // var row = server_placeTile(col, game);
            // // Exit if column is full
            // if (row < 0) {
            //     return;
            // }

            // // Do the victory check
            // var checkPositions = [];
            // var colPositions = server_getColPositions(col);
            // var rowPositions = server_getRowPositions(row);
            // var topDiagonal = server_getTopDiagonal(col, row);
            // var bottomDiagonal = server_getBottomDiagonal(col, row);
            // checkPositions.push(colPositions);
            // checkPositions.push(rowPositions);
            // checkPositions.push(topDiagonal);
            // checkPositions.push(bottomDiagonal);

            // // If game isn't over
            // if (!server_checkVictory(game, checkPositions, 0)) {
            //     // Switch the active turn
            //     game.turn =
            //         game.turn === game.player_1 ? game.player_2 : game.player_1;
            // } else {
            //     const loser_id =
            //         game.turn === game.player_1 ? game.player_2 : game.player_1;
            //     const loss = await addLoss(loser_id);
            //     const win = await addWin(game.turn);

            //     console.log('[server:] vitory:', win, loss);
            // }

            // // console.log('[server:place_tile] game:', game);

            // updateGame(game).then(() => {
            //     io.to(game_id.toString()).emit('game_update', game);
            // });
        });
    });

    return io;
}

module.exports = {
    startSocketServer,
};
