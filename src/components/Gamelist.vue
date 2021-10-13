<template>
    <div class="gamelist" v-if="!loading">
        <h2 v-if="self_games.length > 0">Your current games</h2>
        <h2 v-else>No active games - challenge someone!</h2>
        <ul v-if="self_games">
            <li v-for="game in self_games" class="game" :key="game.id">
                <router-link
                    :to="{ name: 'game', params: { game_id: game.id } }"
                >
                    <h3>
                        <img
                            v-if="game.player_1.id !== user_id"
                            :src="game.player_1.image_url"
                            :alt="game.player_1.username"
                        />
                        <img
                            v-if="game.player_2.id !== user_id"
                            :src="game.player_2.image_url"
                            :alt="game.player_2.username"
                        />
                        <span
                            v-if="game.player_1.id !== user_id"
                            class="player-1"
                            >{{ game.player_1.username }}</span
                        >
                        <span
                            v-if="game.player_2.id !== user_id"
                            class="player-2"
                            >{{ game.player_2.username }}</span
                        >
                    </h3>
                </router-link>
            </li>
        </ul>
        <br />

        <h2 v-if="other_games.length > 0">Other games</h2>
        <ul v-if="other_games">
            <li v-for="game in other_games" class="game" :key="game.id">
                <router-link
                    :to="{ name: 'game', params: { game_id: game.id } }"
                >
                    <h3>
                        <img
                            :src="game.player_1.image_url"
                            :alt="game.player_1.username"
                        />
                        <span class="player-1">{{
                            game.player_1.username
                        }}</span>
                        VS
                        <span class="player-2">{{
                            game.player_2.username
                        }}</span>
                        <img
                            :src="game.player_2.image_url"
                            :alt="game.player_2.username"
                        />
                    </h3>
                </router-link>
            </li>
        </ul>
    </div>
    <div v-else>Loading...</div>
</template>

<script>
import axios from '@/axios';

export default {
    data() {
        return {
            loading: true,
            self_games: null,
            other_games: null,
            user_id: null,
        };
    },
    async mounted() {
        const { data } = await axios.get('/api/games');
        const response = await axios.get('/api/user_id');
        let games = data;
        let user_id = response.data;
        this.user_id = user_id;

        let player_1, player_2;
        // Get player data into game objects
        for (var id in games) {
            player_1 = await axios.get(`/api/user/${games[id].player_1}`);
            player_2 = await axios.get(`/api/user/${games[id].player_2}`);
            games[id].player_1 = player_1.data;
            games[id].player_2 = player_2.data;
        }

        // Only show games that were accepted by the other user
        games = games.filter((game) => game.accepted);
        // Games this user is part of
        this.self_games = games.filter(
            (game) =>
                game.player_1.id === user_id || game.player_2.id === user_id
        );
        // Games of other users
        this.other_games = games.filter(
            (game) =>
                game.player_1.id !== user_id && game.player_2.id !== user_id
        );

        this.loading = false;
    },
};
</script>

<style scoped>
.gamelist {
    width: 50%;
    min-width: 350px;
}
li.game {
    margin: 0.4rem 0;
    padding: 0.5rem;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
}
li.game a h3 {
    display: flex;
    justify-content: center;
    align-items: center;
}
li.game a h3 * {
    margin-right: 0.5em;
    margin-left: 0.5em;
}
li.game:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.5);
}
</style>
