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
    // computed() {
    //     game(){
    //         return
    //     }
    // },
    async mounted() {
        socket.emit('join_room', this.game_id);
        await this.updateGame();
        socket.on('game_update', () => {
            this.updateGame();
        });
        this.loading = false;
    },
    methods: {
        async updateGame() {
            const { data } = await axios.get(`/api/game/${this.game_id}`);
            const player_1 = await axios.get(`/api/user/${data.player_1}`);
            const player_2 = await axios.get(`/api/user/${data.player_2}`);

            if (!data) {
                return this.$router.push({ name: 'hone' });
            }

            return new Promise((resolve) => {
                this.game = {
                    ...data,
                    gamestate: JSON.parse(data.gamestate),
                    gamestateTEST: data.gamestate,
                    winner: data.winner && JSON.parse(data.winner),
                };
                this.game.player_1 = player_1.data;
                this.game.player_2 = player_2.data;
                resolve();
            });
        },
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
