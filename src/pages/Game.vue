<template>
    <div v-if="!loading" class="game">
        <div class="gameheader">
            <h2>
                <img
                    :src="game.player_1.image_url"
                    :alt="game.player_1.username"
                /><span class="player-1">{{ game.player_1.username }}</span>
                VS
                <span class="player-2">{{ game.player_2.username }}</span
                ><img
                    :src="game.player_2.image_url"
                    :alt="game.player_2.username"
                />
            </h2>
            <div v-if="!game.winner">
                <h3 v-if="game.turn === game.player_1.id">
                    It's
                    <span class="player-1">{{ game.player_1.username }}</span
                    >'s turn.
                </h3>
                <h3 v-else>
                    It's
                    <span class="player-2">{{ game.player_2.username }}</span
                    >'s turn.
                </h3>
            </div>
            <div v-else>
                <h3 v-if="game.turn === game.player_1.id">
                    <span class="player-1">{{ game.player_1.username }}</span>
                    won!
                </h3>
                <h3 v-else>
                    <span class="player-2">{{ game.player_2.username }}</span>
                    won!
                </h3>
            </div>
        </div>
        <div class="connect-four">
            <game-column
                v-for="index in 7"
                :key="index"
                :col="index - 1"
                :game="game"
            ></game-column>
        </div>
    </div>
    <div v-else>Loading...</div>
</template>

<script>
import socket from '@/socket';
import axios from '@/axios';
import GameColumn from '@/components/GameColumn';

export default {
    props: ['game_id', 'user'],
    components: {
        GameColumn,
    },
    data() {
        return {
            game: {},
            loading: true,
        };
    },
    async mounted() {
        const { data } = await axios.get(`/api/game/${this.game_id}`);
        if (!data) {
            return this.$router.push({ name: 'hone' });
        }
        this.game = {
            ...data,
            gamestate: JSON.parse(data.gamestate),
            winner: data.winner && JSON.parse(data.winner),
        };

        const player_1 = await axios.get(`/api/user/${this.game.player_1}`);
        const player_2 = await axios.get(`/api/user/${this.game.player_2}`);
        this.game.player_1 = player_1.data;
        this.game.player_2 = player_2.data;

        socket.emit('join_room', this.game_id);
        socket.on('user_joined', (game_id) => {
            console.log('A user joined the game:', game_id);
        });
        socket.on('game_update', (game) => {
            this.game.turn = game.turn;
            this.game.gamestate = game.gamestate;
            if (game.winner) {
                this.game.winner = JSON.parse(game.winner);
            }
        });
        // socket.on('placeTile', ({ index, player }) => {
        //     $('.position')
        //         .eq(index)
        //         .addClass('player-' + player);
        // });
        this.loading = false;
    },
};
</script>

<style scoped>
.gameheader {
    margin: 1rem;
}
.gameheader h2 {
    display: flex;
    justify-content: center;
    align-items: center;
}
.gameheader h2 * {
    margin: 0 0.5rem;
}
.gameheader h2 img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
}
.connect-four {
    width: 700px;
    height: 600px;
    background-color: cornflowerblue;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    border-radius: 50px;
    margin: 15px auto;
}
</style>
