const { getGameById, updateGame } = require('../sqlite3db');

async function placeTile(col, game_id, user_id, cb) {
    // Get the current game
    // console.table({ col, game_id, user_id });
    let game = await getGameById(game_id);
    game.gamestate = JSON.parse(game.gamestate);
    // Determine if its this player's turn or game is over, exit if no
    if (game.turn !== user_id || game.winner) {
        return;
    }

    // Get the row and place tile
    let row = (() => {
        for (var i = (col + 1) * 6 - 1; i >= (col + 1) * 6 - 6; i--) {
            // console.log(' - [game:placeTile] tile:', i);
            if (game.gamestate[i] == 0) {
                game.gamestate[i] =
                    game.turn === game.player_1 ? game.player_1 : game.player_2;
                // console.log(' - [game:placeTile] gamestate:', game.gamestate);
                return i - col * 6;
            }
        }
        return null;
    })();
    // Exit if column is full
    if (!row) {
        return;
    }

    // Do the victory check
    var checkPositions = [];
    var colPositions = getColPositions(col);
    var rowPositions = getRowPositions(row);
    var topDiagonal = getTopDiagonal(col, row);
    var bottomDiagonal = getBottomDiagonal(col, row);
    checkPositions.push(colPositions);
    checkPositions.push(rowPositions);
    checkPositions.push(topDiagonal);
    checkPositions.push(bottomDiagonal);

    // If game isn't over
    if (!checkVictory(game, checkPositions, 0)) {
        // Switch the active turn
        game.turn = game.turn === game.player_1 ? game.player_2 : game.player_1;
    }
    // else {
    //     const loser_id =
    //         game.turn === game.player_1 ? game.player_2 : game.player_1;
    // const loss = await addLoss(loser_id);
    // const win = await addWin(game.turn);

    // console.log('[server:] victory:', win, loss);
    // }
    game.gamestate = JSON.stringify(game.gamestate);
    updateGame(game)
        .then(() => {
            cb();
        })
        .catch((err) => {
            console.log(err);
        });
}

function getColPositions(col) {
    var positions = [];
    for (var i = col * 6; i <= col * 6 + 5; i++) {
        positions.push(i);
    }
    return positions;
}
function getRowPositions(row) {
    var positions = [];
    for (var i = 0; i <= 6; i++) {
        positions.push(i * 6 + row);
    }
    return positions;
}
function getTopDiagonal(col, row) {
    var positions = [];

    // Get top left position of diagonal
    while (col > 0 && row > 0) {
        col--;
        row--;
    }

    // Add positions diagonally down
    while (row <= 5 && col <= 6) {
        positions.push(col * 6 + row);
        row++;
        col++;
    }
    return positions;
}
function getBottomDiagonal(col, row) {
    var positions = [];

    // Get bottom left position of diagonal
    while (col > 0 && row < 5) {
        col--;
        row++;
    }

    // Add positions diagonally up
    while (row >= 0 && col <= 6) {
        positions.push(col * 6 + row);
        row--;
        col++;
    }
    return positions;
}
function checkVictory(game, checkPositions, index = 0) {
    if (index >= checkPositions.length) {
        return false;
    } else {
        var count = 0;
        var winPositions = [];

        for (var i = 0; i < checkPositions[index].length; i++) {
            var current = checkPositions[index][i];

            if (game.gamestate[current] === game.turn) {
                winPositions.push(current);
                count++;
                if (count >= 4) {
                    game.winner = JSON.stringify(winPositions);
                    return true;
                }
            } else {
                count = 0;
                winPositions = [];
            }
        }
        return checkVictory(game, checkPositions, index + 1);
    }
}

module.exports = {
    placeTile,
};
