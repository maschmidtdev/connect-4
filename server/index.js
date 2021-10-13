const path = require('path');
const PORT = process.env.PORT || 3001;
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const sockets = require('./socket');
const io = sockets.startSocketServer(http);
const serveStatic = require('serve-static');
const cookieSecret =
    process.env.COOKIE_SECRET || require('../secret.json').cookieSecret;
const cookieSession = require('cookie-session');
const cookieSessionMiddleware = cookieSession({
    secret: cookieSecret,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});
// const {
//     getUsers,
//     getUserByEmail,
//     getUserById,
//     getChallengers,
//     getGames,
//     getGameById,
// } = require('../db');
const {
    dbSetup: sqlite3setup,
    getUsers: sqlite3getUsers,
    getUserByEmail: sqlite3getUserByEmail,
    getUserById: sqlite3getUserById,
    getChallengers: sqlite3getChallengers,
    getGames: sqlite3getGames,
    getGameById: sqlite3getGameById,
} = require('../sqlite3db');

// Middleware
app.use(
    cors({
        origin: 'http://localhost:8080',
        credentials: true,
    })
);
// app.use(express.urlencoded({ extended: true }));
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(express.json());

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
// app.use(sessionMiddleware);
// io.use(function(socket, next) {
//     sessionMiddleware(socket.request, socket.request.res, next);
// });

app.use(serveStatic('dist'));

// ==================== API Routes ====================
app.post('/api/login', async (req, res) => {
    // const { email, password } = req.body;
    const { email } = req.body;
    // const response = await getUserByEmail(email);
    const response = await sqlite3getUserByEmail(email);
    if (response) {
        req.session.user_id = response.id;
        return res.send(response);
    }
    res.status(500).json({
        error: 'Wrong credentials',
    });
});
app.get('/api/user_id', async (req, res) => {
    const { user_id } = req.session;

    if (!user_id) {
        return res.json(null);
    }

    res.json(user_id);
});
app.get('/api/users', async (req, res) => {
    // const challengers = await getChallengers(req.session.user_id);
    const challengers = await sqlite3getChallengers(req.session.user_id);
    // let users = await getUsers();
    let users = await sqlite3getUsers();
    // console.log('[server:/api/users] challengers:', challengers);

    if (users) {
        users = users.filter((user) => {
            for (var c of challengers) {
                if (user.id === c.id) {
                    return false;
                }
            }
            return true;
        });
        // console.log('users', users);
        // console.log('challengers', challengers);
        return res.json({ challengers, users });
    }
});
app.get('/api/user', async (req, res) => {
    const { user_id } = req.session;
    // const user = await getUserById(user_id);
    const user = await sqlite3getUserById(user_id);
    return user
        ? res.send(user)
        : res.status(500).json({
              error: 'User not found',
          });
});
app.get('/api/user/:user_id', async (req, res) => {
    const { user_id } = req.params;
    // const user = await getUserById(user_id);
    const user = await sqlite3getUserById(user_id);
    return user
        ? res.send(user)
        : res.status(500).json({
              error: 'User not found',
          });
});

app.get('/api/games', async (req, res) => {
    // const response = await getGames();
    const response = await sqlite3getGames();
    // console.log('res games', response);
    res.json(response);
});
app.get('/api/game/:game_id', async (req, res) => {
    // const response = await getGameById(req.params.game_id);
    const game = await sqlite3getGameById(req.params.game_id);
    return res.json(game);
});

app.get('*', (req, res) => {
    return res.sendFile(path.resolve('dist', 'index.html'));
});

// Start server

sqlite3setup(() => {
    http.listen(PORT, () =>
        console.log(`Server is listening on port: ${PORT}`)
    );
});
// http.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
