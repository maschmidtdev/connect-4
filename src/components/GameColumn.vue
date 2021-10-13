<template>
    <div v-if="!loading" class="column" @click="onClick">
        <game-cell
            v-for="cell_index in 6"
            :key="cell_index"
            :position="col * 6 + (cell_index - 1)"
            :game="game"
        ></game-cell>
    </div>
</template>

<script>
import socket from '@/socket';
import axios from '@/axios';
import GameCell from '@/components/GameCell';

export default {
    props: ['col', 'game'],
    components: {
        GameCell,
    },
    data() {
        return {
            loading: true,
            user: null,
        };
    },
    async mounted() {
        const { data } = await axios.get('/api/user');
        const { id, username, email, image_url, wins, losses } = data;
        this.user = {
            id,
            username,
            email,
            image_url,
            wins,
            losses,
        };
        this.loading = false;
    },
    watch: {},
    methods: {
        onClick() {
            socket.emit('place_tile', {
                col: this.col,
                game_id: this.game.id,
                user_id: this.user.id,
            });
        },
    },
};
</script>

<style scoped>
.column:hover {
    background-color: tan;
}
</style>
