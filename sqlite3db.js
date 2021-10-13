const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const dbPromise = open({
    filename: 'data.db',
    driver: sqlite3.Database,
});

const dbSetup = async (appListenFunction) => {
    const db = await dbPromise;
    await db.migrate();
    // db.run(`INSERT INTO Message(text) VALUES(?)`, ['C'], async function(err) {
    //     console.log('test');
    //     if (err) {
    //         return console.log(err.message);
    //     }
    //     // get the last insert id
    //     console.log(`A row has been inserted with rowid ${this.lastID}`);
    // });
    // db.close()
    appListenFunction();
};

// Users
// async function createUser(email, username, password_hash) {
//     const db = await dbPromise;
//     // console.log('[db:getUserByEmail]');
//     return db
//         .query(
//             `INSERT INTO users (email, username, password_hash)
//               VALUES ($1, $2, $3, $4)
//               RETURNING *`,
//             [email, username, password_hash]
//         )
//         .then((result) => {
//             // console.log(`[createUser] result.rows:`, result.rows);
//             return result.rows;
//         });
// }
async function getUserByEmail(email) {
    const db = await dbPromise;
    // console.log('[db:getUserByEmail]');
    const users = await db.all(
        'SELECT id, username, email, wins, losses, image_url FROM users WHERE email = ?',
        [email]
    );
    return users.length > 0 ? users[0] : null;
}
async function getUserById(id) {
    const db = await dbPromise;
    const users = await db.all(
        'SELECT id, username, email, wins, losses, image_url FROM users WHERE id = ?',
        [id]
    );
    return users.length > 0 ? users[0] : null;
}
async function getUsers() {
    // console.log('[db:getUsers');
    const db = await dbPromise;
    const users = await db.all('SELECT * FROM users');
    return users;
}
async function getChallengers(user_id) {
    const db = await dbPromise;
    // console.log('[db:getChallengers');
    const challengers = await db.all(
        `SELECT users.id, username, image_url FROM users
                JOIN games
                ON users.id = games.player_1
                WHERE games.accepted = false
                AND games.player_2 = $1`,
        [user_id]
    );
    return challengers;
}
// async function addWin(user_id) {
//     const db = await dbPromise;
//     // console.log('[db:addWin');
//     return db
//         .query(
//             `UPDATE users SET wins = wins + 1
//                 WHERE id = $1
//                 RETURNING *`,
//             [user_id]
//             // [user_id]
//         )
//         .then((result) => {
//             console.log('[db:addWin] result.rows', result.rows);
//             return result.rows;
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// }
// async function addLoss(user_id) {
//     const db = await dbPromise;
//     // console.log('[db:addLoss');
//     return db
//         .query(
//             `UPDATE users SET losses = losses + 1
//                 WHERE id = $1
//                 RETURNING *`,
//             [user_id]
//         )
//         .then((result) => {
//             console.log('[db:addLoss] result.rows', result.rows);
//             return result.rows;
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// }

// Games
// async function createGame({ player_1, player_2 }) {
//     const db = await dbPromise;
//     return db
//         .query(
//             `INSERT INTO games (player_1, player_2, turn)
//                 VALUES ($1, $2, $1)
//                 RETURNING *`,
//             [player_1, player_2]
//         )
//         .then((result) => {
//             // console.log('result.rows', result.rows);
//             return result.rows;
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// }
async function getGames() {
    const db = await dbPromise;
    const games = await db.all(`SELECT * FROM games ORDER BY id ASC`);
    // console.log('[sqlite3:getGames] games:', games);
    return games;
}
// async function getGamesByUser(user_id) {
//     const db = await dbPromise;
//     // console.log('[db:getGames]');
//     return db
//         .query(
//             `SELECT * FROM games
//                 WHERE player_1 = $1
//                 OR player_2 = $1
//                 ORDER BY id ASC`,
//             [user_id]
//         )
//         .then((result) => {
//             // console.log('result.rows', result.rows);
//             return result.rows;
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// }
async function getGameById(game_id) {
    const db = await dbPromise;
    const games = await db.all(`SELECT * FROM games WHERE id = ?`, [game_id]);
    // console.log('[sqlite3:getGameById] game:', games[0]);
    return games.length > 0 ? games[0] : null;
}
// async function getGame({ player_1, player_2 }) {
//     const db = await dbPromise;
//     // console.log('[db:getGame]');
//     return db
//         .query(
//             `SELECT * FROM games
//             WHERE (player_1 = $1 AND player_2 = $2)
//             OR (player_1 = $2 AND player_2 = $1)`,
//             [player_1, player_2]
//         )
//         .then((result) => {
//             console.log('result.rows[0]', result.rows[0]);
//             return result.rows[0];
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// }
async function updateGame({ turn, gamestate, id, winner }) {
    const db = await dbPromise;

    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE games SET turn = ?, gamestate = ?, winner = ?
            WHERE id = ?`,
            // RETURNING *;`,
            [turn, gamestate, winner, id],
            // [turn, JSON.stringify(gamestate), winner, id],
            async function(err) {
                if (err) {
                    reject(err.message);
                }
                resolve();
            }
        );
        resolve();
    });
}
// async function acceptGame({ player_1, player_2 }) {
//     const db = await dbPromise;
//     return db
//         .query(
//             `UPDATE games SET accepted = true
//               WHERE (player_1 = $1 AND player_2 = $2)
//               OR (player_2 = $1 AND player_1 = $2)
//               RETURNING *`,
//             [player_1, player_2]
//         )
//         .then((result) => {
//             // console.log('[db:acceptGame] result.rows', result.rows);
//             return result.rows;
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// }

module.exports = {
    // createUser,
    getUsers,
    getChallengers,
    getUserByEmail,
    getUserById,
    // addWin,
    // addLoss,
    // createGame,
    getGames,
    // getGame,
    // getGamesByUser,
    getGameById,
    updateGame,
    // acceptGame,
    dbSetup,
};
